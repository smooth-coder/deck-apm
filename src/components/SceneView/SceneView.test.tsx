import { render, screen } from "@testing-library/react";
import { SceneView } from "./SceneView";

it("renders the headline and supporting line but never presenter notes", () => {
  render(<SceneView scene={{ id: 2, title: "T", support: "S", goal: "Presenter note", durationMin: 3 }} />);
  expect(screen.getByRole("heading", { level: 1, name: "T" })).toBeInTheDocument();
  expect(screen.getByText("S")).toBeInTheDocument();
  expect(screen.queryByText("Presenter note")).not.toBeInTheDocument();
  expect(screen.queryByText("Scene 2")).not.toBeInTheDocument();
  expect(screen.queryByText("3 min")).not.toBeInTheDocument();
});
