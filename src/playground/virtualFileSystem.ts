import type { DemoState } from "./demoEngine";
import {
  FIXTURE_MARKED,
  GITIGNORE,
  LOCKFILE,
  MANIFEST_DRIFTED,
  MANIFEST_INSTALLED,
  MANIFEST_TARGETS,
} from "./recorded";

/**
 * Immutable virtual project tree. It is a pure function of the demo state, so the
 * explorer, the viewer and the terminal can never disagree. Files are read-only.
 *
 * Every path and file content comes from one real scripted run of apm-cli 0.33.0
 * (src/playground/recorded.ts, docs/apm-research.md "Re-recorded runs"). Deployed files whose
 * content was not captured show only a note, never invented text.
 */
export interface VFile {
  readonly kind: "file";
  readonly name: string;
  readonly path: string;
  /** Absent when the run did not record the file's content. */
  readonly content?: string;
  /** Short caption under the viewer (why a file is trimmed, what is not recorded). */
  readonly note?: string;
  /** Zero-based line numbers highlighted in the viewer. */
  readonly highlight?: readonly number[];
}

export interface VDir {
  readonly kind: "dir";
  readonly name: string;
  readonly path: string;
  readonly summary?: string;
  readonly children: readonly VNode[];
}

export type VNode = VFile | VDir;

export const MANIFEST_PATH = "apm.yml";
export const LOCKFILE_PATH = "apm.lock.yaml";
/** Fixture created for the recorded `apm audit --file` run; it holds real U+200B and U+202E characters. */
export const HIDDEN_CHARS_PATH = "src/pasted-prompt.md";

/** Placeholder dependency taken from the recorded failing run (the repo itself does not exist). */
export const UNLOCKED_DEPENDENCY = "example/engineering-skills";

const DEPENDENCY_LINE = "    - microsoft/apm-sample-package#v1.0.0";

const lineOf = (content: string, text: string): number => content.split("\n").indexOf(text);

const NOT_RECORDED =
  "File content was not captured in the recorded run. Its path and SHA-256 hash are listed in apm.lock.yaml.";

const file = (
  path: string,
  extra: Partial<Omit<VFile, "kind" | "name" | "path">> = {},
): VFile => ({ kind: "file", name: path.split("/").pop() ?? path, path, ...extra });

const deployed = (path: string): VFile => file(path, { note: NOT_RECORDED });

const dir = (path: string, children: readonly VNode[] = [], summary?: string): VDir => ({
  kind: "dir",
  name: path.split("/").pop() ?? path,
  path,
  children,
  ...(summary ? { summary } : {}),
});

const INSTALLED_STATES: ReadonlySet<DemoState> = new Set<DemoState>([
  "dependencies-installed",
  "lockfile-generated",
  "security-warning",
  "ci-failed",
  "ci-passed",
]);

const SCANNED_STATES: ReadonlySet<DemoState> = new Set<DemoState>([
  "security-warning",
  "ci-failed",
  "ci-passed",
]);

export const isInstalled = (state: DemoState): boolean => INSTALLED_STATES.has(state);

function manifestFor(state: DemoState): VFile {
  if (state === "initial") {
    return file(MANIFEST_PATH, {
      content: MANIFEST_TARGETS,
      note: "apm init --yes output. The CLI writes the targets block commented out; it was uncommented by hand (pinned to copilot and claude).",
    });
  }
  if (state === "dependencies-installed") {
    return file(MANIFEST_PATH, {
      content: MANIFEST_INSTALLED,
      highlight: [lineOf(MANIFEST_INSTALLED, DEPENDENCY_LINE)],
      note: "Highlighted: apm install wrote this dependency into apm.yml itself.",
    });
  }
  if (state === "ci-failed") {
    return file(MANIFEST_PATH, {
      content: MANIFEST_DRIFTED,
      highlight: [lineOf(MANIFEST_DRIFTED, `    - ${UNLOCKED_DEPENDENCY}`)],
      note: "Highlighted: added by hand and never installed, so apm.lock.yaml does not know it.",
    });
  }
  return file(MANIFEST_PATH, { content: MANIFEST_INSTALLED });
}

/** Builds the whole tree for a state. Always returns a fresh immutable structure. */
export function buildFileSystem(state: DemoState): readonly VNode[] {
  const nodes: VNode[] = [manifestFor(state)];

  if (isInstalled(state)) {
    nodes.push(
      file(LOCKFILE_PATH, { content: LOCKFILE, note: "The complete real file, as written by apm install." }),
      file(".gitignore", {
        content: GITIGNORE,
        note: "apm install added the apm_modules/ entry (see the install output).",
      }),
      dir("apm_modules", [], "downloaded packages, git-ignored"),
      dir(".agents", [
        dir(".agents/skills", [
          dir(".agents/skills/review-and-refactor", [
            deployed(".agents/skills/review-and-refactor/SKILL.md"),
          ]),
          dir(".agents/skills/style-checker", [deployed(".agents/skills/style-checker/SKILL.md")]),
        ]),
      ]),
      dir(".claude", [
        dir(".claude/agents", [deployed(".claude/agents/design-reviewer.md")]),
        dir(".claude/commands", [
          deployed(".claude/commands/accessibility-audit.md"),
          deployed(".claude/commands/design-review.md"),
        ]),
        dir(".claude/rules", [deployed(".claude/rules/design-standards.md")]),
        dir(".claude/skills", [
          dir(".claude/skills/review-and-refactor", [
            deployed(".claude/skills/review-and-refactor/SKILL.md"),
          ]),
          dir(".claude/skills/style-checker", [deployed(".claude/skills/style-checker/SKILL.md")]),
        ]),
      ]),
      dir(".github", [
        dir(".github/agents", [deployed(".github/agents/design-reviewer.agent.md")]),
        dir(".github/instructions", [
          deployed(".github/instructions/design-standards.instructions.md"),
        ]),
        dir(".github/prompts", [
          deployed(".github/prompts/accessibility-audit.prompt.md"),
          deployed(".github/prompts/design-review.prompt.md"),
        ]),
      ]),
    );
  }

  if (SCANNED_STATES.has(state)) {
    nodes.push(
      dir("src", [
        file(HIDDEN_CHARS_PATH, {
          content: FIXTURE_MARKED,
          highlight: [1, 2],
          note: "Fixture created for the recorded run. The real file holds invisible characters; here they are written as <U+XXXX> so you can see them.",
        }),
      ]),
    );
  }

  return nodes.sort(compareNodes);
}

function compareNodes(a: VNode, b: VNode): number {
  if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
  return a.name.localeCompare(b.name);
}

export function findFile(nodes: readonly VNode[], path: string): VFile | undefined {
  for (const node of nodes) {
    if (node.kind === "file") {
      if (node.path === path) return node;
    } else {
      const found = findFile(node.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

/** All file paths, depth first. */
export function listFiles(nodes: readonly VNode[]): string[] {
  return nodes.flatMap((n) => (n.kind === "file" ? [n.path] : listFiles(n.children)));
}
