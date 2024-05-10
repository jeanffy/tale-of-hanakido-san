import { Factory } from './game/factory.js';
import { CanvasDrawContext } from './canvas-draw-context.js';
import { Game } from './game/game.js';
import { dataWorld } from './game/data/data-world.js';
import { dataTiles } from './game/data/data-tiles.js';

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

  const tileManager = factory.getTileManager();
  await tileManager.loadTiles(dataTiles);
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

  drawContext.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, { color: '#999' });

  drawContext.strokeRect(0, 0, 400, 400, { color: 'black' });

  for (let i = 50; i < SCREEN_WIDTH; i += 50) {
    drawContext.strokeRect(i, 0, 50, SCREEN_WIDTH, { color: 'black' });
  }
  for (let i = 25; i < SCREEN_WIDTH; i += 25) {
    drawContext.strokeRect(i, 0, 25, SCREEN_WIDTH, { color: '#888' });
  }
  for (let j = 50; j < SCREEN_HEIGHT; j += 50) {
    drawContext.strokeRect(0, j, SCREEN_HEIGHT, 50, { color: 'black' });
  }
  for (let j = 25; j < SCREEN_HEIGHT; j += 25) {
    drawContext.strokeRect(0, j, SCREEN_HEIGHT, 25, { color: '#888' });
  }

  game.nextFrame(drawContext, dt);
  game.updateControlState({ action: false });
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
    case 'Space':
      game.updateControlState({ action: true });
      event.preventDefault();
      break;
  }
});

bootstrap();
