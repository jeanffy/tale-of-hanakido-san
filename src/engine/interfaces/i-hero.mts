import type { MoveDirection } from '../move';

export interface IHero {
  move(direction: MoveDirection): void;
  stop(): void;
  render(delta: number): void;
}
