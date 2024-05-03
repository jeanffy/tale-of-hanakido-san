import { Environment } from './environment';
import { Game } from './game';
import { Hero } from './hero';
import type { IDrawContext } from './interfaces/i-draw-context';
import type { IEnvironment } from './interfaces/i-environment';
import type { IFactory } from './interfaces/i-factory';
import type { IGame } from './interfaces/i-game';
import type { IHero } from './interfaces/i-hero.mjs';
import type { ISpriteManager } from './interfaces/i-sprite-manager';
import { SpriteManager } from './sprite-manager';

export class Factory implements IFactory {
  private drawContext!: IDrawContext;
  private environment: Environment | undefined;
  private spriteManager: SpriteManager | undefined;
  private game: Game | undefined;
  private hero: Hero | undefined;

  public setDrawContext(drawContext: IDrawContext): void {
    this.drawContext = drawContext;
  }

  public getDrawContext(): IDrawContext {
    return this.drawContext;
  }

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
      this.game = new Game(this, this.getEnvironment(), this.getSpriteManager(), this.getDrawContext());
    }
    return this.game;
  }

  public getHero(): IHero {
    if (this.hero === undefined) {
      this.hero = new Hero(this.getEnvironment(), this.getSpriteManager(), this.getDrawContext());
    }
    return this.hero;
  }
}
