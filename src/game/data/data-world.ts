import { SpriteId } from './data-sprite-id.js';

export enum WorldDataItemType {
  Hero,
}

export interface WorldDataLayerItemDef {
  id?: SpriteId;
  type?: WorldDataItemType;
  bbox?: number[]; // undefined = all sprite bounding box, otherwise 4 numbers: x1, y1, x2, y2 (all included)
  hitBox?: number[] | 'overall'; // overall = identical to bbox, 4 numbers = x1, y1, x2, y2 (all included), undefined = no collision
}

export interface WorldDataLayerItem extends WorldDataLayerItemDef {
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

const plantGround: WorldDataLayerItemDef = {
  id: SpriteId.Plant,
  bbox: [0, 51, 44, 86],
  hitBox: [7, 52, 40, 82],
};
const plantOverlay: WorldDataLayerItemDef = {
  id: SpriteId.Plant,
  bbox: [0, 0, 44, 50],
};

export const dataWorld: WorldData = {
  layer0: [
    { id: SpriteId.Grass0, x: 0, y: 0 },
    { id: SpriteId.Grass1, x: 39, y: 0 },
  ],
  layer1: [
    { ...plantGround, x: 150, y: 100 },
    { ...plantGround, x: 195, y: 100 },
    { id: SpriteId.Bush, x: 300, y: 210, hitBox: 'overall' },
    { id: SpriteId.Bush, x: 300, y: 255, hitBox: 'overall' },
    { id: SpriteId.Bush, x: 300, y: 300, hitBox: 'overall' },
    { id: SpriteId.Chest, x: 100, y: 300, hitBox: 'overall' },
    { id: SpriteId.Book, x: 300, y: 100, hitBox: 'overall' },
  ],
  layer2: [{ type: WorldDataItemType.Hero, x: 50, y: 100 }],
  layer3: [
    { ...plantOverlay, x: 150, y: 100 },
    { ...plantOverlay, x: 195, y: 100 }
  ],
};
