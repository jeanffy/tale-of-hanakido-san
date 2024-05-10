import { FillOptions, StrokeOptions, WriteTextOptions, type DrawContext } from './game/draw-context.js';

export class CanvasDrawContext implements DrawContext {
  public constructor(private context: CanvasRenderingContext2D) {}

  public strokeRect(x: number, y: number, w: number, h: number, options?: StrokeOptions | undefined): void {
    this.context.save();
    if (options?.width !== undefined) {
      this.context.lineWidth = options.width;
    }
    if (options?.color !== undefined) {
      this.context.strokeStyle = options.color;
    }
    this.context.strokeRect(x, y, w, h);
    this.context.restore();
  }

  public fillRect(x: number, y: number, w: number, h: number, options?: FillOptions): void {
    this.context.save();
    if (options?.color !== undefined) {
      this.context.fillStyle = options.color;
    }
    this.context.fillRect(x, y, w, h);
    this.context.restore();
  }

  public drawImage(image: HTMLImageElement, x: number, y: number, w: number, h: number): void {
    this.context.save();
    this.context.drawImage(image, x, y, w, h);
    this.context.restore();
  }

  public drawImageCropped(
    image: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
  ): void {
    this.context.save();
    this.context.drawImage(image, x, y, w, h, sx, sy, sw, sh);
    this.context.restore();
  }

  public writeText(text: string, x: number, y: number, options?: WriteTextOptions): void {
    this.context.save();
    if (options?.horizontalAlign !== undefined) {
      switch (options.horizontalAlign) {
        case 'left':
          this.context.textAlign = 'left';
          break;
        case 'center':
          this.context.textAlign = 'center';
          break;
        case 'right':
          this.context.textAlign = 'right';
          break;
      }
    }
    if (options?.verticalAlign !== undefined) {
      switch (options.verticalAlign) {
        case 'top':
          this.context.textBaseline = 'top';
          break;
        case 'center':
          this.context.textBaseline = 'middle';
          break;
        case 'bottom':
          this.context.textBaseline = 'bottom';
          break;
      }
    }
    this.context.fillText(text, x, y);
    this.context.restore();
  }
}
