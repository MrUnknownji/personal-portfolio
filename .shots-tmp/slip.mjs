import { chromium } from "@playwright/test";
const S = process.argv[2];
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
for (const [scheme, w, h] of [
  ["dark", 1440, 900],
  ["light", 1440, 900],
  ["dark", 390, 844],
]) {
  const p = await (
    await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme })
  ).newPage();
  await p.goto("http://localhost:" + (process.env.PORT ?? 3200) + "/review", {
    waitUntil: "networkidle",
  });
  const sl = p.locator(".ld-reply");
  for (let i = 0; i < 4; i++) {
    await sl.evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
    await p.waitForTimeout(250);
  }
  await p.screenshot({ path: `${S}/slip-${scheme}-${w}.png` });
  await p.locator(".ld-scissors").focus();
  await p.keyboard.press("Enter");
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${S}/slip-cut-${scheme}-${w}.png` });
  if (w === 390) {
    const post = p.locator(".ld-post[data-slot=contact]");
    for (let i = 0; i < 4; i++) {
      await post.evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
      await p.waitForTimeout(250);
    }
    await p.screenshot({ path: `${S}/m-letter.png` });
    console.log(
      await p.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ]),
    );
  }
}
await b.close();
