import { GeomVector } from './geom-vector.js';

export class GeomRect {
  public constructor(public x: number, public y: number, public w: number, public h: number) {}

  public moveByVector(vector: GeomVector): GeomRect {
    return new GeomRect(this.x + vector.x, this.y + vector.y, this.w, this.h);
  }

  public intersects(rect: GeomRect): boolean {
    if (rect.x > this.x + this.w) {
      return false;
    }
    if (rect.x + rect.w < this.x) {
      return false;
    }
    if (rect.y > this.y + this.h) {
      return false;
    }
    if (rect.y + rect.h < this.y) {
      return false;
    }
    return true;
  }
}
