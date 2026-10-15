import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface Props {
  /** Labels of the dependencies that failed to resolve. */
  labels: readonly string[];
  agentLabel: string;
}

const WIDTH = 840;
const HEIGHT = 420;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };
const NODE = { w: 390, h: 64 };

const LINE_HEIGHT = 26;

/** Long labels break after "," or ":" so they stay inside the node at projector font size. */
function splitLabel(label: string): string[] {
  const at = label.search(/[:,] /);
  if (at < 0 || label.length <= 28) return [label];
  return [label.slice(0, at + 1), label.slice(at + 2)];
}

/** Corners around the agent; no edge connects any node to another. */
const POSITIONS = [
  { x: 205, y: 50 },
  { x: 635, y: 50 },
  { x: 205, y: 370 },
  { x: 635, y: 370 },
];

export function DependencyGraph({ labels, agentLabel }: Props) {
  const root = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".dep-graph__node", {
        opacity: 0,
        scale: 0.7,
        duration: 0.35,
        stagger: 0.12,
        transformOrigin: "50% 50%",
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <svg
      ref={root}
      className="dep-graph"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Dependency graph: the agent is disconnected from its instructions, skills, tools and any manifest"
    >
      {labels.map((_, i) => {
        const p = POSITIONS[i];
        return p ? (
          <line
            key={`edge-${i}`}
            className="dep-graph__edge"
            x1={CENTER.x}
            y1={CENTER.y}
            x2={p.x}
            y2={p.y}
          />
        ) : null;
      })}
      <g className="dep-graph__node dep-graph__node--agent">
        <rect x={CENTER.x - 90} y={CENTER.y - 30} width={180} height={60} rx={12} />
        <text x={CENTER.x} y={CENTER.y} textAnchor="middle" dominantBaseline="central">
          {agentLabel}
        </text>
      </g>
      {labels.map((label, i) => {
        const p = POSITIONS[i];
        if (!p) return null;
        return (
          <g key={label} className="dep-graph__node dep-graph__node--missing">
            <rect x={p.x - NODE.w / 2} y={p.y - NODE.h / 2} width={NODE.w} height={NODE.h} rx={12} />
            <text textAnchor="middle" dominantBaseline="central">
              {splitLabel(label).map((line, n, all) => (
                <tspan key={line} x={p.x} y={p.y + (n - (all.length - 1) / 2) * LINE_HEIGHT}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
