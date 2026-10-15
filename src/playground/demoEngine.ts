/**
 * Deterministic state machine for the playground. Pure: no timers, no DOM, no I/O.
 *
 * The main talk validates a clean install, then shows an incomplete change fail CI and recover; Unicode scanning is optional:
 * - "lockfile-generated": `apm install` writes apm.lock.yaml; this state means the audience has inspected it.
 * - "security-warning": the hidden-character scan found a problem in a demo file.
 * - "manifest-edited": a dependency was added without installing it; CI has not run yet.
 * - "ci-failed": CI rejected the mismatch between apm.yml and apm.lock.yaml.
 * - "ci-passed": the installed configuration passed `apm audit --ci`, initially or after recovery.
 */
export type DemoState =
  | "initial"
  | "dependencies-installed"
  | "lockfile-generated"
  | "security-warning"
  | "manifest-edited"
  | "ci-failed"
  | "ci-passed";

export type DemoActionType =
  | "install"
  | "inspectLockfile"
  | "runSecurity"
  | "addDependency"
  | "runCI"
  | "fixManifest"
  | "reset";

export interface DemoAction {
  readonly type: DemoActionType;
}

export interface TransitionResult {
  readonly state: DemoState;
  /** False when the action is illegal in the current state; `state` is then unchanged. */
  readonly accepted: boolean;
  /** Set only when the action was rejected: tells the presenter what to do instead. */
  readonly hint?: string;
}

export const INITIAL_STATE: DemoState = "initial";

export const DEMO_STATES: readonly DemoState[] = [
  "initial",
  "dependencies-installed",
  "lockfile-generated",
  "security-warning",
  "manifest-edited",
  "ci-failed",
  "ci-passed",
];

/** Legal transitions, explicit. `reset` is legal everywhere and handled separately. */
const TRANSITIONS: Readonly<Record<DemoState, Partial<Record<DemoActionType, DemoState>>>> = {
  initial: { install: "dependencies-installed" },
  "dependencies-installed": { inspectLockfile: "lockfile-generated" },
  "lockfile-generated": { runSecurity: "security-warning", runCI: "ci-passed" },
  "security-warning": { runCI: "ci-passed" },
  "manifest-edited": { runCI: "ci-failed" },
  // Re-running CI on a red build keeps it red; the fix is a separate action.
  "ci-failed": { runCI: "ci-failed", fixManifest: "ci-passed" },
  // After success, the presenter introduces an incomplete dependency change.
  "ci-passed": { runCI: "ci-passed", addDependency: "manifest-edited" },
};

const HINTS: Readonly<Record<DemoState, string>> = {
  initial: "Nothing is installed yet. Run Install first.",
  "dependencies-installed": "Inspect the lockfile that install just wrote.",
  "lockfile-generated": "Run CI checks on the installed configuration.",
  "security-warning": "Run CI checks on the installed configuration. The Unicode fixture is separate.",
  "manifest-edited": "The manifest changed; the lockfile did not. Run CI checks to detect the mismatch.",
  "ci-failed": "CI is red. Fix the manifest and re-run CI.",
  "ci-passed": "Configuration checks passed. Add a dependency without installing it to see CI catch the mismatch.",
};

export function transition(state: DemoState, action: DemoAction): TransitionResult {
  if (action.type === "reset") return { state: INITIAL_STATE, accepted: true };
  const next = TRANSITIONS[state][action.type];
  if (next === undefined) return { state, accepted: false, hint: HINTS[state] };
  return { state: next, accepted: true };
}

export const canRun = (state: DemoState, type: DemoActionType): boolean =>
  type === "reset" || TRANSITIONS[state][type] !== undefined;
