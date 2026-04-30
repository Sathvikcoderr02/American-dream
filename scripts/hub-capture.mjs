// Quick visual verification of the Hub redesign:
// 1. Capture hub at desktop + mobile (after cinematic dismiss)
// 2. Click Property portal → capture module
// 3. Click "Hub" back → confirm return
// 4. Click a placeholder → capture overlay

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = path.resolve("audit-out/hub");

async function captureRun(browser, vp) {
  await fs.mkdir(path.join(OUT, vp.name), { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: "no-preference",
  });

  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`PAGE ERROR: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`CONSOLE ERROR: ${msg.text()}`);
  });

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  // Skip the cinematic intro
  try {
    await page.click('button:has-text("Skip intro")', { timeout: 2000 });
  } catch {
    // Auto-dismiss after timeout
    await page.waitForTimeout(4000);
  }
  await page.waitForTimeout(800);

  await page.screenshot({
    path: path.join(OUT, vp.name, "01-hub.png"),
    fullPage: true,
  });

  // Click Property portal
  await page.click('button:has-text("The Property")');
  await page.waitForTimeout(1100);

  await page.screenshot({
    path: path.join(OUT, vp.name, "02-property-module.png"),
    fullPage: false,
  });

  // Scroll inside the module
  await page.evaluate(() => {
    const scroller = document.querySelector("div.overflow-y-auto");
    if (scroller) scroller.scrollTo({ top: 1200, behavior: "instant" });
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(OUT, vp.name, "03-property-scrolled.png"),
    fullPage: false,
  });

  // Hub back button
  await page.click('button:has-text("Hub")');
  await page.waitForTimeout(900);
  await page.screenshot({
    path: path.join(OUT, vp.name, "04-hub-returned.png"),
    fullPage: false,
  });

  // Click a placeholder (Sponsor)
  await page.click('button:has-text("Sponsor")');
  await page.waitForTimeout(700);
  await page.screenshot({
    path: path.join(OUT, vp.name, "05-placeholder.png"),
    fullPage: false,
  });

  await ctx.close();
  return { viewport: vp.name, errors };
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const results = [];
  for (const vp of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    results.push(await captureRun(browser, vp));
  }
  await browser.close();

  await fs.writeFile(path.join(OUT, "report.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
