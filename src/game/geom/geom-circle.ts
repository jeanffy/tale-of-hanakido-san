import { GeomVector } from './geom-vector.js';

export class GeomCircle {
  public constructor(public x: number, public y: number, public r: number) {}

  public moveByVector(vector: GeomVector): GeomCircle {
    return new GeomCircle(this.x + vector.x, this.y + vector.y, this.r);
  }
}
