import { TOTAL_DURATION_MIN, scenes } from "./presentation";
import { developers, sharedTask, teamCosts } from "./agentConfigs";
import { hookLines, missingPieces } from "./hook";
import { analogyRows } from "./apm";
import { CLOSING_QUOTE, TAKEAWAY_TITLE, takeawaySteps, solves, doesNotSolve } from "./delivery";

it("reserves seven minutes of the 20-minute slot for questions or overrun", () => {
  expect(scenes).toHaveLength(6);
  expect(TOTAL_DURATION_MIN).toBe(13);
  expect(scenes.at(-1)?.durationMin).toBe(2);
});

it("keeps the on-screen narrative free of the PAY-142 ticket thread", () => {
  const onScreen = JSON.stringify({
    scenes: scenes.map(({ title, support }) => ({ title, support })),
    developers,
    sharedTask,
    teamCosts,
    hookLines,
    missingPieces,
    analogyRows,
  });
  expect(onScreen).not.toMatch(/PAY-142|ticket/i);
});

it("narrates scenes 4 and 5 in Spanish, keeping the CLI demo in English", () => {
  expect(scenes[3]?.lang).toBeUndefined();
  expect(scenes[4]?.lang).toBeUndefined();
});

it("keeps scene 3 to the promise: no lockfile or CI rows", () => {
  expect(analogyRows.map((r) => r.id)).toEqual(["manifest", "install"]);
});

it("closes by separating what APM solves from what it does not", () => {
  expect(solves.length).toBeGreaterThan(0);
  expect(doesNotSolve.length).toBeGreaterThan(0);
  expect(CLOSING_QUOTE).toBe("El próximo dev clona el repo y su agente ya trabaja como el equipo.");
  expect(TAKEAWAY_TITLE).toBe("Cómo empezar");
  expect(takeawaySteps[1]?.note).toBe("crea apm.yml; después declara el repositorio y la versión del equipo");
});
