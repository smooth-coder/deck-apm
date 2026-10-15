import type { DemoActionType, DemoState } from "./demoEngine";
import { HIDDEN_CHARS_PATH, LOCKFILE_PATH, MANIFEST_PATH } from "./virtualFileSystem";

/** The five action-bar buttons. The CI button turns into the fix step when CI is red. */
export type ButtonId = "install" | "inspect" | "security" | "ci" | "reset";

export interface DemoStep {
  /** State the step starts from. */
  readonly from: DemoState;
  readonly action: DemoActionType;
  readonly button: ButtonId;
  /** Where the 5-minute talk is when this step runs. Presenter-only: not rendered. */
  readonly minute: string;
  readonly title: string;
  /** One audience-safe line (max ~25 words), shown in the Demo path hint. */
  readonly say: string;
  /** File the viewer selects after the step runs. */
  readonly focusFile: string;
}

/** The scripted 5-minute sequence, in order. */
export const demoSteps: readonly DemoStep[] = [
  {
    from: "initial",
    action: "install",
    button: "install",
    minute: "1:00 - 3:00",
    title: "Install",
    say: "One command writes instructions, skills and agents into .github/, .claude/ and .agents/. This is what the opening terminal was missing.",
    focusFile: MANIFEST_PATH,
  },
  {
    from: "dependencies-installed",
    action: "inspectLockfile",
    button: "inspect",
    minute: "3:00 - 4:00",
    title: "Inspect Lockfile",
    say: "apm.lock.yaml pins each package to a commit SHA and records a SHA-256 hash for every file it deployed.",
    focusFile: LOCKFILE_PATH,
  },
  {
    from: "lockfile-generated",
    action: "runSecurity",
    button: "security",
    minute: "4:00 - 4:20",
    title: "Security",
    say: "Scans deployed files for hidden Unicode and checks hashes and drift. It does not detect prompt injection.",
    focusFile: HIDDEN_CHARS_PATH,
  },
  {
    from: "security-warning",
    action: "runCI",
    button: "ci",
    minute: "4:20 - 4:40",
    title: "CI Validation",
    say: "apm.yml gained a dependency that was never installed. apm audit --ci and apm install --frozen both exit 1.",
    focusFile: MANIFEST_PATH,
  },
  {
    from: "ci-failed",
    action: "fixManifest",
    button: "ci",
    minute: "4:40 - 5:00",
    title: "Fix manifest and re-run CI",
    say: "Revert the line. The same check now passes all 10 checks and exits 0.",
    focusFile: MANIFEST_PATH,
  },
];

export const INTRO_STEP = {
  minute: "0:00 - 1:00",
  say: "The repo declares no agent dependencies and has no agent files. Compare the opening terminal.",
} as const;

/** The next recommended step from a state, or undefined once the demo is complete. */
export const nextStep = (state: DemoState): DemoStep | undefined =>
  demoSteps.find((s) => s.from === state);

/** File the viewer should show after an action lands in `to`. */
export function focusFileAfter(action: DemoActionType, from: DemoState): string {
  if (action === "reset") return MANIFEST_PATH;
  return demoSteps.find((s) => s.from === from && s.action === action)?.focusFile ?? MANIFEST_PATH;
}

export const COMPLETE_MESSAGE = "Demo complete. Reset Demo restores the initial state.";
