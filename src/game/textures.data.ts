import { TextureData } from '../engine/data.js';

export enum TextureId {
  Debug01,
  Grass0,
  Grass1,
  Plant,
  Bush,
  Chest,
  Book,
  Hero,
}

const assetsDir = 'assets';

export const texturesData: TextureData<TextureId>[] = [
  { id: TextureId.Debug01, url: `${assetsDir}/debug01.png` },

  { id: TextureId.Grass0, url: `${assetsDir}/grass-empty.png` },
  { id: TextureId.Grass1, url: `${assetsDir}/grass.png` },

  { id: TextureId.Plant, url: `${assetsDir}/plant.png` },
  { id: TextureId.Bush, url: `${assetsDir}/bush.png` },
  { id: TextureId.Chest, url: `${assetsDir}/chest.png` },
  { id: TextureId.Book, url: `${assetsDir}/book.png` },

  { id: TextureId.Hero, url: `${assetsDir}/hero.png` },
];
