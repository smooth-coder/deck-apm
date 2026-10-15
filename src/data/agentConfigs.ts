export interface TaskOutput {
  readonly conventions: string;
  readonly tests: string;
  readonly architecture: string;
  readonly tools: string;
}

export interface DeveloperSetup {
  readonly id: string;
  readonly name: string;
  readonly agent: string;
  readonly summary: string;
  readonly config: readonly string[];
  readonly output: TaskOutput;
  /** One line (max ~12 words) linking the setup to the output. */
  readonly why: string;
}

export const sharedTask = 'Same task for everyone: "Add a refund endpoint to the payment service."';

export const ILLUSTRATIVE_LABEL = "Illustrative setups and outputs, not real model runs";

/** Always visible: the setups are plausible but invented, the outputs are written by hand. */
export const SETUPS_LABEL = "Illustrative setups: invented to show the shape of the problem, not real model runs";

export const CONCLUSION =
  "Four pull requests, four conventions. Nothing in git says which agent context produced which.";

export const developers: readonly DeveloperSetup[] = [
  {
    id: "alice",
    name: "Alice",
    agent: "Claude Code",
    summary: "CLAUDE.md + her own skill",
    config: [
      "CLAUDE.md: errors return Result<T,E>, never throw",
      "~/.claude/skills/write-tests/SKILL.md: tests before handler (on her laptop only)",
      "No .mcp.json: no ticket access",
    ],
    output: {
      conventions: "return err(new RefundError()); named exports",
      tests: "refund.test.ts written first",
      architecture: "RefundService behind a PaymentGateway port",
      tools: "Files and shell. Cannot read the ticket.",
    },
    why: "Her skill is not in the repo.",
  },
  {
    id: "bob",
    name: "Bob",
    agent: "Cursor",
    summary: ".cursor/rules from another project",
    config: [
      ".cursor/rules/api.mdc copied months ago: default exports, throw on error",
      "No team test procedure configured",
      "No MCP servers (.cursor/mcp.json absent)",
    ],
    output: {
      conventions: "throw new Error('refund failed'); default export",
      tests: "None generated",
      architecture: "Refund logic inline in the route handler",
      tools: "Cannot read the ticket.",
    },
    why: "The rule file describes a different codebase.",
  },
  {
    id: "carol",
    name: "Carol",
    agent: "Copilot",
    summary: "copilot-instructions.md + local MCP",
    config: [
      ".github/copilot-instructions.md: six generic lines",
      "MCP servers for tracker and staging DB, set up in her own editor, not in the repo",
      "No shared skill for tests",
    ],
    output: {
      conventions: "Mixed styles copied from nearby files",
      tests: "One happy-path test",
      architecture: "Handler queries the staging database directly",
      tools: "Reads the ticket. Writes SQL against staging.",
    },
    why: "Her tools differ from everyone's, and nobody reviewed them.",
  },
  {
    id: "dave",
    name: "Dave",
    agent: "Codex",
    summary: "AGENTS.md, two releases old",
    config: [
      "AGENTS.md at repo root, last edited two releases ago",
      "Names the old test framework and the old layering",
      "No MCP servers",
    ],
    output: {
      conventions: "snake_case names; the codebase moved to camelCase",
      tests: "Jest tests; the team moved to Vitest",
      architecture: "Old controller/model layering",
      tools: "Cannot read the ticket.",
    },
    why: "The file is committed, so it is trusted, and it is stale.",
  },
];
