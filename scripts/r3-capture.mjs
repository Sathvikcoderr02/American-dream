// Round 3 capture: hub with live signals + property module with floor plan
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
await page.waitForTimeout(1500); // let visitor counter tick at least once
await page.screenshot({ path: "audit-out/r3/01-hub-live-signals.png", fullPage: true });

// Wait for ticker to rotate
await page.waitForTimeout(5000);
await page.screenshot({ path: "audit-out/r3/02-hub-signals-rotated.png", fullPage: false });

// Property portal — floor plan
await page.click('button:has-text("The Property")');
await page.waitForTimeout(1300);

// Scroll past hero to floor plan
await page.evaluate(() => {
  const s = document.querySelector("div.overflow-y-auto");
  if (s) s.scrollTo({ top: 1100, behavior: "instant" });
});
await page.waitForTimeout(1200);
await page.screenshot({ path: "audit-out/r3/03-floorplan-default.png", fullPage: false });

// Click Big SNOW zone
await page.evaluate(() => {
  const g = Array.from(document.querySelectorAll("g")).find((el) =>
    el.textContent?.includes("Big SNOW")
  );
  g?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
});
await page.waitForTimeout(900);
await page.screenshot({ path: "audit-out/r3/04-floorplan-bigsnow.png", fullPage: false });

// Click The Avenue zone via mini pill
await page.locator('button:has-text("The Avenue")').first().click();
await page.waitForTimeout(900);
await page.screenshot({ path: "audit-out/r3/05-floorplan-avenue.png", fullPage: false });

await browser.close();
console.log("errors:", errors);
console.log("done");
