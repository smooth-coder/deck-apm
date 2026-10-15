import { toggleFullscreen } from "./fullscreen";

type FakeDoc = Pick<
  Document,
  "fullscreenEnabled" | "fullscreenElement" | "exitFullscreen" | "documentElement"
>;

function makeDoc(overrides: Partial<Record<keyof FakeDoc, unknown>> = {}): FakeDoc {
  return {
    fullscreenEnabled: true,
    fullscreenElement: null,
    exitFullscreen: vi.fn().mockResolvedValue(undefined),
    documentElement: { requestFullscreen: vi.fn().mockResolvedValue(undefined) },
    ...overrides,
  } as unknown as FakeDoc;
}

describe("toggleFullscreen", () => {
  it("returns false when the API is unavailable", async () => {
    const doc = makeDoc({ fullscreenEnabled: false });
    await expect(toggleFullscreen(doc)).resolves.toBe(false);
    expect(doc.documentElement.requestFullscreen).not.toHaveBeenCalled();
  });

  it("requests fullscreen when not active", async () => {
    const doc = makeDoc();
    await expect(toggleFullscreen(doc)).resolves.toBe(true);
    expect(doc.documentElement.requestFullscreen).toHaveBeenCalledOnce();
  });

  it("exits fullscreen when active", async () => {
    const doc = makeDoc({ fullscreenElement: {} });
    await expect(toggleFullscreen(doc)).resolves.toBe(true);
    expect(doc.exitFullscreen).toHaveBeenCalledOnce();
  });

  it("swallows rejections and returns false", async () => {
    const doc = makeDoc({
      documentElement: { requestFullscreen: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    await expect(toggleFullscreen(doc)).resolves.toBe(false);
  });

  it("handles a missing requestFullscreen method", async () => {
    const doc = makeDoc({ documentElement: {} });
    await expect(toggleFullscreen(doc)).resolves.toBe(false);
  });
});
