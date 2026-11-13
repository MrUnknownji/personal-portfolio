import { chromium } from "@playwright/test";
const [, , url, out, sel, w = "1850", h = "1000", ...fracs] = process.argv;
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const p = await (
  await b.newContext({
    viewport: { width: +w, height: +h },
    colorScheme: process.env.SCHEME ?? "dark",
  })
).newPage();
await p.goto(url, { waitUntil: "networkidle" });
if (process.env.TWEAKS)
  (await p.evaluate((t) => {
    localStorage.setItem("ld-tweaks", t);
  }, process.env.TWEAKS),
    await p.reload({ waitUntil: "networkidle" }));
for (const f of fracs) {
  for (let i = 0; i < 4; i++) {
    await p.evaluate(
      ([s, d]) => {
        const el = document.querySelector(s);
        scrollBy({ top: el.getBoundingClientRect().top + d, behavior: "instant" });
      },
      [sel, Number(f) * +h],
    );
    await p.waitForTimeout(250);
  }
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}-${f}.png` });
}
await b.close();
