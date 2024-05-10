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
            action: false,
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
        this.controlState.action = state.action ?? this.controlState.action;
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

class WorldCollider {
    items;
    constructor(items) {
        this.items = items;
    }
    anyItemCollidesWith(checkedItem, position) {
        for (const worldItem of this.items) {
            if (!worldItem.canCollide() || worldItem.uniqueId === checkedItem.uniqueId) {
                continue;
            }
            if (checkedItem.collidesWithOther(position, worldItem)) {
                return worldItem;
            }
        }
        return undefined;
    }
}

class World {
    layer0;
    layer1;
    layer2;
    layer3;
    collider;
    constructor(layer0, layer1, layer2, layer3) {
        this.layer0 = layer0;
        this.layer1 = layer1;
        this.layer2 = layer2;
        this.layer3 = layer3;
        this.collider = new WorldCollider([
            ...this.layer1,
            ...this.layer2,
        ]);
    }
    processInputs(dt, controlState) {
        this.layer2.forEach(item => item.processInputs(controlState));
    }
    update(dt) {
        this.layer2.forEach(item => item.update(dt, this.collider));
    }
    render(drawContext) {
        this.layer0.forEach(item => item.render(drawContext));
        const layers12Items = [...this.layer1, ...this.layer2].sort((a, b) => a.position.y - b.position.y);
        layers12Items.forEach(item => item.render(drawContext));
        this.layer3.sort((a, b) => a.position.y - b.position.y);
        this.layer3.forEach(item => item.render(drawContext));
    }
}

var Intersections;
(function (Intersections) {
    function rectIntersectsWithRect(r1, r2) {
        if (r1.x > r2.x + r2.w) {
            return false;
        }
        if (r1.x + r1.w < r2.x) {
            return false;
        }
        if (r1.y > r2.y + r2.h) {
            return false;
        }
        if (r1.y + r1.h < r2.y) {
            return false;
        }
        return true;
    }
    Intersections.rectIntersectsWithRect = rectIntersectsWithRect;
    function rectIntersectsWithCircle(rect, circle) {
        return false;
    }
    Intersections.rectIntersectsWithCircle = rectIntersectsWithCircle;
    function circleIntersectsWithCircle(c1, c2) {
        const diffX = c2.x - c1.x;
        const diffY = c2.y - c1.y;
        return Math.sqrt(diffX * diffX + diffY * diffY) < c1.r + c2.r;
    }
    Intersections.circleIntersectsWithCircle = circleIntersectsWithCircle;
    function circleIntersectsWithRect(circle, rect) {
        return rectIntersectsWithCircle();
    }
    Intersections.circleIntersectsWithRect = circleIntersectsWithRect;
})(Intersections || (Intersections = {}));

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
    clone() {
        return new GeomRect(this.x, this.y, this.w, this.h);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y && this.w === other.w && this.h === other.h;
    }
    moveByVector(vector) {
        return new GeomRect(this.x + vector.x, this.y + vector.y, this.w, this.h);
    }
    intersectsWithRect(rect) {
        return Intersections.rectIntersectsWithRect(this, rect);
    }
    intersectsWithCircle(circle) {
        return Intersections.rectIntersectsWithCircle(this, circle);
    }
}

class Tile {
    id;
    image;
    imageBBox;
    constructor(id, image) {
        this.id = id;
        this.image = image;
        this.imageBBox = new GeomRect(0, 0, image.width, image.height);
    }
    getCroppedImage(bbox) {
        const canvas = document.createElement('canvas');
        canvas.width = bbox.w;
        canvas.height = bbox.h;
        const context = canvas.getContext('2d');
        context.drawImage(this.image, -bbox.x, -bbox.y);
        const croppedImage = document.createElement('img');
        croppedImage.src = canvas.toDataURL();
        return croppedImage;
    }
    render(drawContext, bbox, position) {
        if (bbox.equals(this.imageBBox)) {
            drawContext.drawImage(this.image, position.x, position.y, this.image.width, this.image.height);
        }
        else {
            drawContext.drawImageCropped(this.image, bbox.x, bbox.y, bbox.w, bbox.h, position.x, position.y, bbox.w, bbox.h);
        }
    }
}

