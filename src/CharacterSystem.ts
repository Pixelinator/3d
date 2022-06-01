import * as THREE from "three";
import { FiniteStateMachine } from "./FiniteStateMachine";
import { InputManager } from "./InputManager";
import { System } from "./System";

export default class CharacterSystem extends System {
  private camera: THREE.Camera;
  private scene: THREE.Scene;
  private decceleration: THREE.Vector3;
  private acceleration: THREE.Vector3;
  private velocity: THREE.Vector3;
  private input: InputManager;
  private stateMachine: FiniteStateMachine;
  private animations: [];
  private mixer: THREE.AnimationMixer;

  constructor(inputManager: InputManager) {
    super();
    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this.acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.input = inputManager;

    this.stateMachine = new FiniteStateMachine();
  }
}
