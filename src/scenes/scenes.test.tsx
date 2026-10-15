import { render, screen } from "@testing-library/react";
import { scenes } from "../data/presentation";
import { sceneComponents } from "./index";

describe("scene placeholders", () => {
  it("has one component per scene", () => {
    expect(sceneComponents).toHaveLength(scenes.length);
  });

  it.each(scenes.map((s, i) => [s.title, s, i] as const))(
    "%s shows title and supporting line, not presenter metadata",
    (_title, scene, i) => {
      const Component = sceneComponents[i];
      if (!Component) throw new Error("missing component");
      render(<Component />);
      expect(screen.getByRole("heading", { level: 1, name: scene.title })).toBeInTheDocument();
      expect(screen.getByText(scene.support)).toBeInTheDocument();
      expect(screen.queryByText(scene.goal)).not.toBeInTheDocument();
      expect(screen.queryByText(`Scene ${scene.id}`)).not.toBeInTheDocument();
      expect(screen.queryByText(`${scene.durationMin} min`)).not.toBeInTheDocument();
    },
  );
});
