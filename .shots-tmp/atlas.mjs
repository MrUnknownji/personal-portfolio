import { chromium } from "@playwright/test";
const S = "/tmp/claude-1000/-home-unknown-web-personal-portfolio/c6c5e3aa-bfa2-4a4c-acc6-c85396710292/scratchpad/prod/atlas";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const errors = [];
for (const [name, vp, scheme] of [["d", {width:1440,height:900}, "light"], ["dn", {width:1440,height:900}, "dark"], ["m", {width:390,height:844}, "light"]]) {
  const ctx = await b.newContext({ viewport: vp, colorScheme: scheme, deviceScaleFactor: 1, hasTouch: name==="m" });
  const p = await ctx.newPage();
  p.on("pageerror", e => errors.push(name+": "+e.message));
  p.on("console", m => m.type()==="error" && errors.push(name+" console: "+m.text()));
  await p.goto("http://localhost:3100/review-2", { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  await p.screenshot({ path: S+"/"+name+"-0-overview.png" });
  await p.waitForTimeout(2600);
  await p.screenshot({ path: S+"/"+name+"-1-origin.png" });
  const next = p.getByRole("button", { name: "Next stop" });
  for (let i = 2; i <= 6; i++) { await next.click(); await p.waitForTimeout(1900); await p.screenshot({ path: S+"/"+name+"-"+i+".png" }); }
  await ctx.close();
}
console.log(errors.join("\n") || "no errors");
await b.close();
