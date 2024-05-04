import type { Sprite, SpriteId } from '../game/sprite.js';

export interface ISpriteManagerLoadSprite {
  id: SpriteId;
  url: string;
}

export interface ISpriteManager {
  loadSprites(sprites: ISpriteManagerLoadSprite[]): Promise<void>;
  getSprite(id: SpriteId): Sprite;
}
