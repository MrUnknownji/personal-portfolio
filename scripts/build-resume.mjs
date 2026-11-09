// Prints the /quick profile to public/sandeep-kumar-resume.pdf so the résumé
// and the site always share one source (data/profile.ts).
// Usage: pnpm build && pnpm resume   (set CHROME_PATH to use a system Chrome)
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const PORT = 3102;
const ROOT_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT = new URL("../public/sandeep-kumar-resume.pdf", import.meta.url);

async function waitForServer(deadline = Date.now() + 60_000) {
  while (Date.now() < deadline) {
    try {
      if ((await fetch(ROOT_URL)).ok) return;
    } catch {
      // Still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Next.js did not start within 60 seconds. Run `pnpm build` first.");
}

const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
  {
    stdio: "ignore",
  },
);

try {
  await waitForServer();
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
  );
  const page = await browser.newPage();
  await page.goto(`${ROOT_URL}/quick`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: OUTPUT.pathname,
    format: "A4",
    printBackground: false,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log(`Wrote ${OUTPUT.pathname}`);
} finally {
  server.kill("SIGTERM");
}
