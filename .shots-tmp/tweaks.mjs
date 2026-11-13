import { chromium } from "@playwright/test";
const S = process.argv[2];
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const p = await (
  await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "light" })
).newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto("http://localhost:3200/review", { waitUntil: "networkidle" });
await p.getByRole("button", { name: /Tweaks/ }).click();
await p.waitForTimeout(300);
await p.screenshot({ path: `${S}/tw-open-light.png` });
await p.getByRole("button", { name: "Blueprint" }).click();
await p.waitForTimeout(800);
await p.screenshot({ path: `${S}/tw-blueprint.png` });
console.log(
  await p.evaluate(() => [
    document.documentElement
      .getAttributeNames()
      .filter((n) => n.startsWith("data-ldt"))
      .map((n) => n + "=" + document.documentElement.getAttribute(n))
      .join(" "),
    document.documentElement.style.cssText,
  ]),
);
await p.reload({ waitUntil: "networkidle" });
console.log(
  "after reload",
  await p.evaluate(() => document.documentElement.style.cssText.slice(0, 80)),
);
await p.getByRole("button", { name: /Tweaks/ }).click();
await p.getByRole("button", { name: "Editorial" }).click();
await p.keyboard.press("Escape");
await p.waitForTimeout(800);
await p.screenshot({ path: `${S}/tw-editorial.png` });
const work = p.locator("#work");
await work.scrollIntoViewIfNeeded();
await p.waitForTimeout(600);
await p.screenshot({ path: `${S}/tw-editorial-work.png` });
// grid work + intro letter
await p.evaluate(() => window.scrollTo(0, 0));
await p.getByRole("button", { name: /Tweaks/ }).click();
await p.getByRole("button", { name: "Default" }).click();
await p.locator("summary", { hasText: "Work" }).click();
await p.locator("label", { hasText: "Two-up grid" }).click();
await p.locator("summary", { hasText: "Letter and contact" }).click();
await p.locator("label", { hasText: "Before the work" }).click();
await p.waitForTimeout(300);
await p.screenshot({ path: `${S}/tw-panel-work.png` });
await p.keyboard.press("Escape");
await work.scrollIntoViewIfNeeded();
await p.waitForTimeout(800);
await p.screenshot({ path: `${S}/tw-grid.png` });
console.log("errors", errs.slice(0, 5));
await b.close();
