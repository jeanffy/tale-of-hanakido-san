import { DrawContext } from './draw-context.js';
import { GeomPoint } from './geom/geom-point.js';
import { GeomRect } from './geom/geom-rect.js';
import { GeomVector } from './geom/geom-vector.js';
import { Tile } from './tile.js';

export class SpriteState {
  private firstFrameBBoxX: number;
  private currentFrame: number;
  private millisecBeforeNextFrame: number;

  public constructor(
    public label: string | undefined,
    private tile: Tile,
    private _bbox: GeomRect, // bbox inside the tile image (relative pixel coordinates)
    private anchor: GeomPoint, // coordinates inside the tile image (relative pixel coordinates)
    private frames: number, // number of frames for animation
    private delay: number, // delay (milliseconds) between each frame
  ) {
    this.firstFrameBBoxX = this._bbox.x;
    this.currentFrame = 0;
    this.millisecBeforeNextFrame = this.delay;
  }

  public get bbox(): GeomRect {
    return this._bbox;
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
        this._bbox.x = this.firstFrameBBoxX + this.currentFrame * this._bbox.w;
      }
    }
  }

  public render(drawContext: DrawContext, position: GeomPoint): void {
    this.tile.render(drawContext, this._bbox, position.moveByVector(new GeomVector(-this.anchor.x, -this.anchor.y)));
  }
}

export class Sprite {
  private currentState: SpriteState;

  public constructor(
    private states: SpriteState[],
    private hitBox: GeomRect | undefined, // hitBox inside the bbox (relative pixel coordinates, relative to bbox)
    private hitBoxAnchor: GeomPoint | undefined,
  ) {
    if (states.length < 1) {
      console.error('Sprite states must have at least 1 state');
      throw new Error('');
    }
    this.currentState = this.states[0];
  }

  public hasHitBox(): boolean {
    return this.hitBox !== undefined;
  }

  public selectState(label: string): void {
    this.currentState = this.states[0];
    const state = this.states.find(s => s.label === label);
    if (state !== undefined) {
      this.currentState = state;
    }
  }

  public update(dt: number): void {
    this.currentState.update(dt);
  }

  public render(drawContext: DrawContext, position: GeomPoint): void {
    this.currentState.render(drawContext, position);

    if (this.hitBox instanceof GeomRect) {
      drawContext.strokeRect(
        position.x - (this.hitBoxAnchor?.x ?? 0) + this.hitBox.x,
        position.y - (this.hitBoxAnchor?.y ?? 0) + this.hitBox.y,
        this.hitBox.w,
        this.hitBox.h,
        {
          color: 'lightgreen',
        },
      );
    }
  }

  public collidesWithOther(position: GeomPoint, other: Sprite, otherPosition: GeomPoint): boolean {
    if (this.hitBox instanceof GeomRect) {
      const thisHitBox = new GeomRect(
        position.x - (this.hitBoxAnchor?.x ?? 0) + this.hitBox.x,
        position.y - (this.hitBoxAnchor?.y ?? 0) + this.hitBox.y,
        this.hitBox.w,
        this.hitBox.h,
      );

      if (other.hitBox instanceof GeomRect) {
        const otherHitBox = new GeomRect(
          otherPosition.x - (other.hitBoxAnchor?.x ?? 0) + other.hitBox.x,
          otherPosition.y - (other.hitBoxAnchor?.y ?? 0) + other.hitBox.y,
          other.hitBox.w,
          other.hitBox.h,
        );
        return thisHitBox.intersectsWithRect(otherHitBox);
      }
    }
    return false;
  }
}
