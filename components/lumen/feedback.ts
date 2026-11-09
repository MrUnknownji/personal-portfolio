"use client";

import { simulateSpring, springParams, type SpringName } from "@/lib/lumen/springs";

// Optional touch and sound feedback. Sound is off until the visitor turns it on.
const SOUND_KEY = "ld-sound";
const listeners = new Set<() => void>();
let sound = false;
let context: AudioContext | null = null;
const responses = new Map<SpringName, ReturnType<typeof simulateSpring>>();

try {
  sound = typeof localStorage !== "undefined" && localStorage.getItem(SOUND_KEY) === "on";
} catch {
  /* Storage can be disabled. */
}

export const soundStore = {
  get: () => sound,
  getServer: () => false,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  set(next: boolean) {
    sound = next;
    try {
      localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {
      /* Storage can be disabled. */
    }
    listeners.forEach((listener) => listener());
  },
};

export function haptic(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* Not every browser allows vibration. */
  }
}

/** A short tone whose pitch follows the spring's stiffness and whose ring follows its bounce. */
export function tone(name: SpringName, gain = 1) {
  if (!sound) return;
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume();
    const response = responses.get(name) ?? simulateSpring(springParams(name));
    responses.set(name, response);
    const decay = 0.06 + 0.24 * (1 - Math.min(1, response.dampingRatio));
    const t = context.currentTime;
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.frequency.setValueAtTime(response.pitch * 1.5, t);
    oscillator.frequency.exponentialRampToValueAtTime(response.pitch, t + 0.03);
    volume.gain.setValueAtTime(0.0001, t);
    volume.gain.linearRampToValueAtTime(0.07 * gain, t + 0.004);
    volume.gain.exponentialRampToValueAtTime(0.0001, t + 0.004 + decay);
    oscillator.connect(volume).connect(context.destination);
    oscillator.start(t);
    oscillator.stop(t + decay + 0.05);
  } catch {
    /* Audio is optional. */
  }
}
