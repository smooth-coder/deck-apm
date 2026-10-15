import type { ComponentType } from "react";
import { CoverScene } from "./01-Cover";
import { HookScene } from "./02-Hook";
import { DependencyHellScene } from "./03-DependencyHell";
import { APMMomentScene } from "./04-APMMoment";
import { TeamRepositoryScene } from "./05-TeamRepository";
import { PlaygroundScene } from "./06-Playground";
import { SoftwareDeliveryScene } from "./07-SoftwareDelivery";

export const sceneComponents: readonly ComponentType[] = [
  CoverScene,
  HookScene,
  DependencyHellScene,
  APMMomentScene,
  TeamRepositoryScene,
  PlaygroundScene,
  SoftwareDeliveryScene,
];
