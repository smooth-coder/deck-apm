import type { ComponentType } from "react";
import { HookScene } from "./01-Hook";
import { DependencyHellScene } from "./02-DependencyHell";
import { AgentStackScene } from "./03-AgentStack";
import { APMMomentScene } from "./04-APMMoment";
import { TeamRepositoryScene } from "./05-TeamRepository";
import { PlaygroundScene } from "./06-Playground";
import { SoftwareDeliveryScene } from "./07-SoftwareDelivery";

export const sceneComponents: readonly ComponentType[] = [
  HookScene,
  DependencyHellScene,
  AgentStackScene,
  APMMomentScene,
  TeamRepositoryScene,
  PlaygroundScene,
  SoftwareDeliveryScene,
];
