import { useEffect, useRef } from "react";
import type { VFile } from "../../playground/virtualFileSystem";
import { tintLine } from "../../playground/highlight";

interface Props {
  tabs: readonly string[];
  file: VFile | undefined;
  onSelect: (path: string) => void;
}

export function CodeViewer({ tabs, file, onSelect }: Props) {
  const lines = file?.content?.trimEnd().split("\n") ?? [];
  const highlighted = new Set(file?.highlight ?? []);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Bring the highlighted line into view, otherwise long files hide the evidence.
  useEffect(() => {
    const mark = bodyRef.current?.querySelector<HTMLElement>('[data-highlight="true"]');
    const body = bodyRef.current;
    if (!body) return;
    body.scrollTop = mark ? Math.max(0, mark.offsetTop - body.clientHeight / 2) : 0;
  }, [file]);

  return (
    <section className="lab-viewer" aria-label="File viewer">
      <div className="lab-viewer__tabs" role="tablist" aria-label="Open files">
        {tabs.map((path) => (
          <button
            key={path}
            type="button"
            role="tab"
            className="lab-viewer__tab"
            aria-selected={path === file?.path}
            title={path}
            onClick={() => onSelect(path)}
          >
            {path.split("/").pop()}
          </button>
        ))}
        <span className="lab-viewer__path" title={file?.path}>{file?.path}</span>
      </div>
      <div ref={bodyRef} className="lab-viewer__body" role="tabpanel">
        {file?.content !== undefined ? (
          <pre className="lab-viewer__code" aria-label={`Contents of ${file.path}`}>
            {lines.map((line, i) => (
              <span
                key={i}
                className="lab-viewer__line"
                data-highlight={highlighted.has(i) ? "true" : undefined}
              >
                <span className="lab-viewer__no" aria-hidden="true">
                  {i + 1}
                </span>
                {tintLine(line).map((token, t) => (
                  <span key={t} className={`tok tok--${token.kind}`}>
                    {token.text}
                  </span>
                ))}
                {"\n"}
              </span>
            ))}
          </pre>
        ) : (
          <p className="lab-viewer__empty">{file?.note ?? "Select a file."}</p>
        )}
      </div>
      {file?.content !== undefined && file.note ? (
        <p className="lab-viewer__note">{file.note}</p>
      ) : null}
    </section>
  );
}
