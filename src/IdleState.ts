import { State } from "./State";
import { FiniteStateMachine } from "./FiniteStateMachine";

export default class IdleState extends State {
  constructor(parent: FiniteStateMachine) {
    super(parent);
  }

  enter(prevState?: any) {
    const idleAction = this.parent.target.animations["idle"].action;
    if (prevState) {
      const prevAction = this.parent.target.animations[prevState.Name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.25, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  exit() {}

  update(_?: any, input?: any) {
    if (input.forward || input.backward) {
      this.parent.setState("walk");
    } else if (input.space) {
      this.parent.setState("attack");
    }
  }

  get Name(): string {
    return "idle";
  }
}
