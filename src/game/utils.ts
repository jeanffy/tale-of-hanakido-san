export type InjectedDependencies = any;

export interface AnimationIteratorParams {
  numberOfSprites: number;
  frameSkip: number;
}

export class AnimationIterator {
  private index = 0;
  private numberOfSprites: number;
  private frameSkip: number;
  private skippedFrames = 0;

  public constructor(params: AnimationIteratorParams) {
    this.numberOfSprites = params.numberOfSprites;
    this.frameSkip = params.frameSkip;
  }

  public reset(): void {
    this.index = 0;
  }

  public getSpriteIndex(): number {
    this.skippedFrames++;
    if (this.skippedFrames > this.frameSkip) {
      this.skippedFrames = 0;
      this.index++;
      if (this.index > this.numberOfSprites - 1) {
        this.index = 0;
      }
    }
    return this.index;
  }
}

export interface FrameRateIteratorParams {
  targetFps: number;
}

export class FrameRateIterator {
  public targetFps: number;
  private timer = 0;
  private frameCountInOneSecond = 0;
  public fps = 0;

  public constructor(params: FrameRateIteratorParams) {
    this.targetFps = params.targetFps;
  }

  public shouldRender(dt: number): Promise<boolean> {
    this.timer += dt;
    if (this.timer > 1000) {
      this.fps = this.frameCountInOneSecond;
      this.frameCountInOneSecond = 0;
      this.timer = 0;
    }

    this.frameCountInOneSecond++;

    return Promise.resolve(true);
  }
}
