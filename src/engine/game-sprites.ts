import type { ISpriteManagerLoadSprite } from './interfaces/i-sprite-manager';
import { SpriteId } from './sprite';

export const gameSprites: ISpriteManagerLoadSprite[] = [
  { id: SpriteId.Grass, url: 'grass.jpg' },

  { id: SpriteId.HeroMoveUp0, url: 'hero-move-up-0.png' },
  { id: SpriteId.HeroMoveUp1, url: 'hero-move-up-1.png' },
  { id: SpriteId.HeroMoveUp2, url: 'hero-move-up-2.png' },
  { id: SpriteId.HeroMoveUp3, url: 'hero-move-up-3.png' },

  { id: SpriteId.HeroMoveDown0, url: 'hero-move-down-0.png' },
  { id: SpriteId.HeroMoveDown1, url: 'hero-move-down-1.png' },
  { id: SpriteId.HeroMoveDown2, url: 'hero-move-down-2.png' },
  { id: SpriteId.HeroMoveDown3, url: 'hero-move-down-3.png' },

  { id: SpriteId.HeroMoveLeft0, url: 'hero-move-left-0.png' },
  { id: SpriteId.HeroMoveLeft1, url: 'hero-move-left-1.png' },
  { id: SpriteId.HeroMoveLeft2, url: 'hero-move-left-2.png' },
  { id: SpriteId.HeroMoveLeft3, url: 'hero-move-left-3.png' },

  { id: SpriteId.HeroMoveRight0, url: 'hero-move-right-0.png' },
  { id: SpriteId.HeroMoveRight1, url: 'hero-move-right-1.png' },
  { id: SpriteId.HeroMoveRight2, url: 'hero-move-right-2.png' },
  { id: SpriteId.HeroMoveRight3, url: 'hero-move-right-3.png' },
];
