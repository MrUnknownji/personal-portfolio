import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";

const ROOT_URL = "http://127.0.0.1:3101";
const START_TIMEOUT_MS = 60_000;
const config = JSON.parse(await readFile(new URL("../lighthouserc.json", import.meta.url), "utf8"));
const { collect, assert } = config.ci;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr || stdout || `${command} exited with code ${code}`));
    });
  });
}

async function waitForServer() {
  const deadline = Date.now() + START_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(ROOT_URL);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Next.js did not become ready within ${START_TIMEOUT_MS / 1_000} seconds.`);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function getMetric(report, key) {
  if (key === "categories:performance") return report.categories.performance.score;
  if (key === "categories:accessibility") return report.categories.accessibility.score;
  if (key === "resource-summary:script:size") {
    return report.audits["resource-summary"].details.items.find((item) => item.resourceType === "script").transferSize;
  }

  return report.audits[key].numericValue;
}

function formatMetric(key, value) {
  if (key.startsWith("categories:")) return value.toFixed(2);
  if (key === "cumulative-layout-shift") return value.toFixed(3);
  if (key.endsWith(":size")) return `${Math.round(value / 1_000)} kB`;
  return `${Math.round(value)} ms`;
}

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", "3101"], {
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.pipe(process.stdout);
server.stderr.pipe(process.stderr);

try {
  await waitForServer();
  const failures = [];

  for (const url of collect.url) {
    const reports = [];

    for (let runNumber = 1; runNumber <= collect.numberOfRuns; runNumber += 1) {
      process.stdout.write(`Auditing ${url} (${runNumber}/${collect.numberOfRuns})... `);
      const output = await run(
        process.execPath,
        [
          "node_modules/lighthouse/cli/index.js",
          url,
          "--quiet",
          "--output=json",
          "--output-path=stdout",
          "--only-categories=performance,accessibility",
          "--chrome-flags=--headless --no-sandbox --disable-gpu",
        ],
        { stdio: ["ignore", "pipe", "pipe"] },
      );
      reports.push(JSON.parse(output));
      console.log("done");
    }

    console.log(`\n${url}`);
    for (const [key, [, threshold]] of Object.entries(assert.assertions)) {
      const value = median(reports.map((report) => getMetric(report, key)));
      const passed = threshold.minScore === undefined
        ? value <= threshold.maxNumericValue
        : value >= threshold.minScore;
      console.log(`  ${passed ? "PASS" : "FAIL"} ${key}: ${formatMetric(key, value)}`);
      if (!passed) failures.push(`${url}: ${key}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Lighthouse thresholds failed:\n- ${failures.join("\n- ")}`);
  }
} finally {
  server.kill("SIGTERM");
}
