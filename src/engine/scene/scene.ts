import type { DrawContext } from '../draw-context.js';
import { GenericItem } from './generic.item.js';
import { ControlState } from '../control-state.js';
import { SceneCollider } from './scene-collider.js';

export class Scene {
  private collider: SceneCollider; // TODO: remove coupling

  public constructor(
    private layer0: GenericItem[],
    private layer1: GenericItem[],
    private layer2: GenericItem[],
    private layer3: GenericItem[],
  ) {
    this.collider = new SceneCollider([...this.layer1, ...this.layer2]);
  }

  public processInputs(deltaTime: number, controlState: ControlState): void {
    this.layer2.forEach(item => item.processInputs(controlState, this.collider));
  }

  public update(deltaTime: number): void {
    this.layer1.forEach(item => item.update(deltaTime, this.collider));
    this.layer2.forEach(item => item.update(deltaTime, this.collider));
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
