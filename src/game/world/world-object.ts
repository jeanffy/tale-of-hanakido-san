import { GeomPoint } from '../geom/geom-point.js';
import { type Sprite } from '../sprite.js';
import { ControlState } from '../control-state.js';
import { SpriteManager } from '../sprite-manager.js';
import { DrawContext } from '../draw-context.js';
import { SpriteId } from '../data/data-sprite.js';
import { WorldItem, WorldItemKind, WorldItemRenderSecondPassFunc } from './world-item.js';
import { GeomRect } from '../geom/geom-rect.js';

export class WorldObject implements WorldItem {
  private sprite: Sprite;
  public kind: WorldItemKind;
  public position: GeomPoint;
  public hitBox: GeomRect;

  public constructor(private spriteManager: SpriteManager, kind: WorldItemKind, spriteId: SpriteId, x: number, y: number) {
    this.kind = kind;
    this.sprite = this.spriteManager.getSprite(spriteId);
    this.position = new GeomPoint(x, y);
    this.hitBox = this.sprite.hitBox;
  }

  public processInputs(controlState: ControlState): void {}

  public update(dt: number): void {}

  public render(drawContext: DrawContext): WorldItemRenderSecondPassFunc | undefined {
    let returnFunction: WorldItemRenderSecondPassFunc | undefined;
    switch (this.kind) {
      case WorldItemKind.Background:
        const needSecondPass = this.sprite.renderBackground(drawContext, this.position);
        if (needSecondPass) {
          returnFunction = () => this.sprite.renderOverlay(drawContext, this.position);
        }
        break;
      case WorldItemKind.Overlay:
        this.sprite.renderOverlay(drawContext, this.position);
        break;
      case WorldItemKind.Character:
        console.warn(`WorldItemKind.Character has object (id = ${this.sprite.id}, (x,y) = (${this.position.x},${this.position.y}))`);
    }
    return returnFunction;
  }
}
