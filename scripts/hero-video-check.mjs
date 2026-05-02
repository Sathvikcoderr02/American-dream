import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
try { await page.click('button:has-text("Skip intro")', { timeout: 2000 }); } catch {}
await page.waitForTimeout(7000);
await page.screenshot({ path: "/Users/srinivasdundigalla/Desktop/projects/bigbull/audit-out/r3/18-hero-with-video.png", fullPage: false });
await browser.close();
console.log("done");
