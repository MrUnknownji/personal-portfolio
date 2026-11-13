import { chromium } from "@playwright/test";
const [, , url, out, w = "1850", sels = ""] = process.argv;
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const ctx = await b.newContext({ viewport: { width: +w, height: 1000 }, colorScheme: "dark" });
const p = await ctx.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForTimeout(800);
await p.screenshot({ path: `${out}-top.png` });
for (const s of sels.split(",").filter(Boolean)) {
  const el = p.locator(s).first();
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  await el.screenshot({ path: `${out}-${s.replace(/[^a-z0-9]/gi, "")}.png` });
}
const sw = await p.evaluate(() => [
  document.documentElement.scrollWidth,
  document.documentElement.clientWidth,
]);
console.log("width", sw, "errors", errs.slice(0, 5));
await b.close();
