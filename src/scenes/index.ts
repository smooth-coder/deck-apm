import type { ComponentType } from "react";
import { HookScene } from "./01-Hook";
import { DependencyHellScene } from "./02-DependencyHell";
import { AgentStackScene } from "./03-AgentStack";
import { APMMomentScene } from "./04-APMMoment";
import { PlaygroundScene } from "./05-Playground";
import { SoftwareDeliveryScene } from "./06-SoftwareDelivery";

export const sceneComponents: readonly ComponentType[] = [
  HookScene,
  DependencyHellScene,
  AgentStackScene,
  APMMomentScene,
  PlaygroundScene,
  SoftwareDeliveryScene,
];
