import type { VNode } from "../../playground/virtualFileSystem";

interface Props {
  nodes: readonly VNode[];
  selectedPath: string;
  onSelect: (path: string) => void;
}

function Tree({ nodes, selectedPath, onSelect }: Props) {
  return (
    <ul className="lab-tree__list">
      {nodes.map((node) =>
        node.kind === "dir" ? (
          <li key={node.path} className="lab-tree__item">
            <span className="lab-tree__dir">
              <span aria-hidden="true">▾ </span>
              {node.name}/
              {node.summary ? <span className="lab-tree__summary"> {node.summary}</span> : null}
            </span>
            {node.children.length > 0 ? (
              <Tree nodes={node.children} selectedPath={selectedPath} onSelect={onSelect} />
            ) : null}
          </li>
        ) : (
          <li key={node.path} className="lab-tree__item">
            <button
              type="button"
              className="lab-tree__file"
              aria-current={node.path === selectedPath ? "true" : undefined}
              onClick={() => onSelect(node.path)}
            >
              {node.name}
            </button>
          </li>
        ),
      )}
    </ul>
  );
}

export function FileExplorer(props: Props) {
  return (
    <nav className="lab-tree" aria-label="Project files">
      <p className="lab-pane__title">Explorer</p>
      <Tree {...props} />
    </nav>
  );
}
