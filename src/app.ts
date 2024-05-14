import { dataTiles } from './game/data/data-tiles.js';
import { dataWorld } from './game/data/data-world.js';
import { DrawContext } from './game/draw-context.js';
import { Factory } from './game/factory.js';
import { Game } from './game/game.js';

const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;

export class App {
  private lastTimestamp: number | undefined;
  private _game!: Game;
  private animationRunning = true;

  public constructor(
    private canvas: HTMLCanvasElement,
    private drawContext: DrawContext,
  ) {
  }

  public get game(): Game {
    return this._game;
  }

  public get isAnimationRunning(): boolean {
    return this.animationRunning;
  }

  public async start(factory: Factory): Promise<void> {
    this.canvas.width = SCREEN_WIDTH;
    this.canvas.height = SCREEN_HEIGHT;

    const tileManager = factory.getTileManager();
    await tileManager.loadTiles(dataTiles);

    const world = factory.getWorld(dataWorld);

    this._game = factory.getGame(world);

    this.setupControls();

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  public enableAnimation(enabled: boolean): void {
    this.animationRunning = enabled;
    if (this.animationRunning) {
      window.requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  public goToNextFrame(dt: number): void {
    this.drawBackground();
    this._game.nextFrame(this.drawContext, dt);
    this._game.updateControlState({ action: false });
  }

  private gameLoop(timestamp: number): void {
    this.lastTimestamp = this.lastTimestamp ?? timestamp;
    const dt = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    this.goToNextFrame(dt);
    if (this.animationRunning) {
      window.requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  private drawBackground(): void {
    this.drawContext.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, { color: '#999' });

    for (let i = 50; i < SCREEN_WIDTH; i += 50) {
      this.drawContext.strokeRect(i, 0, 50, SCREEN_WIDTH, { color: 'black' });
    }
    for (let i = 25; i < SCREEN_WIDTH; i += 25) {
      this.drawContext.strokeRect(i, 0, 25, SCREEN_WIDTH, { color: '#888' });
    }
    for (let j = 50; j < SCREEN_HEIGHT; j += 50) {
      this.drawContext.strokeRect(0, j, SCREEN_HEIGHT, 50, { color: 'black' });
    }
    for (let j = 25; j < SCREEN_HEIGHT; j += 25) {
      this.drawContext.strokeRect(0, j, SCREEN_HEIGHT, 25, { color: '#888' });
    }
  }

  private setupControls(): void {
    window.addEventListener('keydown', (event: KeyboardEvent): void => {
      switch (event.code.toLowerCase()) {
        case 'arrowup':
          this.game.updateControlState({ up: true });
          event.preventDefault();
          break;
        case 'arrowdown':
          this.game.updateControlState({ down: true });
          event.preventDefault();
          break;
        case 'arrowleft':
          this.game.updateControlState({ left: true });
          event.preventDefault();
          break;
        case 'arrowright':
          this.game.updateControlState({ right: true });
          event.preventDefault();
          break;
        case 'keyz':
          this.game.updateControlState({ control: true });
          event.preventDefault();
          break;
      }
    });

    window.addEventListener('keyup', (event: KeyboardEvent): void => {
      switch (event.code.toLowerCase()) {
        case 'arrowup':
          this.game.updateControlState({ up: false });
          event.preventDefault();
          break;
        case 'arrowdown':
          this.game.updateControlState({ down: false });
          event.preventDefault();
          break;
        case 'arrowleft':
          this.game.updateControlState({ left: false });
          event.preventDefault();
          break;
        case 'arrowright':
          this.game.updateControlState({ right: false });
          event.preventDefault();
          break;
        case 'keyz':
          this.game.updateControlState({ control: false });
          event.preventDefault();
          break;
        case 'keyx':
          this.game.updateControlState({ action: true });
          event.preventDefault();
          break;
      }
    });
  }
}
