// Verify new Hailuo videos render in their slots
import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`PAGE: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`CON: ${m.text()}`); });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
// Capture cinematic intro (now using new project.mp4)
await page.waitForTimeout(2000);
await page.screenshot({ path: "audit-out/r3/13-new-cinematic-intro.png", fullPage: false });

try { await page.click('button:has-text("Skip intro")', { timeout: 2000 }); } catch {}
await page.waitForTimeout(8000);
await page.screenshot({ path: "audit-out/r3/14-hub-with-new-videos.png", fullPage: true });

// Hover over Property card (now using portal-property.mp4)
await page.hover('button:has-text("The Property")');
await page.waitForTimeout(2500);
await page.screenshot({ path: "audit-out/r3/15-hub-property-hover.png", fullPage: false });

// Hover over Sponsor card (now using portal-sponsor.mp4)
await page.hover('button:has-text("Sponsor")');
await page.waitForTimeout(2500);
await page.screenshot({ path: "audit-out/r3/16-hub-sponsor-hover.png", fullPage: false });

// Big SNOW cinematic with new video
await page.click('button:has-text("Attractions")');
await page.waitForTimeout(1500);
await page.locator('button >> text=Big SNOW').first().click();
await page.waitForTimeout(1500);
await page.click('button:has-text("Step inside the only place this exists")');
await page.waitForTimeout(4000);
await page.screenshot({ path: "audit-out/r3/17-new-cinematic-snow.png", fullPage: false });

await browser.close();
console.log("errors:", errors);
console.log("done");
