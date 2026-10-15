export type TerminalLineKind = "command" | "success" | "warning";

export interface TerminalLine {
  readonly kind: TerminalLineKind;
  readonly text: string;
}

/** Badge shown on the terminal: the session is staged, not a real run. */
export const HOOK_BADGE = "Illustrative terminal";

export const hookLines: readonly TerminalLine[] = [
  { kind: "command", text: "$ git clone acme/payments-service" },
  { kind: "command", text: "$ npm install" },
  { kind: "success", text: "✓ 247 packages, all pinned in package-lock.json" },
  { kind: "command", text: '$ claude "add a refund endpoint"' },
  { kind: "warning", text: "⚠ No CLAUDE.md or AGENTS.md" },
  { kind: "warning", text: "⚠ No skills: write-tests missing" },
  { kind: "warning", text: "⚠ No .mcp.json: issue tracker unreachable" },
  { kind: "warning", text: "⚠ No manifest, no lockfile for any of it" },
];

/** Seconds between consecutive stages: one per terminal line, then the quote, then the graph. */
export const hookDelays: readonly number[] = [0.6, 0.8, 0.5, 1.0, 0.7, 0.5, 0.5, 0.5, 2.0, 3.0];

export const QUOTE_STAGE = hookLines.length + 1;
export const GRAPH_STAGE = hookLines.length + 2;

export const HOOK_QUOTE_LINES: readonly [string, string] = [
  "npm install gives every developer the same code.",
  "What gives every agent the same context?",
];
