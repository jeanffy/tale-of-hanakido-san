import { GeomCircle } from './geom-circle.js';
import { GeomRect } from './geom-rect.js';

export namespace Intersections {
  export function rectIntersectsWithRect(r1: GeomRect, r2: GeomRect): boolean {
    if (r1.x > r2.x + r2.w) {
      return false;
    }
    if (r1.x + r1.w < r2.x) {
      return false;
    }
    if (r1.y > r2.y + r2.h) {
      return false;
    }
    if (r1.y + r1.h < r2.y) {
      return false;
    }
    return true;
  }

  export function rectIntersectsWithCircle(rect: GeomRect, circle: GeomCircle): boolean {
    return false;
  }

  export function circleIntersectsWithCircle(c1: GeomCircle, c2: GeomCircle): boolean {
    const diffX = c2.x - c1.x;
    const diffY = c2.y - c1.y;
    return Math.sqrt(diffX * diffX + diffY * diffY) < c1.r + c2.r;
  }

  export function circleIntersectsWithRect(circle: GeomCircle, rect: GeomRect): boolean {
    return rectIntersectsWithCircle(rect, circle);
  }
}
