import { SpriteChestState } from './sprites.data.js';
import { SceneCollider } from '../engine/scene/scene-collider.js';
import { GenericItem, GenericItemInitParams } from '../engine/scene/generic.item.js';
import { TileId } from './tiles.data.js';

export class ChestItem extends GenericItem<TileId> {
  private isOpen = false;

  public constructor(params: GenericItemInitParams<TileId>) {
    super(params);
    this._sprite.selectState(SpriteChestState.Closed);
  }

  public open(): void {
    if (this.isOpen) {
      this._sprite.selectState(SpriteChestState.Opening, true);
      this.isOpen = false;
    } else {
      this._sprite.selectState(SpriteChestState.Opening);
      this.isOpen = true;
    }
  }

  public update(dt: number, collider: SceneCollider<TileId>): void {
    super.update(dt, collider);
    if (this._lastSpriteUpdateOut.loopedAnimation) {
      this._sprite.selectState(this.isOpen ? SpriteChestState.Open : SpriteChestState.Closed);
    }
  }
}
