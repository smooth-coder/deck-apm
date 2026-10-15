import { useState } from "react";
import { SceneView } from "../components/SceneView/SceneView";
import {
  CLOSING_QUOTE,
  PIPELINE_CAPTION,
  PIPELINE_TITLE,
  TAKEAWAY_FOOTER,
  TAKEAWAY_TITLE,
  takeawaySteps,
} from "../data/delivery";
import { PipelineVisualizer } from "../components/PipelineVisualizer";
import { scenes } from "../data/presentation";

const scene = scenes[6];

export function SoftwareDeliveryScene() {
  const [view, setView] = useState<"pipeline" | "adoption">("pipeline");
  if (!scene) return null;
  return (
    <SceneView scene={scene} compact>
      <div className="delivery__views" role="group" aria-label="Detalle del cierre">
        <button type="button" className="btn" aria-pressed={view === "pipeline"} onClick={() => setView("pipeline")}>
          {PIPELINE_TITLE}
        </button>
        <button type="button" className="btn" aria-pressed={view === "adoption"} onClick={() => setView("adoption")}>
          {TAKEAWAY_TITLE}
        </button>
      </div>
      {view === "pipeline" ? (
        <PipelineVisualizer caption={PIPELINE_CAPTION} />
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
