import { SceneView } from "../components/SceneView/SceneView";
import { scenes } from "../data/presentation";

const scene = scenes[0];

export function Scene() {
  if (!scene) return null;
  return <SceneView scene={scene} />;
}
