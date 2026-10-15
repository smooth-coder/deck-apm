import { COVERAGE_LABEL, pipelineDelays, pipelineSteps } from "../../data/delivery";
import { useStages } from "../../hooks/useStages";

interface Props {
  /** Shown next to the Replay button. */
  caption?: string;
}

export function PipelineVisualizer({ caption }: Props) {
  const { stage, replay } = useStages(pipelineDelays);

  return (
    <div className="pipeline">
      <ol className="pipeline__steps">
        {pipelineSteps.map((step, i) => (
          <li
            key={step.label}
            className="pipeline__step"
            data-state={i + 1 < stage ? "done" : i + 1 === stage ? "active" : "idle"}
          >
            <span className="pipeline__dot" aria-hidden="true">
              {i + 1 < stage ? "✓" : i + 1}
            </span>
            <span className="pipeline__label">{step.label}</span>
            <span className="pipeline__tag" data-coverage={step.coverage}>
              {COVERAGE_LABEL[step.coverage]}
            </span>
            <span className="pipeline__check">{step.check}</span>
          </li>
        ))}
      </ol>
      <div className="controls">
        <button type="button" className="btn" onClick={replay}>
          Replay
        </button>
        {caption ? <p className="caption pipeline__caption">{caption}</p> : null}
      </div>
    </div>
  );
}
