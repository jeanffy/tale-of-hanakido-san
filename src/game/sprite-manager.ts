import { SpriteId } from './data/data-sprite.js';
import { SpriteData } from './data/data-sprites.js';
import { GeomCircle } from './geom/geom-circle.js';
import { GeomRect } from './geom/geom-rect.js';
import { Sprite, SpriteLayers } from './sprite.js';

export class SpriteManager implements SpriteManager {
  private sprites = new Map<SpriteId, Sprite>();

  public async loadSprites(spritesData: SpriteData[]): Promise<void> {
    for (const spriteData of spritesData) {
      const sprite = await new Promise<Sprite>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve(this.createSprite(spriteData, img));
        };
        img.onerror = () => {
          reject();
        };
        img.src = spriteData.url;
      });
      this.sprites.set(spriteData.id, sprite);
    }
  }

  public getSprite(id: SpriteId): Sprite {
    const sprite = this.sprites.get(id);
    if (sprite === undefined) {
      throw new Error(`No sprite for id '${id}'`);
    }
    return sprite;
  }

  private createSprite(spriteData: SpriteData, img: HTMLImageElement): Sprite {
    let scale = spriteData.scale ?? 1;

    const spriteImg = this.scaleSprite(img, scale);

    let hitBoxRect: GeomRect | undefined;
    let hitBoxCircle: GeomCircle | undefined;

    if (spriteData.hitBoxRect !== undefined) {
      if (spriteData.hitBoxRect === 'bbox') {
        hitBoxRect = new GeomRect(0, 0, img.width * scale, img.height * scale);
      } else {
        hitBoxRect = new GeomRect(
          spriteData.hitBoxRect[0] * scale,
          spriteData.hitBoxRect[1] * scale,
          (spriteData.hitBoxRect[2] - spriteData.hitBoxRect[0] + 1) * scale,
          (spriteData.hitBoxRect[3] - spriteData.hitBoxRect[1] + 1) * scale,
        );
      }
    }

    if (spriteData.hitBoxCircle !== undefined) {
      hitBoxCircle = new GeomCircle(
        spriteData.hitBoxCircle[0] * scale,
        spriteData.hitBoxCircle[1] * scale,
        spriteData.hitBoxCircle[2] * scale,
      );
    }

    let layers: SpriteLayers | undefined;
    if (spriteData.layers !== undefined) {
      layers = {
        background: new GeomRect(
          spriteData.layers.background[0] * scale,
          spriteData.layers.background[1] * scale,
          (spriteData.layers.background[2] - spriteData.layers.background[0] + 1) * scale,
          (spriteData.layers.background[3] - spriteData.layers.background[1] + 1) * scale,
        ),
        overlay: new GeomRect(
          spriteData.layers.overlay[0] * scale,
          spriteData.layers.overlay[1] * scale,
          (spriteData.layers.overlay[2] - spriteData.layers.overlay[0] + 1) * scale,
          (spriteData.layers.overlay[3] - spriteData.layers.overlay[1] + 1) * scale,
        ),
      };
    }

    return new Sprite({
      id: spriteData.id,
      img: spriteImg,
      hitBoxRect,
      hitBoxCircle,
      layers,
    });
  }

  public scaleSprite(img: HTMLImageElement, scale: number): HTMLImageElement {
    if (!Number.isInteger(scale)) {
      console.error(`Invalid scale ${scale}`);
      throw Error();
    }

    if (scale === 1) {
      return img;
    }

    const originalCanvas = document.createElement('canvas');
    const originalContext = originalCanvas.getContext('2d');
    if (originalContext === null) {
      console.error('Error creating memory canvas');
      throw Error();
    }

    const originalWidth = img.width;
    const originalHeight = img.height;
    const targetWidth = originalWidth * scale;
    const targetHeight = originalHeight * scale;

    originalContext.drawImage(img, 0, 0, originalWidth, originalHeight);
    const originalData = originalContext.getImageData(0, 0, originalWidth, originalHeight);

    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = targetWidth;
    targetCanvas.height = targetHeight;
    const targetContext = targetCanvas.getContext('2d');
    if (targetContext === null) {
      console.error('Error creating memory canvas');
      throw Error();
    }

    const targetData = targetContext.createImageData(targetWidth, targetHeight);

    let targetDataIndex = 0;
    for (let y = 0; y < originalHeight; y++) {
      const lineStartIndex = y * originalWidth * 4;
      const lineEndIndex = lineStartIndex + originalWidth * 4;
      const linePixelsRGBA = originalData.data.slice(lineStartIndex, lineEndIndex);
      for (let s = 0; s < scale; s++) {
        for (let x = 0; x < linePixelsRGBA.length; x += 4) {
          for (let s = 0; s < scale; s++) {
            targetData.data[targetDataIndex++] = linePixelsRGBA[x];
            targetData.data[targetDataIndex++] = linePixelsRGBA[x + 1];
            targetData.data[targetDataIndex++] = linePixelsRGBA[x + 2];
            targetData.data[targetDataIndex++] = linePixelsRGBA[x + 3];
          }
        }
      }
    }

    targetContext.putImageData(targetData, 0, 0);

    const targetImg = document.createElement('img');
    targetImg.src = targetCanvas.toDataURL();

    return targetImg;
  }
}
