import { GeomVector } from '../geom/geom-vector.js';
import { ControlState } from '../control-state.js';
import { DrawContext } from '../draw-context.js';
import { WorldItem, WorldItemInitParams } from './world-item.js';
import { WorldCollider } from './world-collider.js';
import { SpriteHeroState } from '../data/data-sprites.js';

const SPEED_WALKING = 0.1;
const SPEED_RUNNING = 0.2;

export class WorldHero extends WorldItem {
  private movingDirectionX: number;
  private movingDirectionY: number;
  private state: SpriteHeroState;
  private speed = SPEED_WALKING;

  public constructor(params: WorldItemInitParams) {
    super(params);
    this.state = SpriteHeroState.StillDown;
    this.movingDirectionX = 0;
    this.movingDirectionY = 0;
  }

  public processInputs(controlState: ControlState): void {
    super.processInputs(controlState);

    this.state = SpriteHeroState.StillDown;

    this.movingDirectionX = 0;
    if (controlState.left) {
      this.movingDirectionX = -1;
      this.state = SpriteHeroState.WalkingLeft;
    } else if (controlState.right) {
      this.movingDirectionX = 1;
      this.state = SpriteHeroState.WalkingRight;
    }

    this.movingDirectionY = 0;
    if (controlState.up) {
      this.movingDirectionY = -1;
      this.state = SpriteHeroState.WalkingUp;
    } else if (controlState.down) {
      this.movingDirectionY = 1;
      this.state = SpriteHeroState.WalkingDown;
    }

    this.sprite.selectState(this.state);

    this.speed = controlState.control ? SPEED_RUNNING : SPEED_WALKING;

    if (controlState.action) {
      console.log('ACTION');
    }
  }

  public update(dt: number, collider: WorldCollider): void {
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

  public render(drawContext: DrawContext): void {
    super.render(drawContext);
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
