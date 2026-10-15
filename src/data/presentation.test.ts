import { TOTAL_DURATION_MIN } from "./presentation";

it("reserves three minutes of the 20-minute slot for questions or overrun", () => {
  expect(TOTAL_DURATION_MIN).toBe(17);
});
