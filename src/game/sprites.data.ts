import { SpriteData } from '../engine/data.js';
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

  SwordUp = 'sword-up',
  SwordDown = 'sword-down',
  SwordLeft = 'sword-left',
  SwordRight = 'sword-right',
}

export const spritesData: SpriteData[] = [
  { id: SpriteId.Grass0, states: [{ textureId: TextureId.Overworld, frames: [{ bbox: [0, 0, 47, 47] }] }] },
  { id: SpriteId.Grass1, states: [{ textureId: TextureId.Overworld, frames: [{ bbox: [816, 1392, 863, 1439] }] }] },
  {
    id: SpriteId.Plant,
    states: [
      {
        textureId: TextureId.Overworld,
        frames: [{ bbox: [1536, 105, 1573, 138], anchor: [0, -51] }],
      },
    ],
    hitBox: [9, 54, 38, 77],
  },
  {
    id: SpriteId.PlantOverlay,
    states: [{ textureId: TextureId.Overworld, frames: [{ bbox: [1536, 54, 1573, 104] }] }],
  },
  {
    id: SpriteId.Hero,
    states: [
      { label: SpriteHeroState.StillUp, textureId: TextureId.Character, frames: [{ bbox: [0, 207, 44, 275] }] },
      { label: SpriteHeroState.StillDown, textureId: TextureId.Character, frames: [{ bbox: [3, 18, 47, 83] }] },
      { label: SpriteHeroState.StillLeft, textureId: TextureId.Character, frames: [{ bbox: [3, 306, 41, 371] }] },
      { label: SpriteHeroState.StillRight, textureId: TextureId.Character, frames: [{ bbox: [6, 114, 44, 179] }] },
      {
        label: SpriteHeroState.WalkingUp,
        textureId: TextureId.Character,
        frames: [
          { bbox: [0, 207, 44, 275] },
          { bbox: [48, 207, 92, 275] },
          { bbox: [96, 207, 140, 275] },
          { bbox: [144, 207, 188, 275] },
        ],
      },
      {
        label: SpriteHeroState.WalkingDown,
        textureId: TextureId.Character,
        frames: [
          { bbox: [3, 18, 47, 83] },
          { bbox: [51, 18, 95, 83] },
          { bbox: [99, 18, 143, 83] },
          { bbox: [147, 18, 191, 83] },
        ],
      },
      {
        label: SpriteHeroState.WalkingLeft,
        textureId: TextureId.Character,
        frames: [
          { bbox: [3, 306, 41, 372] },
          { bbox: [51, 306, 89, 372] },
          { bbox: [99, 306, 137, 372] },
          { bbox: [147, 306, 185, 372] },
        ],
      },
      {
        label: SpriteHeroState.WalkingRight,
        textureId: TextureId.Character,
        frames: [
          { bbox: [6, 114, 44, 179] },
          { bbox: [54, 114, 92, 179] },
          { bbox: [102, 114, 140, 179] },
          { bbox: [150, 114, 188, 179] },
        ],
      },
    ],
    hitBox: [3, 32, 38, 59],
  },
];

// export const spritesData: SpriteData<TextureId, SpriteId>[] = [
//   {
//     id: SpriteId.Debug01,
//     states: [{ tileId: TextureId.Debug01, bbox: [100, 100, 250, 250], anchor: [0, -50] }],
//     hitBox: [50, 50, 100, 100],
//   },
//   { id: SpriteId.Grass0, states: [{ tileId: TextureId.Grass0 }] },
//   { id: SpriteId.Grass1, states: [{ tileId: TextureId.Grass1 }] },
//   { id: SpriteId.Bush, states: [{ tileId: TextureId.Bush }], hitBox: [3, 3, 35, 35] },
//   {
//     id: SpriteId.Chest,
//     states: [
//       { label: SpriteChestState.Closed, tileId: TextureId.Chest, bbox: [0, 0, 65, 53] },
//       { label: SpriteChestState.Opening, tileId: TextureId.Chest, bbox: [0, 0, 65, 53], frames: 3, delay: 200 },
//       { label: SpriteChestState.Open, tileId: TextureId.Chest, bbox: [132, 0, 197, 53] },
//     ],
//     hitBox: [0, 7, 59, 48],
//   },
//   { id: SpriteId.Book, states: [{ tileId: TextureId.Book }], hitBox: 'bbox' },
//   {
//     id: SpriteId.Plant,
//     states: [{ tileId: TextureId.Plant, bbox: [0, 51, 44, 86], anchor: [0, -51] }],
//     hitBox: 'bbox',
//     hitBoxAnchor: [0, -51],
//   },
//   { id: SpriteId.PlantOverlay, states: [{ tileId: TextureId.Plant, bbox: [0, 0, 44, 50] }] },
//   {
//     id: SpriteId.Hero,
//     states: [
//       { label: SpriteHeroState.StillUp, tileId: TextureId.Hero, bbox: [0, 66, 44, 134] },
//       { label: SpriteHeroState.StillDown, tileId: TextureId.Hero, bbox: [0, 0, 45, 66] },
//       { label: SpriteHeroState.StillLeft, tileId: TextureId.Hero, bbox: [3, 135, 41, 200] },
//       { label: SpriteHeroState.StillRight, tileId: TextureId.Hero, bbox: [3, 201, 41, 266] },

//       { label: SpriteHeroState.WalkingUp, tileId: TextureId.Hero, bbox: [0, 66, 44, 134], frames: 4 },
//       { label: SpriteHeroState.WalkingDown, tileId: TextureId.Hero, bbox: [0, 0, 44, 65], frames: 4 },
//       { label: SpriteHeroState.WalkingLeft, tileId: TextureId.Hero, bbox: [3, 135, 41, 200], frames: 4 },
//       { label: SpriteHeroState.WalkingRight, tileId: TextureId.Hero, bbox: [3, 201, 41, 266], frames: 4 },

//       { label: SpriteHeroState.SwordUp, tileId: TextureId.Hero, bbox: [0, 342, 50, 404], frames: 4, delay: 50 },
//       { label: SpriteHeroState.SwordDown, tileId: TextureId.Hero, bbox: [0, 267, 47, 338], frames: 4, delay: 50 },
//       { label: SpriteHeroState.SwordLeft, tileId: TextureId.Hero, bbox: [0, 407, 59, 469], frames: 4, delay: 50 },
//     ],
//     hitBox: [5, 30, 35, 65],
//   },
// ];
