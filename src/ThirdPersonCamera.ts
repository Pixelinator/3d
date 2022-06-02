import * as THREE from "three";
import { Component } from "./Component";
import { Entity } from "./Entity";

export class ThirdPersonCamera extends Component {
  private target: Entity;
  private camera: THREE.Camera;
  private currentPosition: THREE.Vector3;
  private currentLookat: THREE.Vector3;

  constructor(camera: THREE.Camera, entity: Entity) {
    super();
    this.target = entity;
    this.camera = camera;
    this.currentPosition = new THREE.Vector3();
    this.currentLookat = new THREE.Vector3();
  }

  calculateIdealOffset() {
    const idealOffset = new THREE.Vector3(-0, 10, -15);
    idealOffset.applyQuaternion(this.target.rotation);
    idealOffset.add(this.target.position);
    return idealOffset;
  }

  calculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 5, 20);
    idealLookat.applyQuaternion(this.target.rotation);
    idealLookat.add(this.target.position);
    return idealLookat;
  }

  update(timeElapsed: number) {
    const idealOffset = this.calculateIdealOffset();
    const idealLookat = this.calculateIdealLookat();

    // const t = 0.05;
    // const t = 4.0 * timeElapsed;
    const t = 1.0 - Math.pow(0.01, timeElapsed);

    this.currentPosition.lerp(idealOffset, t);
    this.currentLookat.lerp(idealLookat, t);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookat);
    // super.update(timeElapsed);
  }
}
