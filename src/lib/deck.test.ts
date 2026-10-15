import { describe, expect, it } from "vitest";
import { computeDeck, DECK_HEIGHT, DECK_MIN_WIDTH } from "./deck";

describe("computeDeck", () => {
  it("returns null on narrow screens, which scroll normally", () => {
    expect(computeDeck(390, 844)).toBeNull();
    expect(computeDeck(899, 1200)).toBeNull();
  });

  it("scales a 16:9 viewport by height and grows the canvas width", () => {
    const deck = computeDeck(1920, 1080);
    expect(deck).not.toBeNull();
    expect(deck!.scale).toBeCloseTo(1080 / DECK_HEIGHT);
    expect(deck!.height).toBeCloseTo(DECK_HEIGHT);
  });

  it("scales a 4:3 viewport by width and grows the canvas height", () => {
    const deck = computeDeck(1024, 768)!;
    expect(deck.scale).toBeCloseTo(1024 / DECK_MIN_WIDTH);
    expect(deck.width).toBeCloseTo(DECK_MIN_WIDTH);
    expect(deck.height).toBeGreaterThan(DECK_HEIGHT);
  });

  it("always covers the viewport exactly, for any aspect ratio", () => {
    for (const [w, h] of [[1280, 600], [2560, 1080], [3440, 1440], [900, 1400]] as const) {
      const deck = computeDeck(w, h)!;
      expect(deck.width * deck.scale).toBeCloseTo(w);
      expect(deck.height * deck.scale).toBeCloseTo(h);
      expect(deck.width).toBeGreaterThanOrEqual(DECK_MIN_WIDTH - 0.01);
      expect(deck.height).toBeGreaterThanOrEqual(DECK_HEIGHT - 0.01);
    }
  });
});
