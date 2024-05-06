import { DrawContext } from './draw-context.js';
import { GeomRect } from './geom/geom-rect.js';
import { SpriteId } from './data/data-sprite.js';
import { GeomPoint } from './geom/geom-point.js';

export interface SpriteInitParams {
  id: SpriteId;
  img: HTMLImageElement;
  hitBox: GeomRect;
  layers?: SpriteLayers;
}

export interface SpriteLayers {
  background: GeomRect;
  overlay: GeomRect;
}

export enum SpriteDrawType {
  Landscape,
  Background,
  Character,
  Overlay,
}

export class Sprite {
  public id: SpriteId;
  public img: HTMLImageElement;
  public hitBox: GeomRect;
  public layers?: SpriteLayers;

  public constructor(params: SpriteInitParams) {
    this.id = params.id;
    this.img = params.img;
    this.hitBox = params.hitBox;
    this.layers = params.layers;
  }

  public renderLandscape(drawContext: DrawContext, position: GeomPoint): void {
    this.drawFull(drawContext, position);
  }

  public renderBackground(drawContext: DrawContext, position: GeomPoint): boolean {
    let needSecondPass = false;
    if (this.layers === undefined) {
      this.drawFull(drawContext, position);
    } else {
      this.drawLayer(drawContext, position, this.layers.background);
      needSecondPass = true;
    }
    this.drawHitBox(drawContext, position);
    return needSecondPass;
  }

  public renderCharacter(drawContext: DrawContext, position: GeomPoint): void {
    this.drawFull(drawContext, position);
    this.drawHitBox(drawContext, position);
  }

  public renderOverlay(drawContext: DrawContext, position: GeomPoint): void {
    if (this.layers === undefined) {
      this.drawFull(drawContext, position);
    } else {
      this.drawLayer(drawContext, position, this.layers.overlay);
    }
  }

  private drawFull(drawContext: DrawContext, position: GeomPoint): void {
    drawContext.drawImage(this.img, position.x, position.y, this.img.width, this.img.height);
  }

  private drawLayer(drawContext: DrawContext, position: GeomPoint, layer: GeomRect): void {
    drawContext.drawImageCropped(
      this.img,
      layer.x,
      layer.y,
      layer.w,
      layer.h,
      position.x + layer.x,
      position.y + layer.y,
      layer.w,
      layer.h,
    );
  }

  private drawHitBox(drawContext: DrawContext, position: GeomPoint): void {
    drawContext.strokeRect(position.x + this.hitBox.x, position.y + this.hitBox.y, this.hitBox.w, this.hitBox.h, {
      color: 'yellow',
    });
  }
}
