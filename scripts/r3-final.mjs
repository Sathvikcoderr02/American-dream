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

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
try { await page.click('button:has-text("Skip intro")', { timeout: 2000 }); } catch {}
await page.waitForTimeout(8000); // wait for greeting + signals
await page.screenshot({ path: "audit-out/r3/06-hub-with-greeting.png", fullPage: true });

// Cinematic Big SNOW
await page.click('button:has-text("Attractions")');
await page.waitForTimeout(1300);
await page.locator('button >> text=Big SNOW').first().click();
await page.waitForTimeout(2500);
await page.screenshot({ path: "audit-out/r3/07-bigsnow-cta.png", fullPage: false });

await page.click('button:has-text("Step inside the only place this exists")');
await page.waitForTimeout(2500);
await page.screenshot({ path: "audit-out/r3/08-cinematic-1.png", fullPage: false });

await page.waitForTimeout(3000);
await page.screenshot({ path: "audit-out/r3/09-cinematic-2.png", fullPage: false });

await page.waitForTimeout(4000);
await page.screenshot({ path: "audit-out/r3/10-cinematic-3.png", fullPage: false });

// Exit cinematic, exit module
await page.click('button:has-text("Exit cinema")');
await page.waitForTimeout(700);
await page.click('button:has-text("Hub")');
await page.waitForTimeout(900);

// Guided Tour
await page.click('button:has-text("Take the 5-stop tour")');
await page.waitForTimeout(1500);
await page.screenshot({ path: "audit-out/r3/11-tour-stop1.png", fullPage: false });

await page.click('button:has-text("Next")');
await page.waitForTimeout(1500);
await page.screenshot({ path: "audit-out/r3/12-tour-stop2.png", fullPage: false });

await browser.close();
console.log("errors:", errors);
console.log("done");
