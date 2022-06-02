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
import { Sky } from "./Sky";

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
  public mat: THREE.MeshStandardMaterial;

  // public cameraOperator: CameraOperator;
  // public console: InfoStack;
  // public cannonDebugRenderer: CannonDebugRenderer;
  // public characters: Character[] = [];
  // public vehicles: Vehicle[] = [];
  // public paths: Path[] = [];
  // public updatables: IUpdatable[] = [];
  private lastScenarioID: string;

  constructor() {
    this.resourceManager = new ResourceManager();
    Promise.all([
      this.resourceManager.loadResource("ybot", "/models/ybot.fbx"),
      this.resourceManager.loadResource(
        "sundial",
        "/models/Sundial_Classic_big.stl"
      ),
      this.resourceManager.loadResource(
        "forestAlbedo",
        "/textures/pbr/forest-1K/1K-forest_albedo.jpg"
      ),
      this.resourceManager.loadResource(
        "forestAO",
        "/textures/pbr/forest-1K/1K-forest_ao.jpg"
      ),
      this.resourceManager.loadResource(
        "forestHeight",
        "/textures/pbr/forest-1K/1K-forest_height.jpg"
      ),
      this.resourceManager.loadResource(
        "forestNormal",
        "/textures/pbr/forest-1K/1K-forest_normal.jpg"
      ),
    ])
      .then(() => {
        console.log(this);

        this.gameTime = new GameTime();
        this.clock = new THREE.Clock();
        this.inputManager = new InputManager(window);
        this.graphicsWorld = new GraphicsWorld(this);
        this.graphicsWorld.sky = new Sky(this);
        this.physicsWorld = new PhysicsWorld(this);
        this.stats = Stats();
        this.gui = new GUI();
        const timeFolder = this.gui.addFolder("Time");
        timeFolder.add(this.gameTime, "gameTimeHour", 0, 24).listen();
        timeFolder.add(this.gameTime, "gameTimeMinute", 0, 59).listen();
        timeFolder.add(this.gameTime, "gameTimeSecond", 0, 59).listen();
        timeFolder.open();
        const skyFolder = this.gui.addFolder("Sky");
        skyFolder.add(this.graphicsWorld.sky, "_phi", 0, 360).listen();
        skyFolder.add(this.graphicsWorld.sky, "_theta", 0, 360).listen();
        skyFolder.open();
        document.body.appendChild(this.stats.dom);
        window.addEventListener("resize", this.resize.bind(this), false);

        this.mat = new THREE.MeshStandardMaterial({
          map: this.resourceManager.getResource("forestAlbedo"),
          normalMap: this.resourceManager.getResource("forestNormal"),
          normalScale: new THREE.Vector2(1, 1),
          displacementMap: this.resourceManager.getResource("forestHeight"),
          displacementScale: 0.1,
          displacementBias: -0.05,
          aoMap: this.resourceManager.getResource("forestAO"),
          aoMapIntensity: 1,
        });

        this.update();
      })
      .catch(function () {
        console.log("Oh no, epic failure!");
      });
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
