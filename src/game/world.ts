import type { IDrawContext } from '../interfaces/i-draw-context.js';
import type { IEnvironment } from '../interfaces/i-environment.js';
import type { IWorld } from '../interfaces/i-world.js';
import type { ISpriteManager } from '../interfaces/i-sprite-manager.js';
import { SpriteId, type Sprite } from './sprite.js';

const MAP_TILE_COUNT_W = 20;
const MAP_TILE_COUNT_H = 20;

export class World implements IWorld {
  public grassSprite: Sprite;

  public constructor(
    private environment: IEnvironment,
    private spriteManager: ISpriteManager
  ) {
    this.grassSprite = this.spriteManager.getSprite(SpriteId.Grass);
  }

  public update(dt: number): void {}

  public render(drawContext: IDrawContext): void {
    for (let i = 0; i < MAP_TILE_COUNT_W; i++) {
      for (let j = 0; j < MAP_TILE_COUNT_H; j++) {
        const w = this.grassSprite.element.width * this.environment.zoom;
        const h = this.grassSprite.element.height * this.environment.zoom;
        drawContext.drawImage(this.grassSprite.element, i * w, j * h, w, h);
      }
    }
  }
}
