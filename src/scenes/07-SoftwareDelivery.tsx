import { useState } from "react";
import { RefundCheck } from "../components/RefundCheck/RefundCheck";
import { PipelineVisualizer } from "../components/PipelineVisualizer";
import { SceneView } from "../components/SceneView/SceneView";
import {
  CLOSING_QUOTE,
  PIPELINE_CAPTION,
  TAKEAWAY_FOOTER,
  TAKEAWAY_TITLE,
  takeawaySteps,
} from "../data/delivery";
import { scenes } from "../data/presentation";

const scene = scenes[6];

export function SoftwareDeliveryScene() {
  const [view, setView] = useState<"validation" | "adoption">("validation");
  if (!scene) return null;
  return (
    <SceneView scene={scene} compact>
      <PipelineVisualizer caption={PIPELINE_CAPTION} />
      <div className="delivery__views" role="group" aria-label="Detalle de la entrega">
        <button type="button" className="btn" aria-pressed={view === "validation"} onClick={() => setView("validation")}>
          Validar PAY-142
        </button>
        <button type="button" className="btn" aria-pressed={view === "adoption"} onClick={() => setView("adoption")}>
          {TAKEAWAY_TITLE}
        </button>
      </div>
      {view === "validation" ? (
        <>
          <RefundCheck />
          <p className="delivery__eval">
            <strong>Evaluación del agente:</strong> repite la tarea fija PAY-142 y comprueba el criterio de reintentos.
            Registra modelo, instrucciones y configuración. Después, revisa el código.
          </p>
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
