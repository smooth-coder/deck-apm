import { APM_VERSION } from "../playground/commands";

export interface Scene {
  readonly id: number;
  /** Claim headline shown to the audience (max ~10 words). */
  readonly title: string;
  /** One supporting line shown under the title (max ~25 words). */
  readonly support: string;
  /** Presenter intent. Never rendered; kept for the presenter script (docs/talk-script.md). */
  readonly goal: string;
  readonly durationMin: number;
}

export const scenes: readonly Scene[] = [
  {
    id: 1,
    title: "Your code is reproducible. Your agents aren't.",
    support:
      "A fresh clone gives you identical code. Nothing in the repo says which instructions, skills or tools the agent should have.",
    goal: "Make the audience feel the pain of agent setup drift.",
    durationMin: 2,
  },
  {
    id: 2,
    title: "Same repo. Same task. Four different pull requests.",
    support:
      "Each tool reads instructions from a different place. Each developer configured theirs by hand. Git records none of it.",
    goal: "Show four agent setups producing four diverging results.",
    durationMin: 3,
  },
  {
    id: 3,
    title: "Four kinds of agent files. Not interchangeable.",
    support:
      "Instructions load every session. Skills load when relevant. MCP grants tool access. Subagents get their own context.",
    goal: "Map the layers of an agent setup that need to be managed.",
    durationMin: 3,
  },
  {
    id: 4,
    title: "Declare it. Lock it. Install it. Audit it.",
    support:
      "APM applies the package-manager loop to agent files. The loop is the analogy; the contents are different.",
    goal: "Introduce a package manager model for agent dependencies.",
    durationMin: 2,
  },
  {
    id: 5,
    title: "One command rebuilds the agent's environment.",
    support: `Recorded run of apm-cli ${APM_VERSION}: install, lock, audit, then a CI gate that fails on drift.`,
    goal: "Walk the recorded CLI session; the presenter drives, the audience watches.",
    durationMin: 5,
  },
  {
    id: 6,
    title: "Where agent context fits in your delivery pipeline.",
    support:
      "APM handles context, locking, integrity and the CI gate. Evals and review are yours to build.",
    goal: "Connect reproducible agent setups to shipping software.",
    durationMin: 3,
  },
];

export const TOTAL_DURATION_MIN: number = scenes.reduce((sum, s) => sum + s.durationMin, 0);
