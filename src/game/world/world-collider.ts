// import { GeomCircle } from '../geom/geom-circle.js';
// import { GeomRect } from '../geom/geom-rect.js';
// import { GeomVector } from '../geom/geom-vector.js';
import { GeomPoint } from '../geom/geom-point.js';
import { WorldItem } from './world-item.js';

export class WorldCollider {
  public constructor(private items: WorldItem[]) {
  }

  public anyItemCollidesWith(checkedItem: WorldItem, position: GeomPoint): WorldItem | undefined {
    for (const worldItem of this.items) {
      // don't check item against items that do not participate in collisions
      // don't check item against itself
      if (!worldItem.canCollide() || worldItem.uniqueId === checkedItem.uniqueId) {
        continue;
      }
      if (checkedItem.collidesWithOther(position, worldItem)) {
        return worldItem;
      }
    }
    return undefined;
  }

  // public anyItemCollidesWithHitBox(uniqueId: string, hitBox: GeomRect | GeomCircle): WorldItem | undefined {
  //   for (const item of this.items) {
  //     if (item.sprite.hasHitBox() === undefined) {
  //       continue;
  //     }
  //     if (item.sprite.uniqueId === uniqueId) {
  //       continue;
  //     }
  //     const itemPosition = new GeomVector(item.position.x, item.position.y);
  //     if (hitBox instanceof GeomRect) {
  //       if (item.sprite.getHitBox() instanceof GeomRect) {
  //         const itemHitBox = item.sprite.getHitBox()!.moveByVector(itemPosition);
  //         if (hitBox.intersectsWithRect(itemHitBox)) {
  //           return item;
  //         }
  //       } /*else if (item.sprite.hitBox instanceof GeomCircle) {
  //         const itemHitBox = item.hitBox.moveByVector(itemPosition);
  //         if (hitBox.intersectsWithCircle(itemHitBox)) {
  //           return item;
  //         }
  //       }*/
  //     } /*else if (hitBox instanceof GeomCircle) {
  //       if (item.hitBox instanceof GeomRect) {
  //         const itemHitBox = item.hitBox.moveByVector(itemPosition);
  //         if (hitBox.intersectsWithRect(itemHitBox)) {
  //           return item;
  //         }
  //       } else if (item.hitBox instanceof GeomCircle) {
  //         const itemHitBox = item.hitBox.moveByVector(itemPosition);
  //         if (hitBox.intersectsWithCircle(itemHitBox)) {
  //           return item;
  //         }
  //       }
  //     }*/
  //   }
  //   return undefined;
  // }
}
