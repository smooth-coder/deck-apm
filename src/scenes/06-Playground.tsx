import { AgentLab } from "../components/AgentLab";
import { SceneView } from "../components/SceneView/SceneView";
import { scenes } from "../data/presentation";

const scene = scenes[5];

export function PlaygroundScene() {
  if (!scene) return null;
  return (
    <SceneView scene={scene} compact>
      <AgentLab />
    </SceneView>
  );
}
