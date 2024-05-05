import { GeomRect } from './geom-rect.js';
import { Sprite, SpriteId } from './sprite.js';

export interface SpriteData {
  id: SpriteId;
  url: string;
  hitBox?: number[];
  layers?: { background: number[]; overlay: number[] };
}

export class SpriteManager implements SpriteManager {
  private sprites = new Map<SpriteId, Sprite>();

  public async loadSprites(spritesData: SpriteData[]): Promise<void> {
    const scale = 3;
    for (const spriteData of spritesData) {
      const sprite = await new Promise<Sprite>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const spriteImg = this.scaleSprite(img, scale);
          let spriteHitBox: GeomRect;
          if (spriteData.hitBox !== undefined) {
            spriteHitBox = new GeomRect(
              spriteData.hitBox[0] * scale,
              spriteData.hitBox[1] * scale,
              (spriteData.hitBox[2] - spriteData.hitBox[0] + 1) * scale,
              (spriteData.hitBox[3] - spriteData.hitBox[1] + 1) * scale,
            );
          } else {
            spriteHitBox = new GeomRect(0, 0, spriteImg.width * scale, spriteImg.height * scale);
          }

          let layers: Sprite['layers'] | undefined;
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
          resolve({
            id: spriteData.id,
            img: spriteImg,
            hitBox: spriteHitBox,
            layers: layers,
          });
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

  public scaleSprite(img: HTMLImageElement, scale: number): HTMLImageElement {
    if (!Number.isInteger(scale)) {
      console.error(`Invalid scale ${scale}`);
      throw Error();
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
