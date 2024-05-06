import { SpriteId } from './data-sprite.js';

export interface SpriteData {
  id: SpriteId;
  url: string;
  scale?: number; // integer number, for example with 2, one pixel will be drawn as a square of 2x2 pixels
  hitBox?: number[]; // if undefined, the hitBox will be the entire sprite
  layers?: {
    // the coordinates of the background part (drawn below characters)
    background: number[]; // x1, y1, x2, y2 (NOT x, y, w, h)
    // the coordinates of the overlay part (drawn above characters)
    overlay: number[]; // x1, y1, x2, y2 (NOT x, y, w, h)
  };
}

const assetsDir = 'assets';
const scale = 3;

// prettier-ignore
export const dataSprites: SpriteData[] = [
  { id: SpriteId.Debug, url: `${assetsDir}/debug.png`, scale },

  { id: SpriteId.Grass0, url: `${assetsDir}/grass-empty.png`, scale },
  { id: SpriteId.Grass1, url: `${assetsDir}/grass.png`, scale },

  { id: SpriteId.Plant, url: `${assetsDir}/plant.png`, scale, hitBox: [2, 17, 13, 27], layers: { background: [0, 14, 14, 28], overlay: [0, 0, 14, 13] } },
  { id: SpriteId.Bush, url: `${assetsDir}/bush.png`, scale, hitBox: [1, 1, 11, 11 ] },
  { id: SpriteId.Chest, url: `${assetsDir}/chest.png`, scale, hitBox: [0, 0, 19, 13 ] },
  { id: SpriteId.Book, url: `${assetsDir}/book.png`, scale }, // this sprite has no hitBox defined, so the entire sprite will be considered has a hitBox

  { id: SpriteId.HeroMoveUp0, url: `${assetsDir}/hero-move-up-0.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveUp1, url: `${assetsDir}/hero-move-up-1.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveUp2, url: `${assetsDir}/hero-move-up-2.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveUp3, url: `${assetsDir}/hero-move-up-3.png`, scale, hitBox: [1, 12, 12, 20] },

  { id: SpriteId.HeroMoveDown0, url: `${assetsDir}/hero-move-down-0.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveDown1, url: `${assetsDir}/hero-move-down-1.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveDown2, url: `${assetsDir}/hero-move-down-2.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveDown3, url: `${assetsDir}/hero-move-down-3.png`, scale, hitBox: [1, 12, 12, 20] },

  { id: SpriteId.HeroMoveLeft0, url: `${assetsDir}/hero-move-left-0.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveLeft1, url: `${assetsDir}/hero-move-left-1.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveLeft2, url: `${assetsDir}/hero-move-left-2.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveLeft3, url: `${assetsDir}/hero-move-left-3.png`, scale, hitBox: [1, 12, 12, 20] },

  { id: SpriteId.HeroMoveRight0, url: `${assetsDir}/hero-move-right-0.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveRight1, url: `${assetsDir}/hero-move-right-1.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveRight2, url: `${assetsDir}/hero-move-right-2.png`, scale, hitBox: [1, 12, 12, 20] },
  { id: SpriteId.HeroMoveRight3, url: `${assetsDir}/hero-move-right-3.png`, scale, hitBox: [1, 12, 12, 20] },
];
