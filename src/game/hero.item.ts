import { GeomVector } from '../engine/geom/geom-vector.js';
import { ControlState, ControlStateDef } from '../engine/control-state.js';
import { DrawContext } from '../engine/draw-context.js';
import { GenericItem, GenericItemInitParams } from '../engine/scene/generic.item.js';
import { SceneCollider } from '../engine/scene/scene-collider.js';
import { SpriteHeroState } from './sprites.data.js';
import { Direction } from '../engine/direction.js';
import { ChestItem } from './chest.item.js';

const SPEED_WALKING = 0.1;
const SPEED_RUNNING = 0.2;

export class HeroItem extends GenericItem {
  private movingDirectionX: number;
  private movingDirectionY: number;
  private spriteState: SpriteHeroState;
  private previousSpriteState: SpriteHeroState;
  private speed = SPEED_WALKING;
  private isWalking = false;
  private isUsingSword = false;

  public constructor(params: GenericItemInitParams) {
    super(params);
    this.spriteState = SpriteHeroState.StillDown;
    this.previousSpriteState = this.spriteState;
    this.movingDirectionX = 0;
    this.movingDirectionY = 0;
  }

  public processInputs(controlState: ControlState, collider: SceneCollider): void {
    super.processInputs(controlState, collider);

    if (this.isUsingSword) {
      return;
    }

    this.movingDirectionX = 0;
    this.movingDirectionY = 0;
    let primaryDirection = Direction.Down;

    if (controlState.sequence.length > 0) {
      this.isWalking = true;
      for (const cs of controlState.sequence) {
        switch (cs) {
          case ControlStateDef.Up:
            this.movingDirectionY = -1;
            this.spriteState = SpriteHeroState.WalkingUp;
            primaryDirection = Direction.Up;
            break;
          case ControlStateDef.Down:
            this.movingDirectionY = 1;
            this.spriteState = SpriteHeroState.WalkingDown;
            primaryDirection = Direction.Down;
            break;
          case ControlStateDef.Left:
            this.movingDirectionX = -1;
            this.spriteState = SpriteHeroState.WalkingLeft;
            primaryDirection = Direction.Left;
            break;
          case ControlStateDef.Right:
            this.movingDirectionX = 1;
            this.spriteState = SpriteHeroState.WalkingRight;
            primaryDirection = Direction.Right;
            break;
        }
      }
    } else if (this.isWalking) {
      this.isWalking = false;
      switch (this.spriteState) {
        case SpriteHeroState.WalkingUp:
          this.spriteState = SpriteHeroState.StillUp;
          primaryDirection = Direction.Up;
          break;
        case SpriteHeroState.WalkingDown:
          this.spriteState = SpriteHeroState.StillDown;
          primaryDirection = Direction.Down;
          break;
        case SpriteHeroState.WalkingLeft:
          this.spriteState = SpriteHeroState.StillLeft;
          primaryDirection = Direction.Left;
          break;
        case SpriteHeroState.WalkingRight:
          this.spriteState = SpriteHeroState.StillRight;
          primaryDirection = Direction.Right;
          break;
      }
    }

    if (controlState.action2) {
      this.isUsingSword = true;
      switch (primaryDirection) {
        case Direction.Up:
          this.spriteState = SpriteHeroState.SwordUp;
          break;
        case Direction.Down:
          this.spriteState = SpriteHeroState.SwordDown;
          break;
        case Direction.Left:
          this.spriteState = SpriteHeroState.SwordLeft;
          break;
        case Direction.Right:
          this.spriteState = SpriteHeroState.SwordRight;
          break;
      }
    }

    this._sprite.selectState(this.spriteState);
    this.speed = controlState.control ? SPEED_RUNNING : SPEED_WALKING;

    if (controlState.action1) {
      const collideItem = collider.anyItemCollidesWith(this, this._position, { tolerance: 5 });
      if (collideItem !== undefined && collideItem instanceof ChestItem) {
        const chest = collideItem as ChestItem;
        chest.open();
      }
    }
  }

  public update(deltaTime: number, collider: SceneCollider): void {
    super.update(deltaTime, collider);

    switch (this.spriteState) {
      case SpriteHeroState.WalkingUp:
      case SpriteHeroState.WalkingDown:
      case SpriteHeroState.WalkingLeft:
      case SpriteHeroState.WalkingRight:
        // move in two steps (horizontally and vertically) to handle the case:
        // - hero moves right (right arrow key is pressed)
        // - hero collides with an object (still with right arrow key pressed) -> hero stops moving
        // - player press arrow key down briefly to move down while still pressing right arrow key to get around the object
        // otherwise, the hero would have been stuck, event when pressing down arrow key
        // the player would have need to:
        // - release right arrow key
        // - press down arrow key to get pass the object
        // - press right arrow key again
        const movingDirection = new GeomVector(this.movingDirectionX, this.movingDirectionY).normalize();
        this.handleWalk(deltaTime, new GeomVector(movingDirection.x, 0), collider);
        this.handleWalk(deltaTime, new GeomVector(0, movingDirection.y), collider);
        break;
    }
  }

  protected spriteAnimationLooped(): void {
    if (this.isUsingSword) {
      this.isUsingSword = false;
      this._sprite.selectState(this.previousSpriteState);
      this.spriteState = this.previousSpriteState;
    }
  }

  public render(drawContext: DrawContext): void {
    super.render(drawContext);
  }

  private handleWalk(deltaTime: number, direction: GeomVector, collider: SceneCollider): void {
    const moveDirection = direction.scale(this.speed * deltaTime);
    const nextPosition = this._position.moveByVector(moveDirection);
    if (collider.anyItemCollidesWith(this, nextPosition)) {
      return;
    }
    this._position = this._position.moveByVector(moveDirection);
  }
}
