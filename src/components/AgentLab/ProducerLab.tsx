import { useCallback, useEffect, useState } from "react";
import { useTerminalPlayback } from "../../hooks/useTerminalPlayback";
import { RECORDED_BADGE, recorded, type TermEntry } from "../../playground/commands";
import {
  OUT_PRODUCER_INIT,
  OUT_PRODUCER_VERSION,
  PRODUCER_EXIT,
  PRODUCER_INIT_COMMAND,
  PRODUCER_INIT_MANIFEST,
  PRODUCER_VERSION_COMMAND,
  TEAM_SOURCE_FILES,
} from "../../playground/recorded";
import { buildFileTree, findFile, type VFile, type VNode } from "../../playground/virtualFileSystem";
import { CodeViewer } from "./CodeViewer";
import { FileExplorer } from "./FileExplorer";
import { LabTerminal } from "./LabTerminal";

type ProducerState = "empty" | "initialized" | "authored" | "versioned";
type ProducerAction = "initialize" | "author" | "version" | "reset";

const MANIFEST_PATH = "payments-team/apm.yml";
const REVIEWER_PATH = "payments-team/.apm/agents/refund-reviewer.agent.md";
const NO_ENTRIES: readonly TermEntry[] = [];
const EMPTY_REPOSITORY: readonly VNode[] = [
  { kind: "dir", name: "payments-team", path: "payments-team", children: [] },
];
const INITIALIZED_FILES = buildFileTree([
  { kind: "file", name: "apm.yml", path: MANIFEST_PATH, content: PRODUCER_INIT_MANIFEST },
]);
const AUTHORED_FILES = buildFileTree(
  Object.entries(TEAM_SOURCE_FILES).map(([path, content]): VFile => ({
    kind: "file",
    name: path.split("/").pop() ?? path,
    path,
    content,
  })),
);
const INIT_ENTRIES: readonly TermEntry[] = [
  { kind: "command", text: PRODUCER_INIT_COMMAND },
  ...recorded(OUT_PRODUCER_INIT),
  { kind: "dim", text: `(exit ${PRODUCER_EXIT.init})` },
];
const VERSION_ENTRIES: readonly TermEntry[] = [
  { kind: "command", text: PRODUCER_VERSION_COMMAND },
  ...recorded(OUT_PRODUCER_VERSION),
  { kind: "dim", text: `(exit ${PRODUCER_EXIT.version})` },
];
const RESULTS: Readonly<Record<Exclude<ProducerState, "empty">, string>> = {
  initialized: "apm.yml created by apm init.",
  authored: "Team-owned agent, skill, rules and MCP configuration added.",
  versioned: "v1.0.0 tagged locally. Ready for the consumer demo.",
};
const ACTIONS: readonly { id: ProducerAction; label: string; title: string; from?: ProducerState }[] = [
  { id: "initialize", label: "Initialize package", title: "Replay Git initialization and apm init", from: "empty" },
  { id: "author", label: "Add team files", title: "Add the team's authored definitions and MCP configuration", from: "initialized" },
  { id: "version", label: "Version package", title: "Replay the local commit and v1.0.0 tag", from: "authored" },
  { id: "reset", label: "Reset repository", title: "Restore an empty payments-team repository" },
];

export function ProducerLab() {
  const [state, setState] = useState<ProducerState>("empty");
  const [entries, setEntries] = useState<readonly TermEntry[]>(NO_ENTRIES);
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState<readonly string[]>([]);
  const [view, setView] = useState<"files" | "output">("output");
  const { frame, playing, skip } = useTerminalPlayback(entries);

  // Inspecting a file completes the recording rather than leaving invisible typing running.
  useEffect(() => {
    if (view === "files" && playing) skip();
  }, [view, playing, skip]);

  const initializing = state === "initialized" && playing;
  const nodes = state === "empty" || initializing
    ? EMPTY_REPOSITORY
    : state === "initialized" ? INITIALIZED_FILES : AUTHORED_FILES;
  const file = findFile(nodes, selected);
  const tabs = open.filter((path) => findFile(nodes, path));
  const visibleState = initializing ? "initializing" : state === "versioned" && playing ? "versioning" : state;

  const select = useCallback((path: string) => {
    setSelected(path);
    setOpen((previous) => previous.includes(path) ? previous : [...previous, path]);
    setView("files");
  }, []);

  const press = (action: ProducerAction) => {
    if (action === "reset") {
      setState("empty");
      setEntries(NO_ENTRIES);
      setSelected("");
      setOpen([]);
      setView("output");
      return;
    }
    if (playing) return;
    if (action === "initialize" && state === "empty") {
      setEntries([...INIT_ENTRIES]);
      setState("initialized");
      setSelected(MANIFEST_PATH);
      setOpen([MANIFEST_PATH]);
      setView("output");
    } else if (action === "author" && state === "initialized") {
      setState("authored");
      setSelected(REVIEWER_PATH);
      setOpen([REVIEWER_PATH, ...Object.keys(TEAM_SOURCE_FILES).filter((path) => path !== REVIEWER_PATH)]);
      setView("files");
    } else if (action === "version" && state === "authored") {
      setEntries([...VERSION_ENTRIES]);
      setState("versioned");
      setView("output");
    }
  };

  return (
    <div className="lab" lang="en">
      <header className="lab__header" data-state={visibleState}>
        <p className="badge lab__badge">{RECORDED_BADGE}</p>
      </header>
      <div className="lab__views" role="group" aria-label="Demo focus">
        <button type="button" className="btn" aria-pressed={view === "files"} onClick={() => setView("files")}>
          File view
        </button>
        <button type="button" className="btn" aria-pressed={view === "output"} onClick={() => setView("output")}>
          Recorded output
        </button>
      </div>

      <div className="lab__evidence">
        <FileExplorer nodes={nodes} selectedPath={file?.path ?? ""} onSelect={select} />
        <div className="lab__panes">
          <div className="lab__main" hidden={view !== "files"}>
            {file ? (
              <CodeViewer tabs={tabs} file={file} onSelect={select} />
            ) : (
              <section className="lab-viewer" aria-label="Empty file viewer" />
            )}
          </div>
          <div className="lab__output" hidden={view !== "output"}>
            <LabTerminal entries={entries} frame={frame} playing={playing} onSkip={skip} />
          </div>
        </div>
      </div>

      {state !== "empty" && !playing ? (
        <p className="lab__result" data-state={state} aria-live="polite">
          {RESULTS[state]}
        </p>
      ) : null}

      <div className="lab-actions" role="group" aria-label="Producer actions">
        {ACTIONS.map((action) => {
          const enabled = action.id === "reset" || (!playing && action.from === state);
          return (
            <button
              key={action.id}
              type="button"
              className={action.id === "reset" ? "btn lab-actions__reset" : "btn"}
              disabled={!enabled}
              aria-disabled={!enabled}
              data-recommended={enabled && action.id !== "reset" ? "true" : undefined}
              title={action.title}
              onClick={() => press(action.id)}
            >
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
