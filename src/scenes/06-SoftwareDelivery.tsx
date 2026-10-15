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

const scene = scenes[5];
// TODO: public/qr-code.svg is a placeholder and is not shown. Once the deploy URL exists,
// replace it with a real QR code and render it here again (see scripts/README.md).

export function SoftwareDeliveryScene() {
  if (!scene) return null;
  return (
    <SceneView scene={scene} compact>
      <PipelineVisualizer caption={PIPELINE_CAPTION} />
      <div className="closing">
        <blockquote className="closing__quote">{CLOSING_QUOTE}</blockquote>
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
        </aside>
      </div>
    </SceneView>
  );
}
