import { useState } from "react";
import {
  CONCLUSION,
  developers,
  ILLUSTRATIVE_LABEL,
  SETUPS_LABEL,
  sharedTask,
  type DeveloperSetup,
} from "../../data/agentConfigs";

const OUTPUT_FIELDS: readonly { key: keyof DeveloperSetup["output"]; label: string }[] = [
  { key: "conventions", label: "Conventions" },
  { key: "tests", label: "Tests" },
  { key: "architecture", label: "Architecture" },
  { key: "tools", label: "Tool access" },
];

export function DeveloperComparison() {
  const [selectedId, setSelectedId] = useState<string>(developers[0]?.id ?? "");
  const [ran, setRan] = useState(false);
  const selected = developers.find((d) => d.id === selectedId);

  return (
    <div className={ran ? "devs devs--ran" : "devs"}>
      {ran ? null : <p className="badge devs__setups-badge">{SETUPS_LABEL}</p>}
      <ul className="devs__list">
        {developers.map((dev) => (
          <li key={dev.id}>
            <button
              type="button"
              className="devs__card"
              aria-pressed={dev.id === selectedId}
              onClick={() => setSelectedId(dev.id)}
            >
              <strong>{dev.name}</strong>
              <span>{dev.agent}</span>
              <span className="devs__summary">{dev.summary}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Once the outputs are shown the setup panel gives way to them so everything fits one view. */}
      {selected && !ran ? (
        <div className="panel" aria-live="polite">
          <h2 className="panel__title">
            {selected.name}&apos;s setup ({selected.agent})
          </h2>
          <ul className="panel__list">
            {selected.config.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="controls">
        <button type="button" className="btn btn--primary" onClick={() => setRan(true)}>
          Run Same Task
        </button>
        <span className="devs__task">{sharedTask}</span>
        {ran ? <p className="badge devs__badge">{ILLUSTRATIVE_LABEL}</p> : null}
      </div>

      {ran ? (
        <section className="fade-in" aria-label="Task outputs">
          <div className="devs__outputs">
            {developers.map((dev) => (
              <article key={dev.id} className="output">
                <h3 className="output__title">
                  {dev.name} <span>({dev.agent})</span>
                </h3>
                <dl>
                  {OUTPUT_FIELDS.map(({ key, label }) => (
                    <div key={key}>
                      <dt>{label}</dt>
                      <dd>{dev.output[key]}</dd>
                    </div>
                  ))}
                </dl>
                <p className="output__why">{dev.why}</p>
              </article>
            ))}
          </div>
          <p className="conclusion">{CONCLUSION}</p>
        </section>
      ) : null}
    </div>
  );
}
