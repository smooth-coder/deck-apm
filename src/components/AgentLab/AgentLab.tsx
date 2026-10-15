import { useCallback, useMemo, useState } from "react";
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
  COMPLETE_MESSAGE,
  focusFileAfter,
  INTRO_STEP,
  nextStep,
} from "../../playground/scenarios";
import {
  buildFileSystem,
  findFile,
  MANIFEST_PATH,
} from "../../playground/virtualFileSystem";
import { ActionBar, type ActionButton } from "./ActionBar";
import { CodeViewer } from "./CodeViewer";
import { FileExplorer } from "./FileExplorer";
import { LabTerminal } from "./LabTerminal";

const NO_ENTRIES: readonly TermEntry[] = [];

const LAB_FLOW = "FRESH CHECKOUT → INSTALL → LOCK → AUDIT → CI GATE";

/** From docs/apm-research.md, section 6. */
const LIMITS: readonly { label: string; text: string }[] = [
  { label: "APM does:", text: "install, lock, hash, hidden-Unicode scan, drift check, CI gate." },
  { label: "APM does not:", text: "detect prompt injection, review semantics, sandbox the agent at runtime." },
  {
    label: "Not shown:",
    text: "org policy (apm-policy.yml) and MCP trust prompts. Pre-1.0: flags and output change between versions.",
  },
];

/** Maps a button to the engine action it triggers in the current state. */
function actionFor(id: ButtonId, ciFailed: boolean): DemoActionType {
  switch (id) {
    case "install":
      return "install";
    case "inspect":
      return "inspectLockfile";
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
  const [selected, setSelected] = useState(MANIFEST_PATH);
  const [open, setOpen] = useState<readonly string[]>([MANIFEST_PATH]);
  const [hint, setHint] = useState<string | null>(null);
  const { frame, playing, skip } = useTerminalPlayback(entries);

  const nodes = useMemo(() => buildFileSystem(state), [state]);
  const file = findFile(nodes, selected) ?? findFile(nodes, MANIFEST_PATH);
  const tabs = open.filter((path) => findFile(nodes, path));

  const select = useCallback((path: string) => {
    setSelected(path);
    setOpen((prev) => (prev.includes(path) ? prev : [...prev, path]));
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
      setSelected(MANIFEST_PATH);
      setOpen([MANIFEST_PATH]);
      return;
    }
    const run = commandRun(type, state);
    const focus = focusFileAfter(type, state);
    setEntries((prev) => [...prev, ...(run?.entries ?? [])]);
    setState(result.state);
    select(focus);
  };

  const step = nextStep(state);
  const buttons: readonly ActionButton[] = [
    { id: "install", label: "Install", title: "Run apm install" },
    { id: "inspect", label: "Inspect Lockfile", title: "Read apm.lock.yaml" },
    { id: "security", label: "Security", title: `${SECURITY_LABEL}. ${SECURITY_NOTE}` },
    {
      id: "ci",
      label: state === "ci-failed" ? "Fix manifest & re-run CI" : "CI Validation",
      title: "Run apm audit --ci",
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
        <h2 className="lab__title">{LAB_FLOW}</h2>
        <p className="badge lab__badge">{RECORDED_BADGE}</p>
      </header>

      <div className="lab__main">
        <FileExplorer nodes={nodes} selectedPath={file?.path ?? MANIFEST_PATH} onSelect={select} />
        <CodeViewer tabs={tabs} file={file} onSelect={select} />
      </div>

      <LabTerminal entries={entries} frame={frame} playing={playing} onSkip={skip} />

      <p className="lab__path" aria-live="polite">
        <span className="lab__path-label">Demo path</span>
        {step ? (
          <>
            <span>
              {state === "initial" ? `${INTRO_STEP.say} ` : ""}
              Next: <strong>{step.title}</strong>. {step.say}
            </span>
          </>
        ) : (
          <span>{COMPLETE_MESSAGE}</span>
        )}
      </p>
      {hint ? (
        <p className="lab__hint" role="status">
          {hint}
        </p>
      ) : null}

      <ActionBar buttons={buttons} onPress={press} />
      <ul className="lab__limits" aria-label="What APM does and does not do">
        {LIMITS.map((l) => (
          <li key={l.label}>
            <strong>{l.label}</strong> {l.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
