import { useState } from "react";
import {
  BRIDGE,
  COSTS_TITLE,
  developers,
  ILLUSTRATIVE_LABEL,
  LOCATION_LABEL,
  OUTPUT_COLUMNS,
  SETUPS_LABEL,
  sharedTask,
  teamCosts,
  WHY_LABEL,
} from "../../data/agentConfigs";

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

      {/* Comparison replaces setup details so the audience has one reading task at a time. */}
      {selected && !ran ? (
        <div className="panel" aria-live="polite">
          <h2 className="panel__title">
            Configuración de {selected.name} ({selected.agent})
          </h2>
          <ul className="devs__config">
            {selected.config.map((item) => (
              <li key={item.text}>
                <span className={`where where--${item.where}`}>{LOCATION_LABEL[item.where]}</span>
                <code>{item.text}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="controls">
        <button type="button" className="btn btn--primary" onClick={() => setRan(!ran)}>
          {ran ? "Volver a las configuraciones" : "Comparar configuraciones"}
        </button>
        <span className="devs__task">{sharedTask}</span>
        {ran ? <p className="badge devs__badge">{ILLUSTRATIVE_LABEL}</p> : null}
      </div>

      {ran ? (
        <section className="fade-in devs__result" aria-label="Comparación de configuraciones">
          <table className="prs">
            <thead>
              <tr>
                <th scope="col">Configuración</th>
                {OUTPUT_COLUMNS.map((c) => (
                  <th key={c.key} scope="col">
                    {c.label}
                  </th>
                ))}
                <th scope="col">{WHY_LABEL}</th>
              </tr>
            </thead>
            <tbody>
              {developers.map((dev) => (
                <tr key={dev.id}>
                  <th scope="row">
                    {dev.name} <span>{dev.agent}</span>
                  </th>
                  {OUTPUT_COLUMNS.map((c) => (
                    <td key={c.key} data-label={c.label}>
                      {dev.output[c.key]}
                    </td>
                  ))}
                  <td className="prs__why" data-label={WHY_LABEL}>
                    {dev.why}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="costs__title">{COSTS_TITLE}</h2>
          <ul className="costs">
            {teamCosts.map((cost) => (
              <li key={cost.title}>
                <strong>{cost.title}</strong>
                <span>{cost.detail}</span>
              </li>
            ))}
          </ul>
          <p className="conclusion bridge">{BRIDGE}</p>
        </section>
      ) : null}
    </div>
  );
}
