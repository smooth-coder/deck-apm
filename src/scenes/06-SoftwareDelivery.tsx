import { useState } from "react";
import { SceneView } from "../components/SceneView/SceneView";
import {
  CLOSING_QUOTE,
  DOES_NOT_SOLVE_TITLE,
  doesNotSolve,
  SOLVES_TITLE,
  solves,
  TAKEAWAY_FOOTER,
  TAKEAWAY_TITLE,
  takeawaySteps,
} from "../data/delivery";
import { scenes } from "../data/presentation";

const scene = scenes[5];

export function SoftwareDeliveryScene() {
  const [view, setView] = useState<"scope" | "adoption">("scope");
  if (!scene) return null;
  return (
    <SceneView scene={scene} compact>
      <div className="delivery__views" role="group" aria-label="Detalle del cierre">
        <button type="button" className="btn" aria-pressed={view === "scope"} onClick={() => setView("scope")}>
          Alcance de APM
        </button>
        <button type="button" className="btn" aria-pressed={view === "adoption"} onClick={() => setView("adoption")}>
          {TAKEAWAY_TITLE}
        </button>
      </div>
      {view === "scope" ? (
        <>
          <div className="scope">
            <section className="scope__col" aria-label={SOLVES_TITLE}>
              <h2 className="scope__title">{SOLVES_TITLE}</h2>
              <ul>
                {solves.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className="scope__col scope__col--limits" aria-label={DOES_NOT_SOLVE_TITLE}>
              <h2 className="scope__title">{DOES_NOT_SOLVE_TITLE}</h2>
              <ul>
                {doesNotSolve.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </>
      ) : (
        <aside className="closing__takeaway" aria-label={TAKEAWAY_TITLE}>
          <h2 className="closing__takeaway-title">{TAKEAWAY_TITLE}</h2>
          <ol>
            {takeawaySteps.map((s) => (
              <li key={s.command}>
                <code>{s.command}</code>
                {s.note ? <span> {s.note}</span> : null}
              </li>
            ))}
          </ol>
          <p className="closing__takeaway-footer">{TAKEAWAY_FOOTER}</p>
          <a href="https://github.com/microsoft/apm/tree/v0.33.0" target="_blank" rel="noreferrer">Documentación y ejemplo de APM 0.33.0</a>
        </aside>
      )}
      <blockquote className="closing__quote">{CLOSING_QUOTE}</blockquote>
    </SceneView>
  );
}
