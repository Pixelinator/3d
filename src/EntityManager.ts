import { Entity } from "./Entity";

export class EntityManager {
  public entities: Entity[] = [];
  public entitiesMap: any;
  public ids: number;

  constructor() {
    this.entities = [];
    this.entitiesMap = {};
    this.ids = 0;
  }

  update(timeElapsed: number) {
    this.entities.forEach((e) => {
      e.update(timeElapsed);
    });
  }

  generateName() {
    this.ids += 1;
    return "__name__" + this.ids;
  }

  get(name: string): any {
    return this.entitiesMap[name];
  }

  add(entity: Entity, name: string) {
    if (!name) {
      name = this.generateName();
    }

    this.entitiesMap[name] = entity;
    this.entities.push(entity);

    entity.SetParent(this);
    entity.SetName(name);
  }
}
