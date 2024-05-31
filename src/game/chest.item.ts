import { SpriteChestState } from './sprites.data.js';
import { SceneCollider } from '../engine/scene/scene-collider.js';
import { GenericItem, GenericItemInitParams } from '../engine/scene/generic.item.js';

export class ChestItem extends GenericItem {
  private isOpen = false;

  public constructor(params: GenericItemInitParams) {
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

  public update(deltaTime: number, collider: SceneCollider): void {
    super.update(deltaTime, collider);
  }

  protected spriteAnimationLooped(): void {
    this._sprite.selectState(this.isOpen ? SpriteChestState.Open : SpriteChestState.Closed);
  }
}
