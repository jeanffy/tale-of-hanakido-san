import { DrawContext } from './draw-context.js';
import { GeomPoint } from './geom/geom-point.js';
import { GeomRect } from './geom/geom-rect.js';
import { GeomVector } from './geom/geom-vector.js';
import { Tile } from './tile.js';

export interface SpriteStateUpdateOut {
  loopedAnimation: boolean;
}

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

  public update(dt: number): SpriteStateUpdateOut {
    const out: SpriteStateUpdateOut = {
      loopedAnimation: false,
    };
    if (this.frames > 1) {
      this.millisecBeforeNextFrame -= dt;
      if (this.millisecBeforeNextFrame < 0) {
        this.millisecBeforeNextFrame = this.delay;
        this.currentFrame++;
        if (this.currentFrame >= this.frames) {
          this.currentFrame = 0;
          out.loopedAnimation = true;
        }
        this._bbox.x = this.firstFrameBBoxX + this.currentFrame * this._bbox.w;
      }
    }
    return out;
  }

  public render(drawContext: DrawContext, position: GeomPoint): void {
    this.tile.render(drawContext, this._bbox, position.moveByVector(new GeomVector(-this.anchor.x, -this.anchor.y)));
  }
}

export class Sprite {
  private currentState: SpriteState;

  public constructor(
    private states: SpriteState[],
    private _hitBox: GeomRect | undefined, // hitBox inside the bbox (relative pixel coordinates, relative to bbox)
    private _hitBoxAnchor: GeomPoint | undefined,
  ) {
    if (states.length < 1) {
      console.error('Sprite states must have at least 1 state');
      throw new Error('');
    }
    this.currentState = this.states[0];
  }

  public get bbox(): GeomRect {
    return this.currentState.bbox;
  }

  public get hitBox(): GeomRect |  undefined {
    return this._hitBox;
  }

  public get hitBoxAnchor(): GeomPoint |  undefined {
    return this._hitBoxAnchor;
  }

  public hasHitBox(): boolean {
    return this._hitBox !== undefined;
  }

  public selectState(label: string, ): void {
    this.currentState = this.states[0];
    const state = this.states.find(s => s.label === label);
    if (state !== undefined) {
      this.currentState = state;
    }
  }

  public update(dt: number): SpriteStateUpdateOut {
    return this.currentState.update(dt);
  }

  public render(drawContext: DrawContext, position: GeomPoint): void {
    this.currentState.render(drawContext, position);

    if (this._hitBox instanceof GeomRect) {
      drawContext.strokeRect(
        position.x - (this._hitBoxAnchor?.x ?? 0) + this._hitBox.x,
        position.y - (this._hitBoxAnchor?.y ?? 0) + this._hitBox.y,
        this._hitBox.w,
        this._hitBox.h,
        {
          color: 'lightgreen',
        },
      );
    }
  }
}
