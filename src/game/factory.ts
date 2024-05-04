import { Environment } from './environment.js';
import { Game } from './game.js';
import { Hero } from './hero.js';
import type { IEnvironment } from '../interfaces/i-environment.js';
import type { IFactory } from '../interfaces/i-factory.js';
import type { IGame } from '../interfaces/i-game.js';
import type { IHero } from '../interfaces/i-hero.js';
import type { ISpriteManager } from '../interfaces/i-sprite-manager.js';
import { World } from './world.js';
import { SpriteManager } from './sprite-manager.js';
import type { IWorld } from '../interfaces/i-world.js';

export class Factory implements IFactory {
  private environment: Environment | undefined;
  private spriteManager: SpriteManager | undefined;
  private game: Game | undefined;
  private hero: Hero | undefined;
  private world: World | undefined;

  public getEnvironment(): IEnvironment {
    if (this.environment === undefined) {
      this.environment = new Environment();
    }
    return this.environment;
  }

  public getSpriteManager(): ISpriteManager {
    if (this.spriteManager === undefined) {
      this.spriteManager = new SpriteManager();
    }
    return this.spriteManager;
  }

  public getGame(): IGame {
    if (this.game === undefined) {
      this.game = new Game(this); //, this.getEnvironment(), this.getSpriteManager(), this.getDrawContext());
    }
    return this.game;
  }

  public getHero(): IHero {
    if (this.hero === undefined) {
      this.hero = new Hero(this.getEnvironment(), this.getSpriteManager());
    }
    return this.hero;
  }

  public getWorld(): IWorld {
    if (this.world === undefined) {
      this.world = new World(this.getEnvironment(), this.getSpriteManager());
    }
    return this.world;
  }
}
