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

// function doesLineInterceptCircle(A: Point, B: Point, C: Point, radius: number): boolean {
//   let dist;
//   const v1x = B.x - A.x;
//   const v1y = B.y - A.y;
//   const v2x = C.x - A.x;
//   const v2y = C.y - A.y;
//   // get the unit distance along the line of the closest point to
//   // circle center
//   const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);

//   // if the point is on the line segment get the distance squared
//   // from that point to the circle center
//   if(u >= 0 && u <= 1){
//       dist  = (A.x + v1x * u - C.x) ** 2 + (A.y + v1y * u - C.y) ** 2;
//   } else {
//       // if closest point not on the line segment
//       // use the unit distance to determine which end is closest
//       // and get dist square to circle
//       dist = u < 0 ?
//             (A.x - C.x) ** 2 + (A.y - C.y) ** 2 :
//             (B.x - C.x) ** 2 + (B.y - C.y) ** 2;
//   }
//   return dist < radius * radius;
// }
