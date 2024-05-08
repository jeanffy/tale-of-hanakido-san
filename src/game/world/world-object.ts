import { GeomPoint } from '../geom/geom-point.js';
import { ControlState } from '../control-state.js';
import { SpriteManager } from '../sprite-manager.js';
import { SpriteId } from '../data/data-sprite.js';
import { WorldItem, WorldItemLayer } from './world-item.js';

export class WorldObject extends WorldItem {
  public constructor(spriteManager: SpriteManager, spriteId: SpriteId, layer: WorldItemLayer, x: number, y: number) {
    super(layer, new GeomPoint(x, y));
    this.sprite = spriteManager.getSprite(spriteId);
    this.hitBox = this.sprite.hitBoxRect ?? this.sprite.hitBoxCircle;
  }

  public processInputs(controlState: ControlState): void {}

  public update(dt: number): void {}
}
