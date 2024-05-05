import { GeomVector } from './geom-vector.js';

export class GeomPosition {
  public constructor(public x: number, public y: number) {}

  public moveByVector(vector: GeomVector): GeomPosition {
    return new GeomPosition(this.x + vector.x, this.y + vector.y);
  }
}
