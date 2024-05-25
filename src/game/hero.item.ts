import { GeomVector } from '../engine/geom/geom-vector.js';
import { ControlState } from '../engine/control-state.js';
import { DrawContext } from '../engine/draw-context.js';
import { GenericItem, GenericItemInitParams } from '../engine/scene/generic.item.js';
import { SceneCollider } from '../engine/scene/scene-collider.js';
import { SpriteHeroState } from './sprites.data.js';
import { ChestItem } from './chest.item.js';
import { TextureId } from './textures.data.js';
import { Direction } from '../engine/direction.js';

const SPEED_WALKING = 0.1;
const SPEED_RUNNING = 0.2;

export class HeroItem extends GenericItem<TextureId> {
  private movingDirectionX: number;
  private movingDirectionY: number;
  private primaryDirection?: Direction;
  private state: SpriteHeroState;
  private previousState: SpriteHeroState;
  private speed = SPEED_WALKING;
  private usingSword: boolean;

  public constructor(params: GenericItemInitParams<TextureId>) {
    super(params);
    this.state = SpriteHeroState.StillDown;
    this.previousState = this.state;
    this.movingDirectionX = 0;
    this.movingDirectionY = 0;
    this.usingSword = false;
  }

  public processInputs(controlState: ControlState, collider: SceneCollider<TextureId>): void {
    super.processInputs(controlState, collider);

    if (this.usingSword) {
      return;
    }

    this.state = SpriteHeroState.StillDown;
    this.primaryDirection = undefined;

    this.movingDirectionX = 0;
    if (controlState.left) {
      this.movingDirectionX = -1;
      this.state = SpriteHeroState.WalkingLeft;
      if (this.primaryDirection !== Direction.Up && this.primaryDirection !== Direction.Down) {
        this.primaryDirection = Direction.Left;
      }
    } else if (controlState.right) {
      this.movingDirectionX = 1;
      this.state = SpriteHeroState.WalkingRight;
      if (this.primaryDirection !== Direction.Up && this.primaryDirection !== Direction.Down) {
        this.primaryDirection = Direction.Right;
      }
    }

    this.movingDirectionY = 0;
    if (controlState.up) {
      this.movingDirectionY = -1;
      this.state = SpriteHeroState.WalkingUp;
      if (this.primaryDirection !== Direction.Left && this.primaryDirection !== Direction.Right) {
        this.primaryDirection = Direction.Up;
      }
    } else if (controlState.down) {
      this.movingDirectionY = 1;
      this.state = SpriteHeroState.WalkingDown;
      if (this.primaryDirection !== Direction.Left && this.primaryDirection !== Direction.Right) {
        this.primaryDirection = Direction.Down;
      }
    }

    if (controlState.action2) {
      this.previousState = this.state;
      switch (this.primaryDirection) {
        case Direction.Up:
          this.state = SpriteHeroState.SwordUp;
          break;
        case Direction.Down:
          this.state = SpriteHeroState.SwordDown;
          break;
        case Direction.Left:
          this.state = SpriteHeroState.SwordLeft;
          break;
      }
      this.usingSword = true;
    }

    this._sprite.selectState(this.state);

    this.speed = controlState.control ? SPEED_RUNNING : SPEED_WALKING;

    if (controlState.action1) {
      const collideItem = collider.anyItemCollidesWith(this, this._position, { tolerance: 5 });
      if (collideItem !== undefined && collideItem instanceof ChestItem) {
        const chest = collideItem as ChestItem;
        chest.open();
      }
    }
  }

  public update(dt: number, collider: SceneCollider<TextureId>): void {
    super.update(dt, collider);

    switch (this.state) {
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
        this.handleWalk(dt, new GeomVector(this.movingDirectionX, 0), collider);
        this.handleWalk(dt, new GeomVector(0, this.movingDirectionY), collider);
        break;
    }
  }

  protected spriteAnimationLooped(): void {
    if (this.usingSword) {
      this._sprite.selectState(this.previousState);
      this.state = this.previousState;
      this.usingSword = false;
    }
  }

  public render(drawContext: DrawContext): void {
    super.render(drawContext);
  }

  private handleWalk(dt: number, direction: GeomVector, collider: SceneCollider<TextureId>): void {
    const moveDirection = direction.scale(this.speed * dt);
    const nextPosition = this._position.moveByVector(moveDirection);
    if (collider.anyItemCollidesWith(this, nextPosition)) {
      return;
    }
    this._position = this._position.moveByVector(moveDirection);
  }
}
