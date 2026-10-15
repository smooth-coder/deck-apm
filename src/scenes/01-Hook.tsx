import { DependencyGraph } from "../components/DependencyGraph";
import { SceneView } from "../components/SceneView/SceneView";
import { Terminal } from "../components/Terminal";
import {
  GRAPH_STAGE,
  HOOK_BADGE,
  HOOK_QUOTE_LINES,
  hookDelays,
  hookLines,
  QUOTE_STAGE,
} from "../data/hook";
import { scenes } from "../data/presentation";
import { useStages } from "../hooks/useStages";

const scene = scenes[0];
const WARNINGS = hookLines.filter((l) => l.kind === "warning");
const BEFORE_WARNINGS = hookLines.length - WARNINGS.length;

export function HookScene() {
  const { stage, done, replay, skip } = useStages(hookDelays);
  if (!scene) return null;

  const showGraph = stage >= GRAPH_STAGE;
  const showQuote = stage >= QUOTE_STAGE;
  // Once the graph appears, the warning lines leave the terminal and become nodes.
  const visibleLines = showGraph ? BEFORE_WARNINGS : Math.min(stage, hookLines.length);

  return (
    <SceneView scene={scene} compact>
      {/* Every slot is reserved up front so nothing shifts while the sequence plays. */}
      <div className="hook">
        <Terminal lines={hookLines} visible={visibleLines} badge={HOOK_BADGE} />
        <div className="hook__graph">
          {showGraph ? (
            <DependencyGraph
              labels={WARNINGS.map((w) => w.text.replace("⚠ ", ""))}
              agentLabel="agent"
            />
          ) : null}
        </div>
        <p
          className={showQuote ? "hook__quote fade-in" : "hook__quote hook__quote--hidden"}
          aria-hidden={!showQuote}
        >
          {HOOK_QUOTE_LINES[0]}
          <br />
          <strong>{HOOK_QUOTE_LINES[1]}</strong>
        </p>
      </div>
      <div className="controls">
        {!done ? (
          <button type="button" className="btn" onClick={skip}>
            Skip animation
          </button>
        ) : (
          <button type="button" className="btn" onClick={replay}>
            Replay
          </button>
        )}
      </div>
    </SceneView>
  );
}
