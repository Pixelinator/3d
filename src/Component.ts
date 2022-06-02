import { Entity } from "./Entity";
export class Component {
  public parent: any;

  constructor() {
    this.parent = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update(timeElapsed: number) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  InitComponent() {}

  SetParent(p: Entity) {
    this.parent = p;
  }
}
