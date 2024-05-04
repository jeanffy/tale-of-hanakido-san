import { Factory } from './game/factory.js';
import { gameSprites } from './game/game-sprites.js';
import { IDrawContext } from './interfaces/i-draw-context.js';
import { IGame } from './interfaces/i-game.js';

const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;

const factory = new Factory();
let game: IGame | undefined;
let drawContext: IDrawContext | undefined;

async function bootstrap(): Promise<void> {
  const canvasDiv =
    (document.getElementById('canvas') as HTMLCanvasElement) ?? undefined;
  if (canvasDiv === undefined) {
    console.error('no canvas div');
    return;
  }

  drawContext = canvasDiv.getContext('2d') ?? undefined;
  if (drawContext === undefined) {
    console.error('no context in canvas');
    return;
  }

  canvasDiv.width = SCREEN_WIDTH;
  canvasDiv.height = SCREEN_HEIGHT;

  const spriteManager = factory.getSpriteManager();
  await spriteManager.loadSprites(gameSprites);
  game = factory.getGame();

  window.requestAnimationFrame(gameLoop);
}

let lastTimestamp: number | undefined;

function gameLoop(timestamp: number): void {
  if (drawContext === undefined) {
    console.error(`${gameLoop.name}: no drawContext`);
    return;
  }
  if (game === undefined) {
    console.error(`${gameLoop.name}: no game`);
    return;
  }

  lastTimestamp = lastTimestamp ?? timestamp;
  const dt = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  game.nextFrame(drawContext, dt);
  window.requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event: KeyboardEvent): void => {
  if (game === undefined) {
    return;
  }

  switch (event.code) {
    case 'ArrowUp':
      game.updateControlState({ up: true });
      event.preventDefault();
      break;
    case 'ArrowDown':
      game.updateControlState({ down: true });
      event.preventDefault();
      break;
    case 'ArrowLeft':
      game.updateControlState({ left: true });
      event.preventDefault();
      break;
    case 'ArrowRight':
      game.updateControlState({ right: true });
      event.preventDefault();
      break;
  }
});

window.addEventListener('keyup', (event: KeyboardEvent): void => {
  if (game === undefined) {
    return;
  }

  switch (event.code) {
    case 'ArrowUp':
      game.updateControlState({ up: false });
      event.preventDefault();
      break;
    case 'ArrowDown':
      game.updateControlState({ down: false });
      event.preventDefault();
      break;
    case 'ArrowLeft':
      game.updateControlState({ left: false });
      event.preventDefault();
      break;
    case 'ArrowRight':
      game.updateControlState({ right: false });
      event.preventDefault();
      break;
  }
});

bootstrap();
