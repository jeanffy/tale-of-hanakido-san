import { SceneData } from '../engine/engine-app.js';
import { SpriteId } from './sprites.data.js';

export enum SceneDataItemType {
  Chest,
  Hero,
}

export const sceneData: SceneData<SpriteId, SceneDataItemType> = {
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
    { spriteId: SpriteId.Chest, type: SceneDataItemType.Chest, x: 100, y: 300 },
    { spriteId: SpriteId.Book, x: 300, y: 100 },
  ],
  layer2: [{ spriteId: SpriteId.Hero, type: SceneDataItemType.Hero, x: 50, y: 100 }],
  layer3: [
    { spriteId: SpriteId.PlantOverlay, x: 150, y: 100 },
    { spriteId: SpriteId.PlantOverlay, x: 205, y: 100 },
  ],
};
