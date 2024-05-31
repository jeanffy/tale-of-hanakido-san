import { SceneDataItemType } from './scene.data.js';
import { EngineApp } from '../engine/engine-app.js';
import { GenericItem } from '../engine/scene/generic.item.js';
import { SpriteManager } from '../engine/sprite/sprite-manager.js';
import { ChestItem } from './chest.item.js';
import { HeroItem } from './hero.item.js';
import { SceneLayerItemData } from '../engine/data.js';

export class App extends EngineApp {
  protected createSceneItem(spriteManager: SpriteManager, dataItem: SceneLayerItemData): GenericItem {
    const sprite = spriteManager.getSprite(dataItem.spriteId);

    if (dataItem.type !== undefined) {
      switch (dataItem.type) {
        case SceneDataItemType.Chest:
          return new ChestItem({ sprite, x: dataItem.x, y: dataItem.y });
        case SceneDataItemType.Hero:
          return new HeroItem({ sprite, x: dataItem.x, y: dataItem.y });
        default:
          console.error(`Unhandled item type '${dataItem.type}' at (x,y) = (${dataItem.x},${dataItem.y})`);
          throw new Error();
      }
    }

    return new GenericItem({ sprite, x: dataItem.x, y: dataItem.y });
  }
}
