import { TileId } from './data-tiles.js';

export enum SpriteId {
  Debug01 = 'debug01',
  Grass0 = 'grass0',
  Grass1 = 'grass1',
  Bush = 'bush',
  Chest = 'chest',
  Book = 'book',

  Plant = 'plant',
  PlantOverlay = 'plant-overlay',

  HeroStillUp = 'hero-still-up',
  HeroStillDown = 'hero-still-down',
  HeroStillLeft = 'hero-still-left',
  HeroStillRight = 'hero-still-right',
  HeroWalkingUp = 'hero-walking-up',
  HeroWalkingDown = 'hero-walking-down',
  HeroWalkingLeft = 'hero-walking-left',
  HeroWalkingRight = 'hero-walking-right',
}

export interface SpriteData {
  id: SpriteId;
  tileId: TileId;
  bbox?: [number, number, number, number]; // x1, y1, x2, y2
  hitBox?: [number, number, number, number] | 'bbox'; // x1, y1, x2, y2
  anchor?: [number, number] // dx, dy from bbox top-left corner, applies to bbox and hitBox
  frames?: number;
  delay?: number;
}

// prettier-ignore
export const dataSprites: SpriteData[] = [
  {
    id: SpriteId.Debug01,
    tileId: TileId.Debug01,
    bbox: [100, 100, 250, 250],
    anchor: [0, -50],
    hitBox: [50, 50, 100, 100],
  },

  { id: SpriteId.Grass0, tileId: TileId.Grass0 },
  { id: SpriteId.Grass1, tileId: TileId.Grass1 },
  { id: SpriteId.Bush, tileId: TileId.Bush, hitBox: [3, 3, 35, 35] },
  { id: SpriteId.Chest, tileId: TileId.Chest, hitBox: [0, 0, 59, 41] },
  { id: SpriteId.Book, tileId: TileId.Book, hitBox: 'bbox' },
  { id: SpriteId.Plant, tileId: TileId.Plant, bbox: [0, 51, 44, 86], hitBox: 'bbox', anchor: [0, -51] },
  { id: SpriteId.PlantOverlay, tileId: TileId.Plant, bbox: [0, 0, 44, 50] },

  { id: SpriteId.HeroStillUp, tileId: TileId.Hero, bbox: [0, 66, 44, 134], hitBox: [5, 15, 35, 65] },
  { id: SpriteId.HeroStillDown, tileId: TileId.Hero, bbox: [0, 0, 45, 66], hitBox: [5, 15, 35, 65] },
  { id: SpriteId.HeroStillLeft, tileId: TileId.Hero, bbox: [3, 135, 41, 200], hitBox: [5, 15, 35, 65] },
  { id: SpriteId.HeroStillRight, tileId: TileId.Hero, bbox: [3, 201, 41, 266], hitBox: [5, 15, 35, 65] },

  { id: SpriteId.HeroWalkingUp, tileId: TileId.Hero, bbox: [0, 66, 44, 134], hitBox: [5, 15, 35, 65], frames: 4 },
  { id: SpriteId.HeroWalkingDown, tileId: TileId.Hero, bbox: [0, 0, 44, 65], hitBox: [5, 15, 35, 65], frames: 4 },
  { id: SpriteId.HeroWalkingLeft, tileId: TileId.Hero, bbox: [3, 135, 41, 200], hitBox: [5, 15, 35, 65], frames: 4 },
  { id: SpriteId.HeroWalkingRight, tileId: TileId.Hero, bbox: [3, 201, 41, 266], hitBox: [5, 15, 35, 65], frames: 4 },
];
