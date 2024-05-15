import type { DrawContext } from '../draw-context.js';
import { SceneItem } from './scene-item.js';
import { ControlState } from '../control-state.js';
import { SceneCollider } from './scene-collider.js';

export class Scene {
  private collider: SceneCollider; // TODO: remove coupling

  public constructor(
    private layer0: SceneItem[],
    private layer1: SceneItem[],
    private layer2: SceneItem[],
    private layer3: SceneItem[],
  ) {
    this.collider = new SceneCollider([...this.layer1, ...this.layer2]);
  }

  public processInputs(dt: number, controlState: ControlState): void {
    this.layer2.forEach(item => item.processInputs(controlState));
  }

  public update(dt: number): void {
    this.layer2.forEach(item => item.update(dt, this.collider));
  }

  public render(drawContext: DrawContext): void {
    this.layer0.forEach(item => item.render(drawContext));

    const layers12Items = [...this.layer1, ...this.layer2].sort(
      (a, b) => a.position.y + (a.hitBox?.h ?? 0) - (b.position.y + (b.hitBox?.h ?? 0)),
    );
    layers12Items.forEach(item => item.render(drawContext));

    this.layer3.sort((a, b) => a.position.y - b.position.y);
    this.layer3.forEach(item => item.render(drawContext));
  }
}
