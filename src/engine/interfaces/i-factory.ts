import type { IDrawContext } from './i-draw-context';
import type { IEnvironment } from './i-environment';
import type { IGame } from './i-game';
import type { IHero } from './i-hero.mjs';
import type { ISpriteManager } from './i-sprite-manager';

export interface IFactory {
  setDrawContext(drawContext: IDrawContext): void;

  getDrawContext(): IDrawContext;
  getEnvironment(): IEnvironment;
  getSpriteManager(): ISpriteManager;
  getGame(): IGame;
  getHero(): IHero;
}
