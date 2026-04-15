// Browser audit: load both routes at multiple viewports, scroll-step through
// the page so IntersectionObserver-driven reveals fire, capture per-section
// screenshots, and collect console errors + uncaught page errors.

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = path.resolve("audit-out");

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "tablet", width: 820, height: 1180, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "desktop", width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 2 },
];

const ROUTES = [
  { name: "home", path: "/", sections: ["overview", "why", "retail", "luxury", "dining", "attractions", "events", "cta"] },
  { name: "events", path: "/events", sections: [] },
];

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  const report = { startedAt: new Date().toISOString(), base: BASE, results: [] };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
      deviceScaleFactor: vp.deviceScaleFactor,
      reducedMotion: "no-preference",
    });

    for (const route of ROUTES) {
      const page = await ctx.newPage();
      const messages = [];
      const errors = [];

      page.on("console", (msg) => {
        const type = msg.type();
        if (type === "error" || type === "warning") {
          messages.push({ type, text: msg.text() });
        }
      });
      page.on("pageerror", (err) => {
        errors.push({ name: err.name, message: err.message });
      });

      const url = BASE + route.path;
      console.log(`→ ${vp.name} ${route.name} ${url}`);
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      } catch (e) {
        errors.push({ name: "navigation", message: String(e) });
      }
      await page.waitForTimeout(600);

      // Scroll-step through the page to trigger every IntersectionObserver
      const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const stepHeight = Math.floor(vp.height * 0.7);
      let y = 0;
      while (y < docHeight) {
        await page.evaluate((sy) => window.scrollTo({ top: sy, behavior: "instant" }), y);
        await page.waitForTimeout(120);
        y += stepHeight;
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(400);

      // Per-section viewport screenshots (home only)
      if (route.name === "home") {
        for (const id of route.sections) {
          const handle = await page.locator(`#${id}`).first().elementHandle();
          if (!handle) continue;
          await handle.scrollIntoViewIfNeeded();
          await page.waitForTimeout(450);
          await page.screenshot({
            path: path.join(OUT, `${vp.name}__${id}.png`),
            fullPage: false,
          });
        }
      } else {
        // Events: a few scroll positions
        const positions = [0, 800, 1600, 2400, 3200];
        for (let i = 0; i < positions.length; i++) {
          await page.evaluate((sy) => window.scrollTo({ top: sy, behavior: "instant" }), positions[i]);
          await page.waitForTimeout(400);
          await page.screenshot({
            path: path.join(OUT, `${vp.name}__events__${i}.png`),
            fullPage: false,
          });
        }
      }

      report.results.push({ viewport: vp.name, route: route.name, url, messages, errors });
      await page.close();
    }
    await ctx.close();
  }

  await browser.close();
  await fs.writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));

  const totalErrors = report.results.reduce((n, r) => n + r.errors.length, 0);
  const totalWarns = report.results.reduce((n, r) => n + r.messages.length, 0);
  console.log(`\n=== SUMMARY ===`);
  console.log(`Page errors: ${totalErrors}`);
  console.log(`Console err/warn: ${totalWarns}`);
  console.log(`Screenshots in: ${OUT}`);
  if (totalErrors + totalWarns > 0) {
    for (const r of report.results) {
      if (r.errors.length || r.messages.length) {
        console.log(`\n[${r.viewport} · ${r.route}]`);
        for (const e of r.errors) console.log(`  ❌ ${e.name}: ${e.message}`);
        for (const m of r.messages) console.log(`  ⚠ ${m.type}: ${m.text}`);
      }
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
