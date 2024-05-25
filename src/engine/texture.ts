import { DrawContext } from './draw-context.js';
import { GeomRect } from './geom/geom-rect.js';
import { GeomPoint } from './geom/geom-point.js';

export class Texture<TTextureId> {
  public imageBBox: GeomRect;

  public constructor(
    public id: TTextureId,
    private image: HTMLImageElement,
  ) {
    this.imageBBox = new GeomRect(0, 0, image.width, image.height);
  }

  public getCroppedImage(bbox: GeomRect): HTMLImageElement {
    const canvas = document.createElement('canvas');
    canvas.width = bbox.w;
    canvas.height = bbox.h;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(this.image, -bbox.x, -bbox.y);
    const croppedImage = document.createElement('img');
    croppedImage.src = canvas.toDataURL();
    return croppedImage;
  }

  // bbox: pixel coordinates relative to image
  // position: pixel coordinates relative to drawContext
  public render(drawContext: DrawContext, bbox: GeomRect, position: GeomPoint): void {
    if (bbox.equals(this.imageBBox)) {
      drawContext.drawImage(this.image, position.x, position.y, this.image.width, this.image.height);
    } else {
      drawContext.drawImageCropped(this.image, bbox.x, bbox.y, bbox.w, bbox.h, position.x, position.y, bbox.w, bbox.h);

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
