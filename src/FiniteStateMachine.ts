import { InputManager } from "./InputManager";
import { State } from "./State";

export class FiniteStateMachine {
  private states: Record<string, typeof State>;
  private currentState: State;
  public target: any;

  constructor(target?: any) {
    this.target = target;
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
