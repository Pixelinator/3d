import { Entity } from "./Entity";

export class EntityManager {
  public entities: Entity[] = [];

  constructor() {
    this.entities = [];
  }

  update() {
    this.entities.forEach((e) => {
      e.update();
    });
  }
}
