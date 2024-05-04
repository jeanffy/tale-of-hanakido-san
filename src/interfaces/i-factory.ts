import type { IEnvironment } from './i-environment.js';
import type { IGame } from './i-game.js';
import type { IHero } from './i-hero.js';
import type { IWorld } from './i-world.js';
import type { ISpriteManager } from './i-sprite-manager.js';

export interface IFactory {
  getEnvironment(): IEnvironment;
  getSpriteManager(): ISpriteManager;
  getGame(): IGame;
  getHero(): IHero;
  getWorld(): IWorld;
}
