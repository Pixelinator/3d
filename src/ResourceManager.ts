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

  addResource(name: string, resource: any) {
    this.resources.set(name, resource);
  }

  getResource(name: string) {
    if (this.resources.has(name)) {
      return this.resources.get(name);
    }
  }
}
