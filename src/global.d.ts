import { World } from "./World";

declare global {
  interface Window {
    world: World;
  }
}
