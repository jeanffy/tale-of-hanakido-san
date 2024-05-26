import { SpriteData } from './data.js';
import { GeomPoint } from './geom/geom-point.js';
import { GeomRect } from './geom/geom-rect.js';
import { SpriteState } from './sprite-state.js';
import { Sprite } from './sprite.js';
import { TextureManager } from './texture-manager.js';

export class SpriteManager<TTileId, TSpriteId> {
  private sprites = new Map<TSpriteId, Sprite<TTileId>>();

  public constructor(
    private spritesData: SpriteData<TTileId, TSpriteId>[],
    private textureManager: TextureManager<TTileId>,
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

  private createSprite(spriteData: SpriteData<TTileId, TSpriteId>): Sprite<TTileId> {
    const states: SpriteState<TTileId>[] = [];
    for (const state of spriteData.states) {
      const texture = this.textureManager.getTexture(state.tileId);

      let bbox: GeomRect;
      if (state.bbox !== undefined) {
        bbox = new GeomRect(
          state.bbox[0],
          state.bbox[1],
          state.bbox[2] - state.bbox[0] + 1,
          state.bbox[3] - state.bbox[1] + 1,
        );
      } else {
        bbox = texture.imageBBox;
      }

      let anchor: GeomPoint;
      if (state.anchor !== undefined) {
        anchor = new GeomPoint(state.anchor[0], state.anchor[1]);
      } else {
        anchor = new GeomPoint(0, 0);
      }

      states.push(new SpriteState(state.label, texture, bbox, anchor, state.frames ?? 1, state.delay ?? 100));
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
