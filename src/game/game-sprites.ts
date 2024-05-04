import type { ISpriteManagerLoadSprite } from '../interfaces/i-sprite-manager.js';
import { SpriteId } from './sprite.js';

const assetsDir = 'assets';

export const gameSprites: ISpriteManagerLoadSprite[] = [
  { id: SpriteId.Grass, url: `${assetsDir}/grass.jpg` },

  { id: SpriteId.HeroMoveUp0, url: `${assetsDir}/hero-move-up-0.png` },
  { id: SpriteId.HeroMoveUp1, url: `${assetsDir}/hero-move-up-1.png` },
  { id: SpriteId.HeroMoveUp2, url: `${assetsDir}/hero-move-up-2.png` },
  { id: SpriteId.HeroMoveUp3, url: `${assetsDir}/hero-move-up-3.png` },

  { id: SpriteId.HeroMoveDown0, url: `${assetsDir}/hero-move-down-0.png` },
  { id: SpriteId.HeroMoveDown1, url: `${assetsDir}/hero-move-down-1.png` },
  { id: SpriteId.HeroMoveDown2, url: `${assetsDir}/hero-move-down-2.png` },
  { id: SpriteId.HeroMoveDown3, url: `${assetsDir}/hero-move-down-3.png` },

  { id: SpriteId.HeroMoveLeft0, url: `${assetsDir}/hero-move-left-0.png` },
  { id: SpriteId.HeroMoveLeft1, url: `${assetsDir}/hero-move-left-1.png` },
  { id: SpriteId.HeroMoveLeft2, url: `${assetsDir}/hero-move-left-2.png` },
  { id: SpriteId.HeroMoveLeft3, url: `${assetsDir}/hero-move-left-3.png` },

  { id: SpriteId.HeroMoveRight0, url: `${assetsDir}/hero-move-right-0.png` },
  { id: SpriteId.HeroMoveRight1, url: `${assetsDir}/hero-move-right-1.png` },
  { id: SpriteId.HeroMoveRight2, url: `${assetsDir}/hero-move-right-2.png` },
  { id: SpriteId.HeroMoveRight3, url: `${assetsDir}/hero-move-right-3.png` },
];
