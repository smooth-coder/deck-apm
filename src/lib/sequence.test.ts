import { cumulative } from "./sequence";

describe("cumulative", () => {
  it("turns delays into absolute offsets", () => {
    expect(cumulative([0.5, 1, 0.25])).toEqual([0.5, 1.5, 1.75]);
  });

  it("returns an empty list for no delays", () => {
    expect(cumulative([])).toEqual([]);
  });

  it("treats negative delays as zero", () => {
    expect(cumulative([1, -5, 1])).toEqual([1, 1, 2]);
  });
});
