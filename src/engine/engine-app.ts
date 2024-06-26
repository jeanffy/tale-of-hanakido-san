import { DrawContext } from './draw-context.js';
import { EngineGame } from './engine-game.js';
import { TextureManager } from './texture/texture-manager.js';
import { Scene } from './scene/scene.js';
import { SpriteManager } from './sprite/sprite-manager.js';
import { GenericItem } from './scene/generic.item.js';
import { SceneData, SceneLayerItemData, SpriteData, TextureData } from './data.js';
import { ControlStateEvent } from './control-state.js';

const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;

export abstract class EngineApp {
  private lastTimestamp: number | undefined;
  private _game!: EngineGame;
  private animationRunning = true;

  public constructor(
    private canvas: HTMLCanvasElement,
    private drawContext: DrawContext,
  ) {}

  public get game(): EngineGame {
    return this._game;
  }

  public get isAnimationRunning(): boolean {
    return this.animationRunning;
  }

  public async start(tilesData: TextureData[], spritesData: SpriteData[], sceneData: SceneData): Promise<void> {
    this.canvas.width = SCREEN_WIDTH;
    this.canvas.height = SCREEN_HEIGHT;

    const tileManager = new TextureManager();
    await tileManager.loadTextures(tilesData);

    const spriteManager = new SpriteManager(spritesData, tileManager);

    const scene = new Scene(
      sceneData.layer0.map(item => this.createSceneItem(spriteManager, item)),
      sceneData.layer1.map(item => this.createSceneItem(spriteManager, item)),
      sceneData.layer2.map(item => this.createSceneItem(spriteManager, item)),
      sceneData.layer3.map(item => this.createSceneItem(spriteManager, item)),
    );

    this._game = new EngineGame(scene);

    this.setupControls();

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  protected abstract createSceneItem(spriteManager: SpriteManager, dataItem: SceneLayerItemData): GenericItem;

  // {
  //   const sprite = spriteManager.getSprite(dataItem.spriteId);

  //   if (dataItem.type !== undefined) {
  //     switch (dataItem.type) {
  //       case SceneDataItemType.Chest:
  //         return new ChestItem({ sprite, x: dataItem.x, y: dataItem.y });
  //       case SceneDataItemType.Hero:
  //         return new HeroItem({ sprite, x: dataItem.x, y: dataItem.y });
  //       default:
  //         console.error(`Unhandled item type '${dataItem.type}' at (x,y) = (${dataItem.x},${dataItem.y})`);
  //         throw new Error();
  //     }
  //   }

  //   return new GenericItem({ sprite, x: dataItem.x, y: dataItem.y });
  // }

  public enableAnimation(enabled: boolean): void {
    this.animationRunning = enabled;
    if (this.animationRunning) {
      window.requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  public goToNextFrame(delatTime: number): void {
    this.drawBackground();
    this._game.nextFrame(this.drawContext, delatTime);
  }

  private gameLoop(timestamp: number): void {
    this.lastTimestamp = this.lastTimestamp ?? timestamp;
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    this.goToNextFrame(deltaTime);
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
          this.game.updateControlState(ControlStateEvent.UpPressed);
          event.preventDefault();
          break;
        case 'arrowdown':
          this.game.updateControlState(ControlStateEvent.DownPressed);
          event.preventDefault();
          break;
        case 'arrowleft':
          this.game.updateControlState(ControlStateEvent.LeftPressed);
          event.preventDefault();
          break;
        case 'arrowright':
          this.game.updateControlState(ControlStateEvent.RightPressed);
          event.preventDefault();
          break;
        case 'keyz':
          this.game.updateControlState(ControlStateEvent.ControlPressed);
          event.preventDefault();
          break;
        case 'keyx':
          console.log('pre');
          this.game.updateControlState(ControlStateEvent.Action1Pressed);
          event.preventDefault();
          break;
        case 'keyc':
          this.game.updateControlState(ControlStateEvent.Action2Pressed);
          event.preventDefault();
          break;
      }
    });

    window.addEventListener('keyup', (event: KeyboardEvent): void => {
      switch (event.code.toLowerCase()) {
        case 'arrowup':
          this.game.updateControlState(ControlStateEvent.UpReleased);
          event.preventDefault();
          break;
        case 'arrowdown':
          this.game.updateControlState(ControlStateEvent.DownReleased);
          event.preventDefault();
          break;
        case 'arrowleft':
          this.game.updateControlState(ControlStateEvent.LeftReleased);
          event.preventDefault();
          break;
        case 'arrowright':
          this.game.updateControlState(ControlStateEvent.RightReleased);
          event.preventDefault();
          break;
        case 'keyz':
          this.game.updateControlState(ControlStateEvent.ControlReleased);
          event.preventDefault();
          break;
        case 'keyx':
          console.log('rel');
          this.game.updateControlState(ControlStateEvent.Action1Released);
          event.preventDefault();
          break;
        case 'keyc':
          this.game.updateControlState(ControlStateEvent.Action2Released);
          event.preventDefault();
          break;
      }
    });
  }
}
