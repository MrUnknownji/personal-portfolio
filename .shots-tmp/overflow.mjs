import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto("http://localhost:" + (process.env.PORT ?? 3200) + process.argv[2], { waitUntil: "networkidle" });
console.log(await p.evaluate(() => {
  const out = [document.documentElement.scrollWidth + " sw", document.body.scrollWidth + " body", [...document.body.children].map(c => c.tagName + ":" + c.scrollWidth + ":" + Math.round(c.getBoundingClientRect().right)).join(" ")];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.right > document.documentElement.clientWidth + 1 && r.width > 0) {
      let a = el.parentElement, clipped = false;
      while (a) { const s = getComputedStyle(a); if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) { clipped = true; break; } a = a.parentElement; }
      out.push(`${el.tagName}.${String(el.className).slice(0,40)} r=${Math.round(r.right)} w=${Math.round(r.width)}`);
    }
  }
  return out.slice(0, 15).join("\n");
}));
await b.close();
