import { Game } from './game.js';
import { World } from './world/world.js';
import { SpriteManager } from './sprite-manager.js';
import { WorldData, WorldDataItemType, WorldDataLayerItem } from './data/data-world.js';
import { WorldItem } from './world/world-item.js';
import { WorldHero } from './world/world-hero.js';
import { GeomRect } from './geom/geom-rect.js';
import { GeomCircle } from './geom/geom-circle.js';

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
      this.world = new World(
        worldData.layer0.map(item => this.createWorldItem(item)),
        worldData.layer1.map(item => this.createWorldItem(item)),
        worldData.layer2.map(item => this.createWorldItem(item)),
        worldData.layer3.map(item => this.createWorldItem(item)),
      );
    }
    return this.world;
  }

  private createWorldItem(dataItem: WorldDataLayerItem): WorldItem {
    let bbox: GeomRect | undefined;
    if (dataItem.bbox !== undefined) {
      bbox = new GeomRect(
        dataItem.bbox[0],
        dataItem.bbox[1],
        dataItem.bbox[2] - dataItem.bbox[0] + 1,
        dataItem.bbox[3] - dataItem.bbox[1] + 1,
      );
    }

    let hitBox: GeomRect | GeomCircle | undefined;
    if (dataItem.hitBox === 'overall') {
      hitBox = bbox;
    } else if (dataItem.hitBox !== undefined) {
      hitBox = new GeomRect(
        dataItem.hitBox[0],
        dataItem.hitBox[1],
        dataItem.hitBox[2] - dataItem.hitBox[0] + 1,
        dataItem.hitBox[3] - dataItem.hitBox[1] + 1,
      );
    }

    switch (dataItem.type) {
      case WorldDataItemType.Hero:
        console.log(bbox);
        console.log(hitBox);
        return new WorldHero(this.getSpriteManager(), {
          x: dataItem.x,
          y: dataItem.y,
          bbox,
          hitBox,
        });
      default:
        if (dataItem.id === undefined) {
          console.error(`No sprite id for world item at (x,y) = (${dataItem.x},${dataItem.y})`);
        }
        return new WorldItem(this.getSpriteManager(), {
          x: dataItem.x,
          y: dataItem.y,
          spriteId: dataItem.id,
          bbox,
          hitBox,
        });
    }
  }
}
