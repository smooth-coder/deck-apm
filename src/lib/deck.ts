/** Smallest viewport width that uses the scaled "deck" layout. Narrower screens scroll normally. */
export const DECK_MIN_VIEWPORT_WIDTH = 900;
/** The logical canvas is never narrower than this: below it the layout would have to collapse. */
export const DECK_MIN_WIDTH = 1100;
/** Logical canvas height. Every scene is designed to fit this height with the progress bar. */
export const DECK_HEIGHT = 768;

export interface DeckMetrics {
  /** Uniform scale applied to the logical canvas. */
  scale: number;
  /** Logical canvas size in CSS px before scaling (scaled size equals the viewport). */
  width: number;
  height: number;
}

/**
 * Fit-to-viewport metrics. The canvas adapts to the aspect ratio: the scale is limited by whichever
 * axis is tighter and the other axis simply gets more logical room, so the scaled canvas always
 * covers the viewport exactly (no letterbox) and scenes never overflow for any aspect ratio.
 * Returns null on narrow screens, which use the regular scrollable flow layout.
 */
export function computeDeck(viewportWidth: number, viewportHeight: number): DeckMetrics | null {
  if (viewportWidth < DECK_MIN_VIEWPORT_WIDTH || viewportHeight <= 0) return null;
  const scale = Math.min(viewportWidth / DECK_MIN_WIDTH, viewportHeight / DECK_HEIGHT);
  return { scale, width: viewportWidth / scale, height: viewportHeight / scale };
}
