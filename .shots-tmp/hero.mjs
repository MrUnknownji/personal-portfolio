import { chromium } from "@playwright/test";
const S = process.argv[2];
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const p = await (
  await b.newContext({ viewport: { width: 1600, height: 950 }, colorScheme: "dark" })
).newPage();
await p.goto("http://localhost:3200/review", { waitUntil: "networkidle" });
await p.getByRole("button", { name: /Tweaks/ }).click();
await p.locator("summary", { hasText: "Colour" }).click();
await p.locator("summary", { hasText: "Layout" }).click();
for (const v of ["Mirrored", "Name across"]) {
  await p.locator("label", { hasText: v }).click();
  await p.locator("summary", { hasText: "Layout" }).click();
  await p.keyboard.press("Escape");
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${S}/hero-${v.replace(" ", "")}.png` });
  await p.getByRole("button", { name: /Tweaks/ }).click();
  await p.locator("summary", { hasText: "Layout" }).click();
}
await b.close();
