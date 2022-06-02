import * as THREE from "three";
import { Component } from "./Component";
import { EntityManager } from "./EntityManager";

export class Entity {
  public components: any;
  public position: THREE.Vector3;
  public rotation: THREE.Quaternion;
  public parent: EntityManager;
  public name: string;

  constructor() {
    this.components = {};
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Quaternion();
  }

  SetParent(p: EntityManager) {
    this.parent = p;
  }

  SetName(name: string) {
    this.name = name;
  }

  update(timeElapsed: number) {
    Object.entries(this.components).forEach(([key, value], index) => {
      this.components[key].update(timeElapsed);
    });
  }

  addComponent(comp: Component) {
    comp.SetParent(this);
    this.components[comp.constructor.name as any] = comp;

    comp.InitComponent();
  }
}
