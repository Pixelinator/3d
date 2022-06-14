import { KeyboardState } from "./KeyboardState";

export class InputManager {
  public keyboardState: KeyboardState;
  public forward: boolean;
  public backward: boolean;
  public left: boolean;
  public right: boolean;
  public space: boolean;
  public shift: boolean;

  constructor(window: any) {
    this.keyboardState = new KeyboardState();
    this.keyboardState.listenTo(window);

    // ["KeyW", "KeyA", "KeyS", "KeyD"].forEach((keyName) => {
    //   this.keyboardState.addMapping(keyName, (keyState: any) => {
    //     console.log(keyName + ": " + keyState);
    //   });
    // });

    this.keyboardState.addMapping("KeyW", (keyState: any) => {
      this.forward = keyState;
    });
    this.keyboardState.addMapping("KeyA", (keyState: any) => {
      this.left = keyState;
    });
    this.keyboardState.addMapping("KeyS", (keyState: any) => {
      this.backward = keyState;
    });
    this.keyboardState.addMapping("KeyD", (keyState: any) => {
      this.right = keyState;
    });
  }

  loadFromJSON() {}
}
