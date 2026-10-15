export type ApmCoverage = "apm" | "partial" | "yours";

export interface PipelineStep {
  readonly label: string;
  /** One line (max ~25 words) saying what is checked at this step. */
  readonly check: string;
  /** Whether APM does it, does part of it, or it is left to you. */
  readonly coverage: ApmCoverage;
}

export const COVERAGE_LABEL: Readonly<Record<ApmCoverage, string>> = {
  apm: "APM",
  partial: "PARTIAL",
  yours: "YOURS",
};

export const pipelineSteps: readonly PipelineStep[] = [
  {
    label: "Developer",
    check: "Edits apm.yml and agent rules in the same pull request as the code.",
    coverage: "apm",
  },
  {
    label: "Agent Context",
    check: "apm install writes instructions, skills and agents into .github/, .claude/ and .agents/.",
    coverage: "apm",
  },
  {
    label: "Dependency Lock",
    check: "apm.lock.yaml pins commit SHAs and a SHA-256 hash per deployed file.",
    coverage: "apm",
  },
  {
    label: "Integrity Scan",
    check: "apm audit: hidden Unicode, hash mismatch, drift. Not prompt-injection detection.",
    coverage: "partial",
  },
  {
    label: "Agent Evals",
    check:
      "Run a fixed task set against the configured agent and compare results. You build this; APM has no evals.",
    coverage: "yours",
  },
  {
    label: "CI Gate",
    check:
      "apm audit --ci exits 1 if apm.yml and apm.lock.yaml disagree. Runs via microsoft/apm-action@v1.",
    coverage: "apm",
  },
  {
    label: "Human Review",
    check: "A person reads the diff before merge. Tests and runtime permissions still apply.",
    coverage: "yours",
  },
];

/** Seconds between consecutive steps lighting up. */
export const pipelineDelays: readonly number[] = [0.4, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8];

export const PIPELINE_CAPTION =
  "APM handles steps 1 to 4 and 6. It does not evaluate agent quality, sandbox the runtime, or replace code review.";

export const TAKEAWAY_TITLE = "Try this Monday";

export const takeawaySteps: readonly { readonly command: string; readonly note: string }[] = [
  { command: "apm init", note: "creates apm.yml" },
  { command: "apm install owner/repo#tag -t claude,copilot", note: "" },
  { command: "apm audit --ci", note: "add it to CI" },
];

export const TAKEAWAY_FOOTER = "github.com/microsoft/apm  ·  MIT  ·  pre-1.0";

export const CLOSING_QUOTE =
  "We version our code. We lock our dependencies. Now it's time to engineer our AI agents with the same discipline.";
