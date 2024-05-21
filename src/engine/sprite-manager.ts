import { GeomPoint } from './geom/geom-point.js';
import { GeomRect } from './geom/geom-rect.js';
import { SpriteState } from './sprite-state.js';
import { Sprite } from './sprite.js';
import { TileManager } from './tile-manager.js';

export interface SpriteData2<TTileId, TSpriteId> {
  id: TSpriteId;
  states: {
    label?: string;
    tileId: TTileId;
    bbox?: [number, number, number, number]; // x1, y1, x2, y2
    anchor?: [number, number]; // dx, dy from bbox top-left corner, applies to bbox and hitBox
    frames?: number;
    delay?: number;
  }[];
  // 'bbox' indicates that hitBox is same as current state bbox (so in that case hitBox can vary)
  // 'bbox' value is best to be used with 1 state or with states with same bbox
  hitBox?: [number, number, number, number] | 'bbox'; // x1, y1, x2, y2
  hitBoxAnchor?: [number, number];
}

export class SpriteManager<TTileId, TSpriteId> {
  private sprites = new Map<TSpriteId, Sprite<TTileId>>();

  public constructor(
    private spritesData: SpriteData2<TTileId, TSpriteId>[],
    private tileManager: TileManager<TTileId>,
  ) {}

  public getSprite(id: TSpriteId): Sprite<TTileId> {
    const spriteData = this.spritesData.find(s => s.id === id);
    if (spriteData === undefined) {
      console.error(`No sprite data for id '${id}'`);
      throw new Error();
    }
    let sprite = this.sprites.get(id);
    if (sprite === undefined) {
      sprite = this.createSprite(spriteData);
    }
    return sprite;
  }

  private createSprite(spriteData: SpriteData2<TTileId, TSpriteId>): Sprite<TTileId> {
    const states: SpriteState<TTileId>[] = [];
    for (const state of spriteData.states) {
      const tile = this.tileManager.getTile(state.tileId);

      let bbox: GeomRect;
      if (state.bbox !== undefined) {
        bbox = new GeomRect(
          state.bbox[0],
          state.bbox[1],
          state.bbox[2] - state.bbox[0] + 1,
          state.bbox[3] - state.bbox[1] + 1,
        );
      } else {
        bbox = tile.imageBBox;
      }

      let anchor: GeomPoint;
      if (state.anchor !== undefined) {
        anchor = new GeomPoint(state.anchor[0], state.anchor[1]);
      } else {
        anchor = new GeomPoint(0, 0);
      }

      states.push(new SpriteState(state.label, tile, bbox, anchor, state.frames ?? 1, state.delay ?? 100));
    }

    let hitBox: GeomRect | undefined;
    if (spriteData.hitBox !== undefined) {
      if (spriteData.hitBox === 'bbox') {
        const bbox = states[0].bbox;
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

    let hitBoxAnchor: GeomPoint | undefined;
    if (spriteData.hitBoxAnchor !== undefined) {
      hitBoxAnchor = new GeomPoint(spriteData.hitBoxAnchor[0], spriteData.hitBoxAnchor[1]);
    }

    return new Sprite(states, hitBox, hitBoxAnchor);
  }
}
