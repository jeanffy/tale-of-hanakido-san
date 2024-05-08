import { Factory } from './game/factory.js';
import { dataSprites } from './game/data/data-sprites.js';
import { CanvasDrawContext } from './canvas-draw-context.js';
import { Game } from './game/game.js';
import { dataWorld } from './game/data/data-world.js';

const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;

const factory = new Factory();
let game: Game | undefined;
let drawContext: CanvasDrawContext | undefined;

async function bootstrap(): Promise<void> {
  const canvasDiv = (document.getElementById('canvas') as HTMLCanvasElement) ?? undefined;
  if (canvasDiv === undefined) {
    console.error('no canvas div');
    return;
  }

  const context = canvasDiv.getContext('2d') ?? undefined;
  if (context === undefined) {
    console.error('no context in canvas');
    return;
  }

  drawContext = new CanvasDrawContext(context);

  canvasDiv.width = SCREEN_WIDTH;
  canvasDiv.height = SCREEN_HEIGHT;

  const spriteManager = factory.getSpriteManager();
  await spriteManager.loadSprites(dataSprites);
  const world = factory.getWorld(dataWorld);
  game = factory.getGame(world);

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
