import { DrawContext } from './draw-context.js';
import { EngineGame } from './engine-game.js';
import { TextureData, TextureManager } from './texture-manager.js';
import { Scene } from './scene/scene.js';
import { SpriteData2, SpriteManager } from './sprite-manager.js';
import { GenericItem } from './scene/generic.item.js';

const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;

export interface SceneDataLayerItem<TSpriteId, TItemType> {
  spriteId: TSpriteId;
  type?: TItemType;
  // (x,y) = position of anchor point (default is top-left corner of sprite)
  x: number;
  y: number;
}

export interface SceneData<TSpriteId, TItemType> {
  layer0: SceneDataLayerItem<TSpriteId, TItemType>[];
  layer1: SceneDataLayerItem<TSpriteId, TItemType>[];
  layer2: SceneDataLayerItem<TSpriteId, TItemType>[];
  layer3: SceneDataLayerItem<TSpriteId, TItemType>[];
}

export abstract class EngineApp<TTileId, TSpriteId, TItemType> {
  private lastTimestamp: number | undefined;
  private _game!: EngineGame<TTileId>;
  private animationRunning = true;

  public constructor(
    private canvas: HTMLCanvasElement,
    private drawContext: DrawContext,
  ) {}

  public get game(): EngineGame<TTileId> {
    return this._game;
  }

  public get isAnimationRunning(): boolean {
    return this.animationRunning;
  }

  public async start(
    tilesData: TextureData<TTileId>[],
    spritesData: SpriteData2<TTileId, TSpriteId>[],
    sceneData: SceneData<TSpriteId, TItemType>,
  ): Promise<void> {
    this.canvas.width = SCREEN_WIDTH;
    this.canvas.height = SCREEN_HEIGHT;

    const tileManager = new TextureManager<TTileId>();
    await tileManager.loadTextures(tilesData);

    const spriteManager = new SpriteManager(spritesData, tileManager);

    const scene = new Scene<TTileId>(
      sceneData.layer0.map(item => this.createSceneItem(spriteManager, item)),
      sceneData.layer1.map(item => this.createSceneItem(spriteManager, item)),
      sceneData.layer2.map(item => this.createSceneItem(spriteManager, item)),
      sceneData.layer3.map(item => this.createSceneItem(spriteManager, item)),
    );

    this._game = new EngineGame<TTileId>(scene);

    this.setupControls();

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  protected abstract createSceneItem(
    spriteManager: SpriteManager<TTileId, TSpriteId>,
    dataItem: SceneDataLayerItem<TSpriteId, TItemType>,
  ): GenericItem<TTileId>;

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
