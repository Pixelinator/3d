import * as THREE from "three";
import { World } from "./World";
import AmmoModule from "ammojs-typed";
import { RigidBody } from "./RigidBody";

export class PhysicsWorld {
  public parent: World;
  public physicsWorld: any;
  public Ammo: typeof AmmoModule;
  public rigidBodyList: any;
  public tmpTransformation: AmmoModule.btTransform;

  constructor(world: World) {
    this.parent = world;
    this.rigidBodyList = [];
    AmmoModule().then((lib) => {
      this.Ammo = lib;
      this.init();
    });
  }

  init() {
    const collisionConfiguration =
      new this.Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    const dispatcher = new this.Ammo.btCollisionDispatcher(
      collisionConfiguration
    );
    const broadphase = new this.Ammo.btDbvtBroadphase();
    const solver = new this.Ammo.btSequentialImpulseConstraintSolver();
    const softBodySolver = new this.Ammo.btDefaultSoftBodySolver();
    this.physicsWorld = new this.Ammo.btSoftRigidDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      collisionConfiguration,
      softBodySolver
    );
    this.physicsWorld.setGravity(new this.Ammo.btVector3(0, -9.81, 0));
    this.physicsWorld
      .getWorldInfo()
      .set_m_gravity(new this.Ammo.btVector3(0, -9.81, 0));

    this.tmpTransformation = new this.Ammo.btTransform();
    // const softBodyHelpers = new this.Ammo.btSoftBodyHelpers();

    // temp code
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(100, 1, 100, 200, 200),
      this.parent.mat
      // new THREE.MeshStandardMaterial({ color: 0x404040 })
    );
    ground.material.map.wrapS = THREE.RepeatWrapping;
    ground.material.map.wrapT = THREE.RepeatWrapping;
    ground.material.map.repeat.set(20, 20);
    ground.castShadow = false;
    ground.receiveShadow = true;
    ground.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(ground.geometry.attributes.uv.array, 2)
    );
    this.parent.graphicsWorld.graphicsWorld.add(ground);

    const rbGround = new RigidBody(this.Ammo);
    rbGround.createBox(
      0,
      ground.position,
      ground.quaternion,
      new THREE.Vector3(100, 1, 100)
    );
    rbGround.setRestitution(0.99);
    this.physicsWorld.addRigidBody(rbGround.body);

    // -----
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(4, 4, 4),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    box.position.set(1 * 10, Math.random() * 5 + 40, 1 * 10);
    box.castShadow = true;
    box.receiveShadow = true;
    this.parent.graphicsWorld.graphicsWorld.add(box);

    const rbBox = new RigidBody(this.Ammo);
    rbBox.createBox(
      1,
      box.position,
      box.quaternion,
      new THREE.Vector3(4, 4, 4)
    );
    rbBox.setRestitution(0.25);
    rbBox.setFriction(1);
    rbBox.setRollingFriction(5);
    this.physicsWorld.addRigidBody(rbBox.body);

    this.rigidBodyList.push({ mesh: box, rigidBody: rbBox });
  }

  update(timeElapsed: number) {
    if (this.physicsWorld) {
      this.physicsWorld.stepSimulation(timeElapsed, 10);
      for (let i = 0; i < this.rigidBodyList.length; i++) {
        this.rigidBodyList[i].rigidBody.motionState.getWorldTransform(
          this.tmpTransformation
        );
        const pos = this.tmpTransformation.getOrigin();
        const quat = this.tmpTransformation.getRotation();
        const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
        const quat3 = new THREE.Quaternion(
          quat.x(),
          quat.y(),
          quat.z(),
          quat.w()
        );

        this.rigidBodyList[i].mesh.position.copy(pos3);
        this.rigidBodyList[i].mesh.quaternion.copy(quat3);
      }
      this.detectCollision();
    }
  }

  detectCollision() {
    const dispatcher = this.physicsWorld.getDispatcher();
    const numManifolds = dispatcher.getNumManifolds();

    for (let i = 0; i < numManifolds; i++) {
      const contactManifold = dispatcher.getManifoldByIndexInternal(i);
      const numContacts = contactManifold.getNumContacts();

      for (let j = 0; j < numContacts; j++) {
        const contactPoint = contactManifold.getContactPoint(j);
        const distance = contactPoint.getDistance();
        if (distance > 0.0) continue;
        console.log("Collision detected!");
      }
    }
  }
}
