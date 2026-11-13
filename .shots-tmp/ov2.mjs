import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto("http://localhost:" + (process.env.PORT ?? 3200) + process.argv[2], { waitUntil: "networkidle" });
console.log(await p.evaluate((sel) => {
  const root = document.querySelector(sel);
  const out = [];
  const walk = (el, depth) => {
    for (const c of el.children) {
      const prev = c.style.display;
      c.style.display = "none";
      const sw = root.scrollWidth;
      c.style.display = prev;
      if (sw <= document.documentElement.clientWidth) { out.push(" ".repeat(depth) + c.tagName + "." + String(c.className).slice(0, 50)); if (depth < 6) walk(c, depth + 1); return; }
    }
  };
  walk(root, 0);
  return root.scrollWidth + "\n" + out.join("\n");
}, process.argv[3]));
await b.close();
