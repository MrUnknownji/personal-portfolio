// usage: node shot.mjs <path> <outprefix> [scrollSteps]
import { chromium } from "@playwright/test";
const [, , path, out, stepsArg] = process.argv;
const steps = Number(stepsArg ?? 6);
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const errors = [];
for (const [name, vp] of [
  ["d", { width: 1440, height: 900 }],
  ["m", { width: 390, height: 844 }],
]) {
  const ctx = await b.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
    hasTouch: name === "m",
    isMobile: name === "m",
  });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(name + ": " + e.message));
  p.on(
    "console",
    (m) =>
      m.type() === "error" &&
      !m.text().includes("_next/hmr") &&
      errors.push(name + " console: " + m.text().slice(0, 300)),
  );
  await p.goto("http://localhost:" + (process.env.PORT ?? 3200) + path, {
    waitUntil: "networkidle",
  });
  await p.waitForTimeout(1600);
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  if (sw > vp.width) errors.push(`${name}: horizontal overflow ${sw}px`);
  const n = Math.min(steps, Math.ceil(h / vp.height));
  for (let i = 0; i < n; i++) {
    await p.evaluate(
      (y) => window.scrollTo(0, y),
      Math.round((i * (h - vp.height)) / Math.max(1, n - 1)),
    );
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${out}-${name}-${i}.png` });
  }
  await ctx.close();
}
console.log(errors.join("\n") || "no errors");
await b.close();
