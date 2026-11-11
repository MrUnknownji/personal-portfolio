import { describe, expect, it } from "vitest";
import {
  simulateSpring,
  Spring,
  springCssVariables,
  springParams,
  SPRING_NAMES,
  toLinearEasing,
} from "@/lib/lumen/springs";

describe("Lumen Draft springs", () => {
  it("settles every preset on its target", () => {
    for (const name of SPRING_NAMES) {
      const response = simulateSpring(springParams(name));
      expect(response.samples.at(-1)).toBeCloseTo(1, 3);
      expect(response.settle).toBeGreaterThan(0);
      expect(response.settle).toBeLessThan(2);
    }
  });

  it("gives the snap spring one visible wobble and the settle spring none", () => {
    expect(simulateSpring(springParams("snap")).overshoot).toBeGreaterThan(0.1);
    expect(simulateSpring(springParams("settle")).overshoot).toBeLessThan(0.01);
  });

  it("removes overshoot when the visitor prefers reduced motion", () => {
    for (const name of SPRING_NAMES) {
      const response = simulateSpring(springParams(name, true));
      expect(response.dampingRatio).toBeCloseTo(1, 5);
      expect(response.overshoot).toBeLessThan(0.001);
    }
  });

  it("exports each spring as a CSS linear() easing that ends on 1", () => {
    const easing = toLinearEasing(simulateSpring(springParams("snap")));
    expect(easing).toMatch(/^linear\(0, /);
    expect(easing.endsWith(", 1)")).toBe(true);
    const variables = springCssVariables();
    expect(Object.keys(variables)).toHaveLength(SPRING_NAMES.length * 2);
    expect(variables["--ld-dur-snap"]).toMatch(/^\d+ms$/);
  });

  it("steps a spring to rest at its target", () => {
    const spring = new Spring(0, "morph");
    spring.target = 100;
    for (let i = 0; i < 240 && !spring.resting; i++) spring.step(1 / 60);
    expect(spring.resting).toBe(true);
    expect(spring.x).toBeCloseTo(100, 0);
  });
});
