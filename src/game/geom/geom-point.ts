import { GeomVector } from './geom-vector.js';

export class GeomPoint {
  public constructor(public x: number, public y: number) {}

  public moveByVector(vector: GeomVector): GeomPoint {
    return new GeomPoint(this.x + vector.x, this.y + vector.y);
  }
}
