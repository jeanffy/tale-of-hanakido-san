export interface StrokeOptions {
  width?: number;
  color?: string;
}

export interface WriteTextOptions {
  horizontalAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
}

export interface DrawContext {
  strokeRect(x: number, y: number, w: number, h: number, options?: StrokeOptions): void;
  drawImage(image: HTMLImageElement, x: number, y: number, w: number, h: number): void;
  drawImageCropped(
    image: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
  ): void;
  writeText(text: string, x: number, y: number, options?: WriteTextOptions): void;
}
