import { Component } from "./Component";
import * as THREE from "three";

export class AudioListenerComponent extends Component {
  public listener: THREE.AudioListener;
  public camera: THREE.Camera;

  constructor(camera: THREE.Camera) {
    super();
    this.listener = new THREE.AudioListener();
    this.camera = camera;
    this.camera.add(this.listener);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update(timeElapsed: number): void {}
}
