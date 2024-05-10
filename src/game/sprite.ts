import { SpriteId } from './data/data-sprites.js';
import { DrawContext } from './draw-context.js';
import { GeomPoint } from './geom/geom-point.js';
import { GeomRect } from './geom/geom-rect.js';
import { GeomVector } from './geom/geom-vector.js';
import { Tile } from './tile.js';

export class Sprite {
  private firstFrameBBoxX: number;
  private currentFrame: number;
  private millisecBeforeNextFrame: number;

  public constructor(
    public id: SpriteId,
    private tile: Tile,
    private bbox: GeomRect, // bbox inside the tile image (relative pixel coordinates)
    private anchor: GeomPoint, // coordinates inside the tile image (relative pixel coordinates)
    private hitBox: GeomRect | undefined, // hitBox inside the bbox (relative pixel coordinates, relative to bbox)
    private frames: number, // number of frames for animation
    private delay: number, // delay (milliseconds) between each frame
  ) {
    this.firstFrameBBoxX = this.bbox.x;
    this.currentFrame = 0;
    this.millisecBeforeNextFrame = this.delay;
  }

  public hasHitBox(): boolean {
    return this.hitBox !== undefined;
  }

  public update(dt: number): void {
    if (this.frames > 1) {
      this.millisecBeforeNextFrame -= dt;
      if (this.millisecBeforeNextFrame < 0) {
        this.millisecBeforeNextFrame = this.delay;
        this.currentFrame++;
        if (this.currentFrame >= this.frames) {
          this.currentFrame = 0;
        }
        this.bbox.x = this.firstFrameBBoxX + this.currentFrame * this.bbox.w;
      }
    }
  }

  public render(drawContext: DrawContext, position: GeomPoint): void {
    this.tile.render(drawContext, this.bbox, position.moveByVector(new GeomVector(-this.anchor.x, -this.anchor.y)));

    if (this.hitBox instanceof GeomRect) {
      drawContext.strokeRect(
        position.x - this.anchor.x + this.hitBox.x,
        position.y - this.anchor.y + this.hitBox.y,
        this.hitBox.w,
        this.hitBox.h,
        {
          color: 'lightgreen',
        },
      );
    }
  }

  // public collidesAtPosition(collider: WorldCollider, position: GeomPoint): boolean {
  //   if (this.hitBox instanceof GeomRect) {
  //     const hitBoxAtpositionInWorldCoordinates = new GeomRect(
  //       position.x - this.anchor.x + this.hitBox.x,
  //       position.y - this.anchor.y + this.hitBox.y,
  //       this.hitBox.w,
  //       this.hitBox.h,
  //     );
  //     if (collider.anyItemCollidesWithHitBox(this.uniqueId, hitBoxAtpositionInWorldCoordinates) !== undefined) {
  //       return true;
  //     }
  //   }
  //   if (this.hitBox instanceof GeomCircle) {
  //     // TOOD
  //   }
  //   return false;
  // }

  public collidesWithOther(position: GeomPoint, other: Sprite, otherPosition: GeomPoint): boolean {
    if (this.hitBox instanceof GeomRect) {
      const thisHitBox = new GeomRect(
        position.x - this.anchor.x + this.hitBox.x,
        position.y - this.anchor.y + this.hitBox.y,
        this.hitBox.w,
        this.hitBox.h,
      );

      if (other.hitBox instanceof GeomRect) {
        const otherHitBox = new GeomRect(
          otherPosition.x - other.anchor.x + other.hitBox.x,
          otherPosition.y - other.anchor.y + other.hitBox.y,
          other.hitBox.w,
          other.hitBox.h,
        );
        return thisHitBox.intersectsWithRect(otherHitBox);
      }
    }
    return false;
  }
}
