import { useState } from "react";
import { ANALOGY_DISCLAIMER, analogyRows, APM_CLOSING, EMPTY_NOTE, manifestSnippet } from "../../data/apm";

export function ComparisonTable() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = analogyRows.find((r) => r.id === selectedId);

  return (
    <div className="apm">
      <p className="badge apm__badge">{ANALOGY_DISCLAIMER}</p>
      <table className="apm__table">
        <thead>
          <tr>
            <th scope="col">Traditional</th>
            <th scope="col">Agentic</th>
          </tr>
        </thead>
        <tbody>
          {analogyRows.map((row) => (
            <tr key={row.id} data-selected={row.id === selectedId}>
              <td colSpan={2}>
                <button
                  type="button"
                  className="apm__row"
                  aria-pressed={row.id === selectedId}
                  onClick={() => setSelectedId(row.id === selectedId ? null : row.id)}
                >
                  <span>{row.traditional}</span>
                  <span aria-hidden="true">≈</span>
                  <span>{row.agentic}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <aside className="apm__aside">
        <div className="panel" aria-live="polite">
          {selected ? (
            <p className="panel__text">{selected.note}</p>
          ) : (
            <p className="panel__text panel__text--muted">{EMPTY_NOTE}</p>
          )}
        </div>
        <pre className="apm__snippet">{manifestSnippet}</pre>
      </aside>
      <p className="conclusion apm__question">{APM_CLOSING}</p>
    </div>
  );
}
