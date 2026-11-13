import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("http://localhost:" + (process.env.PORT ?? 3200) + "/review", {
  waitUntil: "networkidle",
});
const sc = p.locator(".ld-scissors");
for (let i = 0; i < 4; i++) {
  await sc.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await p.waitForTimeout(250);
}
const box = await sc.boundingBox();
const sx = box.x + box.width / 2 + 5,
  sy = box.y + box.height / 2;
await p.mouse.move(sx, sy);
await p.mouse.down();
const drift = [];
for (const dx of [30, 90, 170, 260]) {
  await p.mouse.move(sx + dx, sy);
  const nb = await sc.boundingBox();
  drift.push(Math.round((nb.x + nb.width / 2 + 5 - (sx + dx)) * 10) / 10);
}
await p.mouse.move(sx + 120, sy);
await p.mouse.up();
await p.waitForTimeout(200);
const cutAfterPartial = await p.locator(".ld-slip[data-cut]").count();
await sc.focus();
await p.keyboard.press("Enter");
await p.waitForTimeout(700);
console.log({
  drift,
  cutAfterPartial,
  cutAfterEnter: await p.locator(".ld-slip[data-cut]").count(),
  label: await p.locator(".ld-slip-reply .ld-anno").first().textContent(),
});
await b.close();
