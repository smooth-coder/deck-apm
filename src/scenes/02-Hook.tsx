import { MissingContext } from "../components/MissingContext";
import { SceneView } from "../components/SceneView/SceneView";
import { Terminal } from "../components/Terminal";
import {
  HOOK_BADGE,
  HOOK_QUOTE_LINES,
  hookDelays,
  hookLines,
  MISSING_TITLE,
  missingPieces,
  pieceStage,
  QUOTE_STAGE,
} from "../data/hook";
import { scenes } from "../data/presentation";
import { useStages } from "../hooks/useStages";

const scene = scenes[1];

export function HookScene() {
  const { stage, done, replay, skip } = useStages(hookDelays);
  if (!scene) return null;

  const showQuote = stage >= QUOTE_STAGE;
  const visibleLines = Math.min(stage, hookLines.length);
  const visiblePieces = missingPieces.filter((_, i) => stage >= pieceStage(i)).length;

  return (
    <SceneView scene={scene} compact>
      {/* Every slot is reserved up front so nothing shifts while the sequence plays. */}
      <div className="hook">
        <Terminal lines={hookLines} visible={visibleLines} badge={HOOK_BADGE} />
        <MissingContext title={MISSING_TITLE} pieces={missingPieces} visible={visiblePieces} />
        <p
          className={showQuote ? "hook__quote fade-in" : "hook__quote hook__quote--hidden"}
          aria-hidden={!showQuote}
        >
          {HOOK_QUOTE_LINES[0]}
          <br />
          <strong>{HOOK_QUOTE_LINES[1]}</strong>
        </p>
      </div>
      <div className="controls hook__controls">
        {!done ? (
          <button type="button" className="btn" onClick={skip}>
            Saltar animación
          </button>
        ) : (
          <button type="button" className="btn" onClick={replay}>
            Repetir
          </button>
        )}
      </div>
    </SceneView>
  );
}
