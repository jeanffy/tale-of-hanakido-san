import { DrawContext } from './draw-context.js';
import { FrameRateIterator } from './utils/frame-rate-iterator.js';
import { Scene } from './scene/scene.js';
import { ControlState } from './control-state.js';

const TARGET_FPS = 60;

export class EngineGame<TTileId> {
  private controlState: ControlState;
  private frameRateIterator: FrameRateIterator;

  public constructor(private scene: Scene<TTileId>) {
    this.controlState = {
      up: false,
      down: false,
      left: false,
      right: false,
      control: false,
      action: false,
    };
    this.frameRateIterator = new FrameRateIterator({ targetFps: TARGET_FPS });
  }

  public nextFrame(drawContext: DrawContext, dt: number): void {
    this.scene.processInputs(dt, this.controlState);
    this.scene.update(dt);

    this.frameRateIterator.shouldRender(dt).then(shouldRender => {
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
    this.controlState.action = state.action ?? this.controlState.action;
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
