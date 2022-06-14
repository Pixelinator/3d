import * as THREE from "three";
import { FiniteStateMachine } from "./FiniteStateMachine";
import { InputManager } from "./InputManager";
import { Component } from "./Component";
import IdleState from "./IdleState";
import WalkState from "./WalkState";
import { Entity } from "./Entity";

export default class CharacterSystem extends Component {
  private camera: THREE.Camera;
  private scene: THREE.Scene;
  private decceleration: THREE.Vector3;
  private acceleration: THREE.Vector3;
  private velocity: THREE.Vector3;
  private input: InputManager;
  private stateMachine: FiniteStateMachine;
  private animations: any;
  private mixer: THREE.AnimationMixer;
  private target: any;
  private bones: any;

  constructor(inputManager: InputManager) {
    super();
    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this.acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.input = inputManager;

    this.stateMachine = new FiniteStateMachine(this);
    this.stateMachine.addState("idle", IdleState);
    this.stateMachine.addState("walk", WalkState);
    this.animations = {};
    this.bones = {};

    this.init();
  }

  update(timeElapsed: number) {
    super.update(timeElapsed);
    this.stateMachine.update(timeElapsed, this.input);
    if (this.mixer) {
      this.mixer.update(timeElapsed);
    }
    this.headTrack();
  }

  headTrack(target?: Entity) {
    const { mixamorigHead } = this.bones;
  }

  init() {
    const scene = window.world.graphicsWorld.graphicsWorld;
    window.world.resourceManager.getResource("ybot").then((result: any) => {
      result.scale.setScalar(0.04);
      result.traverse((c: any) => {
        c.castShadow = true;
        c.receiveShadow = true;
      });
      this.target = result;
      for (const b of this.target.children[1].skeleton.bones) {
        this.bones[b.name] = b;
      }
      this.mixer = new THREE.AnimationMixer(this.target);
      scene.add(this.target);

      const { mixamorigHead } = this.bones;
      const dir = new THREE.Vector3(1, 2, 0);

      //normalize the direction vector (convert to vector of length 1)
      dir.normalize();

      const origin = new THREE.Vector3(0, 0, 0);
      const length = 1;
      const hex = 0xffff00;

      const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
      scene.add(arrowHelper);
    });

    window.world.resourceManager.getResource("walking").then((result: any) => {
      this.animations["walking"] = {
        clip: result.animations[0],
        action: this.mixer.clipAction(result.animations[0]),
      };
    });

    window.world.resourceManager
      .getResource("idle")
      .then((result: any) => {
        this.animations["idle"] = {
          clip: result.animations[0],
          action: this.mixer.clipAction(result.animations[0]),
        };
      })
      .then(() => {
        this.stateMachine.setState("idle");
      });
  }
}
