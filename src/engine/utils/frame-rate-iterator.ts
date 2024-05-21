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
