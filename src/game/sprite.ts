import { DrawContext } from './draw-context.js';
import { GeomRect } from './geom/geom-rect.js';
import { SpriteId } from './data/data-sprite.js';
import { GeomPoint } from './geom/geom-point.js';
import { GeomCircle } from './geom/geom-circle.js';
import { WorldItemLayer } from './world/world-item.js';

export interface SpriteInitParams {
  id: SpriteId;
  img: HTMLImageElement;
  hitBoxRect?: GeomRect;
  hitBoxCircle?: GeomCircle;
  layers?: SpriteLayers;
}

export interface SpriteLayers {
  background: GeomRect;
  overlay: GeomRect;
}

export class Sprite {
  public id: SpriteId;
  public img: HTMLImageElement;
  public hitBoxRect?: GeomRect;
  public hitBoxCircle?: GeomCircle;
  public layers?: SpriteLayers;

  public constructor(params: SpriteInitParams) {
    this.id = params.id;
    this.img = params.img;
    this.hitBoxRect = params.hitBoxRect;
    this.hitBoxCircle = params.hitBoxCircle;
    this.layers = params.layers;
  }

  public render(drawContext: DrawContext, position: GeomPoint, layer: WorldItemLayer): void {
    switch (layer) {
      case WorldItemLayer.Overlay:
        if (this.layers !== undefined) {
          drawContext.drawImageCropped(
            this.img,
            this.layers.overlay.x,
            this.layers.overlay.y,
            this.layers.overlay.w,
            this.layers.overlay.h,
            position.x + this.layers.overlay.x,
            position.y + this.layers.overlay.y,
            this.layers.overlay.w,
            this.layers.overlay.h,
          );
        }
        break;
      default:
        if (this.layers !== undefined) {
          drawContext.drawImageCropped(
            this.img,
            this.layers.background.x,
            this.layers.background.y,
            this.layers.background.w,
            this.layers.background.h,
            position.x + this.layers.background.x,
            position.y + this.layers.background.y,
            this.layers.background.w,
            this.layers.background.h,
          );
        } else {
          drawContext.drawImage(this.img, position.x, position.y, this.img.width, this.img.height);
        }
        if (this.hitBoxRect !== undefined) {
          drawContext.strokeRect(
            position.x + this.hitBoxRect.x,
            position.y + this.hitBoxRect.y,
            this.hitBoxRect.w,
            this.hitBoxRect.h,
            {
              color: 'yellow',
            },
          );
        }
        if (this.hitBoxCircle !== undefined) {
          // drawContext.strokeCircle
        }
    }
  }
}
