import { commandRun } from "./commands";
import {
  canRun,
  DEMO_STATES,
  type DemoActionType,
  type DemoState,
  INITIAL_STATE,
  transition,
} from "./demoEngine";
import { tintLine } from "./highlight";
import { demoSteps, focusFileAfter, nextStep } from "./scenarios";
import {
  buildFileSystem,
  findFile,
  HIDDEN_CHARS_PATH,
  listFiles,
  LOCKFILE_PATH,
  MANIFEST_PATH,
  UNLOCKED_DEPENDENCY,
} from "./virtualFileSystem";

const ACTIONS: readonly DemoActionType[] = [
  "install",
  "inspectLockfile",
  "runSecurity",
  "runCI",
  "fixManifest",
  "reset",
];

const play = (...types: DemoActionType[]): DemoState =>
  types.reduce<DemoState>((s, type) => transition(s, { type }).state, INITIAL_STATE);

describe("demo engine", () => {
  it("walks the scripted path", () => {
    expect(play("install")).toBe("dependencies-installed");
    expect(play("install", "inspectLockfile")).toBe("lockfile-generated");
    expect(play("install", "inspectLockfile", "runSecurity")).toBe("security-warning");
    expect(play("install", "inspectLockfile", "runSecurity", "runCI")).toBe("ci-failed");
    expect(play("install", "inspectLockfile", "runSecurity", "runCI", "fixManifest")).toBe(
      "ci-passed",
    );
  });

  it("rejects illegal actions with the same state and a hint, never throwing", () => {
    const result = transition("initial", { type: "runCI" });
    expect(result).toEqual({ state: "initial", accepted: false, hint: expect.any(String) });
    expect(transition("ci-passed", { type: "install" }).accepted).toBe(false);
    expect(transition("lockfile-generated", { type: "fixManifest" }).hint).toBeTruthy();
  });

  it("allows only the documented transitions", () => {
    const legal = DEMO_STATES.flatMap((s) =>
      ACTIONS.filter((a) => a !== "reset" && canRun(s, a)).map((a) => `${s}:${a}`),
    );
    expect(legal).toEqual([
      "initial:install",
      "dependencies-installed:inspectLockfile",
      "lockfile-generated:runSecurity",
      "security-warning:runCI",
      "ci-failed:runCI",
      "ci-failed:fixManifest",
      "ci-passed:runCI",
    ]);
  });

  it("keeps CI red on re-run and green after the fix", () => {
    expect(transition("ci-failed", { type: "runCI" }).state).toBe("ci-failed");
    expect(transition("ci-passed", { type: "runCI" }).state).toBe("ci-passed");
  });

  it.each(DEMO_STATES)("reset from %s returns to initial", (state) => {
    expect(transition(state, { type: "reset" })).toEqual({ state: "initial", accepted: true });
  });
});

describe("virtual file system", () => {
  it("is deterministic and returns equal trees for the same state", () => {
    expect(buildFileSystem("ci-failed")).toEqual(buildFileSystem("ci-failed"));
  });

  it("starts with only the manifest and src", () => {
    expect(listFiles(buildFileSystem("initial"))).toEqual([MANIFEST_PATH]);
  });

  it("adds the lockfile and real install locations after install", () => {
    const files = listFiles(buildFileSystem("dependencies-installed"));
    expect(files).toContain(LOCKFILE_PATH);
    expect(files).toContain(".agents/skills/style-checker/SKILL.md");
    expect(files).toContain(".github/prompts/design-review.prompt.md");
    expect(findFile(buildFileSystem("dependencies-installed"), MANIFEST_PATH)?.content).toContain(
      "microsoft/apm-sample-package#v1.0.0",
    );
  });

  it("only drifts the manifest in ci-failed, and fixing restores it", () => {
    const manifest = (s: DemoState) => findFile(buildFileSystem(s), MANIFEST_PATH);
    expect(manifest("ci-failed")?.content).toContain(UNLOCKED_DEPENDENCY);
    expect(manifest("ci-failed")?.highlight).toHaveLength(1);
    expect(manifest("ci-passed")?.content).not.toContain(UNLOCKED_DEPENDENCY);
    expect(manifest("ci-passed")?.content).toBe(manifest("lockfile-generated")?.content);
  });

  it("shows the hidden-character fixture from the security step on", () => {
    expect(findFile(buildFileSystem("lockfile-generated"), HIDDEN_CHARS_PATH)).toBeUndefined();
    expect(findFile(buildFileSystem("security-warning"), HIDDEN_CHARS_PATH)?.content).toContain(
      "<U+200B>",
    );
  });
});

