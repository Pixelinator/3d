export class ResourceManager {
  public resources: Map<any, any>;

  constructor() {
    this.resources = new Map();
  }

  addResource(name: any, resource: any) {
    this.resources.set(name, resource);
  }
}
