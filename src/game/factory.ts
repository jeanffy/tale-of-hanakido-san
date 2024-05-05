import { Game } from './game.js';
import { Hero } from './hero.js';
import { World } from './world.js';
import { SpriteManager } from './sprite-manager.js';

export class Factory {
  private spriteManager: SpriteManager | undefined;
  private game: Game | undefined;
  private hero: Hero | undefined;
  private world: World | undefined;

  public getSpriteManager(): SpriteManager {
    if (this.spriteManager === undefined) {
      this.spriteManager = new SpriteManager();
    }
    return this.spriteManager;
  }

  public getGame(): Game {
    if (this.game === undefined) {
      this.game = new Game(this); //, this.getEnvironment(), this.getSpriteManager(), this.getDrawContext());
    }
    return this.game;
  }

  public getHero(): Hero {
    if (this.hero === undefined) {
      this.hero = new Hero(this.getSpriteManager(), this.getWorld());
    }
    return this.hero;
  }

  public getWorld(): World {
    if (this.world === undefined) {
      this.world = new World(this.getSpriteManager());
    }
    return this.world;
  }
}
