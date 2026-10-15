/**
 * Deterministic state machine for the playground. Pure: no timers, no DOM, no I/O.
 *
 * States are exactly the six from the plan; no extra state was needed:
 * - "lockfile-generated": `apm install` writes apm.lock.yaml; this state means the audience has inspected it.
 * - "security-warning": the hidden-character scan found a problem in a demo file.
 * - "ci-failed": apm.yml was edited without running `apm install`, so the lockfile is out of sync.
 * - "ci-passed": the unlocked manifest line was removed and `apm audit --ci` is clean.
 */
export type DemoState =
  | "initial"
  | "dependencies-installed"
  | "lockfile-generated"
  | "security-warning"
  | "ci-failed"
  | "ci-passed";

export type DemoActionType =
  | "install"
  | "inspectLockfile"
  | "runSecurity"
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
  "ci-failed",
  "ci-passed",
];

/** Legal transitions, explicit. `reset` is legal everywhere and handled separately. */
const TRANSITIONS: Readonly<Record<DemoState, Partial<Record<DemoActionType, DemoState>>>> = {
  initial: { install: "dependencies-installed" },
  "dependencies-installed": { inspectLockfile: "lockfile-generated" },
  "lockfile-generated": { runSecurity: "security-warning" },
  "security-warning": { runCI: "ci-failed" },
  // Re-running CI on a red build keeps it red; the fix is a separate action.
  "ci-failed": { runCI: "ci-failed", fixManifest: "ci-passed" },
  // Re-running CI on a green build keeps it green.
  "ci-passed": { runCI: "ci-passed" },
};

const HINTS: Readonly<Record<DemoState, string>> = {
  initial: "Nothing is installed yet. Run Install first.",
  "dependencies-installed": "Inspect the lockfile that install just wrote.",
  "lockfile-generated": "Next step is the hidden-character and integrity scan.",
  "security-warning": "Next step is CI Validation.",
  "ci-failed": "CI is red. Fix the manifest and re-run CI.",
  "ci-passed": "Demo complete. Use Reset Demo to run it again.",
};

export function transition(state: DemoState, action: DemoAction): TransitionResult {
  if (action.type === "reset") return { state: INITIAL_STATE, accepted: true };
  const next = TRANSITIONS[state][action.type];
  if (next === undefined) return { state, accepted: false, hint: HINTS[state] };
  return { state: next, accepted: true };
}

export const canRun = (state: DemoState, type: DemoActionType): boolean =>
  type === "reset" || TRANSITIONS[state][type] !== undefined;
