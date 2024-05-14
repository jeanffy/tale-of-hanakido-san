import { SpriteId } from './data-sprites.js';

export enum WorldDataItemType {
  Hero,
}

export interface WorldDataLayerItem {
  spriteId: SpriteId;
  type?: WorldDataItemType;
  // (x,y) = position (top-left corner of sprite)
  x: number;
  y: number;
}

export interface WorldData {
  layer0: WorldDataLayerItem[];
  layer1: WorldDataLayerItem[];
  layer2: WorldDataLayerItem[];
  layer3: WorldDataLayerItem[];
}

export const dataWorld: WorldData = {
  layer0: [
    { spriteId: SpriteId.Grass0, x: 150, y: 250 },
    { spriteId: SpriteId.Grass1, x: 189, y: 250 },
  ],
  layer1: [
    //{ spriteId: SpriteId.Debug01, x: 175, y: 225 },
    { spriteId: SpriteId.Plant, x: 150, y: 100 },
    { spriteId: SpriteId.Plant, x: 205, y: 100 },
    { spriteId: SpriteId.Bush, x: 300, y: 210 },
    { spriteId: SpriteId.Bush, x: 300, y: 255 },
    { spriteId: SpriteId.Bush, x: 300, y: 300 },
    { spriteId: SpriteId.Chest, x: 100, y: 300 },
    { spriteId: SpriteId.Book, x: 300, y: 100 },
  ],
  layer2: [
    { spriteId: SpriteId.Hero, type: WorldDataItemType.Hero, x: 50, y: 100 }
  ],
  layer3: [
    { spriteId: SpriteId.PlantOverlay, x: 150, y: 100 },
    { spriteId: SpriteId.PlantOverlay, x: 205, y: 100 },
  ],
};
