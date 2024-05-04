import { IDrawContext } from './i-draw-context.js';

export interface GameControlState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface IGame {
  nextFrame(drawContext: IDrawContext, dt: number): void;
  updateControlState(state: Partial<GameControlState>): void;
}
