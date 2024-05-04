import { IDrawContext } from './i-draw-context.js';

export interface IWorld {
  update(dt: number): void;
  render(drawContext: IDrawContext): void;
}
