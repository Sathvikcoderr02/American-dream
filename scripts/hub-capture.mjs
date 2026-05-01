// Day 3 final verification: all 5 portals + AI guide.

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
  try { await page.click('button:has-text("Skip intro")', { timeout: 2000 }); } catch {
    await page.waitForTimeout(4000);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, vp.name, "01-hub.png"), fullPage: true });

  // Property
  await page.click('button:has-text("The Property")');
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(OUT, vp.name, "02-property.png"), fullPage: false });
  await page.click('button:has-text("Hub")');
  await page.waitForTimeout(800);

  // Attractions + Big SNOW live
  await page.click('button:has-text("Attractions")');
  await page.waitForTimeout(1100);
  await page.locator('button >> text=Big SNOW').first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, vp.name, "03-attractions-bigsnow.png"), fullPage: false });
  await page.click('button:has-text("Hub")');
  await page.waitForTimeout(800);

  // Sponsor + AI ROI
  await page.click('button:has-text("Sponsor")');
  await page.waitForTimeout(1100);
  await page.waitForTimeout(8000);
  await page.evaluate(() => {
    const s = document.querySelector("div.overflow-y-auto");
    if (s) s.scrollTo({ top: 1200, behavior: "instant" });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, vp.name, "04-sponsor-ai.png"), fullPage: false });
  await page.click('button:has-text("Hub")');
  await page.waitForTimeout(800);

  // Tenant — all 3 tabs
  await page.click('button:has-text("Tenant")');
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(OUT, vp.name, "05-tenant-retail.png"), fullPage: false });

  await page.locator('button >> text=The Avenue').first().click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, vp.name, "06-tenant-avenue.png"), fullPage: false });

  await page.locator('button >> text=Dining').first().click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, vp.name, "07-tenant-dining.png"), fullPage: false });

  await page.click('button:has-text("Hub")');
  await page.waitForTimeout(800);

  // Events
  await page.click('button:has-text("Events")');
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(OUT, vp.name, "08-events.png"), fullPage: false });

  // Scroll to booking timeline
  await page.evaluate(() => {
    const s = document.querySelector("div.overflow-y-auto");
    if (s) s.scrollTo({ top: 1700, behavior: "instant" });
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, vp.name, "09-events-timeline.png"), fullPage: false });

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
