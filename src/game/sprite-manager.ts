import type {
  ISpriteManager,
  ISpriteManagerLoadSprite,
} from '../interfaces/i-sprite-manager.js';
import type { Sprite, SpriteId } from './sprite.js';

export class SpriteManager implements ISpriteManager {
  private sprites: Sprite[] = [];

  public async loadSprites(sprites: ISpriteManagerLoadSprite[]): Promise<void> {
    this.sprites = await Promise.all(
      sprites.map(
        (s) =>
          new Promise<Sprite>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              resolve({
                id: s.id,
                element: img,
              });
            };
            img.onerror = () => {
              reject();
            };
            img.src = s.url;
          })
      )
    );
  }

  public getSprite(id: SpriteId): Sprite {
    const sprite = this.sprites.find((s) => s.id === id);
    if (sprite === undefined) {
      throw new Error(`No sprite for id '${id}'`);
    }
    return sprite;
  }
}
