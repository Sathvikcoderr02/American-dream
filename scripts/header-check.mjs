import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`PAGE: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`CON: ${m.text()}`); });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
try { await page.click('button:has-text("Skip intro")', { timeout: 2000 }); } catch {}
await page.waitForTimeout(7000);

// Hub with new header
await page.screenshot({ path: "/Users/srinivasdundigalla/Desktop/projects/bigbull/audit-out/r3/22-hub-with-header.png", fullPage: false });

// Scroll a bit to see header backdrop blur kick in
await page.evaluate(() => window.scrollTo(0, 200));
await page.waitForTimeout(500);
await page.screenshot({ path: "/Users/srinivasdundigalla/Desktop/projects/bigbull/audit-out/r3/23-header-scrolled.png", fullPage: false });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);

// Inside a module — header should show breadcrumb
await page.click('button:has-text("The Property")');
await page.waitForTimeout(1500);
await page.screenshot({ path: "/Users/srinivasdundigalla/Desktop/projects/bigbull/audit-out/r3/24-module-header.png", fullPage: false });

await browser.close();
console.log("errors:", errors);
console.log("done");
