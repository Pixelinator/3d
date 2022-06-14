import { InputManager } from "./InputManager";
import { FiniteStateMachine } from "./FiniteStateMachine";

export class State {
  public parent: FiniteStateMachine;

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
