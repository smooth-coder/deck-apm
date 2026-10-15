import { TALK_SUBTITLE, TALK_TITLE } from "../data/presentation";

export function CoverScene() {
  return (
    <section className="scene cover" aria-labelledby="scene-title-1">
      <h1 id="scene-title-1" className="cover__title">
        {TALK_TITLE}
      </h1>
      <p className="cover__subtitle">{TALK_SUBTITLE}</p>
    </section>
  );
}
