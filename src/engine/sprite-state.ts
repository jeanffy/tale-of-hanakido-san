import { DrawContext } from './draw-context.js';
import { GeomPoint } from './geom/geom-point.js';
import { GeomRect } from './geom/geom-rect.js';
import { GeomVector } from './geom/geom-vector.js';
import { Texture } from './texture.js';

export interface SpriteStateUpdateOut {
  loopedAnimation: boolean;
}

export class SpriteState<TTileId> {
  private firstFrameBBoxX: number;
  private currentFrame: number;
  private millisecBeforeNextFrame: number;
  private reverse = false;

  public constructor(
    public label: string | undefined,
    private texture: Texture<TTileId>,
    private _bbox: GeomRect, // bbox inside the texture image (relative pixel coordinates)
    private anchor: GeomPoint, // coordinates inside the texture image (relative pixel coordinates)
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

  public get isReversed(): boolean {
    return this.reverse;
  }

  public init(reverse: boolean): void {
    this.currentFrame = reverse ? this.frames - 1 : 0;
    this.reverse = reverse;
    this._bbox.x = this.firstFrameBBoxX + this.currentFrame * this._bbox.w;
  }

  public update(dt: number): SpriteStateUpdateOut {
    const out: SpriteStateUpdateOut = {
      loopedAnimation: false,
    };
    if (this.frames > 1) {
      this.millisecBeforeNextFrame -= dt;
      if (this.millisecBeforeNextFrame < 0) {
        this.millisecBeforeNextFrame = this.delay;
        if (this.reverse) {
          this.currentFrame--;
          if (this.currentFrame < 0) {
            this.currentFrame = this.frames - 1;
            out.loopedAnimation = true;
          }
        } else {
          this.currentFrame++;
          if (this.currentFrame >= this.frames) {
            this.currentFrame = 0;
            out.loopedAnimation = true;
          }
        }
        this._bbox.x = this.firstFrameBBoxX + this.currentFrame * this._bbox.w;
      }
    }
    return out;
  }

  public render(drawContext: DrawContext, position: GeomPoint): void {
    this.texture.render(drawContext, this._bbox, position.moveByVector(new GeomVector(-this.anchor.x, -this.anchor.y)));
  }
}
