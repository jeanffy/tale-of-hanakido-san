import { GeomPoint } from '../geom/geom-point.js';
import { type Sprite } from '../sprite.js';
import { AnimationIterator } from '../utils/animation-iterator.js';
import { GeomVector } from '../geom/geom-vector.js';
import { ControlState } from '../control-state.js';
import { SpriteManager } from '../sprite-manager.js';
import { DrawContext } from '../draw-context.js';
import { SpriteId } from '../data/data-sprite.js';
import { WorldItem, WorldItemLayer, WorldItemRenderSecondPassFunc } from './world-item.js';
import { GeomRect } from '../geom/geom-rect.js';
import { WorldCollider } from './world-collider.js';
import { GeomCircle } from '../geom/geom-circle.js';

enum HeroState {
  Still,
  Walking,
}

export class WorldHero extends WorldItem {
  private runningUpSprites: Sprite[] = [];
  private runningDownSprites: Sprite[] = [];
  private runningLeftSprites: Sprite[] = [];
  private runningRightSprites: Sprite[] = [];

  private animationIterator = new AnimationIterator({
    frameSkip: 15,
    numberOfSprites: 4,
  });

  private movingDirectionX: number;
  private movingDirectionY: number;
  private state: HeroState;
  private speed = 0.15;

  public constructor(private spriteManager: SpriteManager, layer: WorldItemLayer, x: number, y: number) {
    super(layer, new GeomPoint(x, y));

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

    this.position = new GeomPoint(x, y);
    const sprite = this.selectSprite();
    this.hitBox = sprite.hitBoxRect ?? sprite.hitBoxCircle;
    this.state = HeroState.Still;
    this.movingDirectionX = 0;
    this.movingDirectionY = 0;
  }

  public processInputs(controlState: ControlState): void {
    this.state = HeroState.Still;

    this.movingDirectionX = 0;
    if (controlState.left) {
      this.movingDirectionX = -1;
      this.state = HeroState.Walking;
    } else if (controlState.right) {
      this.movingDirectionX = 1;
      this.state = HeroState.Walking;
    }

    this.movingDirectionY = 0;
    if (controlState.up) {
      this.movingDirectionY = -1;
      this.state = HeroState.Walking;
    } else if (controlState.down) {
      this.movingDirectionY = 1;
      this.state = HeroState.Walking;
    }

    // if (this.isMoving) {
    //   this.movingDirection = this.movingDirection.normalize();
    // }
  }

  public update(dt: number, collider: WorldCollider): void {
    const sprite = this.selectSprite();

    switch (this.state) {
      case HeroState.Walking:
        // move in two steps (horizontally and vertically) to handle the case:
        // - hero moves right (right arrow key is pressed)
        // - hero collides with an object (still with right arrow key pressed) -> hero stops moving
        // - player press arrow key down briefly to move down while still pressing right arrow key to get around the object
        // otherwise, the hero would have been stuck, event when pressing down arrow key
        // the player would have need to:
        // - release right arrow key
        // - press down arrow key to get pass the object
        // - press right arrow key again
        this.handleWalk(dt, sprite, new GeomVector(this.movingDirectionX, 0), collider);
        this.handleWalk(dt, sprite, new GeomVector(0, this.movingDirectionY), collider);
        break;
    }
  }

  public render(drawContext: DrawContext): WorldItemRenderSecondPassFunc | undefined {
    this.sprite = this.selectSprite();
    super.render(drawContext);
    return undefined;
  }

  private selectSprite(): Sprite {
    let sprite: Sprite | undefined;

    if (this.state === HeroState.Walking) {
      const index = this.animationIterator.getSpriteIndex();

      if (this.movingDirectionY < 0) {
        sprite = this.runningUpSprites[index];
      } else if (this.movingDirectionY > 0) {
        sprite = this.runningDownSprites[index];
      }
      if (this.movingDirectionX < 0) {
        sprite = this.runningLeftSprites[index];
      } else if (this.movingDirectionX > 0) {
        sprite = this.runningRightSprites[index];
      }
    }

    if (sprite === undefined) {
      sprite = this.runningDownSprites[0];
    }

    return sprite;
  }

  private handleWalk(dt: number, sprite: Sprite, direction: GeomVector, collider: WorldCollider): void {
    const moveDirection = direction.scale(this.speed * dt);
    const nextPosition = this.position.moveByVector(moveDirection);
    if (this.hitBox instanceof GeomRect) {
      const nextHitBox = new GeomRect(
        this.hitBox.x + nextPosition.x,
        this.hitBox.y + nextPosition.y,
        this.hitBox.w,
        this.hitBox.h,
      );
      if (collider.anyItemCollidesWithHitBox(nextHitBox) !== undefined) {
        return;
      }
    }
    if (this.hitBox instanceof GeomCircle) {
      // TOOD
    }
    this.position = this.position.moveByVector(moveDirection);
  }
}
