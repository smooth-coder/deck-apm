import {
  clampIndex,
  formatHash,
  keyToAction,
  nextIndex,
  parseHash,
  prevIndex,
} from "./navigation";

describe("clampIndex", () => {
  it("keeps in-range values", () => expect(clampIndex(2, 6)).toBe(2));
  it("clamps below zero", () => expect(clampIndex(-3, 6)).toBe(0));
  it("clamps above the last index", () => expect(clampIndex(99, 6)).toBe(5));
});

describe("nextIndex / prevIndex", () => {
  it("advances", () => expect(nextIndex(0, 6)).toBe(1));
  it("stops at the end", () => expect(nextIndex(5, 6)).toBe(5));
  it("goes back", () => expect(prevIndex(3, 6)).toBe(2));
  it("stops at the start", () => expect(prevIndex(0, 6)).toBe(0));
});

describe("parseHash", () => {
  it("parses a valid hash to a zero-based index", () => {
    expect(parseHash("#/scene/3", 6)).toBe(2);
  });
  it("returns null for empty or malformed hashes", () => {
    expect(parseHash("", 6)).toBeNull();
    expect(parseHash("#", 6)).toBeNull();
    expect(parseHash("#/scene/", 6)).toBeNull();
    expect(parseHash("#/scene/abc", 6)).toBeNull();
    expect(parseHash("#/scene/2x", 6)).toBeNull();
    expect(parseHash("#/other/2", 6)).toBeNull();
  });
  it("returns null for out-of-range scenes", () => {
    expect(parseHash("#/scene/0", 6)).toBeNull();
    expect(parseHash("#/scene/7", 6)).toBeNull();
  });
});

describe("formatHash", () => {
  it("formats a zero-based index as a one-based hash", () => {
    expect(formatHash(0)).toBe("#/scene/1");
    expect(formatHash(4)).toBe("#/scene/5");
  });
});

describe("keyToAction", () => {
  it.each(["ArrowRight", "ArrowDown", " ", "PageDown"])("%s is next", (key) => {
    expect(keyToAction(key, 6)).toEqual({ type: "next" });
  });
  it.each(["ArrowLeft", "ArrowUp", "PageUp"])("%s is previous", (key) => {
    expect(keyToAction(key, 6)).toEqual({ type: "prev" });
  });
  it("maps number keys to scenes", () => {
    expect(keyToAction("1", 6)).toEqual({ type: "goto", index: 0 });
    expect(keyToAction("6", 6)).toEqual({ type: "goto", index: 5 });
  });
  it("ignores number keys beyond the scene count", () => {
    expect(keyToAction("7", 6)).toBeNull();
    expect(keyToAction("0", 6)).toBeNull();
  });
  it("maps P to the playground (scene 5) case-insensitively", () => {
    expect(keyToAction("p", 6)).toEqual({ type: "goto", index: 4 });
    expect(keyToAction("P", 6)).toEqual({ type: "goto", index: 4 });
  });
  it("maps F to fullscreen", () => {
    expect(keyToAction("f", 6)).toEqual({ type: "fullscreen" });
  });
  it("ignores unrelated keys", () => {
    expect(keyToAction("x", 6)).toBeNull();
    expect(keyToAction("Enter", 6)).toBeNull();
  });
});
