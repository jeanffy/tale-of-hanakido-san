export enum TileId {
  Debug01,
  Grass0,
  Grass1,
  Plant,
  Bush,
  Chest,
  Book,
  Hero,
}

export interface TileData {
  id: TileId;
  url: string;
}

const assetsDir = 'assets';

export const dataTiles: TileData[] = [
  { id: TileId.Debug01, url: `${assetsDir}/debug01.png` },

  { id: TileId.Grass0, url: `${assetsDir}/grass-empty.png` },
  { id: TileId.Grass1, url: `${assetsDir}/grass.png` },

  { id: TileId.Plant, url: `${assetsDir}/plant.png` },
  { id: TileId.Bush, url: `${assetsDir}/bush.png` },
  { id: TileId.Chest, url: `${assetsDir}/chest.png` },
  { id: TileId.Book, url: `${assetsDir}/book.png` },

  { id: TileId.Hero, url: `${assetsDir}/hero.png` },
];
