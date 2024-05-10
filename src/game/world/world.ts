import type { DrawContext } from '../draw-context.js';
import { WorldItem } from './world-item.js';
import { ControlState } from '../control-state.js';
import { WorldCollider } from './world-collider.js';

export class World {
  private collider: WorldCollider; // TODO: remove coupling

  public constructor(
    private layer0: WorldItem[],
    private layer1: WorldItem[],
    private layer2: WorldItem[],
    private layer3: WorldItem[],
  ) {
    this.collider = new WorldCollider([
      ...this.layer1,
      ...this.layer2,
    ]);
  }

  public processInputs(dt: number, controlState: ControlState): void {
    this.layer2.forEach(item => item.processInputs(controlState));
  }

  public update(dt: number): void {
    this.layer2.forEach(item => item.update(dt, this.collider));
  }

  public render(drawContext: DrawContext): void {
    this.layer0.forEach(item => item.render(drawContext));

    const layers12Items = [...this.layer1, ...this.layer2].sort((a, b) => a.position.y - b.position.y);
    layers12Items.forEach(item => item.render(drawContext));

    this.layer3.sort((a, b) => a.position.y - b.position.y);
    this.layer3.forEach(item => item.render(drawContext));
  }
}
