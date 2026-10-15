import { DeveloperComparison } from "../components/DeveloperComparison";
import { SceneView } from "../components/SceneView/SceneView";
import { scenes } from "../data/presentation";

const scene = scenes[2];

export function DependencyHellScene() {
  if (!scene) return null;
  return (
    <SceneView scene={scene} compact>
      <DeveloperComparison />
    </SceneView>
  );
}
