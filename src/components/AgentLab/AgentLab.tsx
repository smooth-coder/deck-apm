import { useCallback, useEffect, useMemo, useState } from "react";
import { useTerminalPlayback } from "../../hooks/useTerminalPlayback";
import {
  commandRun,
  RECORDED_BADGE,
  SECURITY_LABEL,
  SECURITY_NOTE,
  type TermEntry,
} from "../../playground/commands";
import { canRun, type DemoActionType, INITIAL_STATE, transition } from "../../playground/demoEngine";
import {
  type ButtonId,
  demoResults,
  focusFileAfter,
  nextStep,
} from "../../playground/scenarios";
import {
  buildFileSystem,
  DEFAULT_FILE_PATH,
  findFile,
  MANIFEST_PATH,
} from "../../playground/virtualFileSystem";
import { ActionBar, type ActionButton } from "./ActionBar";
import { CodeViewer } from "./CodeViewer";
import { FileExplorer } from "./FileExplorer";
import { LabTerminal } from "./LabTerminal";

const NO_ENTRIES: readonly TermEntry[] = [];


/** From docs/apm-research.md, section 6. */
const LIMITS: readonly { label: string; text: string }[] = [
  { label: "Recording:", text: "Tagged local Git repo behind an isolated URL alias, not a GitHub publication. No model or payment-provider execution." },
  { label: "MCP:", text: "APM trusts MCP from this direct dependency. Indirect self-defined MCP requires --trust-transitive-mcp. Client approval and private-service credentials remain personal; no server was invoked." },
  { label: "APM does:", text: "install, lock, hash, configure MCP, scan hidden Unicode, check drift and gate CI." },
  { label: "APM does not:", text: "detect prompt injection, review semantics, sandbox the agent at runtime." },
  {
    label: "Not shown:",
    text: "org policy (apm-policy.yml), runtime MCP approval and private-service authorization. Pre-1.0: flags and output can change.",
  },
];

/** Maps a button to the engine action it triggers in the current state. */
function actionFor(id: ButtonId, ciFailed: boolean): DemoActionType {
  switch (id) {
    case "install":
      return "install";
    case "inspect":
      return "inspectLockfile";
    case "edit":
      return "addDependency";
    case "security":
      return "runSecurity";
    case "ci":
      return ciFailed ? "fixManifest" : "runCI";
    case "reset":
      return "reset";
  }
}

export function AgentLab() {
  const [state, setState] = useState(INITIAL_STATE);
  const [entries, setEntries] = useState<readonly TermEntry[]>(NO_ENTRIES);
  const [selected, setSelected] = useState(DEFAULT_FILE_PATH);
  const [open, setOpen] = useState<readonly string[]>([DEFAULT_FILE_PATH]);
  const [hint, setHint] = useState<string | null>(null);
  const [view, setView] = useState<"files" | "output">("files");
  const { frame, playing, skip } = useTerminalPlayback(entries);

  // File inspection is the evidence for this step; never wait for invisible terminal typing.
  useEffect(() => {
    if (view === "files" && playing) skip();
  }, [view, playing, skip]);

  const fileSystemState = state === "dependencies-installed" && playing ? INITIAL_STATE : state;
  const nodes = useMemo(() => buildFileSystem(fileSystemState), [fileSystemState]);
  const file = findFile(nodes, selected) ?? findFile(nodes, MANIFEST_PATH);
  const tabs = open.filter((path) => findFile(nodes, path));

  const select = useCallback((path: string) => {
    setSelected(path);
    setOpen((prev) => (prev.includes(path) ? prev : [...prev, path]));
    setView("files");
  }, []);

  const press = (id: ButtonId) => {
    if (playing && id !== "reset") return;
    const type = actionFor(id, state === "ci-failed");
    const result = transition(state, { type });
    if (!result.accepted) {
      setHint(result.hint ?? null);
      return;
    }
    setHint(null);
    if (type === "reset") {
      setState(INITIAL_STATE);
      setEntries(NO_ENTRIES);
      setSelected(DEFAULT_FILE_PATH);
      setOpen([DEFAULT_FILE_PATH]);
      setView("files");
      return;
    }
    const run = commandRun(type, state);
    const focus = focusFileAfter(type, state);
    setEntries(run ? [...run.entries] : NO_ENTRIES);
    setState(result.state);
    select(focus);
    setView(type === "inspectLockfile" || type === "addDependency" ? "files" : "output");
  };

  const step = nextStep(state);
  const buttons: readonly ActionButton[] = [
    { id: "install", label: "Install", title: "Run apm install" },
    { id: "inspect", label: "Inspect Lockfile", title: "Read apm.lock.yaml" },
    {
      id: "edit",
      label: "Add dependency without installing",
      title: "Add an example dependency to apm.yml without installing it or updating the lockfile",
    },
    {
      id: "ci",
      label: state === "ci-failed" ? "Fix manifest & re-run CI" : "Run CI checks",
      title: state === "ci-failed" ? "Remove the added dependency and run apm audit --ci" : state === "manifest-edited" ? "Run apm audit --ci and apm install --frozen" : "Run apm audit --ci",
    },
    { id: "reset", label: "Reset Demo", title: "Restore the initial state" },
  ].map((b) => {
    const id = b.id as ButtonId;
    const type = actionFor(id, state === "ci-failed");
    const legal = canRun(state, type);
    const enabled = legal && (!playing || id === "reset");
    return {
      ...b,
      id,
      enabled,
      recommended: !playing && step?.button === id,
      title: legal ? b.title : transition(state, { type }).hint ?? b.title,
    };
  });

  return (
    <div className="lab">
      <header className="lab__header" data-state={state}>
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
        <FileExplorer nodes={nodes} selectedPath={file?.path ?? MANIFEST_PATH} onSelect={select} />
        <div className="lab__panes">
          <div className="lab__main" hidden={view !== "files"}>
            <CodeViewer tabs={tabs} file={file} onSelect={select} />
          </div>
          <div className="lab__output" hidden={view !== "output"}>
            <LabTerminal entries={entries} frame={frame} playing={playing} onSkip={skip} />
          </div>
        </div>
      </div>

      {state !== "initial" && !playing ? (
        <p className="lab__result" data-state={state} aria-live="polite">
          {demoResults[state]}
        </p>
      ) : null}
      {hint ? (
        <p className="lab__hint" role="status">
          {hint}
        </p>
      ) : null}

      <ActionBar buttons={buttons} onPress={press} />
      <details className="lab__backup">
        <summary>Backup: Unicode scan and scope limits</summary>
        <button
          type="button"
          className="btn"
          disabled={playing || !canRun(state, "runSecurity")}
          title={`${SECURITY_LABEL}. ${SECURITY_NOTE}`}
          onClick={() => press("security")}
        >
          Scan hidden Unicode
        </button>
        <ul className="lab__limits" aria-label="What APM does and does not do">
          {LIMITS.map((l) => (
            <li key={l.label}>
              <strong>{l.label}</strong> {l.text}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
