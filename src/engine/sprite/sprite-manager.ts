import { SpriteData, SpriteFrameData, SpriteStateData } from '../data.js';
import { GeomPoint } from '../geom/geom-point.js';
import { GeomRect } from '../geom/geom-rect.js';
import { SpriteState } from './sprite-state.js';
import { Sprite } from './sprite.js';
import { TextureManager } from '../texture/texture-manager.js';
import { SpriteFrame } from './sprite-frame.js';
import { Texture } from '../texture/texture.js';

export class SpriteManager {
  private spriteCreator: SpriteCreator;
  private sprites = new Map<string, Sprite>();

  public constructor(
    private spritesData: SpriteData[],
    private textureManager: TextureManager,
  ) {
    this.spriteCreator = new SpriteCreator(this.textureManager);
  }

  public getSprite(id: string): Sprite {
    const spriteData = this.spritesData.find(s => s.id === id);
    if (spriteData === undefined) {
      throw new Error(`No sprite data for id '${id}'`);
    }
    let sprite = this.sprites.get(id);
    if (sprite === undefined) {
      sprite = this.spriteCreator.create(spriteData);
    }
    return sprite;
  }
}

class SpriteCreator {
  public constructor(private textureManager: TextureManager) {}

  public create(spriteData: SpriteData): Sprite {
    const states: SpriteState[] = [];
    for (const stateData of spriteData.states) {
      states.push(this.createState(stateData));
    }

    let hitBox: GeomRect | undefined;
    if (spriteData.hitBox !== undefined) {
      hitBox = new GeomRect(
        spriteData.hitBox[0],
        spriteData.hitBox[1],
        spriteData.hitBox[2] - spriteData.hitBox[0] + 1,
        spriteData.hitBox[3] - spriteData.hitBox[1] + 1,
      );
    }

    let hitBoxAnchor: GeomPoint | undefined;
    if (spriteData.hitBoxAnchor !== undefined) {
      hitBoxAnchor = new GeomPoint(spriteData.hitBoxAnchor[0], spriteData.hitBoxAnchor[1]);
    }

    return new Sprite({
      states,
      hitBox,
      hitBoxAnchor,
    });
  }

  private createState(stateData: SpriteStateData): SpriteState {
    const texture = this.textureManager.getTexture(stateData.textureId);

    const frames: SpriteFrame[] = [];
    if (stateData.frames === undefined) {
      const defaultFrameData: SpriteFrameData = {
        bbox: [
          texture.imageBBox.x,
          texture.imageBBox.y,
          texture.imageBBox.x + texture.imageBBox.w - 1,
          texture.imageBBox.y + texture.imageBBox.h - 1,
        ],
      };
      frames.push(this.createFrame(defaultFrameData, texture));
    } else {
      for (const frameData of stateData.frames) {
        frames.push(this.createFrame(frameData, texture));
      }
    }

    return new SpriteState({
      label: stateData.label,
      texture,
      delay: stateData.delay ?? 100,
      frames,
    });
  }

  private createFrame(frameData: SpriteFrameData, texture: Texture): SpriteFrame {
    let frameBoundingBox: GeomRect;
    if (frameData.bbox !== undefined) {
      frameBoundingBox = new GeomRect(
        frameData.bbox[0],
        frameData.bbox[1],
        frameData.bbox[2] - frameData.bbox[0] + 1,
        frameData.bbox[3] - frameData.bbox[1] + 1,
      );
    } else {
      frameBoundingBox = texture.imageBBox;
    }

    let frameAnchor: GeomPoint;
    if (frameData.anchor !== undefined) {
      frameAnchor = new GeomPoint(frameData.anchor[0], frameData.anchor[1]);
    } else {
      frameAnchor = new GeomPoint(0, 0);
    }

    return new SpriteFrame({
      boundingBox: frameBoundingBox,
      anchor: frameAnchor,
    });
  }
}
