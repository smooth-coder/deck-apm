import { useCallback, useEffect, useRef, useState } from "react";
import { toggleFullscreen as defaultToggleFullscreen } from "../lib/fullscreen";
import {
  clampIndex,
  formatHash,
  keyToAction,
  nextIndex,
  parseHash,
  prevIndex,
} from "../lib/navigation";

interface Options {
  toggleFullscreen?: () => Promise<boolean>;
}

const readIndex = (count: number): number => parseHash(window.location.hash, count) ?? 0;

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

const INTERACTIVE = 'button, a[href], summary, [role="button"], [role="link"], [role="tab"], [role="menuitem"]';

/**
 * True when the focused element handles Space and Enter itself (click on activation).
 * Those keys must reach the element, not the global scene navigation.
 */
function isActivatable(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(INTERACTIVE) !== null;
}

export function useSceneNavigation(count: number, options: Options = {}) {
  const [index, setIndex] = useState(() => readIndex(count));
  const indexRef = useRef(index);
  const fullscreenRef = useRef(options.toggleFullscreen ?? defaultToggleFullscreen);
  fullscreenRef.current = options.toggleFullscreen ?? defaultToggleFullscreen;

  const goTo = useCallback(
    (target: number) => {
      const next = clampIndex(target, count);
      indexRef.current = next;
      setIndex(next);
      if (window.location.hash !== formatHash(next)) window.location.hash = formatHash(next);
    },
    [count],
  );

  useEffect(() => {
    const onHashChange = () => {
      const next = readIndex(count);
      indexRef.current = next;
      setIndex(next);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isEditable(event.target)) return;
      if ((event.key === " " || event.key === "Enter") && isActivatable(event.target)) return;
      const action = keyToAction(event.key, count);
      if (!action) return;
      event.preventDefault();
      switch (action.type) {
        case "next":
          goTo(nextIndex(indexRef.current, count));
          break;
        case "prev":
          goTo(prevIndex(indexRef.current, count));
          break;
        case "goto":
          goTo(action.index);
          break;
        case "fullscreen":
          void fullscreenRef.current();
          break;
      }
    };
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [count, goTo]);

  return { index, goTo };
}
