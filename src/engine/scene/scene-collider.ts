// import { GeomCircle } from '../geom/geom-circle.js';
// import { GeomRect } from '../geom/geom-rect.js';
// import { GeomVector } from '../geom/geom-vector.js';
import { GeomPoint } from '../geom/geom-point.js';
import { GeomRect } from '../geom/geom-rect.js';
import { Sprite } from '../sprite.js';
import { GenericItem } from './generic.item.js';

export interface ColliderOptions {
  tolerance?: number;
}

export class SceneCollider<TTileId> {
  public constructor(private items: GenericItem<TTileId>[]) {}

  public anyItemCollidesWith(
    checkedItem: GenericItem<TTileId>,
    position: GeomPoint,
    options?: ColliderOptions,
  ): GenericItem<TTileId> | undefined {
    for (const sceneItem of this.items) {
      // don't check item against items that do not participate in collisions
      // don't check item against itself
      if (!sceneItem.canCollide() || sceneItem.uniqueId === checkedItem.uniqueId) {
        continue;
      }

      if (
        this.checkCollision(checkedItem.sprite, position, sceneItem.sprite, sceneItem.position, options?.tolerance ?? 0)
      ) {
        return sceneItem;
      }
    }
    return undefined;
  }

  private checkCollision(
    sprite1: Sprite<TTileId>,
    position1: GeomPoint,
    sprite2: Sprite<TTileId>,
    position2: GeomPoint,
    tolerance: number,
  ): boolean {
    if (sprite1.hitBox instanceof GeomRect) {
      const hitBox1 = new GeomRect(
        position1.x - (sprite1.hitBoxAnchor?.x ?? 0) + sprite1.hitBox.x - tolerance,
        position1.y - (sprite1.hitBoxAnchor?.y ?? 0) + sprite1.hitBox.y - tolerance,
        sprite1.hitBox.w + tolerance,
        sprite1.hitBox.h + tolerance,
      );

      if (sprite2.hitBox instanceof GeomRect) {
        const hitBox2 = new GeomRect(
          position2.x - (sprite2.hitBoxAnchor?.x ?? 0) + sprite2.hitBox.x - tolerance,
          position2.y - (sprite2.hitBoxAnchor?.y ?? 0) + sprite2.hitBox.y - tolerance,
          sprite2.hitBox.w + tolerance,
          sprite2.hitBox.h + tolerance,
        );
        return hitBox1.intersectsWithRect(hitBox2);
      }
    }
    return false;
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
