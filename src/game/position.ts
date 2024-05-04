import { Vector } from './vector.js';

export class Position {
  public constructor(public x: number, public y: number) {}

  public moveByVector(vector: Vector): Position {
    return new Position(this.x + vector.x, this.y + vector.y);
  }
}
