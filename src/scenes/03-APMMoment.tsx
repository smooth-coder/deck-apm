import { ComparisonTable } from "../components/ComparisonTable";
import { SceneView } from "../components/SceneView/SceneView";
import { scenes } from "../data/presentation";

const scene = scenes[2];

export function APMMomentScene() {
  if (!scene) return null;
  return (
    <SceneView scene={scene} compact>
      <ComparisonTable />
    </SceneView>
  );
}
