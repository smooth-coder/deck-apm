import type { DemoActionType, DemoState } from "./demoEngine";
import {
  OUT_AUDIT,
  OUT_AUDIT_FILE,
  OUT_CI_FAIL,
  OUT_CI_PASS,
  OUT_DEPS_LIST,
  OUT_FROZEN,
  OUT_INSTALL,
  RECORDED_EXIT,
  RECORDED_VERSION,
} from "./recorded";
import { HIDDEN_CHARS_PATH, UNLOCKED_DEPENDENCY } from "./virtualFileSystem";

/**
 * Recorded terminal output. Every APM line comes verbatim from src/playground/recorded.ts, which
 * is copied from files written by a real run of apm-cli 0.33.0 (docs/apm-research.md, "Re-recorded
 * runs"). Nothing is trimmed or reworded; only the line colour (kind) is derived from the
 * line's own `[x]`, `[!]`, `[+]`, `[*]` prefix. `note` entries are narration written for the talk,
 * never CLI output, and `(exit N)` lines are the recorded exit codes.
 */
export type TermKind = "command" | "note" | "out" | "ok" | "warn" | "err" | "dim";

export interface TermEntry {
  readonly kind: TermKind;
  readonly text: string;
}

export interface CommandRun {
  readonly entries: readonly TermEntry[];
  /** Exit code of the last command, as recorded. */
  readonly exitCode: number;
}

export const APM_VERSION = RECORDED_VERSION.replace(/^.*version\s+/i, "");
export const RECORDED_BADGE = `RECORDED OUTPUT · apm-cli ${APM_VERSION}`;
export const SECURITY_LABEL = "Security: hidden-character and integrity scan";
export const SECURITY_NOTE =
  "apm audit scans for hidden Unicode and checks hash integrity and drift. It does NOT do prompt-injection analysis or semantic review.";

// The manifest pins targets: [copilot, claude], so no -t flag is needed (real run, source: apm.yml).
export const INSTALL_COMMAND = "apm install microsoft/apm-sample-package#v1.0.0";
export const DEPS_LIST_COMMAND = "apm deps list";
export const AUDIT_COMMAND = "apm audit";
export const AUDIT_FILE_COMMAND = `apm audit --file ${HIDDEN_CHARS_PATH}`;
export const CI_COMMAND = "apm audit --ci";
export const FROZEN_COMMAND = "apm install --frozen";

/** Narration after the install output; the counts are the ones in the recorded output above. */
const INSTALL_AFTER_NOTE =
  "# Before: no instructions, skills or tools. After: 2 prompts, 2 agents, 2 commands, 2 instructions, 1 skill.";

const cmd = (text: string): TermEntry => ({ kind: "command", text });
const note = (text: string): TermEntry => ({ kind: "note", text });
const dim = (text: string): TermEntry => ({ kind: "dim", text });
const exit = (code: number): TermEntry => dim(`(exit ${code})`);

function kindOf(line: string): TermKind {
  const t = line.trimStart();
  if (t.startsWith("[x]")) return "err";
  if (t.startsWith("[!]")) return "warn";
  if (t.startsWith("[+]") || t.startsWith("[*]")) return "ok";
  return "out";
}

/** Splits recorded text into terminal lines. Wrapped continuation lines keep their parent's colour. */
function recorded(text: string): TermEntry[] {
  const entries: TermEntry[] = [];
  let last: TermKind = "out";
  for (const line of text.trimEnd().split("\n")) {
    // A wrapped tail starts in column 0 with plain text (no "[x]" marker, no table border).
    const wrapped: boolean = /^[A-Za-z]/.test(line) && last !== "out";
    const kind: TermKind = wrapped ? last : kindOf(line);
    entries.push({ kind, text: line });
    last = kind;
  }
  return entries;
}

const INSTALL: CommandRun = {
  exitCode: Number(RECORDED_EXIT.install),
  entries: [
    cmd(INSTALL_COMMAND),
    ...recorded(OUT_INSTALL),
    exit(Number(RECORDED_EXIT.install)),
    note(INSTALL_AFTER_NOTE),
  ],
};

const INSPECT_LOCKFILE: CommandRun = {
  exitCode: Number(RECORDED_EXIT["deps-list"]),
  entries: [
    note("# the full apm.lock.yaml is open in the viewer"),
    cmd(DEPS_LIST_COMMAND),
    ...recorded(OUT_DEPS_LIST),
    exit(Number(RECORDED_EXIT["deps-list"])),
  ],
};

const SECURITY: CommandRun = {
  exitCode: Number(RECORDED_EXIT["audit-file"]),
  entries: [
    cmd(AUDIT_COMMAND),
    ...recorded(OUT_AUDIT),
    exit(Number(RECORDED_EXIT.audit)),
    note(`# ${HIDDEN_CHARS_PATH} is a demo fixture: text pasted from a web page, with U+200B and U+202E`),
    cmd(AUDIT_FILE_COMMAND),
    ...recorded(OUT_AUDIT_FILE),
    exit(Number(RECORDED_EXIT["audit-file"])),
  ],
};

const CI_FAIL: CommandRun = {
  exitCode: Number(RECORDED_EXIT.frozen),
  entries: [
    note(
      `# a teammate adds ${UNLOCKED_DEPENDENCY} (placeholder name from the recorded run) to apm.yml and forgets to run apm install`,
    ),
    note("# ref-consistency: every ref in apm.yml must exist in apm.lock.yaml"),
    cmd(CI_COMMAND),
    ...recorded(OUT_CI_FAIL),
    exit(Number(RECORDED_EXIT["ci-fail"])),
    cmd(FROZEN_COMMAND),
    ...recorded(OUT_FROZEN),
    exit(Number(RECORDED_EXIT.frozen)),
  ],
};

const CI_PASS: readonly TermEntry[] = [
  cmd(CI_COMMAND),
  ...recorded(OUT_CI_PASS),
  exit(Number(RECORDED_EXIT["ci-pass"])),
];

const FIX_MANIFEST: CommandRun = {
  exitCode: Number(RECORDED_EXIT["ci-pass"]),
  entries: [note(`# remove the unlocked ${UNLOCKED_DEPENDENCY} line from apm.yml`), ...CI_PASS],
};

/** CI re-run on a green build; identical recorded output. */
const CI_RERUN_GREEN: CommandRun = {
  exitCode: Number(RECORDED_EXIT["ci-pass"]),
  entries: CI_PASS,
};

/**
 * The recorded run for an action taken from a state, or undefined when the action is
 * not a command (reset). Illegal combinations never reach here: the engine rejects them first.
 */
export function commandRun(action: DemoActionType, from: DemoState): CommandRun | undefined {
  switch (action) {
    case "install":
      return INSTALL;
    case "inspectLockfile":
      return INSPECT_LOCKFILE;
    case "runSecurity":
      return SECURITY;
    case "runCI":
      return from === "ci-passed" ? CI_RERUN_GREEN : CI_FAIL;
    case "fixManifest":
      return FIX_MANIFEST;
    case "reset":
      return undefined;
  }
}
