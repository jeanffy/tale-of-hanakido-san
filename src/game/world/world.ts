import type { DrawContext } from '../draw-context.js';
import { SpriteManager } from '../sprite-manager.js';
import { GeomPoint } from '../geom/geom-point.js';
import { WorldItem, WorldItemLayer, WorldItemRenderSecondPassFunc } from './world-item.js';
import { ControlState } from '../control-state.js';
import { SpriteId } from '../data/data-sprite.js';
import { WorldCollider } from './world-collider.js';
import { GeomRect } from '../geom/geom-rect.js';
import { GeomCircle } from '../geom/geom-circle.js';
import { GeomVector } from '../geom/geom-vector.js';

export interface WorldInitParams {
  landscape: SpriteId[][];
  background: WorldItem[];
  characters: WorldItem[];
  overlays: WorldItem[];
}

export class World implements WorldCollider {
  private landscapeSprites: SpriteId[][];
  private backgroundItems: WorldItem[];
  private characters: WorldItem[];
  private overlayItems: WorldItem[];

  public constructor(private spriteManager: SpriteManager, params: WorldInitParams) {
    this.landscapeSprites = params.landscape;
    this.backgroundItems = params.background; // TODO order by Y ascending
    this.characters = params.characters;
    this.overlayItems = params.overlays; // TODO order by Y ascending
  }

  public processInputs(dt: number, controlState: ControlState): void {
    this.characters.forEach(item => item.processInputs(controlState));
  }

  public update(dt: number): void {
    this.characters.forEach(item => item.update(dt, this));
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

  public itemCollides(hitBox: GeomRect | GeomCircle): WorldItem | undefined {
    for (const item of this.backgroundItems) {
      if (item.hitBox === undefined) {
        continue;
      }
      if (hitBox instanceof GeomRect) {
        if (item.hitBox instanceof GeomRect) {
          const itemHitBox = item.hitBox.moveByVector(new GeomVector(item.position.x, item.position.y));
          if (hitBox.intersects(itemHitBox)) {
            return item;
          }
        }
      }
    }
    return undefined;
  }
}
