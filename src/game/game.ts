//import { type IDrawContext } from './interfaces/i-draw-context.mjs';
//import { type IEnvironment } from './interfaces/i-environment.mjs';
import { IDrawContext } from '../interfaces/i-draw-context.js';
import type { IFactory } from '../interfaces/i-factory.js';
import type { IGame, GameControlState } from '../interfaces/i-game.js';
import type { IHero } from '../interfaces/i-hero.js';
//import { type ISpriteManager } from './interfaces/i-sprite-manager.mjs';
import type { IWorld } from '../interfaces/i-world.js';
import { FrameRateIterator } from './utils.js';

const TARGET_FPS = 15;

export class Game implements IGame {
  private hero: IHero;
  private world: IWorld;
  private controlState: GameControlState;
  private frameRateIterator: FrameRateIterator;

  public constructor(
    private factory: IFactory // private environment: IEnvironment, // private spriteManager: ISpriteManager, // private drawContext: IDrawContext,
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

  public nextFrame(drawContext: IDrawContext, dt: number): void {
    this.processInputs(dt);
    this.update(dt);

    // for (let i = 0; i < 99999999; i++) {
    //   Math.atan(500);
    // }

    this.frameRateIterator.shouldRender(dt).then((shouldRender) => {
      if (shouldRender) {
        this.render(drawContext);
      }
    });
  }

  public updateControlState(state: Partial<GameControlState>): void {
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

  private render(drawContext: IDrawContext): void {
    try {
      this.world.render(drawContext);
      this.hero.render(drawContext);

      const fpsString = `FPS: ${this.frameRateIterator.fps}`;
      const c = drawContext as CanvasRenderingContext2D;
      c.textAlign = 'left';
      c.textBaseline = 'top';
      c.fillText(fpsString, 5, 5);
    } catch (error) {
      console.error(error);
    }
  }
}
