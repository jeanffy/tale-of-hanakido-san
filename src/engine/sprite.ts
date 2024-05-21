import { DrawContext } from './draw-context.js';
import { GeomPoint } from './geom/geom-point.js';
import { GeomRect } from './geom/geom-rect.js';
import { SpriteState, SpriteStateUpdateOut } from './sprite-state.js';

export class Sprite<TTileId> {
  private currentState: SpriteState<TTileId>;

  public constructor(
    private states: SpriteState<TTileId>[],
    private _hitBox: GeomRect | undefined, // hitBox inside the bbox (relative pixel coordinates, relative to bbox)
    private _hitBoxAnchor: GeomPoint | undefined,
  ) {
    if (states.length < 1) {
      console.error('Sprite states must have at least 1 state');
      throw new Error('');
    }
    this.currentState = this.states[0];
  }

  public get bbox(): GeomRect {
    return this.currentState.bbox;
  }

  public get hitBox(): GeomRect | undefined {
    return this._hitBox;
  }

  public get hitBoxAnchor(): GeomPoint | undefined {
    return this._hitBoxAnchor;
  }

  public hasHitBox(): boolean {
    return this._hitBox !== undefined;
  }

  public selectState(label: string, reverse?: boolean): void {
    // if state is the same and reverse status is the same, right state is already selected
    if (label === this.currentState.label) {
      const reversed = reverse ?? false;
      if (this.currentState.isReversed === reversed) {
        return;
      }
    }

    this.currentState = this.states[0];
    const state = this.states.find(s => s.label === label);
    if (state !== undefined) {
      this.currentState = state;
    }
    this.currentState.init(reverse ?? false);
  }

  public update(dt: number): SpriteStateUpdateOut {
    return this.currentState.update(dt);
  }

  public render(drawContext: DrawContext, position: GeomPoint): void {
    this.currentState.render(drawContext, position);

    // if (this._hitBox instanceof GeomRect) {
    //   drawContext.strokeRect(
    //     position.x - (this._hitBoxAnchor?.x ?? 0) + this._hitBox.x,
    //     position.y - (this._hitBoxAnchor?.y ?? 0) + this._hitBox.y,
    //     this._hitBox.w,
    //     this._hitBox.h,
    //     {
    //       color: 'lightgreen',
    //     },
    //   );
    // }
  }
}
