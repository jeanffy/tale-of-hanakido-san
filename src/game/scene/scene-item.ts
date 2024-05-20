import { ControlState } from '../control-state.js';
import { DrawContext } from '../draw-context.js';
import { GeomPoint } from '../geom/geom-point.js';
import { GeomRect } from '../geom/geom-rect.js';
import { Sprite, SpriteStateUpdateOut } from '../sprite.js';
import { getRandomId } from '../utils/random-id.js';
import { SceneCollider } from './scene-collider.js';

export interface SceneItemInitParams {
  sprite: Sprite;
  x: number;
  y: number;
}

export class SceneItem {
  protected _uniqueId: string;
  protected _sprite: Sprite;
  protected _position: GeomPoint;
  protected _lastSpriteUpdateOut!: SpriteStateUpdateOut;

  public constructor(params: SceneItemInitParams) {
    this._uniqueId = getRandomId();
    this._sprite = params.sprite;
    this._position = new GeomPoint(params.x, params.y);
  }

  public canCollide(): boolean {
    return this._sprite.hasHitBox();
  }

  public get uniqueId(): string {
    return this._uniqueId;
  }

  public get sprite(): Sprite {
    return this._sprite;
  }

  public get position(): GeomPoint {
    return this._position;
  }

  public get bbox(): GeomRect {
    return this._sprite.bbox;
  }

  public get hitBox(): GeomRect | undefined {
    return this._sprite.hitBox;
  }

  public processInputs(controlState: ControlState, collider: SceneCollider): void {}

  public update(dt: number, collider: SceneCollider): void {
    this._lastSpriteUpdateOut = this._sprite.update(dt);
  }

  public render(drawContext: DrawContext): void {
    this._sprite.render(drawContext, this._position);
  }
}
