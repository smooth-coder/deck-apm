import type { MissingPiece } from "../../data/hook";

interface Props {
  title: string;
  pieces: readonly MissingPiece[];
  /** How many pieces are revealed, from the top. Hidden pieces keep their slot so nothing shifts. */
  visible: number;
}

/** Configuration gaps related to the illustrative review, not guaranteed fixes. */
export function MissingContext({ title, pieces, visible }: Props) {
  return (
    <section className="missing" aria-label={title}>
      <h2 className="missing__title">{title}</h2>
      <ol className="missing__list">
        {pieces.map((piece, i) => {
          const shown = i < visible;
          return (
            <li
              key={piece.n}
              className={shown ? "missing__item fade-in" : "missing__item missing__item--hidden"}
              aria-hidden={!shown}
            >
              <span className="missing__n" aria-hidden="true">
                {piece.n}
              </span>
              <div>
                <p className="missing__name">
                  <strong>{piece.name}</strong>
                  {piece.file ? <code>{piece.file}</code> : null}
                </p>
                <p className="missing__what">{piece.what}</p>
                <p className="missing__effect">
                  <span>Objetivo:</span> {piece.effect}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
