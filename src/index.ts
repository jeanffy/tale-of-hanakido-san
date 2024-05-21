import { App } from './game/app.js';
import { CanvasDrawContext } from './canvas-draw-context.js';
import { UI } from './ui.js';

const canvasDiv = (document.getElementById('canvas') as HTMLCanvasElement) ?? undefined;
if (canvasDiv === undefined) {
  console.error('no canvas div');
  throw new Error('no canvas div');
}

const context = canvasDiv.getContext('2d') ?? undefined;
if (context === undefined) {
  console.error('no context in canvas');
  throw new Error('no context in canvas');
}

const drawContext = new CanvasDrawContext(context);
const app = new App(canvasDiv, drawContext);

const ui = new UI(app);
ui.stopButton.addEventListener('click', (event: MouseEvent): void => {
  app.enableAnimation(false);
  ui.update();
});
ui.startButton.addEventListener('click', (event: MouseEvent): void => {
  app.enableAnimation(true);
  ui.update();
});
ui.stepButton.addEventListener('click', (event: MouseEvent): void => {
  app.goToNextFrame(13);
  ui.update();
});

await app.start();
