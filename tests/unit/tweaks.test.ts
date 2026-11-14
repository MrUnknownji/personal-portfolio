import { describe, expect, it } from "vitest";
import { DEFAULTS, EARLY_SCRIPT, SITE_LOOK, compile, sanitize } from "@/components/lumen/tweaks";

describe("tweaks", () => {
  it("ships the chosen look on top of the stylesheet's own values", () => {
    expect(SITE_LOOK).toEqual({
      accent: "#7fe3b4",
      surface: "flat",
      lines: "ruled",
      cursor: "dot",
    });
    const { a, v } = compile(DEFAULTS);
    expect(a).toEqual({
      "data-ldt-surface": "flat",
      "data-ldt-lines": "ruled",
      "data-ldt-cursor": "dot",
    });
    expect(v["--ldt-accent"]).toBe("#7fe3b4");
    expect(v["--ldt-on-accent"]).toBe("#15170f");
  });

  it("keeps only known keys and values a control accepts", () => {
    expect(
      sanitize({
        accent: "#FF9A7D",
        surface: "outline",
        work: "<script>",
        max: 99999,
        rail: "yes",
        theme: "dark",
        unknown: 1,
      }),
    ).toEqual({ accent: "#ff9a7d", surface: "outline", max: 1760 });
    expect(sanitize(null)).toEqual({});
    expect(sanitize("nope")).toEqual({});
  });

  it("applies a saved look before paint, and only safe names and values", () => {
    const writes: string[] = [];
    const root = {
      attributes: [{ name: "data-ldt-surface" }],
      style: Object.assign(["--ldt-accent"], {
        removeProperty: (name: string) => writes.push(`-${name}`),
        setProperty: (name: string, value: string) => writes.push(`${name}=${value}`),
      }),
      removeAttribute: (name: string) => writes.push(`-${name}`),
      setAttribute: (name: string, value: string) => writes.push(`${name}=${value}`),
    };
    const saved = JSON.stringify({
      out: {
        v: { "--ldt-accent": "#8ecbff", "--ldt-x": "url(javascript:1)" },
        a: { "data-ldt-work": "list", onclick: "alert(1)" },
      },
    });
    new Function("localStorage", "document", EARLY_SCRIPT)(
      { getItem: () => saved },
      { documentElement: root },
    );
    expect(writes).toEqual([
      "-data-ldt-surface",
      "---ldt-accent",
      "--ldt-accent=#8ecbff",
      "data-ldt-work=list",
    ]);
  });
});
