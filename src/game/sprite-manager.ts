import { SpriteData, SpriteId } from './data/data-sprites.js';
import { GeomPoint } from './geom/geom-point.js';
import { GeomRect } from './geom/geom-rect.js';
import { Sprite } from './sprite.js';
import { TileManager } from './tile-manager.js';

export class SpriteManager {
  private sprites = new Map<SpriteId, Sprite>();

  public constructor(private dataSprites: SpriteData[], private tileManager: TileManager) {}

  public getSprite(id: SpriteId): Sprite {
    const spriteData = this.dataSprites.find(s => s.id === id);
    if (spriteData === undefined) {
      console.error(`No sprite data for id '${id}'`);
      throw new Error();
    }
    switch (id) {
      case SpriteId.HeroWalkingDown:
        return this.createSprite(spriteData);
      default:
        let sprite = this.sprites.get(id);
        if (sprite === undefined) {
          sprite = this.createSprite(spriteData);
        }
        return sprite;
    }
  }

  private createSprite(spriteData: SpriteData): Sprite {
    const tile = this.tileManager.getTile(spriteData.tileId);

    let bbox: GeomRect;
    if (spriteData.bbox !== undefined) {
      bbox = new GeomRect(
        spriteData.bbox[0],
        spriteData.bbox[1],
        spriteData.bbox[2] - spriteData.bbox[0] + 1,
        spriteData.bbox[3] - spriteData.bbox[1] + 1,
      );
    } else {
      bbox = tile.imageBBox;
    }

    let hitBox: GeomRect | undefined;
    if (spriteData.hitBox !== undefined) {
      if (spriteData.hitBox === 'bbox') {
        hitBox = new GeomRect(0, 0, bbox.w, bbox.h);
      } else {
        hitBox = new GeomRect(
          spriteData.hitBox[0],
          spriteData.hitBox[1],
          spriteData.hitBox[2] - spriteData.hitBox[0] + 1,
          spriteData.hitBox[3] - spriteData.hitBox[1] + 1,
        );
      }
    }

    let anchor: GeomPoint;
    if (spriteData.anchor !== undefined) {
      anchor = new GeomPoint(spriteData.anchor[0], spriteData.anchor[1]);
    } else {
      anchor = new GeomPoint(0, 0);
    }

    return new Sprite(spriteData.id, tile, bbox, anchor, hitBox, spriteData.frames ?? 1, spriteData.delay ?? 100);
  }
}
