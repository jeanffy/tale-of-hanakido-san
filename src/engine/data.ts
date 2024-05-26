export interface TextureData<TTextureId> {
  id: TTextureId;
  url: string;
}

export interface SpriteData<TTileId, TSpriteId> {
  id: TSpriteId;
  states: {
    label?: string;
    tileId: TTileId;
    bbox?: [number, number, number, number]; // x1, y1, x2, y2
    anchor?: [number, number]; // dx, dy from bbox top-left corner, applies to bbox only, hitBox has another anchor
    frames?: number;
    delay?: number;
  }[];
  // 'bbox' indicates that hitBox is same as current state bbox (so in that case hitBox can vary)
  // 'bbox' value is best to be used with 1 state or with states with same bbox
  hitBox?: [number, number, number, number] | 'bbox'; // x1, y1, x2, y2
  hitBoxAnchor?: [number, number];
}
