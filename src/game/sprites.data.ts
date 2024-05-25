import { SpriteData2 } from '../engine/sprite-manager.js';
import { TextureId } from './textures.data.js';

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

export enum SpriteChestState {
  Closed = 'closed',
  Opening = 'opening',
  Open = 'open',
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

export const spritesData: SpriteData2<TextureId, SpriteId>[] = [
  {
    id: SpriteId.Debug01,
    states: [{ tileId: TextureId.Debug01, bbox: [100, 100, 250, 250], anchor: [0, -50] }],
    hitBox: [50, 50, 100, 100],
  },
  { id: SpriteId.Grass0, states: [{ tileId: TextureId.Grass0 }] },
  { id: SpriteId.Grass1, states: [{ tileId: TextureId.Grass1 }] },
  { id: SpriteId.Bush, states: [{ tileId: TextureId.Bush }], hitBox: [3, 3, 35, 35] },
  {
    id: SpriteId.Chest,
    states: [
      { label: SpriteChestState.Closed, tileId: TextureId.Chest, bbox: [0, 0, 65, 53] },
      { label: SpriteChestState.Opening, tileId: TextureId.Chest, bbox: [0, 0, 65, 53], frames: 3, delay: 200 },
      { label: SpriteChestState.Open, tileId: TextureId.Chest, bbox: [132, 0, 197, 53] },
    ],
    hitBox: [0, 7, 59, 48],
  },
  { id: SpriteId.Book, states: [{ tileId: TextureId.Book }], hitBox: 'bbox' },
  {
    id: SpriteId.Plant,
    states: [{ tileId: TextureId.Plant, bbox: [0, 51, 44, 86], anchor: [0, -51] }],
    hitBox: 'bbox',
    hitBoxAnchor: [0, -51],
  },
  { id: SpriteId.PlantOverlay, states: [{ tileId: TextureId.Plant, bbox: [0, 0, 44, 50] }] },
  {
    id: SpriteId.Hero,
    states: [
      { label: SpriteHeroState.StillUp, tileId: TextureId.Hero, bbox: [0, 66, 44, 134] },
      { label: SpriteHeroState.StillDown, tileId: TextureId.Hero, bbox: [0, 0, 45, 66] },
      { label: SpriteHeroState.StillLeft, tileId: TextureId.Hero, bbox: [3, 135, 41, 200] },
      { label: SpriteHeroState.StillRight, tileId: TextureId.Hero, bbox: [3, 201, 41, 266] },
      { label: SpriteHeroState.WalkingUp, tileId: TextureId.Hero, bbox: [0, 66, 44, 134], frames: 4 },
      { label: SpriteHeroState.WalkingDown, tileId: TextureId.Hero, bbox: [0, 0, 44, 65], frames: 4 },
      { label: SpriteHeroState.WalkingLeft, tileId: TextureId.Hero, bbox: [3, 135, 41, 200], frames: 4 },
      { label: SpriteHeroState.WalkingRight, tileId: TextureId.Hero, bbox: [3, 201, 41, 266], frames: 4 },
    ],
    hitBox: [5, 30, 35, 65],
  },
];
