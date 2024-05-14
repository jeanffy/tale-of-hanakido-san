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

  Hero = 'hero',
}

export enum SpriteHeroState {
  StillUp = 'still-up',
  StillDown = 'still-down',
  StillLeft = 'still-left',
  StillRight = 'still-right',

  WalkingUp = 'walking-up',
  WalkingDown = 'walking-down',
  WalkingLeft = 'walking-left',
  WalkingRight = 'walking-right',
}

export interface SpriteData2 {
  id: SpriteId;
  states: {
    label?: string;
    tileId: TileId;
    bbox?: [number, number, number, number]; // x1, y1, x2, y2
    anchor?: [number, number] // dx, dy from bbox top-left corner, applies to bbox and hitBox
    frames?: number;
    delay?: number;
  }[],
  // 'bbox' indicates that hitBox is same as current state bbox (so in that case hitBox can vary)
  // 'bbox' value is best to be used with 1 state or with states with same bbox
  hitBox?: [number, number, number, number] | 'bbox'; // x1, y1, x2, y2
  hitBoxAnchor?: [number, number];
}

export const spritesData: SpriteData2[] = [
  { id: SpriteId.Debug01, states: [{ tileId: TileId.Debug01, bbox: [100, 100, 250, 250], anchor: [0, -50] }], hitBox: [50, 50, 100, 100] },
  { id: SpriteId.Grass0, states: [{ tileId: TileId.Grass0 }] },
  { id: SpriteId.Grass1, states: [{ tileId: TileId.Grass1 }] },
  { id: SpriteId.Bush, states: [{ tileId: TileId.Bush }], hitBox: [3, 3, 35, 35] },
  { id: SpriteId.Chest, states: [{ tileId: TileId.Chest }], hitBox: [0, 0, 59, 41] },
  { id: SpriteId.Book, states: [{ tileId: TileId.Book }], hitBox: 'bbox' },
  { id: SpriteId.Plant, states: [{ tileId: TileId.Plant, bbox: [0, 51, 44, 86], anchor: [0, -51] }], hitBox: 'bbox', hitBoxAnchor: [0, -51] },
  { id: SpriteId.PlantOverlay, states: [{ tileId: TileId.Plant, bbox: [0, 0, 44, 50] }] },
  {
    id: SpriteId.Hero,
    states: [
      { label: SpriteHeroState.StillUp, tileId: TileId.Hero, bbox: [0, 66, 44, 134] },
      { label: SpriteHeroState.StillDown, tileId: TileId.Hero, bbox: [0, 0, 45, 66] },
      { label: SpriteHeroState.StillLeft, tileId: TileId.Hero, bbox: [3, 135, 41, 200] },
      { label: SpriteHeroState.StillRight, tileId: TileId.Hero, bbox: [3, 201, 41, 266] },
      { label: SpriteHeroState.WalkingUp, tileId: TileId.Hero, bbox: [0, 66, 44, 134], frames: 4 },
      { label: SpriteHeroState.WalkingDown, tileId: TileId.Hero, bbox: [0, 0, 44, 65], frames: 4 },
      { label: SpriteHeroState.WalkingLeft, tileId: TileId.Hero, bbox: [3, 135, 41, 200], frames: 4 },
      { label: SpriteHeroState.WalkingRight, tileId: TileId.Hero, bbox: [3, 201, 41, 266], frames: 4 },
    ],
    hitBox: [5, 15, 35, 65],
  }
];
