export enum ControlStateEvent {
  UpPressed,
  UpReleased,
  DownPressed,
  DownReleased,
  LeftPressed,
  LeftReleased,
  RightPressed,
  RightReleased,
  ControlPressed,
  ControlReleased,
  Action1Pressed,
  Action1Released,
  Action2Pressed,
  Action2Released,
}

export enum ControlStateDef {
  Up,
  Down,
  Left,
  Right,
  Control,
  Action1,
  Action2,
}

export interface ControlStateProps {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  control: boolean;
  action1: boolean;
  action2: boolean;
}

export class ControlState implements ControlStateProps {
  public up = false;
  public down = false;
  public left = false;
  public right = false;
  public control = false;
  public action1 = false;
  public action2 = false;

  public sequence: ControlStateDef[] = [];

  public update(event: ControlStateEvent): void {
    switch (event) {
      case ControlStateEvent.UpPressed:
        this.up = true;
        this.isPressed(ControlStateDef.Up);
        break;
      case ControlStateEvent.UpReleased:
        this.up = false;
        this.isReleased(ControlStateDef.Up);
        break;

      case ControlStateEvent.DownPressed:
        this.down = true;
        this.isPressed(ControlStateDef.Down);
        break;
      case ControlStateEvent.DownReleased:
        this.down = false;
        this.isReleased(ControlStateDef.Down);
        break;

      case ControlStateEvent.LeftPressed:
        this.left = true;
        this.isPressed(ControlStateDef.Left);
        break;
      case ControlStateEvent.LeftReleased:
        this.left = false;
        this.isReleased(ControlStateDef.Left);
        break;

      case ControlStateEvent.RightPressed:
        this.right = true;
        this.isPressed(ControlStateDef.Right);
        break;
      case ControlStateEvent.RightReleased:
        this.right = false;
        this.isReleased(ControlStateDef.Right);
        break;

      case ControlStateEvent.ControlPressed:
        this.control = true;
        this.isPressed(ControlStateDef.Control);
        break;
      case ControlStateEvent.ControlReleased:
        this.control = false;
        this.isReleased(ControlStateDef.Control);
        break;

      case ControlStateEvent.Action1Pressed:
        this.action1 = true;
        this.isPressed(ControlStateDef.Action1);
        break;
      case ControlStateEvent.Action1Released:
        this.action1 = false;
        this.isReleased(ControlStateDef.Action1);
        break;

      case ControlStateEvent.Action2Pressed:
        this.action2 = true;
        this.isPressed(ControlStateDef.Action2);
        break;
      case ControlStateEvent.Action2Released:
        this.action2 = false;
        this.isReleased(ControlStateDef.Action2);
        break;
    }
  }

  private isPressed(def: ControlStateDef): void {
    const index = this.sequence.indexOf(def);
    if (index === -1) {
      this.sequence.unshift(def);
    }
  }

  private isReleased(def: ControlStateDef): void {
    this.sequence = this.sequence.filter(s => s !== def);
  }
}
