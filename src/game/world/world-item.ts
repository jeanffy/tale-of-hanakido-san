import { ControlState } from '../control-state.js';
import { DrawContext } from '../draw-context.js';
import { GeomCircle } from '../geom/geom-circle.js';
import { GeomPoint } from '../geom/geom-point.js';
import { GeomRect } from '../geom/geom-rect.js';
import { Sprite } from '../sprite.js';
import { WorldCollider } from './world-collider.js';

export enum WorldItemLayer {
  Landscape,
  Background,
  Characters,
  Overlay,
}

export type WorldItemRenderSecondPassFunc = () => void;

export abstract class WorldItem {
  protected sprite!: Sprite;
  public hitBox?: GeomRect | GeomCircle;

  public constructor(
    public layer: WorldItemLayer,
    public position: GeomPoint,
  ) {}

  public hasOverlay(): boolean {
    return this.sprite.layers !== undefined;
  }

  public abstract processInputs(controlState: ControlState): void;
  public abstract update(dt: number, collider: WorldCollider): void;

  public render(drawContext: DrawContext): WorldItemRenderSecondPassFunc | undefined {
    this.sprite.render(drawContext, this.position, this.layer);
    if (this.sprite.layers !== undefined) {
      return (): void => {
        this.sprite.render(drawContext, this.position, WorldItemLayer.Overlay);
      };
    }
    return undefined;
  }
}
