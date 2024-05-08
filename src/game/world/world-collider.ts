import { GeomCircle } from '../geom/geom-circle.js';
import { GeomRect } from '../geom/geom-rect.js';
import { GeomVector } from '../geom/geom-vector.js';
import { WorldItem } from './world-item.js';

export class WorldCollider {
  public constructor(private items: WorldItem[]) {
  }

  public anyItemCollidesWithHitBox(hitBox: GeomRect | GeomCircle): WorldItem | undefined {
    for (const item of this.items) {
      if (item.hitBox === undefined) {
        continue;
      }
      const itemPosition = new GeomVector(item.position.x, item.position.y);
      if (hitBox instanceof GeomRect) {
        if (item.hitBox instanceof GeomRect) {
          const itemHitBox = item.hitBox.moveByVector(itemPosition);
          if (hitBox.intersectsWithRect(itemHitBox)) {
            return item;
          }
        } else if (item.hitBox instanceof GeomCircle) {
          const itemHitBox = item.hitBox.moveByVector(itemPosition);
          if (hitBox.intersectsWithCircle(itemHitBox)) {
            return item;
          }
        }
      } else if (hitBox instanceof GeomCircle) {
        if (item.hitBox instanceof GeomRect) {
          const itemHitBox = item.hitBox.moveByVector(itemPosition);
          if (hitBox.intersectsWithRect(itemHitBox)) {
            return item;
          }
        } else if (item.hitBox instanceof GeomCircle) {
          const itemHitBox = item.hitBox.moveByVector(itemPosition);
          if (hitBox.intersectsWithCircle(itemHitBox)) {
            return item;
          }
        }
      }
    }
    return undefined;
  }
}
