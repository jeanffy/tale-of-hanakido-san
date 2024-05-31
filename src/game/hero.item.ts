import { GeomVector } from '../engine/geom/geom-vector.js';
import { ControlState } from '../engine/control-state.js';
import { DrawContext } from '../engine/draw-context.js';
import { GenericItem, GenericItemInitParams } from '../engine/scene/generic.item.js';
import { SceneCollider } from '../engine/scene/scene-collider.js';
import { SpriteHeroState } from './sprites.data.js';
import { ChestItem } from './chest.item.js';
import { Direction } from '../engine/direction.js';

const SPEED_WALKING = 0.1;
const SPEED_RUNNING = 0.2;

enum HeroState {
  Still,
  UsingSword,
  Walking,
}

export class HeroItem extends GenericItem {
  private movingDirectionX: number;
  private movingDirectionY: number;
  private primaryDirection?: Direction;
  private spriteState: SpriteHeroState;
  private previousSpriteState: SpriteHeroState;
  private speed = SPEED_WALKING;

  private get state(): HeroState {
    switch (this.spriteState) {
      case SpriteHeroState.StillUp:
      case SpriteHeroState.StillDown:
      case SpriteHeroState.StillLeft:
      case SpriteHeroState.StillRight:
        return HeroState.Still;
      case SpriteHeroState.WalkingUp:
      case SpriteHeroState.WalkingDown:
      case SpriteHeroState.WalkingLeft:
      case SpriteHeroState.WalkingRight:
        return HeroState.Walking;
      case SpriteHeroState.SwordUp:
      case SpriteHeroState.SwordDown:
      case SpriteHeroState.SwordLeft:
      case SpriteHeroState.SwordRight:
        return HeroState.UsingSword;
    }
  }

  public constructor(params: GenericItemInitParams) {
    super(params);
    this.spriteState = SpriteHeroState.StillDown;

    this.previousSpriteState = this.spriteState;
    this.movingDirectionX = 0;
    this.movingDirectionY = 0;
  }

  public processInputs(controlState: ControlState, collider: SceneCollider): void {
    super.processInputs(controlState, collider);

    if (this.state === HeroState.UsingSword) {
      return;
    }

    const currentState = this.state;
    let nextSpriteState = SpriteHeroState.StillDown;

    switch (this.primaryDirection) {
      case Direction.Up:
        nextSpriteState = SpriteHeroState.StillUp;
        break;
      case Direction.Down:
        nextSpriteState = SpriteHeroState.StillDown;
        break;
      case Direction.Left:
        nextSpriteState = SpriteHeroState.StillLeft;
        break;
      case Direction.Right:
        nextSpriteState = SpriteHeroState.StillRight;
        break;
    }

    this.movingDirectionX = 0;
    if (controlState.left) {
      this.movingDirectionX = -1;
      if (currentState !== HeroState.Walking) {
        this.primaryDirection = Direction.Left;
        nextSpriteState = SpriteHeroState.WalkingLeft;
      }
    } else if (controlState.right) {
      this.movingDirectionX = 1;
      if (currentState !== HeroState.Walking) {
        this.primaryDirection = Direction.Right;
        nextSpriteState = SpriteHeroState.WalkingRight;
      }
    }

    this.movingDirectionY = 0;
    if (controlState.up) {
      this.movingDirectionY = -1;
      if (currentState !== HeroState.Walking) {
        this.primaryDirection = Direction.Up;
        nextSpriteState = SpriteHeroState.WalkingUp;
      }
    } else if (controlState.down) {
      this.movingDirectionY = 1;
      if (currentState !== HeroState.Walking) {
        this.primaryDirection = Direction.Down;
        nextSpriteState = SpriteHeroState.WalkingDown;
      }
    }

    if (controlState.action2) {
      this.previousSpriteState = nextSpriteState;
      switch (this.primaryDirection) {
        case Direction.Up:
          nextSpriteState = SpriteHeroState.SwordUp;
          break;
        case Direction.Down:
          nextSpriteState = SpriteHeroState.SwordDown;
          break;
        case Direction.Left:
          nextSpriteState = SpriteHeroState.SwordLeft;
          break;
        case Direction.Right:
          nextSpriteState = SpriteHeroState.SwordRight;
          break;
      }
    }

    this.spriteState = nextSpriteState;
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
        this.handleWalk(deltaTime, new GeomVector(this.movingDirectionX, 0), collider);
        this.handleWalk(deltaTime, new GeomVector(0, this.movingDirectionY), collider);
        break;
    }
  }

  protected spriteAnimationLooped(): void {
    if (this.state === HeroState.UsingSword) {
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
