import { SpriteData } from './sprite-manager.js';
import { SpriteId } from './sprite.js';

const assetsDir = 'assets';

// prettier-ignore
export const dataSprites: SpriteData[] = [
  { id: SpriteId.Debug, url: `${assetsDir}/debug.png` },

  { id: SpriteId.Grass0, url: `${assetsDir}/grass-empty.png` },
  { id: SpriteId.Grass1, url: `${assetsDir}/grass.png` },
  { id: SpriteId.Plant, url: `${assetsDir}/plant.png`, hitBox: [2, 17, 13, 27], layers: { background: [0, 14, 14, 28], overlay: [0, 0, 14, 13] } },
  { id: SpriteId.Bush, url: `${assetsDir}/bush.png`, hitBox: [1, 1, 11, 11 ] },

  { id: SpriteId.HeroMoveUp0, url: `${assetsDir}/hero-move-up-0.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveUp1, url: `${assetsDir}/hero-move-up-1.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveUp2, url: `${assetsDir}/hero-move-up-2.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveUp3, url: `${assetsDir}/hero-move-up-3.png`, hitBox: [1, 11, 12, 18] },

  { id: SpriteId.HeroMoveDown0, url: `${assetsDir}/hero-move-down-0.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveDown1, url: `${assetsDir}/hero-move-down-1.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveDown2, url: `${assetsDir}/hero-move-down-2.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveDown3, url: `${assetsDir}/hero-move-down-3.png`, hitBox: [1, 11, 12, 18] },

  { id: SpriteId.HeroMoveLeft0, url: `${assetsDir}/hero-move-left-0.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveLeft1, url: `${assetsDir}/hero-move-left-1.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveLeft2, url: `${assetsDir}/hero-move-left-2.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveLeft3, url: `${assetsDir}/hero-move-left-3.png`, hitBox: [1, 11, 12, 18] },

  { id: SpriteId.HeroMoveRight0, url: `${assetsDir}/hero-move-right-0.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveRight1, url: `${assetsDir}/hero-move-right-1.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveRight2, url: `${assetsDir}/hero-move-right-2.png`, hitBox: [1, 11, 12, 18] },
  { id: SpriteId.HeroMoveRight3, url: `${assetsDir}/hero-move-right-3.png`, hitBox: [1, 11, 12, 18] },
];
