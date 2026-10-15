import type { ReactNode } from "react";
import type { Scene } from "../../data/presentation";

interface Props {
  scene: Scene;
  /** Smaller header, used by scenes that render real content below it. */
  compact?: boolean;
  children?: ReactNode;
}

/** The audience sees the claim headline and one supporting line. Goal and timing stay presenter-side. */
export function SceneView({ scene, compact = false, children }: Props) {
  return (
    <section
      className={compact ? "scene scene--compact" : "scene"}
      aria-labelledby={`scene-title-${scene.id}`}
    >
      <header className="scene__header">
        <h1 id={`scene-title-${scene.id}`} className="scene__title">
          {scene.title}
        </h1>
        <p className="scene__goal">{scene.support}</p>
      </header>
      {children}
    </section>
  );
}
