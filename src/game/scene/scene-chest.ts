import { SpriteChestState } from '../data/sprites-data.js';
import { SceneCollider } from './scene-collider.js';
import { SceneItem, SceneItemInitParams } from './scene-item.js';

export class SceneChest extends SceneItem {
  private isOpen = false;

  public constructor(params: SceneItemInitParams) {
    super(params);
    this._sprite.selectState(SpriteChestState.Closed);
  }

  public open(): void {
    if (!this.isOpen) {
      this._sprite.selectState(SpriteChestState.Opening);
      this.isOpen = true;
    }
  }

  public update(dt: number, collider: SceneCollider): void {
    super.update(dt, collider);
    if (this._lastSpriteUpdateOut.loopedAnimation) {
      this._sprite.selectState(SpriteChestState.Open);
    }
  }
}
