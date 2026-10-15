import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.location.hash = "";
});

describe("App", () => {
  it("renders the first scene by default", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "Your code is reproducible. Your agents aren't." })).toBeInTheDocument();
  });

  it("deep-links to a scene from the hash", () => {
    window.location.hash = "#/scene/5";
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "One command rebuilds the agent's environment." })).toBeInTheDocument();
  });

  it("navigates with the keyboard", () => {
    render(<App />);
    act(() => {
      fireEvent.keyDown(window, { key: "ArrowRight" });
    });
    expect(screen.getByRole("heading", { level: 1, name: "Same repo. Same task. Four different pull requests." })).toBeInTheDocument();
  });
});
