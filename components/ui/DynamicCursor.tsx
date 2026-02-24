"use client";

import { useEffect, useState } from "react";

export default function DynamicCursor() {
  const [styles, setStyles] = useState("");

  useEffect(() => {
    // Generate styles based on current CSS variable
    const updateCursor = () => {
      const root = document.documentElement;
      const primaryVar = getComputedStyle(root)
        .getPropertyValue("--primary")
        .trim();

      let primaryColor = "#ff9233"; // Fallback to orange if not found
      if (primaryVar) {
        // Extract the numbers from formats like "hsl(28 100% 60%)" or "hsl(28, 100%, 60%)"
        const match = primaryVar.match(
          /hsl\(\s*([\d.]+)[^\d\s]*\s*[, ]\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?\s*\)/,
        );
        if (match) {
          const h = parseFloat(match[1]);
          const s = parseFloat(match[2]) / 100;
          const l = parseFloat(match[3]) / 100;

          // HSL to RGB to HEX conversion
          const k = (n: number) => (n + h / 30) % 12;
          const a = s * Math.min(l, 1 - l);
          const f = (n: number) =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

          const rgbToHex = (r: number, g: number, b: number) =>
            "#" +
            [r, g, b]
              .map((x) =>
                Math.round(x * 255)
                  .toString(16)
                  .padStart(2, "0"),
              )
              .join("");

          primaryColor = rgbToHex(f(0), f(8), f(4));
        } else if (primaryVar.startsWith("#")) {
          primaryColor = primaryVar;
        }
      }

      // Helper to encode SVG into valid CSS data URI
      const encodeSvg = (svg: string) =>
        `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

      const normalSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4l18.5 13.5-8.5 2-3 8L4 4z" fill="#09090b" stroke="${primaryColor}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="18" r="1" fill="${primaryColor}"/></svg>`;

      const pointerSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2L24 16L15 17.5L12 26L6 2Z" fill="${primaryColor}" stroke="#09090b" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

      const textSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 8H18M16 8V24M14 24H18" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round"/></svg>`;

      const resizeHSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 16H28M4 16L10 10M4 16L10 22M28 16L22 10M28 16L22 22" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="16" r="2" fill="#09090b" stroke="${primaryColor}"/></svg>`;

      const resizeVSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4V28M16 4L10 10M16 4L22 10M16 28L10 22M16 28L22 22" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="16" r="2" fill="#09090b" stroke="${primaryColor}"/></svg>`;

      const disabledSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="10" stroke="white" stroke-width="2" fill="black" fill-opacity="0.5"/><path d="M9 9L23 23" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`;

      const loadingSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="10" stroke="black" stroke-width="4" stroke-opacity="0.2"/><path d="M16 6a10 10 0 0 1 10 10" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="1s" repeatCount="indefinite"/></path></svg>`;

      const styleString = `
        @media (hover: hover) and (pointer: fine) {
          html, body, .cursor-auto, .cursor-default { cursor: ${encodeSvg(normalSvg)} 4 4, auto !important; }
          a, button, [role="button"], label, input[type="submit"], input[type="button"], .cursor-pointer, .skill-chip, .card, .bot-trigger, [onClick] { cursor: ${encodeSvg(pointerSvg)} 10 2, pointer !important; }
          .cursor-text, input:not([type="button"]):not([type="submit"]):not([type="range"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"], .prose p:not(.cursor-pointer):not([onclick]), .prose span:not(.cursor-pointer):not([onclick]) { cursor: ${encodeSvg(textSvg)} 16 16, text !important; }
          .cursor-col-resize, .react-resizable-handle-e, .react-resizable-handle-w, .code-resizer-handle { cursor: ${encodeSvg(resizeHSvg)} 16 16, col-resize !important; }
          .cursor-row-resize, .react-resizable-handle-s, .react-resizable-handle-n { cursor: ${encodeSvg(resizeVSvg)} 16 16, row-resize !important; }
          .cursor-not-allowed, :disabled, [aria-disabled="true"], fieldset:disabled * { cursor: ${encodeSvg(disabledSvg)} 16 16, not-allowed !important; }
          .cursor-wait, [aria-busy="true"] { cursor: ${encodeSvg(loadingSvg)} 16 16, wait !important; }
          .cursor-move, .cursor-all-scroll { cursor: move !important; }
        }
        html, body {
          cursor: ${encodeSvg(normalSvg)} 4 4, auto;
        }
      `;

      setStyles(styleString);
    };

    updateCursor();

    const observer = new MutationObserver(updateCursor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => observer.disconnect();
  }, []);

  if (!styles) return null;

  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}
