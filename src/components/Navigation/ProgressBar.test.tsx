import { render, screen } from "@testing-library/react";
import { scenes } from "../../data/presentation";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {

  it("marks only the current scene with aria-current", () => {
    render(<ProgressBar scenes={scenes} currentIndex={2} onSelect={() => {}} />);
    const current = screen.getAllByRole("button").filter((b) => b.getAttribute("aria-current") === "step");
    expect(current).toHaveLength(1);
    expect(current[0]).toBe(screen.getAllByRole("button")[2]);
  });

});
