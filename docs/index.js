class Environment {
    zoom = 2;
}

class AnimationIterator {
    index = 0;
    numberOfSprites;
    frameSkip;
    skippedFrames = 0;
    constructor(params) {
        this.numberOfSprites = params.numberOfSprites;
        this.frameSkip = params.frameSkip;
    }
    reset() {
        this.index = 0;
    }
    getSpriteIndex() {
        this.skippedFrames++;
        if (this.skippedFrames > this.frameSkip) {
            this.skippedFrames = 0;
            this.index++;
            if (this.index > this.numberOfSprites - 1) {
                this.index = 0;
            }
        }
        return this.index;
    }
}
class FrameRateIterator {
    targetFps;
    timer = 0;
    frameCountInOneSecond = 0;
    fps = 0;
    constructor(params) {
        this.targetFps = params.targetFps;
    }
    shouldRender(dt) {
        this.timer += dt;
        if (this.timer > 1000) {
            this.fps = this.frameCountInOneSecond;
            this.frameCountInOneSecond = 0;
            this.timer = 0;
        }
        this.frameCountInOneSecond++;
        return Promise.resolve(true);
    }
}

const TARGET_FPS = 15;
class Game {
    factory;
    hero;
    world;
    controlState;
    frameRateIterator;
    constructor(factory) {
        this.factory = factory;
        this.hero = this.factory.getHero();
        this.world = this.factory.getWorld();
        this.controlState = {
            up: false,
            down: false,
            left: false,
            right: false,
        };
        this.frameRateIterator = new FrameRateIterator({ targetFps: TARGET_FPS });
    }
    nextFrame(drawContext, dt) {
        this.processInputs(dt);
        this.update(dt);
        this.frameRateIterator.shouldRender(dt).then((shouldRender) => {
            if (shouldRender) {
                this.render(drawContext);
            }
        });
    }
    updateControlState(state) {
        this.controlState.up = state.up ?? this.controlState.up;
        this.controlState.down = state.down ?? this.controlState.down;
        this.controlState.left = state.left ?? this.controlState.left;
        this.controlState.right = state.right ?? this.controlState.right;
    }
    processInputs(dt) {
        this.hero.processInputs(this.controlState);
    }
    update(dt) {
        this.world.update(dt);
        this.hero.update(dt);
    }
    render(drawContext) {
        try {
            this.world.render(drawContext);
            this.hero.render(drawContext);
            const fpsString = `FPS: ${this.frameRateIterator.fps}`;
            const c = drawContext;
            c.textAlign = 'left';
            c.textBaseline = 'top';
            c.fillText(fpsString, 5, 5);
        }
        catch (error) {
            console.error(error);
        }
    }
}

class Position {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    moveByVector(vector) {
        return new Position(this.x + vector.x, this.y + vector.y);
    }
}

var SpriteId;
(function (SpriteId) {
    SpriteId["Grass"] = "grass";
    SpriteId["HeroMoveUp0"] = "hero-move-up-0";
    SpriteId["HeroMoveUp1"] = "hero-move-up-1";
    SpriteId["HeroMoveUp2"] = "hero-move-up-2";
    SpriteId["HeroMoveUp3"] = "hero-move-up-3";
    SpriteId["HeroMoveDown0"] = "hero-move-down-0";
    SpriteId["HeroMoveDown1"] = "hero-move-down-1";
    SpriteId["HeroMoveDown2"] = "hero-move-down-2";
    SpriteId["HeroMoveDown3"] = "hero-move-down-3";
    SpriteId["HeroMoveLeft0"] = "hero-move-left-0";
    SpriteId["HeroMoveLeft1"] = "hero-move-left-1";
    SpriteId["HeroMoveLeft2"] = "hero-move-left-2";
    SpriteId["HeroMoveLeft3"] = "hero-move-left-3";
    SpriteId["HeroMoveRight0"] = "hero-move-right-0";
    SpriteId["HeroMoveRight1"] = "hero-move-right-1";
    SpriteId["HeroMoveRight2"] = "hero-move-right-2";
    SpriteId["HeroMoveRight3"] = "hero-move-right-3";
})(SpriteId || (SpriteId = {}));

