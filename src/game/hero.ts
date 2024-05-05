import { GeomPosition } from './geom-position.js';
import { SpriteId, type Sprite } from './sprite.js';
import { AnimationIterator } from './utils.js';
import { GeomVector } from './geom-vector.js';
import { ControlState } from './control-state.js';
import { SpriteManager } from './sprite-manager.js';
import { DrawContext } from './draw-context.js';
import { World } from './world.js';
import { GeomRect } from './geom-rect.js';

export class Hero {
  private runningUpSprites: Sprite[] = [];
  private runningDownSprites: Sprite[] = [];
  private runningLeftSprites: Sprite[] = [];
  private runningRightSprites: Sprite[] = [];
  private animationIterator = new AnimationIterator({
    frameSkip: 5,
    numberOfSprites: 4,
  });

  private position: GeomPosition;
  private movingDirection: GeomVector;
  private isMoving = false;
  private speed = 0.15;

  public constructor(private spriteManager: SpriteManager, private world: World) {
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
    this.position = new GeomPosition(0, 0);
    this.movingDirection = new GeomVector(0, 0);
  }

  public processInputs(controlState: ControlState): void {
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
      const sprite = this.selectSprite();
      const direction = this.movingDirection.scale(this.speed * dt);
      const nextPosition = this.position.moveByVector(direction);
      const nextHitBox = new GeomRect(
        sprite.hitBox.x + nextPosition.x,
        sprite.hitBox.y + nextPosition.y,
        sprite.hitBox.w,
        sprite.hitBox.h,
      );
      if (!this.world.anyObjectCollidesWith(nextHitBox)) {
        this.position = this.position.moveByVector(direction);
      }
    }
  }

  public render(drawContext: DrawContext): void {
    const sprite = this.selectSprite();

    const w = sprite.img.width;
    const h = sprite.img.height;

    drawContext.drawImage(sprite.img, this.position.x, this.position.y, w, h);
    drawContext.strokeRect(
      sprite.hitBox.x + this.position.x,
      sprite.hitBox.y + this.position.y,
      sprite.hitBox.w,
      sprite.hitBox.h,
      { color: 'blue' },
    );
  }

  private selectSprite(): Sprite {
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

    return sprite;
  }
}
