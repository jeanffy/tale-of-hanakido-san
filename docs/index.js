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
    world;
    controlState;
    frameRateIterator;
    constructor(world) {
        this.world = world;
        this.controlState = {
            up: false,
            down: false,
            left: false,
            right: false,
        };
        this.frameRateIterator = new FrameRateIterator({ targetFps: TARGET_FPS });
    }
    nextFrame(drawContext, dt) {
        this.world.processInputs(dt, this.controlState);
        this.world.update(dt);
        this.frameRateIterator.shouldRender(dt).then(shouldRender => {
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
    render(drawContext) {
        try {
            this.world.render(drawContext);
            const fpsString = `FPS: ${this.frameRateIterator.fps}`;
            drawContext.writeText(fpsString, 5, 5, { horizontalAlign: 'left', verticalAlign: 'top' });
        }
        catch (error) {
            console.error(error);
        }
    }
}

class GeomPoint {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    moveByVector(vector) {
        return new GeomPoint(this.x + vector.x, this.y + vector.y);
    }
}

class GeomVector {
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
        return new GeomVector((this.x /= magnitude), (this.y /= magnitude));
    }
    scale(factor) {
        return new GeomVector(this.x * factor, this.y * factor);
    }
}

class World {
    spriteManager;
    landscapeSprites;
    backgroundItems;
    characters;
    overlayItems;
    constructor(spriteManager, params) {
        this.spriteManager = spriteManager;
        this.landscapeSprites = params.landscape;
        this.backgroundItems = params.background;
        this.characters = params.characters;
        this.overlayItems = params.overlays;
    }
    processInputs(dt, controlState) {
        this.characters.forEach(item => item.processInputs(controlState));
    }
    update(dt) {
        this.characters.forEach(item => item.update(dt, this));
    }
    render(drawContext) {
        if (this.landscapeSprites.length > 0) {
            const mapHorizontalLength = this.landscapeSprites[0].length;
            const mapVerticalLength = this.landscapeSprites.length;
            for (let i = 0; i < mapHorizontalLength; i++) {
                for (let j = 0; j < mapVerticalLength; j++) {
                    const spriteId = this.landscapeSprites[j][i];
                    const sprite = this.spriteManager.getSprite(spriteId);
                    sprite.renderLandscape(drawContext, new GeomPoint(i * sprite.img.width, j * sprite.img.height));
                }
            }
        }
        const secondPassFuncs = [];
        this.backgroundItems.forEach(item => secondPassFuncs.push(item.render(drawContext)));
        this.characters.forEach(item => item.render(drawContext));
        secondPassFuncs.filter((f) => f !== undefined).forEach(f => f());
        this.overlayItems.forEach(item => item.render(drawContext));
    }
    itemCollides(hitBox) {
        for (const item of this.backgroundItems) {
            const spriteHitBox = item.hitBox.moveByVector(new GeomVector(item.position.x, item.position.y));
            if (spriteHitBox.intersects(hitBox)) {
                return item;
            }
        }
        return undefined;
    }
}

class GeomRect {
    x;
    y;
    w;
    h;
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    moveByVector(vector) {
        return new GeomRect(this.x + vector.x, this.y + vector.y, this.w, this.h);
    }
    intersects(rect) {
        if (rect.x > this.x + this.w) {
            return false;
        }
        if (rect.x + rect.w < this.x) {
            return false;
        }
        if (rect.y > this.y + this.h) {
            return false;
        }
        if (rect.y + rect.h < this.y) {
            return false;
        }
        return true;
    }
}

var SpriteDrawType;
(function (SpriteDrawType) {
    SpriteDrawType[SpriteDrawType["Landscape"] = 0] = "Landscape";
    SpriteDrawType[SpriteDrawType["Background"] = 1] = "Background";
    SpriteDrawType[SpriteDrawType["Character"] = 2] = "Character";
    SpriteDrawType[SpriteDrawType["Overlay"] = 3] = "Overlay";
})(SpriteDrawType || (SpriteDrawType = {}));
class Sprite {
    id;
    img;
    hitBox;
    layers;
    constructor(params) {
        this.id = params.id;
        this.img = params.img;
        this.hitBox = params.hitBox;
        this.layers = params.layers;
    }
    renderLandscape(drawContext, position) {
        this.drawFull(drawContext, position);
    }
    renderBackground(drawContext, position) {
        let needSecondPass = false;
        if (this.layers === undefined) {
            this.drawFull(drawContext, position);
        }
        else {
            this.drawLayer(drawContext, position, this.layers.background);
            needSecondPass = true;
        }
        this.drawHitBox(drawContext, position);
        return needSecondPass;
    }
    renderCharacter(drawContext, position) {
        this.drawFull(drawContext, position);
        this.drawHitBox(drawContext, position);
    }
    renderOverlay(drawContext, position) {
        if (this.layers === undefined) {
            this.drawFull(drawContext, position);
        }
        else {
            this.drawLayer(drawContext, position, this.layers.overlay);
        }
    }
    drawFull(drawContext, position) {
        drawContext.drawImage(this.img, position.x, position.y, this.img.width, this.img.height);
    }
    drawLayer(drawContext, position, layer) {
        drawContext.drawImageCropped(this.img, layer.x, layer.y, layer.w, layer.h, position.x + layer.x, position.y + layer.y, layer.w, layer.h);
    }
    drawHitBox(drawContext, position) {
        drawContext.strokeRect(position.x + this.hitBox.x, position.y + this.hitBox.y, this.hitBox.w, this.hitBox.h, {
            color: 'yellow',
        });
    }
}

class SpriteManager {
    sprites = new Map();
    async loadSprites(spritesData) {
        for (const spriteData of spritesData) {
            const sprite = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    let scale = spriteData.scale ?? 1;
                    const spriteImg = this.scaleSprite(img, scale);
                    let spriteHitBox;
                    if (spriteData.hitBox !== undefined) {
                        spriteHitBox = new GeomRect(spriteData.hitBox[0] * scale, spriteData.hitBox[1] * scale, (spriteData.hitBox[2] - spriteData.hitBox[0] + 1) * scale, (spriteData.hitBox[3] - spriteData.hitBox[1] + 1) * scale);
                    }
                    else {
                        spriteHitBox = new GeomRect(0, 0, img.width * scale, img.height * scale);
                    }
                    let layers;
                    if (spriteData.layers !== undefined) {
                        layers = {
                            background: new GeomRect(spriteData.layers.background[0] * scale, spriteData.layers.background[1] * scale, (spriteData.layers.background[2] - spriteData.layers.background[0] + 1) * scale, (spriteData.layers.background[3] - spriteData.layers.background[1] + 1) * scale),
                            overlay: new GeomRect(spriteData.layers.overlay[0] * scale, spriteData.layers.overlay[1] * scale, (spriteData.layers.overlay[2] - spriteData.layers.overlay[0] + 1) * scale, (spriteData.layers.overlay[3] - spriteData.layers.overlay[1] + 1) * scale),
                        };
                    }
                    resolve(new Sprite({
                        id: spriteData.id,
                        img: spriteImg,
                        hitBox: spriteHitBox,
                        layers: layers,
                    }));
                };
                img.onerror = () => {
                    reject();
                };
                img.src = spriteData.url;
            });
            this.sprites.set(spriteData.id, sprite);
        }
    }
    getSprite(id) {
        const sprite = this.sprites.get(id);
        if (sprite === undefined) {
            throw new Error(`No sprite for id '${id}'`);
        }
        return sprite;
    }
    scaleSprite(img, scale) {
        if (!Number.isInteger(scale)) {
            console.error(`Invalid scale ${scale}`);
            throw Error();
        }
        if (scale === 1) {
            return img;
        }
        const originalCanvas = document.createElement('canvas');
        const originalContext = originalCanvas.getContext('2d');
        if (originalContext === null) {
            console.error('Error creating memory canvas');
            throw Error();
        }
        const originalWidth = img.width;
        const originalHeight = img.height;
        const targetWidth = originalWidth * scale;
        const targetHeight = originalHeight * scale;
        originalContext.drawImage(img, 0, 0, originalWidth, originalHeight);
        const originalData = originalContext.getImageData(0, 0, originalWidth, originalHeight);
        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = targetWidth;
        targetCanvas.height = targetHeight;
        const targetContext = targetCanvas.getContext('2d');
        if (targetContext === null) {
            console.error('Error creating memory canvas');
            throw Error();
        }
        const targetData = targetContext.createImageData(targetWidth, targetHeight);
        let targetDataIndex = 0;
        for (let y = 0; y < originalHeight; y++) {
            const lineStartIndex = y * originalWidth * 4;
            const lineEndIndex = lineStartIndex + originalWidth * 4;
            const linePixelsRGBA = originalData.data.slice(lineStartIndex, lineEndIndex);
            for (let s = 0; s < scale; s++) {
                for (let x = 0; x < linePixelsRGBA.length; x += 4) {
                    for (let s = 0; s < scale; s++) {
                        targetData.data[targetDataIndex++] = linePixelsRGBA[x];
                        targetData.data[targetDataIndex++] = linePixelsRGBA[x + 1];
                        targetData.data[targetDataIndex++] = linePixelsRGBA[x + 2];
                        targetData.data[targetDataIndex++] = linePixelsRGBA[x + 3];
                    }
                }
            }
        }
        targetContext.putImageData(targetData, 0, 0);
        const targetImg = document.createElement('img');
        targetImg.src = targetCanvas.toDataURL();
        return targetImg;
    }
}

