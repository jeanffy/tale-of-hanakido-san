// import { GeomCircle } from '../geom/geom-circle.js';
// import { GeomRect } from '../geom/geom-rect.js';
// import { GeomVector } from '../geom/geom-vector.js';
import { GeomPoint } from '../geom/geom-point.js';
import { SceneItem } from './scene-item.js';

export class SceneCollider {
  public constructor(private items: SceneItem[]) {
  }

  public anyItemCollidesWith(checkedItem: SceneItem, position: GeomPoint): SceneItem | undefined {
    for (const sceneItem of this.items) {
      // don't check item against items that do not participate in collisions
      // don't check item against itself
      if (!sceneItem.canCollide() || sceneItem.uniqueId === checkedItem.uniqueId) {
        continue;
      }
      if (checkedItem.collidesWithOther(position, sceneItem)) {
        return sceneItem;
      }
    }
    return undefined;
  }

  // public anyItemCollidesWithHitBox(uniqueId: string, hitBox: GeomRect | GeomCircle): SceneItem | undefined {
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
