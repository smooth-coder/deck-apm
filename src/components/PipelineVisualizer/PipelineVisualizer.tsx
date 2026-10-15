import { COVERAGE_LABEL, pipelineSteps } from "../../data/delivery";

interface Props {
  /** Boundary of APM's coverage, not the result of an executed pipeline. */
  caption?: string;
}

export function PipelineVisualizer({ caption }: Props) {
  return (
    <div className="pipeline">
      <ol className="pipeline__steps">
        {pipelineSteps.map((step, i) => (
          <li
            key={step.label}
            className="pipeline__step"
          >
            <span className="pipeline__dot" aria-hidden="true">
              {i + 1}
            </span>
            <span className="pipeline__label">{step.label}</span>
            <span className="pipeline__tag" data-coverage={step.coverage}>
              {COVERAGE_LABEL[step.coverage]}
            </span>
            <span className="pipeline__check">{step.check}</span>
          </li>
        ))}
      </ol>
      {caption ? <p className="caption pipeline__caption">{caption}</p> : null}
    </div>
  );
}
