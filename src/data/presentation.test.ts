import { scenes, TOTAL_DURATION_MIN } from "./presentation";

describe("presentation data", () => {
  it("has six scenes with sequential ids", () => {
    expect(scenes.map((s) => s.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("uses the agreed titles", () => {
    expect(scenes.map((s) => s.title)).toEqual([
      "Your code is reproducible. Your agents aren't.",
      "Same repo. Same task. Four different pull requests.",
      "Four kinds of agent files. Not interchangeable.",
      "Declare it. Lock it. Install it. Audit it.",
      "One command rebuilds the agent's environment.",
      "Where agent context fits in your delivery pipeline.",
    ]);
  });

  it("budgets 18 minutes of content (2 min margin)", () => {
    expect(scenes.map((s) => s.durationMin)).toEqual([2, 3, 3, 2, 5, 3]);
    expect(TOTAL_DURATION_MIN).toBe(18);
  });

  it("gives every scene a non-empty presenter goal and a projector-short headline and support line", () => {
    const words = (t: string) => t.split(/\s+/).length;
    for (const scene of scenes) {
      expect(scene.goal.length).toBeGreaterThan(0);
      expect(words(scene.title)).toBeLessThanOrEqual(10);
      expect(words(scene.support)).toBeLessThanOrEqual(25);
    }
  });

  it("never calls the recorded scene live", () => {
    expect(scenes[4]?.title).not.toMatch(/live/i);
    expect(scenes[4]?.support).toMatch(/Recorded run of apm-cli 0\.33\.0/);
  });
});
