import { ControlState } from '../control-state.js';
import { DrawContext } from '../draw-context.js';
import { GeomPoint } from '../geom/geom-point.js';
import { GeomRect } from '../geom/geom-rect.js';
import { Sprite } from '../sprite.js';
import { getRandomId } from '../utils/random-id.js';
import { SceneCollider } from './scene-collider.js';

export interface SceneItemInitParams {
  sprite: Sprite;
  x: number;
  y: number;
}

export class SceneItem {
  public uniqueId: string;
  public sprite: Sprite;
  public position: GeomPoint;

  public constructor(params: SceneItemInitParams) {
    this.uniqueId = getRandomId();
    this.sprite = params.sprite;
    this.position = new GeomPoint(params.x, params.y);
  }

  public canCollide(): boolean {
    return this.sprite.hasHitBox();
  }

  public collidesWithOther(position: GeomPoint, item: SceneItem): boolean {
    return this.sprite.collidesWithOther(position, item.sprite, item.position);
  }

  public get bbox(): GeomRect {
    return this.sprite.bbox;
  }

  public get hitBox(): GeomRect | undefined {
    return this.sprite.hitBox;
  }

  public processInputs(controlState: ControlState): void {}

  public update(dt: number, collider: SceneCollider): void {
    this.sprite.update(dt);
  }

  public render(drawContext: DrawContext): void {
    this.sprite.render(drawContext, this.position);
  }
}
