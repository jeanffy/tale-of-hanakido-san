import { GeomRect } from './geom-rect.js';

export enum SpriteId {
  Debug = 'debug',

  Grass0 = 'grass0',
  Grass1 = 'grass1',
  Plant = 'plant',
  Bush = 'bush',

  HeroMoveUp0 = 'hero-move-up-0',
  HeroMoveUp1 = 'hero-move-up-1',
  HeroMoveUp2 = 'hero-move-up-2',
  HeroMoveUp3 = 'hero-move-up-3',

  HeroMoveDown0 = 'hero-move-down-0',
  HeroMoveDown1 = 'hero-move-down-1',
  HeroMoveDown2 = 'hero-move-down-2',
  HeroMoveDown3 = 'hero-move-down-3',

  HeroMoveLeft0 = 'hero-move-left-0',
  HeroMoveLeft1 = 'hero-move-left-1',
  HeroMoveLeft2 = 'hero-move-left-2',
  HeroMoveLeft3 = 'hero-move-left-3',

  HeroMoveRight0 = 'hero-move-right-0',
  HeroMoveRight1 = 'hero-move-right-1',
  HeroMoveRight2 = 'hero-move-right-2',
  HeroMoveRight3 = 'hero-move-right-3',
}

export interface Sprite {
  id: SpriteId;
  img: HTMLImageElement;
  hitBox: GeomRect;
  layers?: {
    background: GeomRect;
    overlay: GeomRect;
  };
}
