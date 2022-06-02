import * as THREE from "three";
import { World } from "./World";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { Sky } from "./Sky";
import { GameTime } from "./GameTime";
import CharacterSystem from "./CharacterSystem";
// import Nebula, { SpriteRenderer } from "three-nebula";
import json from "./particle-system.json";

export class GraphicsWorld {
  public parent: World;
  public graphicsWorld: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public composer: EffectComposer;
  public sky: Sky;
  public controls: any;
  public nebula: any;
  public characterSys: CharacterSystem;
  public character: THREE.Mesh;
  public characterHelper: THREE.SkeletonHelper;

  private fxaaPass: ShaderPass;

  constructor(world: World) {
    this.parent = world;
    this.graphicsWorld = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.camera = new THREE.PerspectiveCamera(
      45,
      innerWidth / innerHeight,
      0.1,
      35000
    );
    const renderPass = new RenderPass(this.graphicsWorld, this.camera);
    this.fxaaPass = new ShaderPass(FXAAShader);

    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaaPass.material["uniforms"].resolution.value.x =
      1 / (window.innerWidth * pixelRatio);
    this.fxaaPass.material["uniforms"].resolution.value.y =
      1 / (window.innerHeight * pixelRatio);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.fxaaPass);

    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = "canvas";

    // This should be inside a scenario
    // Nebula.fromJSONAsync(json, THREE).then((loaded: any) => {
    //   console.log(loaded);
    //   const nebulaRenderer = new SpriteRenderer(this.graphicsWorld, THREE);
    //   this.nebula = loaded.addRenderer(nebulaRenderer);
    // });
    this.characterSys = new CharacterSystem(this.parent.inputManager);

    this.parent.resourceManager.getResource("ybot").then((result: any) => {
      result.scale.setScalar(0.04);
      result.traverse((c: any) => {
        c.castShadow = true;
        c.receiveShadow = true;
      });
      this.character = result;
      this.character.position.set(-10, 1, 0);
      this.graphicsWorld.add(this.character);
      this.characterHelper = new THREE.SkeletonHelper(this.character);
      this.graphicsWorld.add(this.characterHelper);
    });

    this.parent.resourceManager.getResource("sundial").then((result: any) => {
      const mesh = new THREE.Mesh(
        result,
        new THREE.MeshStandardMaterial({ color: 0x222222 })
      );
      mesh.rotateX(-Math.PI / 2);
      mesh.position.set(0, 1, 0);
      mesh.scale.setScalar(0.05);
      mesh.traverse((c: any) => {
        c.castShadow = true;
        c.receiveShadow = true;
      });
      this.graphicsWorld.add(mesh);
    });
  }

  update(deltaTime: number, gameTime: GameTime) {
    // this.nebula.update();
    this.sky.update(deltaTime, gameTime);
    this.render();
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaaPass.material["uniforms"].resolution.value.x =
      1 / (window.innerWidth * pixelRatio);
    this.fxaaPass.material["uniforms"].resolution.value.y =
      1 / (window.innerHeight * pixelRatio);
  }

  render() {
    this.composer.render();
  }
}
