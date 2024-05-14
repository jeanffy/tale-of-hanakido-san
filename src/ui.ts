import { App } from './app.js';

export class UI {
  public stopButton = document.getElementById('ui-btn-stop') as HTMLButtonElement;
  public startButton = document.getElementById('ui-btn-start') as HTMLButtonElement;
  public stepButton = document.getElementById('ui-btn-step') as HTMLButtonElement;

  public constructor(private gameApp: App) {
    this.update();
  }

  public update(): void {
    this.stopButton.style.display = this.gameApp.isAnimationRunning ? 'unset' : 'none';
    this.startButton.style.display = this.gameApp.isAnimationRunning ? 'none' : 'unset';
  }
}
