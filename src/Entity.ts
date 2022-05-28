import { Component } from "./Component";

export class Entity {
  public components: Component[] = [];

  constructor() {
    this.components = [];
  }

  update() {
    this.components.forEach((c) => {
      c.update();
    });
  }
}
