import { GeomCircle } from './geom-circle.js';
import { GeomVector } from './geom-vector.js';
import { Intersections } from './intersections.js';

export class GeomRect {
  public constructor(public x: number, public y: number, public w: number, public h: number) {}

  public equals(other: GeomRect): boolean {
    return this.x === other.x && this.y === other.y && this.w === other.w && this.h === other.h;
  }

  public moveByVector(vector: GeomVector): GeomRect {
    return new GeomRect(this.x + vector.x, this.y + vector.y, this.w, this.h);
  }

  public intersectsWithRect(rect: GeomRect): boolean {
    return Intersections.rectIntersectsWithRect(this, rect);
  }

  public intersectsWithCircle(circle: GeomCircle): boolean {
    return Intersections.rectIntersectsWithCircle(this, circle);
  }
}
