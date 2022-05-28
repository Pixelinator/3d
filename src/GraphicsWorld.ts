import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "./Sky";
import { GameTime } from "./GameTime";
// import Nebula, { SpriteRenderer } from "three-nebula";
import json from "./particle-system.json";

export class GraphicsWorld {
  public graphicsWorld: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public composer: EffectComposer;
  public cube: THREE.Mesh;
  public sky: Sky;
  public controls: any;
  public nebula: any;

  constructor() {
    this.graphicsWorld = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.camera = new THREE.PerspectiveCamera(
      45,
      innerWidth / innerHeight,
      0.1,
      1000
    );
    let renderPass = new RenderPass(this.graphicsWorld, this.camera);
    let fxaaPass = new ShaderPass(FXAAShader);

    let pixelRatio = this.renderer.getPixelRatio();
    fxaaPass.material["uniforms"].resolution.value.x =
      1 / (window.innerWidth * pixelRatio);
    fxaaPass.material["uniforms"].resolution.value.y =
      1 / (window.innerHeight * pixelRatio);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(fxaaPass);

    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = "canvas";

    // This should be inside a scenario
    const geometry = new THREE.CapsuleGeometry(1, 1, 4, 8);
    const material = new THREE.MeshPhysicalMaterial({ color: 0x777777 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.graphicsWorld.add(this.cube);

    const planeGeo = new THREE.PlaneBufferGeometry(40, 40);
    const planeMat = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });
    planeMat.color.setRGB(1.2, 1.2, 1.2);
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -0.5;
    mesh.position.y = -2.5;
    this.graphicsWorld.add(mesh);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.z = 15;
    this.controls.update();
    // this.init();
    // Nebula.fromJSONAsync(json, THREE).then((loaded: any) => {
    //   console.log(loaded);
    //   const nebulaRenderer = new SpriteRenderer(this.graphicsWorld, THREE);
    //   this.nebula = loaded.addRenderer(nebulaRenderer);
    // });
  }

  init() {
    // this.sky = new Sky(world);
  }

  update(gameTime: GameTime) {
    this.controls.update();
    this.cube.rotation.x += 0.001;
    this.cube.rotation.y += 0.002;
    // this.nebula.update();
    this.sky.update(gameTime);
    this.render();
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.composer.render();
  }
}
