import type { CSSProperties } from "react";
import type { TerminalLine } from "../../data/hook";

interface Props {
  lines: readonly TerminalLine[];
  /** How many lines are visible, from the top. */
  visible: number;
  /** Optional label, e.g. "Illustrative terminal". */
  badge?: string;
}

export function Terminal({ lines, visible, badge }: Props) {
  return (
    <div className="terminal" role="log" aria-label="Terminal output">
      <div className="terminal__bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {badge ? <p className="terminal__badge">{badge}</p> : null}
      <ul
        className="terminal__lines"
        style={{ "--terminal-lines": lines.length } as CSSProperties}
      >
        {lines.slice(0, visible).map((line) => (
          <li key={line.text} className={`terminal__line terminal__line--${line.kind}`}>
            {line.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