describe("recorded commands", () => {
  const text = (type: DemoActionType, from: DemoState) =>
    commandRun(type, from)
      ?.entries.map((e) => e.text)
      .join("\n") ?? "";

  it("uses the real sample package, not the 404 one, for install", () => {
    const out = text("install", "initial");
    expect(out).toContain("apm install microsoft/apm-sample-package#v1.0.0");
    expect(out).not.toContain(" -t ");
    expect(out).toContain("Targets: claude, copilot  (source: apm.yml)");
    expect(out).toContain("[*] Installed 2 APM dependencies");
    expect(out).not.toContain("engineering-skills");
  });

  it("records apm deps list and shows the complete real lockfile in the viewer", () => {
    expect(text("inspectLockfile", "dependencies-installed")).toContain("APM Dependencies (Project)");
    const lock = findFile(buildFileSystem("lockfile-generated"), LOCKFILE_PATH);
    expect(lock?.content).toContain("resolved_commit: fb2851683be0e0e7711421d518bd8dba23b0b1f6");
    expect(lock?.content).not.toMatch(/\.\.\./);
  });

  it("keeps the manifest, the command and the recorded output consistent", () => {
    const initial = findFile(buildFileSystem("initial"), MANIFEST_PATH)?.content ?? "";
    const installedFile = findFile(buildFileSystem("dependencies-installed"), MANIFEST_PATH);
    const installed = installedFile?.content ?? "";
    expect(initial).toMatch(/^targets:\n {2}- copilot\n {2}- claude$/m);
    expect(initial).toContain("  apm: []");
    expect(installed).toContain("    - microsoft/apm-sample-package#v1.0.0");
    expect(installed).not.toBe(initial);
    expect(installedFile?.highlight).toHaveLength(1);
  });

  it("records the hidden-character scan, not an invented injection audit", () => {
    const out = text("runSecurity", "lockfile-generated");
    expect(out).toContain("apm audit --file src/pasted-prompt.md");
    expect(out).toContain("12 file(s) scanned -- no issues found");
    expect(out).toMatch(/CRITICAL\s+│ src\/pasted-prompt\.md\s+│ 3:30\s+│ U\+202E\s+│ Right-to-left override \(RLO\)/);
    expect(out).toMatch(/WARNING\s+│ src\/pasted-prompt\.md\s+│ 2:29\s+│ U\+200B\s+│ Zero-width space/);
    // The findings are the real table rows, never "CRITICAL ..." placeholders.
    expect(out).not.toMatch(/(CRITICAL|WARNING)\s+\.\.\./);
    expect(out).not.toMatch(/prompt.injection/i);
    expect(commandRun("runSecurity", "lockfile-generated")?.exitCode).toBe(1);
  });

  it("fails CI with exit 1 on manifest and lockfile drift, for both real commands", () => {
    const run = commandRun("runCI", "security-warning");
    const out = text("runCI", "security-warning");
    expect(run?.exitCode).toBe(1);
    expect(out).toContain("apm audit --ci");
    expect(out).toContain("apm install --frozen");
    expect(out).toContain("not found in lockfile");
    expect(out).toContain("out of sync with apm.yml");
  });

  it("passes CI with exit 0 after the fix", () => {
    const run = commandRun("fixManifest", "ci-failed");
    expect(run?.exitCode).toBe(0);
    expect(text("fixManifest", "ci-failed")).toContain("[*] All 10 check(s) passed");
    expect(text("fixManifest", "ci-failed")).toContain("(exit 0)");
  });

  it("shows the fixture with visible markers and the positions the audit reports", () => {
    const fixture = findFile(buildFileSystem("security-warning"), HIDDEN_CHARS_PATH);
    const lines = fixture?.content?.trimEnd().split("\n") ?? [];
    expect(lines[1]?.indexOf("<U+200B>")).toBe(28); // finding 2:29
    expect(lines[2]?.indexOf("<U+202E>")).toBe(29); // finding 3:30
    expect(lines[2]?.endsWith("<U+202E>")).toBe(true);
  });

  it("has no command for reset", () => {
    expect(commandRun("reset", "ci-passed")).toBeUndefined();
  });

  it("only uses commands that exist in the research doc", () => {
    const allowed = [
      /^apm install microsoft\/apm-sample-package#v1\.0\.0$/,
      /^apm deps list$/,
      /^apm audit$/,
      /^apm audit --file src\/pasted-prompt\.md$/,
      /^apm audit --ci$/,
      /^apm install --frozen$/,
    ];
    const types: [DemoActionType, DemoState][] = [
      ["install", "initial"],
      ["inspectLockfile", "dependencies-installed"],
      ["runSecurity", "lockfile-generated"],
      ["runCI", "security-warning"],
      ["fixManifest", "ci-failed"],
      ["runCI", "ci-passed"],
    ];
    for (const [type, from] of types) {
      for (const entry of commandRun(type, from)?.entries ?? []) {
        if (entry.kind === "command") {
          expect(allowed.some((re) => re.test(entry.text))).toBe(true);
        }
      }
    }
  });
});

describe("scenario", () => {
  it("recommends exactly the legal transition at every step, ending at ci-passed", () => {
    let state: DemoState = INITIAL_STATE;
    for (const step of demoSteps) {
      expect(nextStep(state)).toBe(step);
      const result = transition(state, { type: step.action });
      expect(result.accepted).toBe(true);
      state = result.state;
    }
    expect(state).toBe("ci-passed");
    expect(nextStep(state)).toBeUndefined();
  });

  it("points the viewer at files that exist after each step", () => {
    let state: DemoState = INITIAL_STATE;
    for (const step of demoSteps) {
      state = transition(state, { type: step.action }).state;
      expect(findFile(buildFileSystem(state), focusFileAfter(step.action, step.from))).toBeDefined();
    }
  });
});

describe("highlight", () => {
  it("tints keys, comments and hidden-character markers", () => {
    expect(tintLine("# note")).toEqual([{ kind: "comment", text: "# note" }]);
    expect(tintLine("name: proj").map((t) => t.kind)).toEqual(["plain", "key", "plain", "string"]);
    expect(tintLine("a<U+200B>b").map((t) => t.kind)).toEqual(["plain", "marker", "plain"]);
    expect(tintLine("")).toEqual([{ kind: "plain", text: "" }]);
  });
});
