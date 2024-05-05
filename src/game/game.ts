import { DrawContext } from './draw-context.js';
import { Factory } from './factory.js';
import { Hero } from './hero.js';
import { FrameRateIterator } from './utils.js';
import { World } from './world.js';
import { ControlState } from './control-state.js';

const TARGET_FPS = 15;

export class Game {
  private hero: Hero;
  private world: World;
  private controlState: ControlState;
  private frameRateIterator: FrameRateIterator;

  public constructor(
    private factory: Factory, // private environment: IEnvironment, // private spriteManager: ISpriteManager, // private drawContext: IDrawContext,
  ) {
    this.hero = this.factory.getHero();
    this.world = this.factory.getWorld();
    this.controlState = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    this.frameRateIterator = new FrameRateIterator({ targetFps: TARGET_FPS });
  }

  public nextFrame(drawContext: DrawContext, dt: number): void {
    this.processInputs(dt);
    this.update(dt);

    // for (let i = 0; i < 99999999; i++) {
    //   Math.atan(500);
    // }

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
  }

  private processInputs(dt: number): void {
    this.hero.processInputs(this.controlState);
  }

  private update(dt: number): void {
    this.world.update(dt);
    this.hero.update(dt);
  }

  private render(drawContext: DrawContext): void {
    try {
      this.world.render(drawContext);
      this.hero.render(drawContext);
      this.world.renderOverlays(drawContext);

      const fpsString = `FPS: ${this.frameRateIterator.fps}`;
      drawContext.writeText(fpsString, 5, 5, { horizontalAlign: 'left', verticalAlign: 'top' });
    } catch (error) {
      console.error(error);
    }
  }
}
