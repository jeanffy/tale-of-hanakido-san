import { TextureData } from '../engine/data.js';

export enum TextureId {
  Debug01 = 'debug01',
  Grass0 = 'grass0',
  Grass1 = 'grass1',
  Plant = 'plant',
  Bush = 'bush',
  Chest = 'chest',
  Book = 'book',
  Hero = 'hero',
  Character = 'character',
  Objects = 'objects',
  Overworld = 'overworld',
}

const assetsDir = 'assets';

export const texturesData: TextureData[] = [
  // { id: TextureId.Debug01, url: `${assetsDir}/debug01.png` },

  { id: TextureId.Character, url: `${assetsDir}/character.png` },
  { id: TextureId.Objects, url: `${assetsDir}/objects.png` },
  { id: TextureId.Overworld, url: `${assetsDir}/overworld.png` },

  // { id: TextureId.Grass0, url: `${assetsDir}/grass-empty.png` },
  // { id: TextureId.Grass1, url: `${assetsDir}/grass.png` },

  // { id: TextureId.Plant, url: `${assetsDir}/plant.png` },
  // { id: TextureId.Bush, url: `${assetsDir}/bush.png` },
  // { id: TextureId.Chest, url: `${assetsDir}/chest.png` },
  // { id: TextureId.Book, url: `${assetsDir}/book.png` },

  // { id: TextureId.Hero, url: `${assetsDir}/hero.png` },
];
