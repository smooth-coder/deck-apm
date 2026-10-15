/** Turns per-step delays (seconds since the previous step) into absolute offsets from the start. */
export function cumulative(delays: readonly number[]): number[] {
  let total = 0;
  return delays.map((delay) => {
    total += Math.max(delay, 0);
    return total;
  });
}
