import { Game } from './game.js';
import { World } from './world/world.js';
import { TileManager } from './tile-manager.js';
import { WorldData, WorldDataItemType, WorldDataLayerItem } from './data/data-world.js';
import { WorldItem } from './world/world-item.js';
import { WorldHero } from './world/world-hero.js';
import { SpriteManager } from './sprite-manager.js';
import { dataSprites } from './data/data-sprites.js';

export class Factory {
  private tileManager: TileManager | undefined;
  private spriteManager: SpriteManager | undefined;
  private game: Game | undefined;
  private world: World | undefined;

  public getTileManager(): TileManager {
    if (this.tileManager === undefined) {
      this.tileManager = new TileManager();
    }
    return this.tileManager;
  }

  public getSpriteManager(): SpriteManager {
    if (this.spriteManager === undefined) {
      this.spriteManager = new SpriteManager(dataSprites, this.getTileManager());
    }
    return this.spriteManager;
  }

  public getGame(world: World): Game {
    if (this.game === undefined) {
      this.game = new Game(world);
    }
    return this.game;
  }

  public getWorld(worldData: WorldData): World {
    if (this.world === undefined) {
      this.world = new World(
        worldData.layer0.map(item => this.createWorldItem(this.getSpriteManager(), item)),
        worldData.layer1.map(item => this.createWorldItem(this.getSpriteManager(), item)),
        worldData.layer2.map(item => this.createWorldItem(this.getSpriteManager(), item)),
        worldData.layer3.map(item => this.createWorldItem(this.getSpriteManager(), item)),
      );
    }
    return this.world;
  }

  private createWorldItem(spriteManager: SpriteManager, dataItem: WorldDataLayerItem): WorldItem {
    if (dataItem.type !== undefined) {
      switch (dataItem.type) {
        case WorldDataItemType.Hero:
          return new WorldHero(spriteManager, { x: dataItem.x, y: dataItem.y });
        default:
          console.error(`Unhandled item type '${dataItem.type}' at (x,y) = (${dataItem.x},${dataItem.y})`);
          throw new Error();
      }
    }

    if (dataItem.spriteId !== undefined) {
      const sprite = spriteManager.getSprite(dataItem.spriteId);
      return new WorldItem({ sprite, x: dataItem.x, y: dataItem.y });
    }

    console.error(`No spriteId nor type for at (x,y) = (${dataItem.x},${dataItem.y})`);
    throw new Error();
  }
}
