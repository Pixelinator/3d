import AmmoModule from "ammojs-typed";

export class RigidBody {
  public Ammo: typeof AmmoModule;
  body: any;
  transform: any;
  motionState: any;
  shape: any;
  inertia: any;
  info: any;

  constructor(lib: typeof AmmoModule) {
    this.Ammo = lib;
  }

  setRestitution(val: any) {
    this.body.setRestitution(val);
  }

  setFriction(val: any) {
    this.body.setFriction(val);
  }

  setRollingFriction(val: any) {
    this.body.setRollingFriction(val);
  }

  createBox(mass: number, pos: any, quat: any, size: any) {
    this.transform = new this.Ammo.btTransform();
    this.transform.setIdentity();
    this.transform.setOrigin(new this.Ammo.btVector3(pos.x, pos.y, pos.z));
    this.transform.setRotation(
      new this.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
    );
    this.motionState = new this.Ammo.btDefaultMotionState(this.transform);

    const btSize = new this.Ammo.btVector3(
      size.x * 0.5,
      size.y * 0.5,
      size.z * 0.5
    );
    this.shape = new this.Ammo.btBoxShape(btSize);
    this.shape.setMargin(0.05);

    this.inertia = new this.Ammo.btVector3(0, 0, 0);
    if (mass > 0) {
      this.shape.calculateLocalInertia(mass, this.inertia);
    }

    this.info = new this.Ammo.btRigidBodyConstructionInfo(
      mass,
      this.motionState,
      this.shape,
      this.inertia
    );
    this.body = new this.Ammo.btRigidBody(this.info);

    this.Ammo.destroy(btSize);
  }
}
