import { act, renderHook } from "@testing-library/react";
import { useStages } from "./useStages";

const DELAYS = [0.01, 0.01, 0.01] as const;
const SLOW = [5, 5] as const;

function mockReducedMotion(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    (query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("useStages", () => {
  it("reveals everything immediately with reduced motion", () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useStages(DELAYS));
    expect(result.current.stage).toBe(3);
    expect(result.current.done).toBe(true);
  });

  it("starts at zero and advances over time", async () => {
    mockReducedMotion(false);
    const { result } = renderHook(() => useStages(DELAYS));
    expect(result.current.stage).toBe(0);
    await vi.waitFor(() => expect(result.current.done).toBe(true));
  });

  it("skip jumps to the end and replay restarts", async () => {
    mockReducedMotion(false);
    const { result } = renderHook(() => useStages(SLOW));
    act(() => result.current.skip());
    expect(result.current.stage).toBe(2);
    act(() => result.current.replay());
    await vi.waitFor(() => expect(result.current.stage).toBe(0));
  });
});
