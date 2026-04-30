// Day 2 verification: hub → AttractionsModule (Big SNOW live moment),
// SponsorModule (AI ROI narrative), AIGuide flow.

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
  try {
    await page.click('button:has-text("Skip intro")', { timeout: 2000 });
  } catch {
    await page.waitForTimeout(4000);
  }
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.join(OUT, vp.name, "01-hub.png"), fullPage: true });

  // Test Attractions portal
  await page.click('button:has-text("Attractions")');
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(OUT, vp.name, "02-attractions.png"), fullPage: false });

  // Click on Big SNOW (3rd attraction in picker rail)
  await page.locator('button >> text=Big SNOW').first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, vp.name, "03-big-snow-live.png"), fullPage: false });

  // Back to hub, then Sponsor portal
  await page.click('button:has-text("Hub")');
  await page.waitForTimeout(800);
  await page.click('button:has-text("Sponsor")');
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(OUT, vp.name, "04-sponsor.png"), fullPage: false });

  // Wait for AI narrative to stream
  await page.waitForTimeout(8000);
  await page.evaluate(() => {
    const scroller = document.querySelector("div.overflow-y-auto");
    if (scroller) scroller.scrollTo({ top: 700, behavior: "instant" });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, vp.name, "05-sponsor-ai-roi.png"), fullPage: false });

  // Back to hub, test AI guide
  await page.click('button:has-text("Hub")');
  await page.waitForTimeout(800);
  await page.click('button:has-text("Not sure where to start")').catch(() => {
    // mobile label
    return page.click('button:has-text("Ask the concierge")');
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, vp.name, "06-guide-q1.png"), fullPage: false });

  // Walk through 3 questions — scope clicks INSIDE the guide panel
  const panel = page.locator('div[class*="rounded-t-3xl"]').first();
  await panel.locator('button:has-text("Brand partnership")').click();
  await page.waitForTimeout(500);
  await panel.locator('button:has-text("$750K – $2M")').click();
  await page.waitForTimeout(500);
  await panel.locator('button:has-text("Long-term IP association")').click();
  await page.waitForTimeout(8000);
  await page.screenshot({ path: path.join(OUT, vp.name, "07-guide-result.png"), fullPage: false });

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
