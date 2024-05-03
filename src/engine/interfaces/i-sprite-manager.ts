import type { Sprite, SpriteId } from '../sprite';

export interface ISpriteManagerLoadSprite {
  id: SpriteId;
  url: string;
}

export interface ISpriteManager {
  loadSprites(sprites: ISpriteManagerLoadSprite[]): Promise<void>;
  getSprite(id: SpriteId): Sprite;
}
