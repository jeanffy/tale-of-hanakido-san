import type { DrawContext } from './draw-context.js';
import { SpriteManager } from './sprite-manager.js';
import { dataMap } from './data-map.js';
import { GeomRect } from './geom-rect.js';
import { GeomVector } from './geom-vector.js';

export class World {
  public constructor(private spriteManager: SpriteManager) {}

  public update(dt: number): void {}

  public render(drawContext: DrawContext): void {
    const mapHorizontalLength = dataMap.landscape[0].length;
    const mapVerticalLength = dataMap.landscape.length;
    for (let i = 0; i < mapHorizontalLength; i++) {
      for (let j = 0; j < mapVerticalLength; j++) {
        const spriteId = dataMap.landscape[j][i];
        const sprite = this.spriteManager.getSprite(spriteId);
        const w = sprite.img.width;
        const h = sprite.img.height;
        drawContext.drawImage(sprite.img, i * w, j * h, w, h);
      }
    }

    for (const o of dataMap.objects) {
      const sprite = this.spriteManager.getSprite(o.id);
      if (sprite.layers !== undefined) {
        drawContext.drawImageCropped(
          sprite.img,
          sprite.layers.background.x,
          sprite.layers.background.y,
          sprite.layers.background.w,
          sprite.layers.background.h,
          o.x + sprite.layers.background.x,
          o.y + sprite.layers.background.y,
          sprite.layers.background.w,
          sprite.layers.background.h,
        );
      } else {
        drawContext.drawImage(sprite.img, o.x, o.y, sprite.img.width, sprite.img.height);
      }

      drawContext.strokeRect(o.x + sprite.hitBox.x, o.y + sprite.hitBox.y, sprite.hitBox.w, sprite.hitBox.h, {
        color: 'red',
      });
    }
  }

  public renderOverlays(drawContext: DrawContext): void {
    for (const o of dataMap.objects) {
      const sprite = this.spriteManager.getSprite(o.id);
      if (sprite.layers !== undefined) {
        drawContext.drawImageCropped(
          sprite.img,
          sprite.layers.overlay.x,
          sprite.layers.overlay.y,
          sprite.layers.overlay.w,
          sprite.layers.overlay.h,
          o.x + sprite.layers.overlay.x,
          o.y + sprite.layers.overlay.y,
          sprite.layers.overlay.w,
          sprite.layers.overlay.h,
        );
      } else {
        drawContext.drawImage(sprite.img, o.x, o.y, sprite.img.width, sprite.img.height);
      }

      drawContext.strokeRect(o.x + sprite.hitBox.x, o.y + sprite.hitBox.y, sprite.hitBox.w, sprite.hitBox.h, {
        color: 'red',
      });
    }
  }

  public anyObjectCollidesWith(rect: GeomRect): boolean {
    for (const o of dataMap.objects) {
      const sprite = this.spriteManager.getSprite(o.id);
      const spriteHitBox = sprite.hitBox.moveByVector(new GeomVector(o.x, o.y));
      if (spriteHitBox.intersects(rect)) {
        return true;
      }
    }
    return false;
  }
}
