import { SceneView } from "../components/SceneView/SceneView";
import { StackDiagram } from "../components/StackDiagram";
import { scenes } from "../data/presentation";

const scene = scenes[2];

export function AgentStackScene() {
  if (!scene) return null;
  return (
    <SceneView scene={scene} compact>
      <StackDiagram />
    </SceneView>
  );
}
