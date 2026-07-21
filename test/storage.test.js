import { migrate, CURRENT_VERSION } from "../js/storage.js";

describe("migrate", () => {
  test("null input (first-time user) produces an empty envelope at the current version", () => {
    expect(migrate(null)).toEqual({ version: CURRENT_VERSION, data: {} });
  });
  test("a v1 envelope is upgraded to the current version", () => {
    const result = migrate({ version: 1, data: { lessonStates: { 1: "explored" } } });
    expect(result.version).toBe(CURRENT_VERSION);
  });
  test("v1 -> v2 migration preserves lessonStates unchanged (no shape change yet)", () => {
    const result = migrate({ version: 1, data: { lessonStates: { 1: "mastered", 2: "practiced" } } });
    expect(result.data.lessonStates).toEqual({ 1: "mastered", 2: "practiced" });
  });
  test("an already-current envelope passes through unchanged", () => {
    const input = { version: CURRENT_VERSION, data: { lessonStates: { 3: "explored" } } };
    expect(migrate(input)).toEqual(input);
  });
  test("missing version on a non-null envelope is treated as v1", () => {
    const result = migrate({ data: { lessonStates: { 1: "explored" } } });
    expect(result.version).toBe(CURRENT_VERSION);
    expect(result.data.lessonStates).toEqual({ 1: "explored" });
  });
});
