import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
const page = await ctx.newPage();

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
try { await page.click('button:has-text("Skip intro")', { timeout: 2000 }); } catch {}
await page.waitForTimeout(800);

async function captureScrolled(name, scrollPositions) {
  for (let i = 0; i < scrollPositions.length; i++) {
    await page.evaluate((y) => {
      const s = document.querySelector("div.overflow-y-auto");
      if (s) s.scrollTo({ top: y, behavior: "instant" });
    }, scrollPositions[i]);
    await page.waitForTimeout(700);
    await page.screenshot({
      path: `audit-out/full/${name}-${i}.png`,
      fullPage: false,
    });
  }
}

// Tenant — Retail
await page.click('button:has-text("Tenant")');
await page.waitForTimeout(1300);
await captureScrolled("tenant-retail", [0, 700, 1400]);

// Tenant — Avenue
await page.locator('button >> text="The Avenue"').first().click();
await page.waitForTimeout(800);
await captureScrolled("tenant-avenue", [0, 700, 1400, 2000]);

// Tenant — Dining
await page.locator('button >> text="Dining"').first().click();
await page.waitForTimeout(800);
await captureScrolled("tenant-dining", [0, 700, 1400, 2000]);

// Hub back
await page.click('button:has-text("Hub")');
await page.waitForTimeout(700);

// Events
await page.click('button:has-text("Events")');
await page.waitForTimeout(1300);
await captureScrolled("events", [0, 800, 1600, 2400, 3200]);

await browser.close();
console.log("done");
