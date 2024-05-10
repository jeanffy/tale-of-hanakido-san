import { TileData, TileId } from './data/data-tiles.js';
import { Tile } from './tile.js';

export class TileManager {
  private tiles = new Map<TileId, Tile>();

  public async loadTiles(dataTiles: TileData[]): Promise<void> {
    for (const dataTile of dataTiles) {
      const tile = await new Promise<Tile>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          resolve(new Tile(dataTile.id, image));
        };
        image.onerror = () => {
          reject();
        };
        image.src = dataTile.url;
      });
      this.tiles.set(dataTile.id, tile);
    }
  }

  public getTile(id: TileId): Tile {
    const tile = this.tiles.get(id);
    if (tile === undefined) {
      throw new Error(`No tile for id '${id}'`);
    }
    return tile;
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
