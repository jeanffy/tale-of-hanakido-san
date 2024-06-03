import { DrawContext } from './draw-context.js';
import { FrameRateIterator } from './utils/frame-rate-iterator.js';
import { Scene } from './scene/scene.js';
import { ControlState, ControlStateEvent } from './control-state.js';

const TARGET_FPS = 60;

export class EngineGame {
  private controlState: ControlState;
  private frameRateIterator: FrameRateIterator;

  public constructor(private scene: Scene) {
    this.controlState = new ControlState();
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

  public updateControlState(def: ControlStateEvent): void {
    this.controlState.update(def);
  }

  private render(drawContext: DrawContext): void {
    try {
      this.scene.render(drawContext);
      const fpsString = `FPS: ${this.frameRateIterator.fps}`;
      drawContext.writeText(fpsString, 5, 5, { horizontalAlign: 'left', verticalAlign: 'top' });
      const csString = `[${this.controlState.sequence.join(',')}]`;
      drawContext.writeText(csString, 10, 20, { horizontalAlign: 'left', verticalAlign: 'top' });
    } catch (error) {
      console.error(error);
    }
  }
}
