import { DrawContext } from './draw-context.js';
import { GeomRect } from './geom/geom-rect.js';
import { SpriteId } from './data/data-sprite-id.js';
import { GeomPoint } from './geom/geom-point.js';
import { GeomCircle } from './geom/geom-circle.js';

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
  // public hitBoxRect?: GeomRect;
  // public hitBoxCircle?: GeomCircle;
  // public layers?: SpriteLayers;

  public constructor(params: SpriteInitParams) {
    this.id = params.id;
    this.img = params.img;
    // this.hitBoxRect = params.hitBoxRect;
    // this.hitBoxCircle = params.hitBoxCircle;
    // this.layers = params.layers;
  }

  public render(drawContext: DrawContext, position: GeomPoint, bbox?: GeomRect): void {
    if (bbox !== undefined) {
      drawContext.drawImageCropped(
        this.img,
        bbox.x,
        bbox.y,
        bbox.w,
        bbox.h,
        position.x + bbox.x,
        position.y + bbox.y,
        bbox.w,
        bbox.h,
      );
    } else {
      drawContext.drawImage(this.img, position.x, position.y, this.img.width, this.img.height);
        // }
        // if (this.hitBoxRect !== undefined) {
        //   drawContext.strokeRect(
        //     position.x + this.hitBoxRect.x,
        //     position.y + this.hitBoxRect.y,
        //     this.hitBoxRect.w,
        //     this.hitBoxRect.h,
        //     {
        //       color: 'yellow',
        //     },
        //   );
        // }
        // if (this.hitBoxCircle !== undefined) {
        //   // drawContext.strokeCircle
        // }
    }
  }
}
