import type { DemoState } from "./demoEngine";
import {
  DEPLOYED_FILES,
  FIXTURE_MARKED,
  GITIGNORE,
  LOCKFILE,
  MANIFEST_DRIFTED,
  MANIFEST_INSTALLED,
  MANIFEST_TARGETS,
} from "./recorded";

/** Read-only files captured from the real team-package recording. */
export interface VFile {
  readonly kind: "file";
  readonly name: string;
  readonly path: string;
  readonly content?: string;
  readonly note?: string;
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

export const MANIFEST_PATH = "payments-service/apm.yml";
export const LOCKFILE_PATH = "payments-service/apm.lock.yaml";
export const HIDDEN_CHARS_PATH = "payments-service/src/pasted-prompt.md";
export const DEFAULT_FILE_PATH = MANIFEST_PATH;
export const UNLOCKED_DEPENDENCY = "northstar-engineering/uninstalled-team#v1.0.0";
const DEPENDENCY_LINE = "    - northstar-engineering/payments-team#v1.0.0";

export const isInstalled = (state: DemoState): boolean => state !== "initial";

function capturedFile(path: string, content: string, highlight?: readonly number[]): VFile {
  return { kind: "file", name: path.split("/").pop() ?? path, path, content, highlight };
}

/** The consumer view contains only its manifest and real deployed files, never producer sources. */
export function buildFileSystem(state: DemoState): readonly VNode[] {
  const drifted = state === "manifest-edited" || state === "ci-failed";
  const manifest = state === "initial" ? MANIFEST_TARGETS : drifted ? MANIFEST_DRIFTED : MANIFEST_INSTALLED;
  const highlightedLine = drifted ? `    - ${UNLOCKED_DEPENDENCY}` : DEPENDENCY_LINE;
  const files: VFile[] = [
    capturedFile(MANIFEST_PATH, manifest, state === "dependencies-installed" || drifted
      ? [manifest.split("\n").indexOf(highlightedLine)] : undefined),
  ];
  if (isInstalled(state)) {
    files.push(
      capturedFile(LOCKFILE_PATH, LOCKFILE, [LOCKFILE.split("\n").findIndex((line) => line.includes("resolved_commit:"))]),
      capturedFile("payments-service/.gitignore", GITIGNORE),
      ...Object.entries(DEPLOYED_FILES).map(([path, content]) => capturedFile(`payments-service/${path}`, content)),
    );
  }
  if (state === "security-warning") {
    files.push({
      ...capturedFile(HIDDEN_CHARS_PATH, FIXTURE_MARKED, [1, 2]),
      note: "Recorded fixture; invisible characters are displayed as <U+XXXX> markers.",
    });
  }

  return buildFileTree(files);
}

/** Group captured file paths into a sorted explorer tree for either demo. */
export function buildFileTree(files: readonly VFile[]): readonly VNode[] {
  const roots: VNode[] = [];
  const directories = new Map<string, Omit<VDir, "children"> & { children: VNode[] }>();
  for (const file of files) {
    const segments = file.path.split("/");
    let children = roots;
    let prefix = "";
    for (let i = 0; i < segments.length - 1; i += 1) {
      const name = segments[i]!;
      prefix = prefix ? `${prefix}/${name}` : name;
      let directory = directories.get(prefix);
      if (!directory) {
        directory = {
          kind: "dir", name, path: prefix, children: [],
        };
        directories.set(prefix, directory);
        children.push(directory);
      }
      children = directory.children;
    }
    children.push(file);
  }
  for (const directory of directories.values()) directory.children.sort(compareNodes);
  return roots.sort(compareNodes);
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

export function listFiles(nodes: readonly VNode[]): string[] {
  return nodes.flatMap((node) => node.kind === "file" ? [node.path] : listFiles(node.children));
}
