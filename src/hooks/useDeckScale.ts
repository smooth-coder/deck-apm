import { useLayoutEffect, type RefObject } from "react";
import { computeDeck } from "../lib/deck";

/**
 * Writes the deck canvas size and scale as CSS variables on the element. The stylesheet only
 * consumes them on wide screens (see `.app` in index.css); on narrow screens the variables are
 * removed so the page is a normal scrollable flow.
 */
export function useDeckScale(ref: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      const deck = computeDeck(window.innerWidth, window.innerHeight);
      if (!deck) {
        el.style.removeProperty("--deck-scale");
        el.style.removeProperty("--deck-w");
        el.style.removeProperty("--deck-h");
        return;
      }
      el.style.setProperty("--deck-scale", deck.scale.toFixed(5));
      el.style.setProperty("--deck-w", `${deck.width.toFixed(2)}px`);
      el.style.setProperty("--deck-h", `${deck.height.toFixed(2)}px`);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [ref]);
}
