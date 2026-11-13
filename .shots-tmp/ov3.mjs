import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto("http://localhost:3200/review-3", { waitUntil: "networkidle" });
console.log(await p.evaluate(() => {
  const a = document.querySelector(".tk-skip"); const s = getComputedStyle(a); const r = a.getBoundingClientRect();
  return [s.position, s.width, s.clipPath, JSON.stringify(r), innerWidth, document.documentElement.clientWidth, visualViewport.width].join(" | ");
}));
await b.close();
