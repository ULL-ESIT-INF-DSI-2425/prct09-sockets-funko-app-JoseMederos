import { describe, expect, test } from "vitest";
import { add, sub, div } from "../src/basicFunctions";

describe("add function tests", () => {
  test("add(1, 8) returns value 9", () => {
    expect(add(1, 8)).toBe(9);
  });

  test("add(-1, 8) returns value 7", () => {
    expect(add(-1, 8)).toBe(7);
  });
});

describe("sub function tests", () => {
  test("sub(10, 7) returns value 3", () => {
    expect(sub(10, 7)).toBe(3);
  });

  test("sub(-1, 8) returns value -9", () => {
    expect(sub(-1, 8)).toBe(-9);
  });

  test("sub(10, 3) returns value 7", () => {
    expect(sub(10, 3)).toBe(7);
  });
});

describe("div function tests", () => {
  test("div(17, 0) throws an error", () => {
    // Expect must be used in this way, if the test consists of
    // checking if an error is thrown by any function
    expect(() => div(17, 0)).toThrowError("Zero division");
  });

  test("div(4, 8) returns value 0.5", () => {
    expect(div(4, 8)).toBe(0.5);
  });

  test("div(1, 3) returns value 0.3", () => {
    expect(div(1, 3)).toBeCloseTo(0.33);
  });
});
