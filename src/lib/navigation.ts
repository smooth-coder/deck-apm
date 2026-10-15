export type NavAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "goto"; index: number }
  | { type: "fullscreen" };

/** Zero-based index of the consumer demo (scene 5). */
export const PLAYGROUND_INDEX = 4;

export function clampIndex(index: number, count: number): number {
  return Math.min(Math.max(index, 0), Math.max(count - 1, 0));
}

export const nextIndex = (index: number, count: number): number => clampIndex(index + 1, count);
export const prevIndex = (index: number, count: number): number => clampIndex(index - 1, count);

const HASH_PATTERN = /^#\/scene\/(\d+)$/;

/** Parses "#/scene/N" (one-based) into a zero-based index, or null when invalid. */
export function parseHash(hash: string, count: number): number | null {
  const match = HASH_PATTERN.exec(hash);
  if (!match || match[1] === undefined) return null;
  const scene = Number(match[1]);
  return scene >= 1 && scene <= count ? scene - 1 : null;
}

export const formatHash = (index: number): string => `#/scene/${index + 1}`;

export function keyToAction(key: string, count: number): NavAction | null {
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
    case " ":
    case "PageDown":
      return { type: "next" };
    case "ArrowLeft":
    case "ArrowUp":
    case "PageUp":
      return { type: "prev" };
    case "p":
    case "P":
      return { type: "goto", index: PLAYGROUND_INDEX };
    case "f":
    case "F":
      return { type: "fullscreen" };
  }
  if (/^[1-9]$/.test(key)) {
    const index = Number(key) - 1;
    return index < count ? { type: "goto", index } : null;
  }
  return null;
}
