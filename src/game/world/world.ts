import type { DrawContext } from '../draw-context.js';
import { SpriteManager } from '../sprite-manager.js';
import { GeomPoint } from '../geom/geom-point.js';
import { WorldItem, WorldItemRenderSecondPassFunc } from './world-item.js';
import { ControlState } from '../control-state.js';
import { SpriteId } from '../data/data-sprite.js';
import { WorldCollider } from './world-collider.js';
import { GeomVector } from '../geom/geom-vector.js';
import { GeomRect } from '../geom/geom-rect.js';

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
          sprite.renderLandscape(drawContext, new GeomPoint(i * sprite.img.width, j * sprite.img.height));
        }
      }
    }

    // for each background render, we populate the second pass function to be called
    // this second pass function allow for a background object to have a part of its sprite to
    // display on top on any character (for example for a tree: the trunk will display under the character when
    // the character stays before it, and the leaves will disply above the character when the character
    // stays behind it
    const secondPassFuncs: (WorldItemRenderSecondPassFunc | undefined)[] = [];
    this.backgroundItems.forEach(item => secondPassFuncs.push(item.render(drawContext)));
    this.characters.forEach(item => item.render(drawContext));
    secondPassFuncs.filter((f): f is WorldItemRenderSecondPassFunc => f !== undefined).forEach(f => f());
    this.overlayItems.forEach(item => item.render(drawContext));
  }

  public itemCollides(hitBox: GeomRect): WorldItem | undefined {
    for (const item of this.backgroundItems) {
      const spriteHitBox = item.hitBox.moveByVector(new GeomVector(item.position.x, item.position.y));
      if (spriteHitBox.intersects(hitBox)) {
        return item;
      }
    }
    return undefined;
  }
}
