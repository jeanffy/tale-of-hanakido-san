import { GeomPoint } from '../geom/geom-point.js';
import { GeomRect } from '../geom/geom-rect.js';

export interface SpriteFrameInitParams {
  boundingBox: GeomRect;
  anchor: GeomPoint;
}

export class SpriteFrame {
  public constructor(private params: SpriteFrameInitParams) {}

  public get boundingBox(): GeomRect {
    return this.params.boundingBox;
  }

  public get anchor(): GeomPoint {
    return this.params.anchor;
  }
}
