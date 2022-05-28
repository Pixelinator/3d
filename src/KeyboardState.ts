export class KeyboardState {
  keyStates: Map<any, any>;
  keyMap: Map<any, any>;

  constructor() {
    this.keyStates = new Map();
    this.keyMap = new Map();
  }

  addMapping(code: any, callback: any) {
    this.keyMap.set(code, callback);
  }

  handleEvent(event: KeyboardEvent) {
    const { code } = event;
    if (!this.keyMap.has(code)) {
      return;
    }
    event.preventDefault();
    const keyState = event.type === "keydown" ? 1 : 0;
    if (this.keyStates.get(code) === keyState) {
      return;
    }
    this.keyStates.set(code, keyState);
    this.keyMap.get(code)(keyState);
  }

  listenTo(window: any) {
    ["keydown", "keyup"].forEach((eventName: string) => {
      window.addEventListener(eventName, (event: KeyboardEvent) => {
        this.handleEvent(event);
      });
    });
  }
}
