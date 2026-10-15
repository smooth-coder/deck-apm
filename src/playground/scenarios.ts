import type { DemoActionType, DemoState } from "./demoEngine";
import { DEFAULT_FILE_PATH, HIDDEN_CHARS_PATH, LOCKFILE_PATH, MANIFEST_PATH } from "./virtualFileSystem";

/** Main controls plus optional manifest-failure and Unicode examples. */
export type ButtonId = "install" | "inspect" | "edit" | "security" | "ci" | "reset";

export interface DemoStep {
  /** State the step starts from. */
  readonly from: DemoState;
  readonly action: DemoActionType;
  readonly button: ButtonId;
  /** Presenter-only timing within the three-minute consumer demo. */
  readonly minute: string;
  readonly title: string;
  /** File the viewer selects after the step runs. */
  readonly focusFile: string;
}

/** Main three-minute path ends at successful CI without introducing a failure. */
export const demoSteps: readonly DemoStep[] = [
  {
    from: "initial",
    action: "install",
    button: "install",
    minute: "0:30 - 1:15",
    title: "Install",
    focusFile: MANIFEST_PATH,
  },
  {
    from: "dependencies-installed",
    action: "inspectLockfile",
    button: "inspect",
    minute: "1:15 - 1:45",
    title: "Inspect Lockfile",
    focusFile: LOCKFILE_PATH,
  },
  {
    from: "lockfile-generated",
    action: "runCI",
    button: "ci",
    minute: "1:45 - 2:30",
    title: "Run CI checks",
    focusFile: MANIFEST_PATH,
  },
];


/** Only completed actions have an audience-facing result. */
export const demoResults: Readonly<Record<Exclude<DemoState, "initial">, string>> = {
  "dependencies-installed": "Shared reviewer, skill, rules and MCP configuration installed for Claude + Copilot.",
  "lockfile-generated": "payments-team 1.0.0: resolved Git commit, file hashes and shared MCP configuration recorded.",
  "security-warning": "2 hidden characters found in src/pasted-prompt.md.",
  "manifest-edited": "Added uninstalled-team to apm.yml only. The lockfile is unchanged; CI has not been re-run.",
  "ci-failed": "CI rejected the added package: it was not in the lockfile.",
  "ci-passed": "10 configuration checks passed. The installed setup matches the manifest and lockfile.",
};

/** The next recommended step from a state, or undefined once the demo is complete. */
export const nextStep = (state: DemoState): DemoStep | undefined =>
  demoSteps.find((s) => s.from === (state === "security-warning" || state === "manifest-edited" ? "lockfile-generated" : state));

/** File the viewer should show after an action lands in `to`. */
export function focusFileAfter(action: DemoActionType, from: DemoState): string {
  if (action === "reset") return DEFAULT_FILE_PATH;
  if (action === "runSecurity") return HIDDEN_CHARS_PATH;
  return demoSteps.find((s) => s.action === action && (s.from === from || from === "security-warning"))?.focusFile ?? MANIFEST_PATH;
}

