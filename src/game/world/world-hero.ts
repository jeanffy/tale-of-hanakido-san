import { GeomVector } from '../geom/geom-vector.js';
import { ControlState } from '../control-state.js';
import { DrawContext } from '../draw-context.js';
import { WorldItem } from './world-item.js';
import { WorldCollider } from './world-collider.js';
import { Sprite } from '../sprite.js';
import { SpriteManager } from '../sprite-manager.js';
import { SpriteId } from '../data/data-sprites.js';

export interface WorldHeroInitParams {
  x: number;
  y: number;
}

enum HeroState {
  Still,
  Walking,
}

export class WorldHero extends WorldItem {
  private stillSpriteUp: Sprite;
  private stillSpriteDown: Sprite;
  private stillSpriteLeft: Sprite;
  private stillSpriteRight: Sprite;
  private stillSprite: Sprite;

  private runningUpSprite: Sprite;
  private runningDownSprite: Sprite;
  private runningLeftSprite: Sprite;
  private runningRightSprite: Sprite;

  private movingDirectionX: number;
  private movingDirectionY: number;
  private state: HeroState;
  private speed = 0.15;

  public constructor(spriteManager: SpriteManager, params: WorldHeroInitParams) {
    super(params);
    this.stillSpriteUp = spriteManager.getSprite(SpriteId.HeroStillUp);
    this.stillSpriteDown = spriteManager.getSprite(SpriteId.HeroStillDown);
    this.stillSpriteLeft = spriteManager.getSprite(SpriteId.HeroStillLeft);
    this.stillSpriteRight = spriteManager.getSprite(SpriteId.HeroStillRight);
    this.runningUpSprite = spriteManager.getSprite(SpriteId.HeroWalkingUp);
    this.runningDownSprite = spriteManager.getSprite(SpriteId.HeroWalkingDown);
    this.runningLeftSprite = spriteManager.getSprite(SpriteId.HeroWalkingLeft);
    this.runningRightSprite = spriteManager.getSprite(SpriteId.HeroWalkingRight);
    this.sprite = this.selectSprite();
    this.state = HeroState.Still;
    this.movingDirectionX = 0;
    this.movingDirectionY = 0;
    this.stillSprite = this.stillSpriteDown;
  }

  public processInputs(controlState: ControlState): void {
    super.processInputs(controlState);

    this.state = HeroState.Still;

    this.movingDirectionX = 0;
    if (controlState.left) {
      this.movingDirectionX = -1;
      this.state = HeroState.Walking;
      this.stillSprite = this.stillSpriteLeft;
    } else if (controlState.right) {
      this.movingDirectionX = 1;
      this.state = HeroState.Walking;
      this.stillSprite = this.stillSpriteRight;
    }

    this.movingDirectionY = 0;
    if (controlState.up) {
      this.movingDirectionY = -1;
      this.state = HeroState.Walking;
      this.stillSprite = this.stillSpriteUp;
    } else if (controlState.down) {
      this.movingDirectionY = 1;
      this.state = HeroState.Walking;
      this.stillSprite = this.stillSpriteDown;
    }

    // if (this.isMoving) {
    //   this.movingDirection = this.movingDirection.normalize();
    // }
  }

  public update(dt: number, collider: WorldCollider): void {
    this.sprite = this.selectSprite();
    super.update(dt, collider);

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
        this.handleWalk(dt, new GeomVector(this.movingDirectionX, 0), collider);
        this.handleWalk(dt, new GeomVector(0, this.movingDirectionY), collider);
        break;
    }
  }

  public render(drawContext: DrawContext): void {
    super.render(drawContext);
  }

  private selectSprite(): Sprite {
    let sprite: Sprite | undefined;

    if (this.state === HeroState.Walking) {
      if (this.movingDirectionY < 0) {
        sprite = this.runningUpSprite;
      } else if (this.movingDirectionY > 0) {
        sprite = this.runningDownSprite;
      }
      if (this.movingDirectionX < 0) {
        sprite = this.runningLeftSprite;
      } else if (this.movingDirectionX > 0) {
        sprite = this.runningRightSprite;
      }
    }

    if (sprite === undefined) {
      sprite = this.stillSprite;
    }

    return sprite;
  }

  private handleWalk(dt: number, direction: GeomVector, collider: WorldCollider): void {
    const moveDirection = direction.scale(this.speed * dt);
    const nextPosition = this.position.moveByVector(moveDirection);
    if (collider.anyItemCollidesWith(this, nextPosition)) {
      return;
    }
    this.position = this.position.moveByVector(moveDirection);
  }
}
