import {
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
  MANIFEST_PATH,
  UNLOCKED_DEPENDENCY,
} from "./virtualFileSystem";


const play = (...types: DemoActionType[]): DemoState =>
  types.reduce<DemoState>((s, type) => transition(s, { type }).state, INITIAL_STATE);

describe("demo engine", () => {
  it("validates the clean install, then optionally demonstrates failure and recovery", () => {
    expect(play("install", "inspectLockfile", "runCI")).toBe("ci-passed");
    expect(play("install", "inspectLockfile", "runCI", "addDependency", "runCI")).toBe("ci-failed");
    expect(play("install", "inspectLockfile", "runCI", "addDependency", "runCI", "fixManifest")).toBe("ci-passed");
  });

  it("can return from the optional scan to clean CI", () => {
    expect(play("install", "inspectLockfile", "runSecurity", "runCI")).toBe("ci-passed");
  });

  it("rejects illegal actions with the same state and a hint, never throwing", () => {
    const result = transition("initial", { type: "runCI" });
    expect(result).toEqual({ state: "initial", accepted: false, hint: expect.any(String) });
    expect(transition("ci-passed", { type: "install" }).accepted).toBe(false);
    expect(transition("lockfile-generated", { type: "fixManifest" }).hint).toBeTruthy();
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

  it("keeps the manifest edit visible before and after CI, and fixing restores it", () => {
    const manifest = (s: DemoState) => findFile(buildFileSystem(s), MANIFEST_PATH);
    expect(manifest("manifest-edited")?.content).toContain(UNLOCKED_DEPENDENCY);
    expect(manifest("manifest-edited")?.content).toBe(manifest("ci-failed")?.content);
    expect(manifest("ci-failed")?.content).toContain(UNLOCKED_DEPENDENCY);
    expect(manifest("ci-failed")?.highlight).toHaveLength(1);
    expect(manifest("ci-passed")?.content).not.toContain(UNLOCKED_DEPENDENCY);
    expect(manifest("ci-passed")?.content).toBe(manifest("lockfile-generated")?.content);
  });

  it("shows the hidden-character fixture only while inspecting the optional scan", () => {
    expect(findFile(buildFileSystem("lockfile-generated"), HIDDEN_CHARS_PATH)).toBeUndefined();
    expect(findFile(buildFileSystem("ci-passed"), HIDDEN_CHARS_PATH)).toBeUndefined();
    expect(findFile(buildFileSystem("security-warning"), HIDDEN_CHARS_PATH)?.content).toContain(
      "<U+200B>",
    );
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
