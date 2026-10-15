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
    <div className="terminal" role="log" aria-label="Salida de terminal">
      <div className="terminal__bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {badge ? <p className="terminal__badge">{badge}</p> : null}
      <ul
        className="terminal__lines"
        lang="en"
        style={{ "--terminal-lines": lines.length } as CSSProperties}
      >
        {lines.slice(0, visible).map((line) => (
          <li key={line.text} className={`terminal__line terminal__line--${line.kind}`}>
            {line.text}
            {line.ref ? (
              <span className="terminal__ref" lang="es" aria-label={`ver elemento faltante ${line.ref}`}>
                {line.ref}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
