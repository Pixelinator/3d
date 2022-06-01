import * as THREE from "three";
import { ResourceManager } from "./ResourceManager";
import { InputManager } from "./InputManager";
import { EntityManager } from "./EntityManager";
import { ScenarioManager } from "./ScenarioManager";
import { PhysicsWorld } from "./PhysicsWorld";
import { GraphicsWorld } from "./GraphicsWorld";
import Stats from "three/examples/jsm/libs/stats.module";
import { GameTime } from "./GameTime";
import { GUI } from "dat.gui";

export class World {
  public graphicsWorld: GraphicsWorld;
  public physicsWorld: PhysicsWorld;
  public scenarioManager: ScenarioManager;
  public entityManager: EntityManager;
  public inputManager: InputManager;
  public resourceManager: ResourceManager;
  public stats: Stats;
  public gui: GUI;
  public clock: THREE.Clock;
  public gameTime: GameTime;
  public renderDelta: number;
  public logicDelta: number;
  public requestDelta: number;
  public sinceLastFrame: number;
  public justRendered: boolean;
  public timeScaleTarget = 1;

  // public cameraOperator: CameraOperator;
  // public console: InfoStack;
  // public cannonDebugRenderer: CannonDebugRenderer;
  // public characters: Character[] = [];
  // public vehicles: Vehicle[] = [];
  // public paths: Path[] = [];
  // public updatables: IUpdatable[] = [];
  private lastScenarioID: string;

  constructor() {
    this.inputManager = new InputManager(window);
    this.resourceManager = new ResourceManager();
    this.resourceManager.loadResource("ybot", "/models/ybot.fbx");
    this.gameTime = new GameTime();
    this.clock = new THREE.Clock();
    this.graphicsWorld = new GraphicsWorld(this);
    this.physicsWorld = new PhysicsWorld(this);
    this.stats = Stats();
    this.gui = new GUI();
    const timeFolder = this.gui.addFolder("Time");
    timeFolder.add(this.gameTime, "gameTimeHour", 0, 24).listen();
    timeFolder.add(this.gameTime, "gameTimeMinute", 0, 59).listen();
    timeFolder.add(this.gameTime, "gameTimeSecond", 0, 59).listen();
    timeFolder.open();
    document.body.appendChild(this.stats.dom);
    window.addEventListener("resize", this.resize.bind(this), false);
  }

  resize() {
    this.graphicsWorld.resize();
  }

  update() {
    let deltaTime = this.clock.getDelta();
    this.gameTime.update(deltaTime);
    this.physicsWorld.update(deltaTime);
    this.graphicsWorld.update(this.gameTime);
    this.stats.update();
    requestAnimationFrame(this.update.bind(this));
  }
}
