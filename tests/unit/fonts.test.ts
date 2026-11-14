import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Keep in step with the UNICODES list in app/fonts/README.md.
const COVERED = new Set("©®·É×àáâãäçèéêëíñóöúü –—‘’“”•…₹←↑→↓↔↕↗↺✓✕▣".split(""));

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|md)$/.test(name) ? [path] : [];
  });

describe("site fonts", () => {
  it("cover every character the site's text uses", () => {
    const missing = new Map<string, string>();
    for (const file of [...files("data"), ...files("app"), ...files("components/lumen")]) {
      if (file.endsWith("README.md")) continue;
      for (const char of readFileSync(file, "utf8")) {
        const code = char.codePointAt(0)!;
        if (code < 0x7f || char === "\n" || COVERED.has(char)) continue;
        missing.set(char, file);
      }
    }
    expect(Object.fromEntries(missing)).toEqual({});
  });
});
