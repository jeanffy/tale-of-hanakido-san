import { Game } from './game.js';
import { World, WorldInitParams } from './world/world.js';
import { SpriteManager } from './sprite-manager.js';

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

  public getWorld(params: WorldInitParams): World {
    if (this.world === undefined) {
      this.world = new World(this.getSpriteManager(), params);
    }
    return this.world;
  }
}
