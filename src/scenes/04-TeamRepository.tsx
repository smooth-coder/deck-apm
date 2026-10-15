import { ProducerLab } from "../components/AgentLab/ProducerLab";
import { SceneView } from "../components/SceneView/SceneView";
import { scenes } from "../data/presentation";

const scene = scenes[3];

export function TeamRepositoryScene() {
  if (!scene) return null;
  return (
    <SceneView scene={scene} compact>
      <ProducerLab />
    </SceneView>
  );
}
