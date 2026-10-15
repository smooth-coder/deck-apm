import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { scenes } from "../../data/presentation";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders one labelled button per scene", () => {
    render(<ProgressBar scenes={scenes} currentIndex={0} onSelect={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(6);
    expect(
      screen.getByRole("button", { name: "Scene 5 of 6: One command rebuilds the agent's environment." }),
    ).toBeInTheDocument();
  });

  it("marks only the current scene with aria-current", () => {
    render(<ProgressBar scenes={scenes} currentIndex={2} onSelect={() => {}} />);
    const current = screen.getAllByRole("button").filter((b) => b.getAttribute("aria-current") === "step");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName(/Scene 3 of 6/);
  });

  it("calls onSelect with the clicked index", async () => {
    const onSelect = vi.fn();
    render(<ProgressBar scenes={scenes} currentIndex={0} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: /Scene 4 of 6/ }));
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  it("is exposed as a navigation landmark", () => {
    render(<ProgressBar scenes={scenes} currentIndex={0} onSelect={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Talk progress" })).toBeInTheDocument();
  });
});
