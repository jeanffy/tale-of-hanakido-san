import { GeomRect } from './geom-rect.js';
import { GeomVector } from './geom-vector.js';
import { Intersections } from './intersections.js';

export class GeomCircle {
  public constructor(
    public x: number,
    public y: number,
    public r: number,
  ) {}

  public moveByVector(vector: GeomVector): GeomCircle {
    return new GeomCircle(this.x + vector.x, this.y + vector.y, this.r);
  }

  public intersectsWithRect(rect: GeomRect): boolean {
    return Intersections.circleIntersectsWithRect(this, rect);
  }

  public intersectsWithCircle(circle: GeomCircle): boolean {
    return Intersections.circleIntersectsWithCircle(this, circle);
  }
}
