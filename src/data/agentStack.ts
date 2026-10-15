export interface StackNode {
  readonly id: string;
  readonly label: string;
  /** What it is and when it enters the model's context (max ~25 words). */
  readonly definition: string;
  /** Where it lives: a real path or file name. */
  readonly lives: string;
  /** Illustrative content for that file. */
  readonly example: string;
}

export const agentNode: StackNode = {
  id: "agent",
  label: "AI Agent",
  definition:
    "The model that reads the task and edits your repo. Everything else on this slide is what you give it.",
  lives: "(the tool: Claude Code, Copilot, Cursor, Codex)",
  example: "Task: Add a refund endpoint to the payment service.",
};

export const capabilityNodes: readonly StackNode[] = [
  {
    id: "instructions",
    label: "Instructions",
    definition:
      "Plain-text rules loaded into context at session start. Guidance only: the model can still ignore them.",
    lives: "CLAUDE.md · AGENTS.md · .github/copilot-instructions.md · .cursor/rules/*.mdc",
    example: "Use pnpm. Errors extend AppError. Never edit generated files.",
  },
  {
    id: "skills",
    label: "Skills",
    definition: "A named procedure the agent loads only when its description matches the task.",
    lives: ".claude/skills/write-tests/SKILL.md",
    example: "description: Add a unit test the way this team does it. Body: numbered steps.",
  },
  {
    id: "mcp",
    label: "MCP",
    definition:
      "A server that gives the agent tools and data beyond the repo: it can read and act on external systems.",
    lives: ".mcp.json (Claude Code) · .cursor/mcp.json (Cursor)",
    example: '{ "mcpServers": { "tracker": { "type": "http", "url": "https://tracker.example.com/mcp" } } }',
  },
  {
    id: "subagents",
    label: "Subagents",
    definition:
      "A specialist the main agent hands work to, with its own prompt and its own tool allow-list.",
    lives: ".claude/agents/code-reviewer.md",
    example: "tools: Read, Grep, Glob. It can review the diff but cannot edit files.",
  },
];

export const contextNode: StackNode = {
  id: "context",
  label: "Agent Context",
  definition:
    "What the model actually receives: your repo plus whatever the files above put in front of it.",
  lives: "Built at runtime from all of the above, differently per tool and per laptop",
  example: "Change one file, or one version of it, and the same prompt produces a different pull request.",
};

export const STACK_MESSAGE =
  "If any one file differs, the agent's environment differs. That is the dependency problem.";

/** Shown with every node: most paths are Claude Code's; other tools are named where they differ. */
export const STACK_SCOPE_NOTE =
  "Paths are Claude Code's unless another tool is named. Examples are illustrative.";
