import type { Scene } from "../../data/presentation";

interface Props {
  scenes: readonly Scene[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function ProgressBar({ scenes, currentIndex, onSelect }: Props) {
  return (
    <nav aria-label="Talk progress" className="progress">
      <ol className="progress__list">
        {scenes.map((scene, i) => (
          <li key={scene.id} className="progress__item" style={{ flexGrow: scene.durationMin }}>
            <button
              type="button"
              className="progress__segment"
              data-active={i === currentIndex}
              data-done={i < currentIndex}
              aria-current={i === currentIndex ? "step" : undefined}
              aria-label={`Scene ${scene.id} of ${scenes.length}: ${scene.title}`}
              title={scene.title}
              onClick={() => onSelect(i)}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}
