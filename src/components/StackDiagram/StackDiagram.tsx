import { useState } from "react";
import {
  agentNode,
  capabilityNodes,
  contextNode,
  STACK_MESSAGE,
  STACK_SCOPE_NOTE,
  type StackNode,
} from "../../data/agentStack";

const allNodes: readonly StackNode[] = [agentNode, ...capabilityNodes, contextNode];

/** Horizontal centre (0-100) of each capability column in the 4-column grid. */
const COLUMN_X = [12.5, 37.5, 62.5, 87.5];

type Direction = "fan-out" | "converge";

/** Decorative connector: the agent fans out to each capability, the capabilities converge on the context. */
function Connector({ direction }: { direction: Direction }) {
  return (
    <svg
      className={`stack__connector stack__connector--${direction}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {COLUMN_X.map((x) => (
        <line
          key={x}
          className="stack__line"
          x1={direction === "fan-out" ? 50 : x}
          y1={0}
          x2={direction === "fan-out" ? x : 50}
          y2={100}
        />
      ))}
    </svg>
  );
}

export function StackDiagram() {
  const [selectedId, setSelectedId] = useState<string>(agentNode.id);
  const selected = allNodes.find((n) => n.id === selectedId);

  const node = (n: StackNode, className: string) => (
    <button
      key={n.id}
      type="button"
      className={`stack__node ${className}`}
      aria-pressed={n.id === selectedId}
      onClick={() => setSelectedId(n.id)}
    >
      {n.label}
    </button>
  );

  return (
    <div className="stack">
      <div className="stack__diagram">
        {node(agentNode, "stack__node--agent")}
        <Connector direction="fan-out" />
        {capabilityNodes.map((n, i) => node(n, `stack__node--cap-${i + 1}`))}
        <Connector direction="converge" />
        {node(contextNode, "stack__node--context")}
      </div>

      <div className="stack__side">
        <div className="panel" aria-live="polite">
          {selected ? (
            <>
              <h2 className="panel__title">{selected.label}</h2>
              <p className="panel__text">{selected.definition}</p>
              <p className="panel__example">
                <span>Ubicación</span> <code>{selected.lives}</code>
              </p>
              <p className="panel__example" lang={selected.id === "context" ? "es" : "en"}>
                <span lang="es">Ejemplo ilustrativo</span> {selected.example}
              </p>
              <p className="panel__text panel__text--muted stack__scope">{STACK_SCOPE_NOTE}</p>
            </>
          ) : null}
        </div>
        <p className="conclusion">{STACK_MESSAGE}</p>
      </div>
    </div>
  );
}
