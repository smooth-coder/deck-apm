import { useRef } from "react";
import { ProgressBar } from "./components/Navigation";
import { scenes } from "./data/presentation";
import { useDeckScale } from "./hooks/useDeckScale";
import { useSceneNavigation } from "./hooks/useSceneNavigation";
import { sceneComponents } from "./scenes";

export default function App() {
  const { index, goTo } = useSceneNavigation(scenes.length);
  const Scene = sceneComponents[index];
  const appRef = useRef<HTMLDivElement>(null);
  useDeckScale(appRef);

  return (
    <div ref={appRef} className="app">
      <main className="app__stage">
        {/* key remounts the scene so the fade-in animation replays */}
        <div key={index} className="fade-in">
          {Scene ? <Scene /> : null}
        </div>
      </main>
      <ProgressBar scenes={scenes} currentIndex={index} onSelect={goTo} />
    </div>
  );
}
