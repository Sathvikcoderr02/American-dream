import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("audit-out");

const browser = await chromium.launch();
const errors = [];
const messages = [];

for (const vp of [
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "desktop", width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 2 },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
    deviceScaleFactor: vp.deviceScaleFactor,
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      messages.push(`[${vp.name}] ${m.type()}: ${m.text()}`);
    }
  });
  page.on("pageerror", (e) => errors.push(`[${vp.name}] ${e.message}`));

  await page.goto("http://localhost:3000/sponsorship", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);

  // Step through page sections
  const positions = [0, 600, 1200, 1800, 2400, 3000, 3600];
  for (let i = 0; i < positions.length; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), positions[i]);
    await page.waitForTimeout(350);
    await page.screenshot({
      path: path.join(OUT, `${vp.name}__sponsorship__${i}.png`),
      fullPage: false,
    });
  }
  await ctx.close();
}

await browser.close();

console.log(`errors: ${errors.length}`);
console.log(`warns:  ${messages.length}`);
errors.forEach((e) => console.log("  ❌", e));
messages.forEach((m) => console.log("  ⚠ ", m));
