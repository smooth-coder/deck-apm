import { useState } from "react";
import { ANALOGY_DISCLAIMER, analogyRows, APM_CLOSING, manifestSnippet } from "../../data/apm";

export function ComparisonTable() {
  const [selectedId, setSelectedId] = useState(analogyRows[0]?.id);
  const selected = analogyRows.find((r) => r.id === selectedId);

  return (
    <div className="apm">
      <table className="apm__table">
        <thead>
          <tr>
            <th scope="col">Qué gana el equipo</th>
            <th scope="col">Flujo conocido → APM</th>
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
                  onClick={() => setSelectedId(row.id)}
                >
                  <strong className="apm__outcome">{row.outcome}</strong>
                  <span className="apm__mapping">
                    <code>{row.traditional}</code>
                    <span aria-hidden="true">≈</span>
                    <code>{row.agentic}</code>
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <aside className="apm__aside">
        <div className="panel" aria-live="polite">
          <h2 className="panel__title">En la práctica</h2>
          <p className="panel__text">{selected?.note}</p>
        </div>
        <details className="apm__details">
          <summary>Ejemplo técnico y límites</summary>
          <pre className="apm__snippet" lang="en">{manifestSnippet}</pre>
          <p className="caption">{ANALOGY_DISCLAIMER}</p>
          <p className="caption">Reproduce la configuración instalada, no resultados idénticos del modelo. Las huellas comprueban integridad, no seguridad ni corrección.</p>
        </details>
      </aside>
      <p className="conclusion apm__question">{APM_CLOSING}</p>
    </div>
  );
}
