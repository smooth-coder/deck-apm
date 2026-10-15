import { useEffect, useRef } from "react";
import type { PlaybackFrame } from "../../hooks/useTerminalPlayback";
import type { TermEntry } from "../../playground/commands";

interface Props {
  entries: readonly TermEntry[];
  frame: PlaybackFrame;
  playing: boolean;
  onSkip: () => void;
}

export function LabTerminal({ entries, frame, playing, onSkip }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [frame]);

  const shown = entries.slice(0, frame.count);
  const partial = entries[frame.count];
  const typing = playing && partial?.kind === "command" ? partial.text.slice(0, frame.chars) : null;

  return (
    <div className="lab-term">
      <div className="lab-term__bar">
        <span className="lab-term__title">Terminal · read-only, replayed</span>
        {playing ? (
          <button type="button" className="lab-term__skip" onClick={onSkip}>
            Skip typing
          </button>
        ) : null}
      </div>
      <div ref={bodyRef} className="lab-term__body" role="log" aria-label="Terminal output">
        {entries.length === 0 ? (
          <p className="lab-term__line lab-term__line--dim">
            <span className="lab-term__prompt">$ </span>
            <span className="lab-term__cursor" aria-hidden="true" />
          </p>
        ) : null}
        {shown.map((entry, i) => (
          <p key={i} className={`lab-term__line lab-term__line--${entry.kind}`}>
            {entry.kind === "command" ? <span className="lab-term__prompt">$ </span> : null}
            {entry.text}
          </p>
        ))}
        {typing !== null ? (
          <p className="lab-term__line lab-term__line--command">
            <span className="lab-term__prompt">$ </span>
            {typing}
            <span className="lab-term__cursor" aria-hidden="true" />
          </p>
        ) : null}
        {!playing && entries.length > 0 ? (
          <p className="lab-term__line">
            <span className="lab-term__prompt">$ </span>
            <span className="lab-term__cursor" aria-hidden="true" />
          </p>
        ) : null}
      </div>
    </div>
  );
}
