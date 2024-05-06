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
