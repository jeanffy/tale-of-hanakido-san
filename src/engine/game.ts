import { type IDrawContext } from './interfaces/i-draw-context';
import { type IEnvironment } from './interfaces/i-environment';
import type { IFactory } from './interfaces/i-factory';
import type { IGame, GameControlState } from './interfaces/i-game';
import type { IHero } from './interfaces/i-hero.mjs';
import { type ISpriteManager } from './interfaces/i-sprite-manager';
import { MoveDirection } from './move';
import { SpriteId } from './sprite';

const MAP_TILE_COUNT_W = 20;
const MAP_TILE_COUNT_H = 20;
const zoom = 2;

export class Game implements IGame {
  private hero: IHero;
  private lastRender: number | undefined;
  private controlState: GameControlState;

  public constructor(
    private factory: IFactory,
    private environment: IEnvironment,
    private spriteManager: ISpriteManager,
    private drawContext: IDrawContext,
  ) {
    this.hero = this.factory.getHero();
    console.log(this.hero);
    this.controlState = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
  }

  public async loop(timestamp: number): Promise<void> {
    if (this.lastRender === undefined) {
      this.lastRender = timestamp;
    }
    const delta = timestamp - this.lastRender;

    const start = Date.now();

    this.processInputs(delta);
    //update(delta);
    this.render(delta);

    const targetFPS = 60;
    const millisecondsPerFrame = 1000 / targetFPS;
    const waitMilliseconds = start + millisecondsPerFrame - Date.now();
    if (waitMilliseconds > 0) {
      return new Promise(resolve => setTimeout(resolve, start + 16 - Date.now()));
    }

    return Promise.resolve();
  }

  public updateControls(state: Partial<GameControlState>): void {
    this.controlState.up = state.up ?? this.controlState.up;
    this.controlState.down = state.down ?? this.controlState.down;
    this.controlState.left = state.left ?? this.controlState.left;
    this.controlState.right = state.right ?? this.controlState.right;
  }

  private processInputs(delta: number): void {
    let heroIsMoving = false;
    if (this.controlState.up) {
      this.hero.move(MoveDirection.Up);
      heroIsMoving = true;
    }
    if (this.controlState.down) {
      this.hero.move(MoveDirection.Down);
      heroIsMoving = true;
    }
    if (this.controlState.left) {
      this.hero.move(MoveDirection.Left);
      heroIsMoving = true;
    }
    if (this.controlState.right) {
      this.hero.move(MoveDirection.Right);
      heroIsMoving = true;
    }
    if (!heroIsMoving) {
      this.hero.stop();
    }
  }

  private render(delta: number): void {
    try {
      const grass = this.spriteManager.getSprite(SpriteId.Grass);

      for (let i = 0; i < MAP_TILE_COUNT_W; i++) {
        for (let j = 0; j < MAP_TILE_COUNT_H; j++) {
          const w = grass.element.width * zoom;
          const h = grass.element.height * zoom;
          this.drawContext.drawImage(grass.element, i * w, j * h, w, h);
        }
      }

      this.hero.render(delta);
    } catch (error) {
      console.error(error);
    }
  }
}
