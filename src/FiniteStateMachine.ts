import { InputManager } from "./InputManager";

export class FiniteStateMachine {
  private states: Record<string, typeof State>;
  private currentState: State;

  constructor() {
    this.states = {};
    this.currentState = null;
  }

  addState(name: string, type: any) {
    this.states[name] = type;
  }

  setState(name: string) {
    const prevState = this.currentState;

    if (prevState) {
      if (prevState.Name === name) {
        return;
      }
      prevState.exit();
    }

    const state = new this.states[name](this);

    this.currentState = state;
    state.enter(prevState);
  }

  update(timeElapsed: number, input: InputManager) {
    if (this.currentState) {
      this.currentState.update(timeElapsed, input);
    }
  }
}

class State {
  private parent: FiniteStateMachine;

  constructor(parent: FiniteStateMachine) {
    this.parent = parent;
  }

  get Name(): string {
    return "";
  }

  enter(previous?: State) {}
  exit() {}
  update(timeElapsed?: number, input?: InputManager) {}
}

class IdleState extends State {
  constructor(parent: FiniteStateMachine) {
    super(parent);
  }

  get Name(): string {
    return "idle";
  }
}

class WalkState extends State {
  constructor(parent: FiniteStateMachine) {
    super(parent);
  }

  get Name(): string {
    return "walk";
  }
}
