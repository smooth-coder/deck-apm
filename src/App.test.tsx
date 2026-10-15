import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.location.hash = "";
});

describe("App", () => {
  it("renders the first scene by default", () => {
    render(<App />);
    const navigation = screen.getByRole("navigation");
    expect(navigation.querySelector('[aria-current="step"]')).toBe(navigation.querySelectorAll("button")[0]);
  });

  it("deep-links to a scene from the hash", () => {
    window.location.hash = "#/scene/5";
    render(<App />);
    const navigation = screen.getByRole("navigation");
    expect(navigation.querySelector('[aria-current="step"]')).toBe(navigation.querySelectorAll("button")[4]);
  });

  it("navigates with the keyboard", () => {
    render(<App />);
    act(() => {
      fireEvent.keyDown(window, { key: "ArrowRight" });
    });
    const navigation = screen.getByRole("navigation");
    expect(navigation.querySelector('[aria-current="step"]')).toBe(navigation.querySelectorAll("button")[1]);
  });
});
