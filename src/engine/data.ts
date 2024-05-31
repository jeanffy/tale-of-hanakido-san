export interface TextureData {
  id: string;
  url: string; // can be absolute or relative to current domain
}

export interface SpriteFrameData {
  // x1, y1, x2, y2, coordinates of frame, inside the texture (0-based)
  // texture scale must not be taken in to account here
  // if no bbox, the texture bounding box is taken
  bbox?: [number, number, number, number];
  // dx, dy from bbox top-left corner, default is (0,0)
  // texture scale must not be taken in to account here
  anchor?: [number, number];
}

export interface SpriteStateData {
  // only mandatory if multiple states are defined
  label?: string;
  // the id in TextureData
  textureId: string;
  // if no frames are defined, a default frame representing the whole texture with the default anchor is created
  frames?: SpriteFrameData[];
  // milliseconds between each frame (only relevant if more than 1 frame)
  // default is 100 ms
  delay?: number;
}

export interface SpriteData {
  id: string;
  states: SpriteStateData[];
  // x1, y1, x2, y2, relative to the frame bbox
  // texture scale must not be taken in to account here
  // if no hit box is defined, the sprite does not participate in collisions
  hitBox?: [number, number, number, number];
  // dx, dy from bbox top-left corner of hitBox
  // texture scale must not be taken in to account here
  // relevant only if hitBox !== undefined
  hitBoxAnchor?: [number, number];
}

export interface SceneLayerItemData {
  // the id in SpriteData
  spriteId: string;
  // if defined, can be used to create specific instance of class in EngineApp.createSceneItem method
  type?: string;
  // (x,y) = position of anchor point (default is top-left corner of sprite)
  // texture scale must not be taken in to account here
  x: number;
  y: number;
}

// layers are drawn in order
// only layers 1 and 2 are used for collisions
// layer0 is mainly used for background
// layer3 is mainly used for overlays
export interface SceneData {
  layer0: SceneLayerItemData[];
  layer1: SceneLayerItemData[];
  layer2: SceneLayerItemData[];
  layer3: SceneLayerItemData[];
}
