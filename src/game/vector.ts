export class Vector {
  public constructor(public x: number, public y: number) {}

  public normalize(): Vector {
    const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    if (magnitude <= 0) {
      console.error(`Vector has an invalid magnitude (${this.x}, ${this.y})`);
      throw new Error(`Vector has an invalid magnitude (${this.x}, ${this.y})`);
    }
    return new Vector((this.x /= magnitude), (this.y /= magnitude));
  }

  public scale(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor);
  }
}
