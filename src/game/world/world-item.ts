import { ControlState } from '../control-state.js';
import { SpriteId } from '../data/data-sprite-id.js';
import { DrawContext } from '../draw-context.js';
import { GeomCircle } from '../geom/geom-circle.js';
import { GeomPoint } from '../geom/geom-point.js';
import { GeomRect } from '../geom/geom-rect.js';
import { SpriteManager } from '../sprite-manager.js';
import { Sprite } from '../sprite.js';
import { WorldCollider } from './world-collider.js';

export interface WorldItemInitParams {
  spriteId?: SpriteId;
  x: number;
  y: number;
  bbox?: GeomRect;
  hitBox?: GeomRect | GeomCircle;
}

export class WorldItem {
  protected sprite!: Sprite;
  public position: GeomPoint;
  public bbox?: GeomRect;
  public hitBox?: GeomRect | GeomCircle

  public constructor(spriteManager: SpriteManager, params: WorldItemInitParams) {
    if (params.spriteId !== undefined) {
      this.sprite = spriteManager.getSprite(params.spriteId);
    }
    this.position = new GeomPoint(params.x, params.y);
    this.bbox = params.bbox;
    this.hitBox = params.hitBox;
  }

  public processInputs(controlState: ControlState): void {}
  public update(dt: number, collider: WorldCollider): void {}

  public render(drawContext: DrawContext): void {
    this.sprite.render(drawContext, this.position, this.bbox);
    if (this.hitBox instanceof GeomRect) {
      drawContext.strokeRect(
        this.position.x + this.hitBox.x,
        this.position.y + this.hitBox.y,
        this.hitBox.w,
        this.hitBox.h,
        {
          color: 'yellow',
        },
      );
    }
  }
}
