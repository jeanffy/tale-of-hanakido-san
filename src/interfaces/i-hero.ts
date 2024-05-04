import { IDrawContext } from './i-draw-context.js';
import { GameControlState } from './i-game.js';

export interface IHero {
  processInputs(controlState: GameControlState): void;
  update(dt: number): void;
  render(drawContext: IDrawContext): void;
}
