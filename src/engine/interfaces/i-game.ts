export interface GameControlState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface IGame {
  loop(timestamp: number): Promise<void>;
  updateControls(state: Partial<GameControlState>): void;
}
