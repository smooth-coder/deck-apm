type FullscreenDoc = Pick<
  Document,
  "fullscreenEnabled" | "fullscreenElement" | "exitFullscreen" | "documentElement"
>;

/** Toggles fullscreen. Resolves true if a toggle was issued, false if unsupported or rejected. */
export async function toggleFullscreen(doc: FullscreenDoc = document): Promise<boolean> {
  if (!doc.fullscreenEnabled) return false;
  try {
    if (doc.fullscreenElement) {
      await doc.exitFullscreen();
    } else {
      if (typeof doc.documentElement.requestFullscreen !== "function") return false;
      await doc.documentElement.requestFullscreen();
    }
    return true;
  } catch {
    return false;
  }
}
