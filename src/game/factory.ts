import { Game } from './game.js';
import { Scene } from './scene/scene.js';
import { TileManager } from './tile-manager.js';
import { SceneData, SceneDataItemType, SceneDataLayerItem } from './data/scene-data.js';
import { SceneItem } from './scene/scene-item.js';
import { SceneHero } from './scene/scene-hero.js';
import { SpriteManager } from './sprite-manager.js';
import { spritesData } from './data/sprites-data.js';
import { SceneChest } from './scene/scene-chest.js';

export class Factory {
  private tileManager: TileManager | undefined;
  private spriteManager: SpriteManager | undefined;
  private game: Game | undefined;
  private scene: Scene | undefined;

  public getTileManager(): TileManager {
    if (this.tileManager === undefined) {
      this.tileManager = new TileManager();
    }
    return this.tileManager;
  }

  public getSpriteManager(): SpriteManager {
    if (this.spriteManager === undefined) {
      this.spriteManager = new SpriteManager(spritesData, this.getTileManager());
    }
    return this.spriteManager;
  }

  public getGame(scene: Scene): Game {
    if (this.game === undefined) {
      this.game = new Game(scene);
    }
    return this.game;
  }

  public getScene(sceneData: SceneData): Scene {
    if (this.scene === undefined) {
      this.scene = new Scene(
        sceneData.layer0.map(item => this.createSceneItem(this.getSpriteManager(), item)),
        sceneData.layer1.map(item => this.createSceneItem(this.getSpriteManager(), item)),
        sceneData.layer2.map(item => this.createSceneItem(this.getSpriteManager(), item)),
        sceneData.layer3.map(item => this.createSceneItem(this.getSpriteManager(), item)),
      );
    }
    return this.scene;
  }

  private createSceneItem(spriteManager: SpriteManager, dataItem: SceneDataLayerItem): SceneItem {
    const sprite = spriteManager.getSprite(dataItem.spriteId);

    if (dataItem.type !== undefined) {
      switch (dataItem.type) {
        case SceneDataItemType.Chest:
          return new SceneChest({ sprite, x: dataItem.x, y: dataItem.y });
        case SceneDataItemType.Hero:
          return new SceneHero({ sprite, x: dataItem.x, y: dataItem.y });
        default:
          console.error(`Unhandled item type '${dataItem.type}' at (x,y) = (${dataItem.x},${dataItem.y})`);
          throw new Error();
      }
    }

    return new SceneItem({ sprite, x: dataItem.x, y: dataItem.y });
  }
}
