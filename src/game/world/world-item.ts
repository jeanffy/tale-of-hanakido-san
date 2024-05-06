import { ControlState } from '../control-state.js';
import { DrawContext } from '../draw-context.js';
import { GeomPoint } from '../geom/geom-point.js';
import { GeomRect } from '../geom/geom-rect.js';
import { WorldCollider } from './world-collider.js';

export enum WorldItemKind {
  Background,
  Character,
  Overlay,
}

export type WorldItemRenderSecondPassFunc = () => void;

export interface WorldItem {
  kind: WorldItemKind;
  position: GeomPoint;
  hitBox: GeomRect;
  processInputs(controlState: ControlState): void;
  update(dt: number, collider: WorldCollider): void;
  render(drawContext: DrawContext): WorldItemRenderSecondPassFunc | undefined;
}
