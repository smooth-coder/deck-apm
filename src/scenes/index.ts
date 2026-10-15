import type { ComponentType } from "react";
import { HookScene } from "./01-Hook";
import { DependencyHellScene } from "./02-DependencyHell";
import { APMMomentScene } from "./03-APMMoment";
import { TeamRepositoryScene } from "./04-TeamRepository";
import { PlaygroundScene } from "./05-Playground";
import { SoftwareDeliveryScene } from "./06-SoftwareDelivery";

export const sceneComponents: readonly ComponentType[] = [
  HookScene,
  DependencyHellScene,
  APMMomentScene,
  TeamRepositoryScene,
  PlaygroundScene,
  SoftwareDeliveryScene,
];
