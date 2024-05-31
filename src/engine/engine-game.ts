import { DrawContext } from './draw-context.js';
import { FrameRateIterator } from './utils/frame-rate-iterator.js';
import { Scene } from './scene/scene.js';
import { ControlState } from './control-state.js';

const TARGET_FPS = 60;

export class EngineGame {
  private controlState: ControlState;
  private frameRateIterator: FrameRateIterator;

  public constructor(private scene: Scene) {
    this.controlState = {
      up: false,
      down: false,
      left: false,
      right: false,
      control: false,
      action1: false,
      action2: false,
    };
    this.frameRateIterator = new FrameRateIterator({ targetFps: TARGET_FPS });
  }

  public nextFrame(drawContext: DrawContext, deltaTime: number): void {
    this.scene.processInputs(deltaTime, this.controlState);
    this.scene.update(deltaTime);

    this.frameRateIterator.shouldRender(deltaTime).then(shouldRender => {
      if (shouldRender) {
        this.render(drawContext);
      }
    });
  }

  public updateControlState(state: Partial<ControlState>): void {
    this.controlState.up = state.up ?? this.controlState.up;
    this.controlState.down = state.down ?? this.controlState.down;
    this.controlState.left = state.left ?? this.controlState.left;
    this.controlState.right = state.right ?? this.controlState.right;
    this.controlState.control = state.control ?? this.controlState.control;
    this.controlState.action1 = state.action1 ?? this.controlState.action1;
    this.controlState.action2 = state.action2 ?? this.controlState.action2;
  }

  private render(drawContext: DrawContext): void {
    try {
      this.scene.render(drawContext);
      const fpsString = `FPS: ${this.frameRateIterator.fps}`;
      drawContext.writeText(fpsString, 5, 5, { horizontalAlign: 'left', verticalAlign: 'top' });
    } catch (error) {
      console.error(error);
    }
  }
}
