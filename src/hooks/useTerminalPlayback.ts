import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TermEntry } from "../playground/commands";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export interface PlaybackFrame {
  /** Entries shown in full, from the top. */
  readonly count: number;
  /** Characters typed so far of entry `count`, when that entry is a command. */
  readonly chars: number;
}

const CHARS_PER_FRAME = 3;
const CHAR_FRAME_S = 0.025;
const AFTER_COMMAND_S = 0.18;
const DELAY_S: Readonly<Record<TermEntry["kind"], number>> = {
  command: 0,
  note: 0.3,
  out: 0.06,
  ok: 0.08,
  warn: 0.12,
  err: 0.12,
  dim: 0.06,
};

/** Each entry list is one command step. Replacing it starts a fresh playback from line zero. */
export function useTerminalPlayback(entries: readonly TermEntry[]) {
  const reduced = usePrefersReducedMotion();
  const [playback, setPlayback] = useState({ entries, frame: { count: 0, chars: 0 } });
  const timeline = useRef<gsap.core.Timeline | null>(null);

  const commit = useCallback((frame: PlaybackFrame) => {
    setPlayback({ entries, frame });
  }, [entries]);

  useEffect(() => {
    if (reduced || entries.length === 0) return;

    const tl = gsap.timeline();
    let at = 0;
    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      if (!entry) continue;
      if (entry.kind === "command") {
        tl.call(() => commit({ count: i, chars: 0 }), undefined, at);
        for (let c = CHARS_PER_FRAME; c < entry.text.length; c += CHARS_PER_FRAME) {
          at += CHAR_FRAME_S;
          tl.call(() => commit({ count: i, chars: c }), undefined, at);
        }
        at += AFTER_COMMAND_S;
      }
      const done = i + 1;
      tl.call(() => commit({ count: done, chars: 0 }), undefined, at);
      at += DELAY_S[entry.kind];
    }
    timeline.current = tl;
    return () => {
      tl.kill();
    };
  }, [entries, reduced, commit]);

  const skip = useCallback(() => {
    timeline.current?.kill();
    commit({ count: entries.length, chars: 0 });
  }, [entries, commit]);

  const effective: PlaybackFrame = reduced
    ? { count: entries.length, chars: 0 }
    : playback.entries === entries ? playback.frame : { count: 0, chars: 0 };
  return { frame: effective, playing: effective.count < entries.length, skip };
}
