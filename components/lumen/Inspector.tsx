"use client";

import { useEffect } from "react";
import { haptic, tone } from "./feedback";

const HOLD_MS = 450;
const SLOP_PX = 6;

/**
 * Press and hold any surface marked `data-ld-inspect` (or hold Space on it) to split it into
 * its labelled layers, with its rendered size measured. Releasing collapses it and cancels the
 * click, so holding never triggers a link or button. Also squashes display letters on press.
 */
export default function Inspector() {
  useEffect(() => {
    const ring = document.getElementById("ld-holdring");
    const live = document.getElementById("ld-live");
    let pending: {
      el: HTMLElement;
      x: number;
      y: number;
      id: number | "key";
      timer: number;
    } | null = null;
    let exploded: HTMLElement | null = null;
    let suppressClick = false;

    const press = (el: HTMLElement, x: number, y: number) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--px", `${Math.round(((x - rect.left) / rect.width) * 100)}%`);
      el.style.setProperty("--py", `${Math.round(((y - rect.top) / rect.height) * 100)}%`);
      el.classList.add("is-pressed");
      el.dataset.ldPressedAt = String(performance.now());
    };
    const release = (el: HTMLElement) => {
      const wait = Math.max(0, 90 - (performance.now() - Number(el.dataset.ldPressedAt || 0)));
      window.setTimeout(() => el.classList.remove("is-pressed"), wait);
    };
    const cancelHold = () => {
      const current = pending;
      if (!current) return null;
      window.clearTimeout(current.timer);
      ring?.classList.remove("is-on");
      pending = null;
      return current;
    };

    const ensure = (host: Element, className: string, html: string) => {
      let node = host.querySelector<HTMLElement>(`:scope > .${className}`);
      if (!node) {
        node = document.createElement("span");
        node.className = className;
        node.setAttribute("aria-hidden", "true");
        node.innerHTML = html;
        host.appendChild(node);
      }
      return node;
    };

    const prepare = (el: HTMLElement) => {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const radius = Math.round(
        Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, width / 2, height / 2),
      );
      const shape = CSS.supports("corner-shape", "squircle") ? "squircle" : "round";
      const dims = ensure(
        el,
        "ld-dims",
        '<span class="ld-dim-w"><b></b></span><span class="ld-dim-h"><b></b></span><span class="ld-dim-r"></span>',
      );
      dims.querySelector(".ld-dim-w b")!.textContent = `${width} px`;
      dims.querySelector(".ld-dim-h b")!.textContent = `${height} px`;
      dims.querySelector(".ld-dim-r")!.textContent = `r ${radius} · ${shape}`;

      // Wide surfaces keep their callouts inside the sheet so they never leave the screen.
      const rect = el.getBoundingClientRect();
      el.classList.toggle("ld-callouts-inside", rect.right + 240 > window.innerWidth);

      const callout = (host: Element, text: string, lead: number) => {
        const node = ensure(host, "ld-callout", "<i></i><span></span>");
        node.lastElementChild!.textContent = text;
        node.style.setProperty("--lead", `${Math.max(18, lead)}px`);
      };
      if (el.dataset.ldBase) callout(el, el.dataset.ldBase, 30);
      const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-ld-layer]")).filter(
        (layer) => layer.closest("[data-ld-inspect]") === el && layer.offsetParent !== null,
      );
      layers.forEach((layer, index) => {
        layer.style.setProperty("--li", String(index + 1));
        const right = layer.getBoundingClientRect().right;
        callout(layer, layer.dataset.ldLayer || "", rect.right - right + 30);
      });
      return { width, height, count: layers.length + 1 };
    };

    const explode = (el: HTMLElement) => {
      el.classList.remove("is-pressed");
      const { width, height, count } = prepare(el);
      exploded = el;
      el.classList.add("is-exploded");
      document.body.classList.add("ld-inspecting");
      haptic([6, 30, 10]);
      tone("morph", 0.8);
      if (live)
        live.textContent = `Inspecting ${el.dataset.ldName}: ${count} layers, ${width} by ${height} pixels. Release to close.`;
    };
    const collapse = () => {
      if (!exploded) return;
      exploded.classList.remove("is-exploded");
      document.body.classList.remove("ld-inspecting");
      exploded = null;
      tone("settle", 0.5);
      if (live) live.textContent = "";
    };

    const startHold = (el: HTMLElement, x: number, y: number, id: number | "key") => {
      cancelHold();
      press(el, x, y);
      if (ring) {
        ring.style.translate = `${x}px ${y}px`;
        ring.classList.remove("is-on");
        void ring.getBoundingClientRect();
        ring.classList.add("is-on");
      }
      pending = {
        el,
        x,
        y,
        id,
        timer: window.setTimeout(() => {
          const current = cancelHold();
          if (current) explode(current.el);
        }, HOLD_MS),
      };
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element;
      const letter = target.closest?.(".ld-ch");
      if (letter) {
        letter.classList.add("is-squashed");
        window.setTimeout(() => letter.classList.remove("is-squashed"), 110);
        tone("snap", 0.5);
        haptic(6);
      }
      if (event.button !== 0 || exploded) return;
      const el = target.closest?.<HTMLElement>("[data-ld-inspect]");
      if (el) startHold(el, event.clientX, event.clientY, event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      const current = pending;
      if (
        current &&
        current.id === event.pointerId &&
        Math.hypot(event.clientX - current.x, event.clientY - current.y) > SLOP_PX
      ) {
        cancelHold();
        release(current.el);
      }
    };
    const onPointerEnd = (event: PointerEvent) => {
      if (exploded) {
        collapse();
        suppressClick = true;
        window.setTimeout(() => (suppressClick = false), 400);
        return;
      }
      const current = pending;
      if (current && current.id === event.pointerId) {
        cancelHold();
        release(current.el);
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    };
    const onContextMenu = (event: MouseEvent) => {
      if ((event.target as Element).closest?.("[data-ld-inspect]")) event.preventDefault();
    };
    const inspectTarget = (event: KeyboardEvent) =>
      (event.target as Element).closest?.<HTMLElement>("[data-ld-inspect]") ?? null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && exploded) {
        collapse();
        return;
      }
      if (event.key !== " ") return;
      const el = inspectTarget(event);
      const field = (event.target as Element).closest?.("input, textarea, select");
      if (!el || field) return;
      event.preventDefault();
      if (event.repeat || pending || exploded) return;
      const rect = el.getBoundingClientRect();
      startHold(el, rect.left + rect.width / 2, rect.top + rect.height / 2, "key");
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== " ") return;
      const el = inspectTarget(event);
      const field = (event.target as Element).closest?.("input, textarea, select");
      if (!el || field) return;
      event.preventDefault();
      if (exploded) {
        collapse();
        return;
      }
      const current = cancelHold();
      if (current) {
        release(current.el);
        (event.target as HTMLElement).click();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerup", onPointerEnd);
    document.addEventListener("pointercancel", onPointerEnd);
    document.addEventListener("click", onClick, true);
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      cancelHold();
      collapse();
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerEnd);
      document.removeEventListener("pointercancel", onPointerEnd);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return null;
}
