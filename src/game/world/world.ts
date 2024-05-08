import type { DrawContext } from '../draw-context.js';
import { SpriteManager } from '../sprite-manager.js';
import { GeomPoint } from '../geom/geom-point.js';
import { WorldItem, WorldItemLayer, WorldItemRenderSecondPassFunc } from './world-item.js';
import { ControlState } from '../control-state.js';
import { SpriteId } from '../data/data-sprite.js';
import { WorldCollider } from './world-collider.js';

export interface WorldInitParams {
  landscape: SpriteId[][];
  background: WorldItem[];
  characters: WorldItem[];
  overlays: WorldItem[];
}

export class World {
  private landscapeSprites: SpriteId[][];
  public backgroundItems: WorldItem[];
  private characters: WorldItem[];
  private overlayItems: WorldItem[];
  private collider: WorldCollider; // TODO: remove coupling

  public constructor(private spriteManager: SpriteManager, params: WorldInitParams) {
    this.landscapeSprites = params.landscape;
    this.backgroundItems = params.background;
    this.characters = params.characters;
    this.overlayItems = params.overlays;
    this.collider = new WorldCollider(this.backgroundItems);
  }

  public processInputs(dt: number, controlState: ControlState): void {
    this.characters.forEach(item => item.processInputs(controlState));
  }

  public update(dt: number): void {
    this.characters.forEach(item => item.update(dt, this.collider));
  }

  public render(drawContext: DrawContext): void {
    if (this.landscapeSprites.length > 0) {
      const mapHorizontalLength = this.landscapeSprites[0].length;
      const mapVerticalLength = this.landscapeSprites.length;
      for (let i = 0; i < mapHorizontalLength; i++) {
        for (let j = 0; j < mapVerticalLength; j++) {
          const spriteId = this.landscapeSprites[j][i];
          const sprite = this.spriteManager.getSprite(spriteId);
          sprite.render(drawContext, new GeomPoint(i * sprite.img.width, j * sprite.img.height), WorldItemLayer.Landscape);
        }
      }
    }

    const items = [...this.backgroundItems, ...this.characters].sort((a, b) => a.position.y - b.position.y);

    const secondPassFuncs: WorldItemRenderSecondPassFunc[] = [];
    items.forEach(item => {
      const secondPassFunc = item.render(drawContext);
      if (secondPassFunc !== undefined) {
        secondPassFuncs.push(secondPassFunc);
      }
    });

    secondPassFuncs.forEach(f => f());

    this.overlayItems.sort((a, b) => a.position.y - b.position.y);
    this.overlayItems.forEach(item => item.render(drawContext));
  }
}
