import { Coord } from './coord';
import { type IDrawContext } from './interfaces/i-draw-context';
import { type IEnvironment } from './interfaces/i-environment';
import type { IHero } from './interfaces/i-hero.mjs';
import { type ISpriteManager } from './interfaces/i-sprite-manager';
import { MoveDirection } from './move';
import { SpriteId, type Sprite } from './sprite';
import { AnimationIterator } from './utils';

export class Hero implements IHero {
  private runningUpSprites: Sprite[] = [];
  private runningDownSprites: Sprite[] = [];
  private runningLeftSprites: Sprite[] = [];
  private runningRightSprites: Sprite[] = [];
  private animationIterator = new AnimationIterator({
    frameSkip: 5,
    numberOfSprites: 4,
  });

  private position = new Coord(0, 0);
  private isMoving = false;
  public movingDirection = MoveDirection.Down;
  private speed = 2.5;

  public constructor(
    private environment: IEnvironment,
    private spriteManager: ISpriteManager,
    private drawContext: IDrawContext,
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

  public move(direction: MoveDirection): void {
    this.movingDirection = direction;
    this.isMoving = true;
    switch (direction) {
      case MoveDirection.Up:
        this.position.y -= this.speed;
        break;
      case MoveDirection.Down:
        this.position.y += this.speed;
        break;
      case MoveDirection.Left:
        this.position.x -= this.speed;
        break;
      case MoveDirection.Right:
        this.position.x += this.speed;
        break;
    }
  }

  public stop(): void {
    this.isMoving = false;
  }

  public render(delta: number): void {
    let sprite: Sprite;

    const index = this.isMoving ? this.animationIterator.getSpriteIndex() : 0;

    switch (this.movingDirection) {
      case MoveDirection.Up:
        sprite = this.runningUpSprites[index];
        break;
      case MoveDirection.Down:
        sprite = this.runningDownSprites[index];
        break;
      case MoveDirection.Left:
        sprite = this.runningLeftSprites[index];
        break;
      case MoveDirection.Right:
        sprite = this.runningRightSprites[index];
        break;
    }

    const w = sprite.element.width * this.environment.zoom;
    const h = sprite.element.height * this.environment.zoom;

    this.drawContext.drawImage(sprite.element, this.position.x, this.position.y, w, h);
  }
}
