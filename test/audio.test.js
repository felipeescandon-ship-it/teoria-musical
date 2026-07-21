import { computeEnvelope } from "../js/audio.js";

describe("computeEnvelope", () => {
  test("higher velocity produces a shorter attack (snappier hit)", () => {
    const soft = computeEnvelope(0.11, 0.1);
    const hard = computeEnvelope(0.11, 0.9);
    expect(hard.attack).toBeLessThan(soft.attack);
  });
  test("velocity 0 gives the longest attack (~50ms)", () => {
    expect(computeEnvelope(0.11, 0).attack).toBeCloseTo(0.05, 5);
  });
  test("velocity 1 gives the shortest attack (~6ms)", () => {
    expect(computeEnvelope(0.11, 1).attack).toBeCloseTo(0.006, 5);
  });
  test("sustainGain scales with the requested peak volume", () => {
    const quiet = computeEnvelope(0.05, 0.7);
    const loud = computeEnvelope(0.2, 0.7);
    expect(loud.sustainGain).toBeGreaterThan(quiet.sustainGain);
  });
  test("higher velocity yields a higher sustain ratio (rings out longer)", () => {
    const soft = computeEnvelope(0.11, 0.1);
    const hard = computeEnvelope(0.11, 0.9);
    expect(hard.sustainGain / hard.peakGain).toBeGreaterThan(soft.sustainGain / soft.peakGain);
  });
  test("higher velocity yields brighter harmonic content", () => {
    const soft = computeEnvelope(0.11, 0.1);
    const hard = computeEnvelope(0.11, 0.9);
    expect(hard.brightness).toBeGreaterThan(soft.brightness);
  });
  test("velocity is clamped to [0,1] even if given out of range", () => {
    expect(computeEnvelope(0.11, 5).velocity).toBe(1);
    expect(computeEnvelope(0.11, -3).velocity).toBe(0);
  });
  test("omitting velocity infers it from the requested volume", () => {
    const inferred = computeEnvelope(0.15); // volume at the neutral reference point
    expect(inferred.velocity).toBeCloseTo(1, 5);
  });
  test("release is a fixed fade independent of note duration", () => {
    const a = computeEnvelope(0.11, 0.5);
    const b = computeEnvelope(0.2, 0.5);
    expect(a.release).toBe(b.release);
  });
  test("decay stage is always present between attack and sustain", () => {
    const env = computeEnvelope(0.11, 0.5);
    expect(env.decay).toBeGreaterThan(0);
  });
});
