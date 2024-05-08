import { Game } from './game.js';
import { World } from './world/world.js';
import { SpriteManager } from './sprite-manager.js';
import { WorldData, WorldDataItem, WorldDataItemType } from './data/data-world.js';
import { WorldItem, WorldItemLayer } from './world/world-item.js';
import { WorldHero } from './world/world-hero.js';
import { WorldObject } from './world/world-object.js';

export class Factory {
  private spriteManager: SpriteManager | undefined;
  private game: Game | undefined;
  private world: World | undefined;

  public getSpriteManager(): SpriteManager {
    if (this.spriteManager === undefined) {
      this.spriteManager = new SpriteManager();
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
      this.world = new World(this.getSpriteManager(), {
        landscape: worldData.landscape,
        background: worldData.backgroundItems.map(item => this.createWorldItem(item, WorldItemLayer.Background)),
        characters: worldData.characters.map(item => this.createWorldItem(item, WorldItemLayer.Characters)),
        overlays: worldData.overlayItems.map(item => this.createWorldItem(item, WorldItemLayer.Overlay)),
      });
    }
    return this.world;
  }

  private createWorldItem(dataItem: WorldDataItem, layer: WorldItemLayer): WorldItem {
    switch (dataItem.type) {
      case WorldDataItemType.Hero:
        return new WorldHero(this.getSpriteManager(), layer, dataItem.x, dataItem.y);
      default:
        return new WorldObject(this.getSpriteManager(), dataItem.spriteId!, layer, dataItem.x, dataItem.y);
    }
  }
}