class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    normalize() {
        const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        if (magnitude <= 0) {
            console.error(`Vector has an invalid magnitude (${this.x}, ${this.y})`);
            throw new Error(`Vector has an invalid magnitude (${this.x}, ${this.y})`);
        }
        return new Vector((this.x /= magnitude), (this.y /= magnitude));
    }
    scale(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }
}

class Hero {
    environment;
    spriteManager;
    runningUpSprites = [];
    runningDownSprites = [];
    runningLeftSprites = [];
    runningRightSprites = [];
    animationIterator = new AnimationIterator({
        frameSkip: 5,
        numberOfSprites: 4,
    });
    position = new Position(0, 0);
    movingDirection = new Vector(0, 0);
    isMoving = false;
    speed = 0.15;
    constructor(environment, spriteManager) {
        this.environment = environment;
        this.spriteManager = spriteManager;
        this.runningUpSprites = [
            this.spriteManager.getSprite(SpriteId.HeroMoveUp0),
            this.spriteManager.getSprite(SpriteId.HeroMoveUp1),
            this.spriteManager.getSprite(SpriteId.HeroMoveUp2),
            this.spriteManager.getSprite(SpriteId.HeroMoveUp3),
        ];
        this.runningDownSprites = [
            this.spriteManager.getSprite(SpriteId.HeroMoveDown0),
            this.spriteManager.getSprite(SpriteId.HeroMoveDown1),
            this.spriteManager.getSprite(SpriteId.HeroMoveDown2),
            this.spriteManager.getSprite(SpriteId.HeroMoveDown3),
        ];
        this.runningLeftSprites = [
            this.spriteManager.getSprite(SpriteId.HeroMoveLeft0),
            this.spriteManager.getSprite(SpriteId.HeroMoveLeft1),
            this.spriteManager.getSprite(SpriteId.HeroMoveLeft2),
            this.spriteManager.getSprite(SpriteId.HeroMoveLeft3),
        ];
        this.runningRightSprites = [
            this.spriteManager.getSprite(SpriteId.HeroMoveRight0),
            this.spriteManager.getSprite(SpriteId.HeroMoveRight1),
            this.spriteManager.getSprite(SpriteId.HeroMoveRight2),
            this.spriteManager.getSprite(SpriteId.HeroMoveRight3),
        ];
    }
    processInputs(controlState) {
        this.isMoving = false;
        this.movingDirection.x = 0;
        this.movingDirection.y = 0;
        if (controlState.up) {
            this.movingDirection.y = -1;
            this.isMoving = true;
        }
        else if (controlState.down) {
            this.movingDirection.y = 1;
            this.isMoving = true;
        }
        if (controlState.left) {
            this.movingDirection.x = -1;
            this.isMoving = true;
        }
        else if (controlState.right) {
            this.movingDirection.x = 1;
            this.isMoving = true;
        }
        if (this.isMoving) {
            this.movingDirection = this.movingDirection.normalize();
        }
    }
    update(dt) {
        if (this.isMoving) {
            const direction = this.movingDirection.scale(this.speed * dt);
            this.position = this.position.moveByVector(direction);
        }
    }
    render(drawContext) {
        let sprite;
        if (this.isMoving) {
            const index = this.animationIterator.getSpriteIndex();
            if (this.movingDirection.y < 0) {
                sprite = this.runningUpSprites[index];
            }
            else if (this.movingDirection.y > 0) {
                sprite = this.runningDownSprites[index];
            }
            if (this.movingDirection.x < 0) {
                sprite = this.runningLeftSprites[index];
            }
            else if (this.movingDirection.x > 0) {
                sprite = this.runningRightSprites[index];
            }
        }
        if (sprite === undefined) {
            sprite = this.runningDownSprites[0];
        }
        const w = sprite.element.width * this.environment.zoom;
        const h = sprite.element.height * this.environment.zoom;
        drawContext.drawImage(sprite.element, this.position.x, this.position.y, w, h);
    }
}

