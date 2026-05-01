import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
try { await page.click('button:has-text("Skip intro")', { timeout: 2000 }); } catch {}
await page.waitForTimeout(800);
await page.screenshot({ path: "audit-out/full/hub-current.png", fullPage: true });
await browser.close();
console.log("done");
