import { ControlState } from '../control-state.js';
import { DrawContext } from '../draw-context.js';
import { GeomPoint } from '../geom/geom-point.js';
import { Sprite } from '../sprite.js';
import { getRandomId } from '../utils/random-id.js';
import { WorldCollider } from './world-collider.js';

export interface WorldItemInitParams {
  sprite: Sprite;
  x: number;
  y: number;
}

export class WorldItem {
  public uniqueId: string;
  public sprite: Sprite;
  public position: GeomPoint;

  public constructor(params: WorldItemInitParams) {
    this.uniqueId = getRandomId();
    this.sprite = params.sprite;
    this.position = new GeomPoint(params.x, params.y);
  }

  public canCollide(): boolean {
    return this.sprite.hasHitBox();
  }

  public collidesWithOther(position: GeomPoint, item: WorldItem): boolean {
    return this.sprite.collidesWithOther(position, item.sprite, item.position);
  }

  public processInputs(controlState: ControlState): void {}

  public update(dt: number, collider: WorldCollider): void {
    this.sprite.update(dt);
  }

  public render(drawContext: DrawContext): void {
    this.sprite.render(drawContext, this.position);
  }
}
