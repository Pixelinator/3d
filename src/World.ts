import * as THREE from "three";
import { ResourceManager } from "./ResourceManager";
import { InputManager } from "./InputManager";
import { Entity } from "./Entity";
import { EntityManager } from "./EntityManager";
import { ThirdPersonCamera } from "./ThirdPersonCamera";
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
  private lastScenarioID: string;

  constructor() {
    this.resourceManager = new ResourceManager();
    Promise.all([
      this.resourceManager.loadResource("ybot", "/models/ybot.fbx"),
      this.resourceManager.loadResource(
        "sundial",
        "/models/Sundial_Classic_big.stl"
      ),
      this.resourceManager.loadMaterial(
        "/textures/pbr/forest-4K/4K-forest_albedo.jpg",
        "/textures/pbr/forest-4K/4K-forest_normal.jpg",
        "/textures/pbr/forest-4K/4K-forest_height.jpg",
        "/textures/pbr/forest-4K/4K-forest_ao.jpg"
      ),
      // this.resourceManager.loadMaterial(
      //   "/textures/pbr/forest-1K/1K-forest_albedo.jpg",
      //   "/textures/pbr/forest-1K/1K-forest_normal.jpg",
      //   "/textures/pbr/forest-1K/1K-forest_height.jpg",
      //   "/textures/pbr/forest-1K/1K-forest_ao.jpg"
      // ),
    ])
      .then((result) => {
        this.mat = result[2] as THREE.MeshStandardMaterial;
        console.log(this.mat);

        this.gameTime = new GameTime();
        this.clock = new THREE.Clock();
        this.entityManager = new EntityManager();
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

        const player = new Entity();
        player.position.set(0, 0, 0);
        this.entityManager.add(player, "player");
        const camera = new Entity();
        camera.addComponent(
          new ThirdPersonCamera(
            this.graphicsWorld.camera,
            this.entityManager.get("player")
          )
        );

        this.entityManager.add(camera, "player-camera");
        console.log(this.entityManager);

        document.body.appendChild(this.stats.dom);
        window.addEventListener("resize", this.resize.bind(this), false);

        this.update();
      })
      .catch(function (err) {
        console.error(err);
        console.log("Oh no, epic failure!");
      });
  }

  resize() {
    this.graphicsWorld.resize();
  }

  update() {
    const deltaTime = this.clock.getDelta();
    this.gameTime.update(deltaTime);
    this.entityManager.update(deltaTime);
    this.physicsWorld.update(deltaTime);
    this.graphicsWorld.update(deltaTime, this.gameTime);
    this.stats.update();
    requestAnimationFrame(this.update.bind(this));
  }
}
