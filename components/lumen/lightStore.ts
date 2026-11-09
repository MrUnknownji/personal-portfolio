"use client";

import { useSyncExternalStore } from "react";
import { ORBIT_SECONDS, START_ANGLE } from "@/lib/lumen/light";

// Shared state for the one light: whether it orbits, and where it is when paused.
// The orbit itself runs as compositor animations owned by LightEngine.
type LightState = { running: boolean; pausedAt: number; epoch: number };

const duration = ORBIT_SECONDS * 1000;
let state: LightState = { running: false, pausedAt: 0, epoch: 0 };
const listeners = new Set<() => void>();

const now = () => Number(document.timeline.currentTime ?? performance.now());
const emit = () => listeners.forEach((listener) => listener());

export const lightStore = {
  get: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** Milliseconds into the orbit right now. */
  phase() {
    return state.running
      ? (((now() - state.epoch) % duration) + duration) % duration
      : state.pausedAt;
  },
  angle() {
    return START_ANGLE + (360 * lightStore.phase()) / duration;
  },
  setRunning(running: boolean) {
    if (running === state.running) return;
    state = running
      ? { ...state, running, epoch: now() - state.pausedAt }
      : { ...state, running, pausedAt: lightStore.phase() };
    emit();
  },
  setAngle(angle: number) {
    const turn = ((((angle - START_ANGLE) / 360) % 1) + 1) % 1;
    state = { ...state, running: false, pausedAt: turn * duration };
    emit();
  },
};

export function useLight() {
  return useSyncExternalStore(lightStore.subscribe, lightStore.get, lightStore.get);
}
