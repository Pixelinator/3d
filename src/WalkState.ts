import { State } from "./State";
import { FiniteStateMachine } from "./FiniteStateMachine";

export default class WalkState extends State {
  constructor(parent: FiniteStateMachine) {
    super(parent);
  }

  get Name(): string {
    return "walking";
  }

  enter(prevState?: any) {
    const curAction = this.parent.target.animations["walking"].action;
    if (prevState) {
      const prevAction = this.parent.target.animations[prevState.Name].action;

      curAction.enabled = true;

      if (prevState.Name == "run") {
        const ratio =
          curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.1, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  exit() {}

  update(timeElapsed?: number, input?: any) {
    if (input.forward || input.backward) {
      if (input.shift) {
        this.parent.setState("run");
      }
      return;
    }

    this.parent.setState("idle");
  }
}
