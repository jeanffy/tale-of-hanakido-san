import { Position } from './position.js';
import { type IDrawContext } from '../interfaces/i-draw-context.js';
import { type IEnvironment } from '../interfaces/i-environment.js';
import type { IHero } from '../interfaces/i-hero.js';
import { type ISpriteManager } from '../interfaces/i-sprite-manager.js';
import { SpriteId, type Sprite } from './sprite.js';
import { AnimationIterator } from './utils.js';
import { Vector } from './vector.js';
import { GameControlState } from '../interfaces/i-game.js';

export class Hero implements IHero {
  private runningUpSprites: Sprite[] = [];
  private runningDownSprites: Sprite[] = [];
  private runningLeftSprites: Sprite[] = [];
  private runningRightSprites: Sprite[] = [];
  private animationIterator = new AnimationIterator({
    frameSkip: 5,
    numberOfSprites: 4,
  });

  private position = new Position(0, 0);
  private movingDirection = new Vector(0, 0);
  private isMoving = false;
  private speed = 0.15;

  public constructor(
    private environment: IEnvironment,
    private spriteManager: ISpriteManager
  ) {
    this.runningUpSprites = [
      this.spriteManager.getSprite(SpriteId.HeroMoveUp0),
      this.spriteManager.getSprite(SpriteId.HeroMoveUp1),
      this.spriteManager.getSprite(SpriteId.HeroMoveUp2),
      this.spriteManager.getSprite(SpriteId.HeroMoveUp3),
    ];
    this.runningDownSprites = [
      this.spriteManager.getSprite(SpriteId.HeroMoveDown0),
      this.spriteManager.getSprite(SpriteId.HeroMoveDown1),
      this.spriteManager.getSprite(SpriteId.HeroMoveDown2),
      this.spriteManager.getSprite(SpriteId.HeroMoveDown3),
    ];
    this.runningLeftSprites = [
      this.spriteManager.getSprite(SpriteId.HeroMoveLeft0),
      this.spriteManager.getSprite(SpriteId.HeroMoveLeft1),
      this.spriteManager.getSprite(SpriteId.HeroMoveLeft2),
      this.spriteManager.getSprite(SpriteId.HeroMoveLeft3),
    ];
    this.runningRightSprites = [
      this.spriteManager.getSprite(SpriteId.HeroMoveRight0),
      this.spriteManager.getSprite(SpriteId.HeroMoveRight1),
      this.spriteManager.getSprite(SpriteId.HeroMoveRight2),
      this.spriteManager.getSprite(SpriteId.HeroMoveRight3),
    ];
  }

  public processInputs(controlState: GameControlState): void {
    this.isMoving = false;
    this.movingDirection.x = 0;
    this.movingDirection.y = 0;

    if (controlState.up) {
      this.movingDirection.y = -1;
      this.isMoving = true;
    } else if (controlState.down) {
      this.movingDirection.y = 1;
      this.isMoving = true;
    }
    if (controlState.left) {
      this.movingDirection.x = -1;
      this.isMoving = true;
    } else if (controlState.right) {
      this.movingDirection.x = 1;
      this.isMoving = true;
    }

    if (this.isMoving) {
      this.movingDirection = this.movingDirection.normalize();
    }
  }

  public update(dt: number): void {
    if (this.isMoving) {
      const direction = this.movingDirection.scale(this.speed * dt);
      this.position = this.position.moveByVector(direction);
    }
  }

  public render(drawContext: IDrawContext): void {
    let sprite: Sprite | undefined;

    if (this.isMoving) {
      const index = this.animationIterator.getSpriteIndex();

      if (this.movingDirection.y < 0) {
        sprite = this.runningUpSprites[index];
      } else if (this.movingDirection.y > 0) {
        sprite = this.runningDownSprites[index];
      }
      if (this.movingDirection.x < 0) {
        sprite = this.runningLeftSprites[index];
      } else if (this.movingDirection.x > 0) {
        sprite = this.runningRightSprites[index];
      }
    }

    if (sprite === undefined) {
      sprite = this.runningDownSprites[0];
    }

    const w = sprite.element.width * this.environment.zoom;
    const h = sprite.element.height * this.environment.zoom;

    drawContext.drawImage(
      sprite.element,
      this.position.x,
      this.position.y,
      w,
      h
    );
  }
}
