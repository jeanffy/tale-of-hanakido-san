import { Factory } from './game/factory.js';
import { CanvasDrawContext } from './canvas-draw-context.js';
import { App } from './app.js';
import { UI } from './ui.js';

let app: App | undefined;
let ui: UI | undefined;

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

  const drawContext = new CanvasDrawContext(context);
  app = new App(canvasDiv, drawContext);

  ui = new UI(app);
  ui.stopButton.addEventListener('click', onStopAnimate);
  ui.startButton.addEventListener('click', onStartAnimate);
  ui.stepButton.addEventListener('click', onStepAnimate);

  const factory = new Factory();
  await app.start(factory);
}

export function onStopAnimate(event: MouseEvent): void {
  app?.enableAnimation(false);
  ui?.update();
}

export function onStartAnimate(event: MouseEvent): void {
  app?.enableAnimation(true);
  ui?.update();
}

export function onStepAnimate(event: MouseEvent): void {
  app?.goToNextFrame(13);
  ui?.update();
}

bootstrap();