class TileManager {
    tiles = new Map();
    async loadTiles(dataTiles) {
        for (const dataTile of dataTiles) {
            const tile = await new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    resolve(new Tile(dataTile.id, image));
                };
                image.onerror = () => {
                    reject();
                };
                image.src = dataTile.url;
            });
            this.tiles.set(dataTile.id, tile);
        }
    }
    getTile(id) {
        const tile = this.tiles.get(id);
        if (tile === undefined) {
            throw new Error(`No tile for id '${id}'`);
        }
        return tile;
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

var TileId;
(function (TileId) {
    TileId[TileId["Debug01"] = 0] = "Debug01";
    TileId[TileId["Grass0"] = 1] = "Grass0";
    TileId[TileId["Grass1"] = 2] = "Grass1";
    TileId[TileId["Plant"] = 3] = "Plant";
    TileId[TileId["Bush"] = 4] = "Bush";
    TileId[TileId["Chest"] = 5] = "Chest";
    TileId[TileId["Book"] = 6] = "Book";
    TileId[TileId["Hero"] = 7] = "Hero";
})(TileId || (TileId = {}));
const assetsDir = 'assets';
const dataTiles = [
    { id: TileId.Debug01, url: `${assetsDir}/debug01.png` },
    { id: TileId.Grass0, url: `${assetsDir}/grass-empty.png` },
    { id: TileId.Grass1, url: `${assetsDir}/grass.png` },
    { id: TileId.Plant, url: `${assetsDir}/plant.png` },
    { id: TileId.Bush, url: `${assetsDir}/bush.png` },
    { id: TileId.Chest, url: `${assetsDir}/chest.png` },
    { id: TileId.Book, url: `${assetsDir}/book.png` },
    { id: TileId.Hero, url: `${assetsDir}/hero.png` },
];

var SpriteId;
(function (SpriteId) {
    SpriteId["Debug01"] = "debug01";
    SpriteId["Grass0"] = "grass0";
    SpriteId["Grass1"] = "grass1";
    SpriteId["Bush"] = "bush";
    SpriteId["Chest"] = "chest";
    SpriteId["Book"] = "book";
    SpriteId["Plant"] = "plant";
    SpriteId["PlantOverlay"] = "plant-overlay";
    SpriteId["HeroStillUp"] = "hero-still-up";
    SpriteId["HeroStillDown"] = "hero-still-down";
    SpriteId["HeroStillLeft"] = "hero-still-left";
    SpriteId["HeroStillRight"] = "hero-still-right";
    SpriteId["HeroWalkingUp"] = "hero-walking-up";
    SpriteId["HeroWalkingDown"] = "hero-walking-down";
    SpriteId["HeroWalkingLeft"] = "hero-walking-left";
    SpriteId["HeroWalkingRight"] = "hero-walking-right";
})(SpriteId || (SpriteId = {}));
const dataSprites = [
    {
        id: SpriteId.Debug01,
        tileId: TileId.Debug01,
        bbox: [100, 100, 250, 250],
        anchor: [0, -50],
        hitBox: [50, 50, 100, 100],
    },
    { id: SpriteId.Grass0, tileId: TileId.Grass0 },
    { id: SpriteId.Grass1, tileId: TileId.Grass1 },
    { id: SpriteId.Bush, tileId: TileId.Bush, hitBox: [3, 3, 35, 35] },
    { id: SpriteId.Chest, tileId: TileId.Chest, hitBox: [0, 0, 59, 41] },
    { id: SpriteId.Book, tileId: TileId.Book, hitBox: 'bbox' },
    { id: SpriteId.Plant, tileId: TileId.Plant, bbox: [0, 51, 44, 86], hitBox: 'bbox', anchor: [0, -51] },
    { id: SpriteId.PlantOverlay, tileId: TileId.Plant, bbox: [0, 0, 44, 50] },
    { id: SpriteId.HeroStillUp, tileId: TileId.Hero, bbox: [0, 66, 44, 134], hitBox: [5, 15, 35, 65] },
    { id: SpriteId.HeroStillDown, tileId: TileId.Hero, bbox: [0, 0, 45, 66], hitBox: [5, 15, 35, 65] },
    { id: SpriteId.HeroStillLeft, tileId: TileId.Hero, bbox: [3, 135, 41, 200], hitBox: [5, 15, 35, 65] },
    { id: SpriteId.HeroStillRight, tileId: TileId.Hero, bbox: [3, 201, 41, 266], hitBox: [5, 15, 35, 65] },
    { id: SpriteId.HeroWalkingUp, tileId: TileId.Hero, bbox: [0, 66, 44, 134], hitBox: [5, 15, 35, 65], frames: 4 },
    { id: SpriteId.HeroWalkingDown, tileId: TileId.Hero, bbox: [0, 0, 44, 65], hitBox: [5, 15, 35, 65], frames: 4 },
    { id: SpriteId.HeroWalkingLeft, tileId: TileId.Hero, bbox: [3, 135, 41, 200], hitBox: [5, 15, 35, 65], frames: 4 },
    { id: SpriteId.HeroWalkingRight, tileId: TileId.Hero, bbox: [3, 201, 41, 266], hitBox: [5, 15, 35, 65], frames: 4 },
];

var WorldDataItemType;
(function (WorldDataItemType) {
    WorldDataItemType[WorldDataItemType["Hero"] = 0] = "Hero";
})(WorldDataItemType || (WorldDataItemType = {}));
const dataWorld = {
    layer0: [
        { spriteId: SpriteId.Grass0, x: 150, y: 250 },
        { spriteId: SpriteId.Grass1, x: 189, y: 250 },
    ],
    layer1: [
        { spriteId: SpriteId.Plant, x: 150, y: 100 },
        { spriteId: SpriteId.Plant, x: 205, y: 100 },
        { spriteId: SpriteId.Bush, x: 300, y: 210 },
        { spriteId: SpriteId.Bush, x: 300, y: 255 },
        { spriteId: SpriteId.Bush, x: 300, y: 300 },
        { spriteId: SpriteId.Chest, x: 100, y: 300 },
        { spriteId: SpriteId.Book, x: 300, y: 100 },
    ],
    layer2: [
        { type: WorldDataItemType.Hero, x: 50, y: 100 }
    ],
    layer3: [
        { spriteId: SpriteId.PlantOverlay, x: 150, y: 100 },
        { spriteId: SpriteId.PlantOverlay, x: 205, y: 100 },
    ],
};

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

function getRandomId() {
    return btoa(`${Math.random() * 99999}`);
}

class WorldItem {
    uniqueId;
    sprite;
    position;
    constructor(params) {
        this.uniqueId = getRandomId();
        if (params.sprite !== undefined) {
            this.sprite = params.sprite;
        }
        this.position = new GeomPoint(params.x, params.y);
    }
    canCollide() {
        return this.sprite.hasHitBox();
    }
    collidesWithOther(position, item) {
        return this.sprite.collidesWithOther(position, item.sprite, item.position);
    }
    processInputs(controlState) { }
    update(dt, collider) {
        this.sprite.update(dt);
    }
    render(drawContext) {
        this.sprite.render(drawContext, this.position);
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

var HeroState;
(function (HeroState) {
    HeroState[HeroState["Still"] = 0] = "Still";
    HeroState[HeroState["Walking"] = 1] = "Walking";
})(HeroState || (HeroState = {}));
class WorldHero extends WorldItem {
    stillSpriteUp;
    stillSpriteDown;
    stillSpriteLeft;
    stillSpriteRight;
    stillSprite;
    runningUpSprite;
    runningDownSprite;
    runningLeftSprite;
    runningRightSprite;
    movingDirectionX;
    movingDirectionY;
    state;
    speed = 0.15;
    constructor(spriteManager, params) {
        super(params);
        this.stillSpriteUp = spriteManager.getSprite(SpriteId.HeroStillUp);
        this.stillSpriteDown = spriteManager.getSprite(SpriteId.HeroStillDown);
        this.stillSpriteLeft = spriteManager.getSprite(SpriteId.HeroStillLeft);
        this.stillSpriteRight = spriteManager.getSprite(SpriteId.HeroStillRight);
        this.runningUpSprite = spriteManager.getSprite(SpriteId.HeroWalkingUp);
        this.runningDownSprite = spriteManager.getSprite(SpriteId.HeroWalkingDown);
        this.runningLeftSprite = spriteManager.getSprite(SpriteId.HeroWalkingLeft);
        this.runningRightSprite = spriteManager.getSprite(SpriteId.HeroWalkingRight);
        this.sprite = this.selectSprite();
        this.state = HeroState.Still;
        this.movingDirectionX = 0;
        this.movingDirectionY = 0;
        this.stillSprite = this.stillSpriteDown;
    }
    processInputs(controlState) {
        super.processInputs(controlState);
        this.state = HeroState.Still;
        this.movingDirectionX = 0;
        if (controlState.left) {
            this.movingDirectionX = -1;
            this.state = HeroState.Walking;
            this.stillSprite = this.stillSpriteLeft;
        }
        else if (controlState.right) {
            this.movingDirectionX = 1;
            this.state = HeroState.Walking;
            this.stillSprite = this.stillSpriteRight;
        }
        this.movingDirectionY = 0;
        if (controlState.up) {
            this.movingDirectionY = -1;
            this.state = HeroState.Walking;
            this.stillSprite = this.stillSpriteUp;
        }
        else if (controlState.down) {
            this.movingDirectionY = 1;
            this.state = HeroState.Walking;
            this.stillSprite = this.stillSpriteDown;
        }
    }
    update(dt, collider) {
        this.sprite = this.selectSprite();
        super.update(dt, collider);
        switch (this.state) {
            case HeroState.Walking:
                this.handleWalk(dt, new GeomVector(this.movingDirectionX, 0), collider);
                this.handleWalk(dt, new GeomVector(0, this.movingDirectionY), collider);
                break;
        }
    }
    render(drawContext) {
        super.render(drawContext);
    }
    selectSprite() {
        let sprite;
        if (this.state === HeroState.Walking) {
            if (this.movingDirectionY < 0) {
                sprite = this.runningUpSprite;
            }
            else if (this.movingDirectionY > 0) {
                sprite = this.runningDownSprite;
            }
            if (this.movingDirectionX < 0) {
                sprite = this.runningLeftSprite;
            }
            else if (this.movingDirectionX > 0) {
                sprite = this.runningRightSprite;
            }
        }
        if (sprite === undefined) {
            sprite = this.stillSprite;
        }
        return sprite;
    }
    handleWalk(dt, direction, collider) {
        const moveDirection = direction.scale(this.speed * dt);
        const nextPosition = this.position.moveByVector(moveDirection);
        if (collider.anyItemCollidesWith(this, nextPosition)) {
            return;
        }
        this.position = this.position.moveByVector(moveDirection);
    }
}

class Sprite {
    id;
    tile;
    bbox;
    anchor;
    hitBox;
    frames;
    delay;
    firstFrameBBoxX;
    currentFrame;
    millisecBeforeNextFrame;
    constructor(id, tile, bbox, anchor, hitBox, frames, delay) {
        this.id = id;
        this.tile = tile;
        this.bbox = bbox;
        this.anchor = anchor;
        this.hitBox = hitBox;
        this.frames = frames;
        this.delay = delay;
        this.firstFrameBBoxX = this.bbox.x;
        this.currentFrame = 0;
        this.millisecBeforeNextFrame = this.delay;
    }
    hasHitBox() {
        return this.hitBox !== undefined;
    }
    update(dt) {
        if (this.frames > 1) {
            this.millisecBeforeNextFrame -= dt;
            if (this.millisecBeforeNextFrame < 0) {
                this.millisecBeforeNextFrame = this.delay;
                this.currentFrame++;
                if (this.currentFrame >= this.frames) {
                    this.currentFrame = 0;
                }
                this.bbox.x = this.firstFrameBBoxX + this.currentFrame * this.bbox.w;
            }
        }
    }
    render(drawContext, position) {
        this.tile.render(drawContext, this.bbox, position.moveByVector(new GeomVector(-this.anchor.x, -this.anchor.y)));
        if (this.hitBox instanceof GeomRect) {
            drawContext.strokeRect(position.x - this.anchor.x + this.hitBox.x, position.y - this.anchor.y + this.hitBox.y, this.hitBox.w, this.hitBox.h, {
                color: 'lightgreen',
            });
        }
    }
    collidesWithOther(position, other, otherPosition) {
        if (this.hitBox instanceof GeomRect) {
            const thisHitBox = new GeomRect(position.x - this.anchor.x + this.hitBox.x, position.y - this.anchor.y + this.hitBox.y, this.hitBox.w, this.hitBox.h);
            if (other.hitBox instanceof GeomRect) {
                const otherHitBox = new GeomRect(otherPosition.x - other.anchor.x + other.hitBox.x, otherPosition.y - other.anchor.y + other.hitBox.y, other.hitBox.w, other.hitBox.h);
                return thisHitBox.intersectsWithRect(otherHitBox);
            }
        }
        return false;
    }
}

class SpriteManager {
    dataSprites;
    tileManager;
    sprites = new Map();
    constructor(dataSprites, tileManager) {
        this.dataSprites = dataSprites;
        this.tileManager = tileManager;
    }
    getSprite(id) {
        const spriteData = this.dataSprites.find(s => s.id === id);
        if (spriteData === undefined) {
            console.error(`No sprite data for id '${id}'`);
            throw new Error();
        }
        switch (id) {
            case SpriteId.HeroWalkingDown:
                return this.createSprite(spriteData);
            default:
                let sprite = this.sprites.get(id);
                if (sprite === undefined) {
                    sprite = this.createSprite(spriteData);
                }
                return sprite;
        }
    }
    createSprite(spriteData) {
        const tile = this.tileManager.getTile(spriteData.tileId);
        let bbox;
        if (spriteData.bbox !== undefined) {
            bbox = new GeomRect(spriteData.bbox[0], spriteData.bbox[1], spriteData.bbox[2] - spriteData.bbox[0] + 1, spriteData.bbox[3] - spriteData.bbox[1] + 1);
        }
        else {
            bbox = tile.imageBBox;
        }
        let hitBox;
        if (spriteData.hitBox !== undefined) {
            if (spriteData.hitBox === 'bbox') {
                hitBox = new GeomRect(0, 0, bbox.w, bbox.h);
            }
            else {
                hitBox = new GeomRect(spriteData.hitBox[0], spriteData.hitBox[1], spriteData.hitBox[2] - spriteData.hitBox[0] + 1, spriteData.hitBox[3] - spriteData.hitBox[1] + 1);
            }
        }
        let anchor;
        if (spriteData.anchor !== undefined) {
            anchor = new GeomPoint(spriteData.anchor[0], spriteData.anchor[1]);
        }
        else {
            anchor = new GeomPoint(0, 0);
        }
        return new Sprite(spriteData.id, tile, bbox, anchor, hitBox, spriteData.frames ?? 1, spriteData.delay ?? 100);
    }
}

class Factory {
    tileManager;
    spriteManager;
    game;
    world;
    getTileManager() {
        if (this.tileManager === undefined) {
            this.tileManager = new TileManager();
        }
        return this.tileManager;
    }
    getSpriteManager() {
        if (this.spriteManager === undefined) {
            this.spriteManager = new SpriteManager(dataSprites, this.getTileManager());
        }
        return this.spriteManager;
    }
    getGame(world) {
        if (this.game === undefined) {
            this.game = new Game(world);
        }
        return this.game;
    }
    getWorld(worldData) {
        if (this.world === undefined) {
            this.world = new World(worldData.layer0.map(item => this.createWorldItem(this.getSpriteManager(), item)), worldData.layer1.map(item => this.createWorldItem(this.getSpriteManager(), item)), worldData.layer2.map(item => this.createWorldItem(this.getSpriteManager(), item)), worldData.layer3.map(item => this.createWorldItem(this.getSpriteManager(), item)));
        }
        return this.world;
    }
    createWorldItem(spriteManager, dataItem) {
        if (dataItem.type !== undefined) {
            switch (dataItem.type) {
                case WorldDataItemType.Hero:
                    return new WorldHero(spriteManager, { x: dataItem.x, y: dataItem.y });
                default:
                    console.error(`Unhandled item type '${dataItem.type}' at (x,y) = (${dataItem.x},${dataItem.y})`);
                    throw new Error();
            }
        }
        if (dataItem.spriteId !== undefined) {
            const sprite = spriteManager.getSprite(dataItem.spriteId);
            return new WorldItem({ sprite, x: dataItem.x, y: dataItem.y });
        }
        console.error(`No spriteId nor type for at (x,y) = (${dataItem.x},${dataItem.y})`);
        throw new Error();
    }
}

class CanvasDrawContext {
    context;
    constructor(context) {
        this.context = context;
    }
    strokeRect(x, y, w, h, options) {
        this.context.save();
        if (options?.width !== undefined) {
            this.context.lineWidth = options.width;
        }
        if (options?.color !== undefined) {
            this.context.strokeStyle = options.color;
        }
        this.context.strokeRect(x, y, w, h);
        this.context.restore();
    }
    fillRect(x, y, w, h, options) {
        this.context.save();
        if (options?.color !== undefined) {
            this.context.fillStyle = options.color;
        }
        this.context.fillRect(x, y, w, h);
        this.context.restore();
    }
    drawImage(image, x, y, w, h) {
        this.context.save();
        this.context.drawImage(image, x, y, w, h);
        this.context.restore();
    }
    drawImageCropped(image, x, y, w, h, sx, sy, sw, sh) {
        this.context.save();
        this.context.drawImage(image, x, y, w, h, sx, sy, sw, sh);
        this.context.restore();
    }
    writeText(text, x, y, options) {
        this.context.save();
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
        this.context.restore();
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
    const tileManager = factory.getTileManager();
    await tileManager.loadTiles(dataTiles);
    const world = factory.getWorld(dataWorld);
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
        case 'Space':
            game.updateControlState({ action: true });
            event.preventDefault();
            break;
    }
});
bootstrap();
//# sourceMappingURL=index.js.map
