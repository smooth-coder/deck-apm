import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { cumulative } from "../lib/sequence";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Drives a staged reveal: `stage` goes from 0 to `delays.length`, one step per delay.
 * With prefers-reduced-motion the final stage is reached immediately.
 * `delays` must be a stable reference (module constant or memoized).
 */
export function useStages(delays: readonly number[]) {
  const reduced = usePrefersReducedMotion();
  const total = delays.length;
  const [stage, setStage] = useState(reduced ? total : 0);
  const [run, setRun] = useState(0);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (reduced) {
      setStage(total);
      return;
    }
    setStage(0);
    const tl = gsap.timeline();
    cumulative(delays).forEach((at, i) => tl.call(() => setStage(i + 1), undefined, at));
    timeline.current = tl;
    return () => {
      tl.kill();
    };
  }, [delays, total, reduced, run]);

  const replay = useCallback(() => setRun((n) => n + 1), []);
  const skip = useCallback(() => {
    timeline.current?.kill();
    setStage(total);
  }, [total]);

  return { stage, total, done: stage >= total, replay, skip };
}
