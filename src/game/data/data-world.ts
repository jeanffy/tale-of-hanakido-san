import { SpriteId } from './data-sprite.js';

export enum WorldDataItemType {
  Hero,
}

export interface WorldDataItem {
  type?: WorldDataItemType;
  spriteId?: SpriteId;
  x: number;
  y: number;
}

export interface WorldData {
  landscape: SpriteId[][];
  backgroundItems: WorldDataItem[];
  characters: WorldDataItem[];
  overlayItems: WorldDataItem[];
}

// prettier-ignore
export const dataWorld: WorldData = {
  landscape: [
    [ SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0],
    [ SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass0],
    [ SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0],
    [ SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass0],
    [ SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0],
    [ SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass0],
    [ SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0],
    [ SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass0],
  ],
  backgroundItems: [
    { spriteId: SpriteId.Plant, x: 150, y: 100 },
    { spriteId: SpriteId.Plant, x: 195, y: 100 },
    { spriteId: SpriteId.Bush, x: 300, y: 210 },
    { spriteId: SpriteId.Bush, x: 300, y: 255 },
    { spriteId: SpriteId.Bush, x: 300, y: 300 },
    { spriteId: SpriteId.Chest, x: 100, y: 300 },
    { spriteId: SpriteId.Book, x: 300, y: 100 },
  ],
  characters: [
    { type: WorldDataItemType.Hero, x: 50, y: 100 },
  ],
  overlayItems: [],
};
