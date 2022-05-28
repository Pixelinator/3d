import { KeyboardState } from "./KeyboardState";

export class InputManager {
  public keyboardState: KeyboardState;

  constructor(window: any) {
    this.keyboardState = new KeyboardState();
    this.keyboardState.listenTo(window);

    ["KeyW", "KeyA", "KeyS", "KeyD"].forEach((keyName) => {
      this.keyboardState.addMapping(keyName, (keyState: any) => {
        console.log(keyName + ": " + keyState);
      });
    });
  }

  loadFromJSON() {}
}