const MAP_TILE_COUNT_W = 20;
const MAP_TILE_COUNT_H = 20;
class World {
    environment;
    spriteManager;
    grassSprite;
    constructor(environment, spriteManager) {
        this.environment = environment;
        this.spriteManager = spriteManager;
        this.grassSprite = this.spriteManager.getSprite(SpriteId.Grass);
    }
    update(dt) { }
    render(drawContext) {
        for (let i = 0; i < MAP_TILE_COUNT_W; i++) {
            for (let j = 0; j < MAP_TILE_COUNT_H; j++) {
                const w = this.grassSprite.element.width * this.environment.zoom;
                const h = this.grassSprite.element.height * this.environment.zoom;
                drawContext.drawImage(this.grassSprite.element, i * w, j * h, w, h);
            }
        }
    }
}

class SpriteManager {
    sprites = [];
    async loadSprites(sprites) {
        this.sprites = await Promise.all(sprites.map((s) => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    id: s.id,
                    element: img,
                });
            };
            img.onerror = () => {
                reject();
            };
            img.src = s.url;
        })));
    }
    getSprite(id) {
        const sprite = this.sprites.find((s) => s.id === id);
        if (sprite === undefined) {
            throw new Error(`No sprite for id '${id}'`);
        }
        return sprite;
    }
}

class Factory {
    environment;
    spriteManager;
    game;
    hero;
    world;
    getEnvironment() {
        if (this.environment === undefined) {
            this.environment = new Environment();
        }
        return this.environment;
    }
    getSpriteManager() {
        if (this.spriteManager === undefined) {
            this.spriteManager = new SpriteManager();
        }
        return this.spriteManager;
    }
    getGame() {
        if (this.game === undefined) {
            this.game = new Game(this);
        }
        return this.game;
    }
    getHero() {
        if (this.hero === undefined) {
            this.hero = new Hero(this.getEnvironment(), this.getSpriteManager());
        }
        return this.hero;
    }
    getWorld() {
        if (this.world === undefined) {
            this.world = new World(this.getEnvironment(), this.getSpriteManager());
        }
        return this.world;
    }
}

const assetsDir = 'assets';
const gameSprites = [
    { id: SpriteId.Grass, url: `${assetsDir}/grass.jpg` },
    { id: SpriteId.HeroMoveUp0, url: `${assetsDir}/hero-move-up-0.png` },
    { id: SpriteId.HeroMoveUp1, url: `${assetsDir}/hero-move-up-1.png` },
    { id: SpriteId.HeroMoveUp2, url: `${assetsDir}/hero-move-up-2.png` },
    { id: SpriteId.HeroMoveUp3, url: `${assetsDir}/hero-move-up-3.png` },
    { id: SpriteId.HeroMoveDown0, url: `${assetsDir}/hero-move-down-0.png` },
    { id: SpriteId.HeroMoveDown1, url: `${assetsDir}/hero-move-down-1.png` },
    { id: SpriteId.HeroMoveDown2, url: `${assetsDir}/hero-move-down-2.png` },
    { id: SpriteId.HeroMoveDown3, url: `${assetsDir}/hero-move-down-3.png` },
    { id: SpriteId.HeroMoveLeft0, url: `${assetsDir}/hero-move-left-0.png` },
    { id: SpriteId.HeroMoveLeft1, url: `${assetsDir}/hero-move-left-1.png` },
    { id: SpriteId.HeroMoveLeft2, url: `${assetsDir}/hero-move-left-2.png` },
    { id: SpriteId.HeroMoveLeft3, url: `${assetsDir}/hero-move-left-3.png` },
    { id: SpriteId.HeroMoveRight0, url: `${assetsDir}/hero-move-right-0.png` },
    { id: SpriteId.HeroMoveRight1, url: `${assetsDir}/hero-move-right-1.png` },
    { id: SpriteId.HeroMoveRight2, url: `${assetsDir}/hero-move-right-2.png` },
    { id: SpriteId.HeroMoveRight3, url: `${assetsDir}/hero-move-right-3.png` },
];

const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const factory = new Factory();
let game;
let drawContext;
async function bootstrap() {
    const canvasDiv = document.getElementById('canvas') ?? undefined;
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
let lastTimestamp;
function gameLoop(timestamp) {
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
window.addEventListener('keydown', (event) => {
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
window.addEventListener('keyup', (event) => {
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
//# sourceMappingURL=index.js.map
