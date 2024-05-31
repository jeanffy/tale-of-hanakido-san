import { DrawContext } from '../draw-context.js';
import { GeomPoint } from '../geom/geom-point.js';
import { GeomRect } from '../geom/geom-rect.js';
import { GeomVector } from '../geom/geom-vector.js';
import { Texture } from '../texture/texture.js';
import { SpriteFrame } from './sprite-frame.js';

export interface SpriteStateUpdateOut {
  loopedAnimation: boolean;
}

export interface SpriteStateInitParams {
  label?: string;
  texture: Texture;
  frames: SpriteFrame[];
  delay: number; // delay (milliseconds) between each frame
}

export class SpriteState {
  private currentFrame: number;
  private millisecBeforeNextFrame: number;
  private reverse = false;

  public constructor(private params: SpriteStateInitParams) {
    this.currentFrame = 0;
    this.millisecBeforeNextFrame = this.params.delay;
  }

  public get label(): string | undefined {
    return this.params.label;
  }

  public get bbox(): GeomRect {
    return this.params.frames[this.currentFrame].boundingBox;
  }

  public get isReversed(): boolean {
    return this.reverse;
  }

  public update(deltaTime: number): SpriteStateUpdateOut {
    const out: SpriteStateUpdateOut = {
      loopedAnimation: false,
    };

    if (this.params.frames.length <= 1) {
      return out;
    }

    this.millisecBeforeNextFrame -= deltaTime;
    if (this.millisecBeforeNextFrame < 0) {
      this.millisecBeforeNextFrame = this.params.delay;
      if (this.reverse) {
        this.currentFrame--;
        if (this.currentFrame < 0) {
          this.currentFrame = this.params.frames.length - 1;
          out.loopedAnimation = true;
        }
      } else {
        this.currentFrame++;
        if (this.currentFrame >= this.params.frames.length) {
          this.currentFrame = 0;
          out.loopedAnimation = true;
        }
      }
    }

    return out;
  }

  public render(drawContext: DrawContext, position: GeomPoint): void {
    const frame = this.params.frames[this.currentFrame];
    const finalPosition = position.moveByVector(new GeomVector(-frame.anchor.x, -frame.anchor.y));
    this.params.texture.render(drawContext, frame.boundingBox, finalPosition);
  }
}
