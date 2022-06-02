import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

export class ResourceManager {
  private resources: Map<string, any>;
  public loadingManager: THREE.LoadingManager;

  constructor() {
    this.resources = new Map();
    this.loadingManager = new THREE.LoadingManager();
  }

  loadResource(name: string, url: string) {
    if (url.endsWith(".fbx")) {
      const loader = new FBXLoader();
      const p = new Promise((resolve) => {
        loader.load(url, resolve);
      });
      this.addResource(name, p);
      return p;
    } else if (url.endsWith(".stl")) {
      const loader = new STLLoader();
      const p = new Promise((resolve) => {
        loader.load(url, resolve);
      });
      this.addResource(name, p);
      return p;
    } else if (url.endsWith(".jpg") || url.endsWith(".png")) {
      const loader = new THREE.TextureLoader();
      const p = new Promise((resolve) => {
        loader.load(url, resolve);
      });
      this.addResource(name, p);
      return p;
    }
    return;
  }

  loadTexture(url: string) {
    return new Promise((resolve) => {
      new THREE.TextureLoader().load(url, resolve);
    });
  }

  loadMaterial(
    mapUrl: string,
    normalUrl?: string,
    displacementUrl?: string,
    aoUrl?: string
  ) {
    const textures: any = {
      map: mapUrl,
      normalMap: normalUrl,
      displacementMap: displacementUrl,
      aoMap: aoUrl,
    };

    const params: any = {
      normalScale: new THREE.Vector2(1, 1),
      displacementScale: 0.1,
      displacementBias: -0.05,
      aoMapIntensity: 1,
    };

    const promises = Object.keys(textures).map((key) => {
      return this.loadTexture(textures[key]).then((texture) => {
        params[key] = texture;
      });
    });

    return Promise.all(promises).then(() => {
      return new THREE.MeshStandardMaterial(params);
    });
  }

  addResource(name: string, resource: any) {
    this.resources.set(name, resource);
  }

  getResource(name: string) {
    if (this.resources.has(name)) {
      return this.resources.get(name);
    }
  }
}
