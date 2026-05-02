import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`PAGE: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`CON: ${m.text()}`); });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
try { await page.click('button:has-text("Skip intro")', { timeout: 2000 }); } catch {}
await page.waitForTimeout(8000);
await page.screenshot({ path: "/Users/srinivasdundigalla/Desktop/projects/bigbull/audit-out/r3/19-hub-with-credibility-and-teaser.png", fullPage: true });

// Hover over a portal card to test cursor tilt + shine
const card = page.locator('button:has-text("The Property")').first();
const box = await card.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3);
  await page.waitForTimeout(800);
  await page.screenshot({ path: "/Users/srinivasdundigalla/Desktop/projects/bigbull/audit-out/r3/20-portal-tilt-shine.png", fullPage: false });
}

// Events module CountUp
await page.click('button:has-text("Events")');
await page.waitForTimeout(1500);
await page.evaluate(() => {
  const s = document.querySelector("div.overflow-y-auto");
  if (s) s.scrollTo({ top: 1500, behavior: "instant" });
});
await page.waitForTimeout(2000);
await page.screenshot({ path: "/Users/srinivasdundigalla/Desktop/projects/bigbull/audit-out/r3/21-events-countup.png", fullPage: false });

await browser.close();
console.log("errors:", errors);
console.log("done");
