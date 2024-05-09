import { SpriteId } from './data-sprite-id.js';

export interface SpriteData {
  id: SpriteId;
  url: string;
}

const assetsDir = 'assets';

// prettier-ignore
export const dataSprites: SpriteData[] = [
  { id: SpriteId.Debug, url: `${assetsDir}/debug.png` },

  { id: SpriteId.Grass0, url: `${assetsDir}/grass-empty.png` },
  { id: SpriteId.Grass1, url: `${assetsDir}/grass.png` },

  { id: SpriteId.Plant, url: `${assetsDir}/plant.png` },
  { id: SpriteId.Bush, url: `${assetsDir}/bush.png` },
  { id: SpriteId.Chest, url: `${assetsDir}/chest.png` },
  { id: SpriteId.Book, url: `${assetsDir}/book.png` },

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
