import { DrawContext } from '../draw-context.js';
import { GeomPoint } from '../geom/geom-point.js';
import { GeomRect } from '../geom/geom-rect.js';
import { SpriteState, SpriteStateUpdateOut } from './sprite-state.js';

export interface SpriteInitParams {
  states: SpriteState[];
  hitBox?: GeomRect;
  hitBoxAnchor?: GeomPoint;
}

export class Sprite {
  private currentState: SpriteState;

  public constructor(private params: SpriteInitParams) {
    if (params.states.length < 1) {
      console.error('Sprite states must have at least 1 state');
      throw new Error('Sprite states must have at least 1 state');
    }
    this.currentState = this.params.states[0];
  }

  public get boundingBox(): GeomRect {
    return this.currentState.bbox;
  }

  public get hitBox(): GeomRect | undefined {
    return this.params.hitBox;
  }

  public hasHitBox(): boolean {
    return this.params.hitBox !== undefined;
  }

  public get hitBoxAnchor(): GeomPoint | undefined {
    return this.params.hitBoxAnchor;
  }

  public selectState(label: string, reverse?: boolean): void {
    // if state is the same and reverse status is the same, right state is already selected
    if (label === this.currentState.label) {
      const reversed = reverse ?? false;
      if (this.currentState.isReversed === reversed) {
        return;
      }
    }

    this.currentState = this.params.states[0];
    const state = this.params.states.find(s => s.label === label);
    if (state !== undefined) {
      this.currentState = state;
    }
  }

  public update(deltaTime: number): SpriteStateUpdateOut {
    return this.currentState.update(deltaTime);
  }

  public render(drawContext: DrawContext, position: GeomPoint): void {
    this.currentState.render(drawContext, position);

    if (this.hitBox instanceof GeomRect) {
      drawContext.strokeRect(
        position.x - (this.hitBoxAnchor?.x ?? 0) + this.hitBox.x,
        position.y - (this.hitBoxAnchor?.y ?? 0) + this.hitBox.y,
        this.hitBox.w,
        this.hitBox.h,
        {
          color: 'lightgreen',
        },
      );
    }
  }
}