class Factory {
    spriteManager;
    game;
    world;
    getSpriteManager() {
        if (this.spriteManager === undefined) {
            this.spriteManager = new SpriteManager();
        }
        return this.spriteManager;
    }
    getGame(world) {
        if (this.game === undefined) {
            this.game = new Game(world);
        }
        return this.game;
    }
    getWorld(params) {
        if (this.world === undefined) {
            this.world = new World(this.getSpriteManager(), params);
        }
        return this.world;
    }
}

var SpriteId;
(function (SpriteId) {
    SpriteId["Debug"] = "debug";
    SpriteId["Grass0"] = "grass0";
    SpriteId["Grass1"] = "grass1";
    SpriteId["Plant"] = "plant";
    SpriteId["Bush"] = "bush";
    SpriteId["Chest"] = "chest";
    SpriteId["Book"] = "book";
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

const assetsDir = 'assets';
const scale = 3;
const dataSprites = [
    { id: SpriteId.Debug, url: `${assetsDir}/debug.png`, scale },
    { id: SpriteId.Grass0, url: `${assetsDir}/grass-empty.png`, scale },
    { id: SpriteId.Grass1, url: `${assetsDir}/grass.png`, scale },
    { id: SpriteId.Plant, url: `${assetsDir}/plant.png`, scale, hitBox: [2, 17, 13, 27], layers: { background: [0, 14, 14, 28], overlay: [0, 0, 14, 13] } },
    { id: SpriteId.Bush, url: `${assetsDir}/bush.png`, scale, hitBox: [1, 1, 11, 11] },
    { id: SpriteId.Chest, url: `${assetsDir}/chest.png`, scale, hitBox: [0, 0, 19, 13] },
    { id: SpriteId.Book, url: `${assetsDir}/book.png`, scale },
    { id: SpriteId.HeroMoveUp0, url: `${assetsDir}/hero-move-up-0.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveUp1, url: `${assetsDir}/hero-move-up-1.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveUp2, url: `${assetsDir}/hero-move-up-2.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveUp3, url: `${assetsDir}/hero-move-up-3.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveDown0, url: `${assetsDir}/hero-move-down-0.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveDown1, url: `${assetsDir}/hero-move-down-1.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveDown2, url: `${assetsDir}/hero-move-down-2.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveDown3, url: `${assetsDir}/hero-move-down-3.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveLeft0, url: `${assetsDir}/hero-move-left-0.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveLeft1, url: `${assetsDir}/hero-move-left-1.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveLeft2, url: `${assetsDir}/hero-move-left-2.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveLeft3, url: `${assetsDir}/hero-move-left-3.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveRight0, url: `${assetsDir}/hero-move-right-0.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveRight1, url: `${assetsDir}/hero-move-right-1.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveRight2, url: `${assetsDir}/hero-move-right-2.png`, scale, hitBox: [1, 12, 12, 20] },
    { id: SpriteId.HeroMoveRight3, url: `${assetsDir}/hero-move-right-3.png`, scale, hitBox: [1, 12, 12, 20] },
];

class CanvasDrawContext {
    context;
    constructor(context) {
        this.context = context;
    }
    strokeRect(x, y, w, h, options) {
        if (options?.width !== undefined) {
            this.context.lineWidth = options.width;
        }
        if (options?.color !== undefined) {
            this.context.strokeStyle = options.color;
        }
        this.context.strokeRect(x, y, w, h);
    }
    drawImage(image, x, y, w, h) {
        this.context.drawImage(image, x, y, w, h);
    }
    drawImageCropped(image, x, y, w, h, sx, sy, sw, sh) {
        this.context.drawImage(image, x, y, w, h, sx, sy, sw, sh);
    }
    writeText(text, x, y, options) {
        if (options?.horizontalAlign !== undefined) {
            switch (options.horizontalAlign) {
                case 'left':
                    this.context.textAlign = 'left';
                    break;
                case 'center':
                    this.context.textAlign = 'center';
                    break;
                case 'right':
                    this.context.textAlign = 'right';
                    break;
            }
        }
        if (options?.verticalAlign !== undefined) {
            switch (options.verticalAlign) {
                case 'top':
                    this.context.textBaseline = 'top';
                    break;
                case 'center':
                    this.context.textBaseline = 'middle';
                    break;
                case 'bottom':
                    this.context.textBaseline = 'bottom';
                    break;
            }
        }
        this.context.fillText(text, x, y);
    }
}

var WorldDataItemType;
(function (WorldDataItemType) {
    WorldDataItemType[WorldDataItemType["Hero"] = 0] = "Hero";
})(WorldDataItemType || (WorldDataItemType = {}));
const dataWorld = {
    landscape: [
        [SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0],
        [SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass0],
        [SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0],
        [SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass0],
        [SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0],
        [SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass0],
        [SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0],
        [SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass1, SpriteId.Grass0, SpriteId.Grass0],
    ],
    backgroundItems: [
        { spriteId: SpriteId.Plant, x: 150, y: 100 },
        { spriteId: SpriteId.Plant, x: 195, y: 100 },
        { spriteId: SpriteId.Bush, x: 300, y: 210 },
        { spriteId: SpriteId.Bush, x: 300, y: 255 },
        { spriteId: SpriteId.Bush, x: 300, y: 300 },
        { spriteId: SpriteId.Chest, x: 100, y: 300 },
        { spriteId: SpriteId.Book, x: 300, y: 100 },
    ],
    characters: [
        { type: WorldDataItemType.Hero, x: 50, y: 100 },
    ],
    overlayItems: [],
};

var WorldItemKind;
(function (WorldItemKind) {
    WorldItemKind[WorldItemKind["Background"] = 0] = "Background";
    WorldItemKind[WorldItemKind["Character"] = 1] = "Character";
    WorldItemKind[WorldItemKind["Overlay"] = 2] = "Overlay";
})(WorldItemKind || (WorldItemKind = {}));

class WorldObject {
    spriteManager;
    sprite;
    kind;
    position;
    hitBox;
    constructor(spriteManager, kind, spriteId, x, y) {
        this.spriteManager = spriteManager;
        this.kind = kind;
        this.sprite = this.spriteManager.getSprite(spriteId);
        this.position = new GeomPoint(x, y);
        this.hitBox = this.sprite.hitBox;
    }
    processInputs(controlState) { }
    update(dt) { }
    render(drawContext) {
        let returnFunction;
        switch (this.kind) {
            case WorldItemKind.Background:
                const needSecondPass = this.sprite.renderBackground(drawContext, this.position);
                if (needSecondPass) {
                    returnFunction = () => this.sprite.renderOverlay(drawContext, this.position);
                }
                break;
            case WorldItemKind.Overlay:
                this.sprite.renderOverlay(drawContext, this.position);
                break;
            case WorldItemKind.Character:
                console.warn(`WorldItemKind.Character has object (id = ${this.sprite.id}, (x,y) = (${this.position.x},${this.position.y}))`);
        }
        return returnFunction;
    }
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

var HeroState;
(function (HeroState) {
    HeroState[HeroState["Still"] = 0] = "Still";
    HeroState[HeroState["Walking"] = 1] = "Walking";
})(HeroState || (HeroState = {}));
class WorldHero {
    spriteManager;
    kind = WorldItemKind.Character;
    runningUpSprites = [];
    runningDownSprites = [];
    runningLeftSprites = [];
    runningRightSprites = [];
    animationIterator = new AnimationIterator({
        frameSkip: 15,
        numberOfSprites: 4,
    });
    position;
    hitBox;
    movingDirectionX;
    movingDirectionY;
    state;
    speed = 0.15;
    constructor(spriteManager, x, y) {
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
        this.position = new GeomPoint(x, y);
        const sprite = this.selectSprite();
        this.hitBox = sprite.hitBox;
        this.state = HeroState.Still;
        this.movingDirectionX = 0;
        this.movingDirectionY = 0;
    }
    processInputs(controlState) {
        this.state = HeroState.Still;
        this.movingDirectionX = 0;
        if (controlState.left) {
            this.movingDirectionX = -1;
            this.state = HeroState.Walking;
        }
        else if (controlState.right) {
            this.movingDirectionX = 1;
            this.state = HeroState.Walking;
        }
        this.movingDirectionY = 0;
        if (controlState.up) {
            this.movingDirectionY = -1;
            this.state = HeroState.Walking;
        }
        else if (controlState.down) {
            this.movingDirectionY = 1;
            this.state = HeroState.Walking;
        }
    }
    update(dt, collider) {
        const sprite = this.selectSprite();
        switch (this.state) {
            case HeroState.Walking:
                this.handleWalk(dt, sprite, new GeomVector(this.movingDirectionX, 0), collider);
                this.handleWalk(dt, sprite, new GeomVector(0, this.movingDirectionY), collider);
                break;
        }
    }
    render(drawContext) {
        const sprite = this.selectSprite();
        sprite.renderCharacter(drawContext, this.position);
        return undefined;
    }
    selectSprite() {
        let sprite;
        if (this.state === HeroState.Walking) {
            const index = this.animationIterator.getSpriteIndex();
            if (this.movingDirectionY < 0) {
                sprite = this.runningUpSprites[index];
            }
            else if (this.movingDirectionY > 0) {
                sprite = this.runningDownSprites[index];
            }
            if (this.movingDirectionX < 0) {
                sprite = this.runningLeftSprites[index];
            }
            else if (this.movingDirectionX > 0) {
                sprite = this.runningRightSprites[index];
            }
        }
        if (sprite === undefined) {
            sprite = this.runningDownSprites[0];
        }
        return sprite;
    }
    handleWalk(dt, sprite, direction, collider) {
        const moveDirection = direction.scale(this.speed * dt);
        const nextPosition = this.position.moveByVector(moveDirection);
        const nextHitBox = new GeomRect(sprite.hitBox.x + nextPosition.x, sprite.hitBox.y + nextPosition.y, sprite.hitBox.w, sprite.hitBox.h);
        if (collider.itemCollides(nextHitBox) !== undefined) {
            return;
        }
        this.position = this.position.moveByVector(moveDirection);
    }
}

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
    const world = factory.getWorld({
        landscape: dataWorld.landscape,
        background: dataWorld.backgroundItems.map(item => new WorldObject(spriteManager, WorldItemKind.Background, item.spriteId, item.x, item.y)),
        characters: dataWorld.characters.map(item => {
            switch (item.type) {
                case WorldDataItemType.Hero:
                    return new WorldHero(spriteManager, item.x, item.y);
            }
            throw new Error('123');
        }),
        overlays: [],
    });
    game = factory.getGame(world);
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
