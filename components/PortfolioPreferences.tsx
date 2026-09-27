"use client";

import { useEffect } from "react";

export const portfolioPalettes = [
  { name: "Orange", accent: "#e9702c", ink: "#a84920" },
  { name: "Ochre", accent: "#c4ad38", ink: "#685714" },
  { name: "Sage", accent: "#7ba78c", ink: "#365b43" },
  { name: "Lilac", accent: "#b083ba", ink: "#693c74" },
  { name: "Blue", accent: "#7398bd", ink: "#345676" },
] as const;

const storageKey = "portfolio-lab-settings";
export type PortfolioSettings = { spacing: number; palette: number };
export const defaultPortfolioSettings: PortfolioSettings = { spacing: 0, palette: 0 };

export function readPortfolioSettings(): PortfolioSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    return {
      spacing: Number.isFinite(saved?.spacing) ? Math.max(-7, Math.min(22, saved.spacing)) : 0,
      palette: Number.isInteger(saved?.palette) && saved.palette >= 0 && saved.palette < portfolioPalettes.length ? saved.palette : 0,
    };
  } catch {
    return defaultPortfolioSettings;
  }
}

export function applyPortfolioSettings(settings: PortfolioSettings) {
  const root = document.documentElement;
  const color = portfolioPalettes[settings.palette] || portfolioPalettes[0];
  const siteSpacing = Math.max(-2, Math.min(4, settings.spacing));
  root.style.setProperty("--offset-orange", color.accent);
  root.style.setProperty("--primary", color.ink);
  root.style.setProperty("--accent", color.ink);
  root.style.setProperty("--ring", color.ink);
  root.style.setProperty("--scrollbar-thumb-hover", color.ink);
  root.style.setProperty("--portfolio-tracking", `${siteSpacing / 7}px`);
  root.style.setProperty("--portfolio-label-tracking", `${siteSpacing / 22}px`);
  root.dataset.portfolioPalette = color.name.toLowerCase();
  try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch { /* Storage can be disabled. */ }
}

export default function PortfolioPreferences() {
  useEffect(() => { applyPortfolioSettings(readPortfolioSettings()); }, []);
  return null;
}
