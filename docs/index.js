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
    scene;
    controlState;
    frameRateIterator;
    constructor(scene) {
        this.scene = scene;
        this.controlState = {
            up: false,
            down: false,
            left: false,
            right: false,
            control: false,
            action: false,
        };
        this.frameRateIterator = new FrameRateIterator({ targetFps: TARGET_FPS });
    }
    nextFrame(drawContext, dt) {
        this.scene.processInputs(dt, this.controlState);
        this.scene.update(dt);
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
        this.controlState.control = state.control ?? this.controlState.control;
        this.controlState.action = state.action ?? this.controlState.action;
    }
    render(drawContext) {
        try {
            this.scene.render(drawContext);
            const fpsString = `FPS: ${this.frameRateIterator.fps}`;
            drawContext.writeText(fpsString, 5, 5, { horizontalAlign: 'left', verticalAlign: 'top' });
        }
        catch (error) {
            console.error(error);
        }
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

class SceneCollider {
    items;
    constructor(items) {
        this.items = items;
    }
    anyItemCollidesWith(checkedItem, position, options) {
        for (const sceneItem of this.items) {
            if (!sceneItem.canCollide() || sceneItem.uniqueId === checkedItem.uniqueId) {
                continue;
            }
            if (this.checkCollision(checkedItem.sprite, position, sceneItem.sprite, sceneItem.position, options?.tolerance ?? 0)) {
                return sceneItem;
            }
        }
        return undefined;
    }
    checkCollision(sprite1, position1, sprite2, position2, tolerance) {
        if (sprite1.hitBox instanceof GeomRect) {
            const hitBox1 = new GeomRect(position1.x - (sprite1.hitBoxAnchor?.x ?? 0) + sprite1.hitBox.x - tolerance, position1.y - (sprite1.hitBoxAnchor?.y ?? 0) + sprite1.hitBox.y - tolerance, sprite1.hitBox.w + tolerance, sprite1.hitBox.h + tolerance);
            if (sprite2.hitBox instanceof GeomRect) {
                const hitBox2 = new GeomRect(position2.x - (sprite2.hitBoxAnchor?.x ?? 0) + sprite2.hitBox.x - tolerance, position2.y - (sprite2.hitBoxAnchor?.y ?? 0) + sprite2.hitBox.y - tolerance, sprite2.hitBox.w + tolerance, sprite2.hitBox.h + tolerance);
                return hitBox1.intersectsWithRect(hitBox2);
            }
        }
        return false;
    }
}

class Scene {
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
        this.collider = new SceneCollider([...this.layer1, ...this.layer2]);
    }
    processInputs(dt, controlState) {
        this.layer2.forEach(item => item.processInputs(controlState, this.collider));
    }
    update(dt) {
        this.layer1.forEach(item => item.update(dt, this.collider));
        this.layer2.forEach(item => item.update(dt, this.collider));
    }
    render(drawContext) {
        this.layer0.forEach(item => item.render(drawContext));
        const layers12Items = [...this.layer1, ...this.layer2].sort((a, b) => a.position.y + (a.hitBox?.h ?? 0) - (b.position.y + (b.hitBox?.h ?? 0)));
        layers12Items.forEach(item => item.render(drawContext));
        this.layer3.sort((a, b) => a.position.y - b.position.y);
        this.layer3.forEach(item => item.render(drawContext));
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
const tilesData = [
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
    SpriteId["Hero"] = "hero";
})(SpriteId || (SpriteId = {}));
var SpriteChestState;
(function (SpriteChestState) {
    SpriteChestState["Closed"] = "closed";
    SpriteChestState["Opening"] = "opening";
    SpriteChestState["Open"] = "open";
})(SpriteChestState || (SpriteChestState = {}));
var SpriteHeroState;
(function (SpriteHeroState) {
    SpriteHeroState["StillUp"] = "still-up";
    SpriteHeroState["StillDown"] = "still-down";
    SpriteHeroState["StillLeft"] = "still-left";
    SpriteHeroState["StillRight"] = "still-right";
    SpriteHeroState["WalkingUp"] = "walking-up";
    SpriteHeroState["WalkingDown"] = "walking-down";
    SpriteHeroState["WalkingLeft"] = "walking-left";
    SpriteHeroState["WalkingRight"] = "walking-right";
})(SpriteHeroState || (SpriteHeroState = {}));
const spritesData = [
    { id: SpriteId.Debug01, states: [{ tileId: TileId.Debug01, bbox: [100, 100, 250, 250], anchor: [0, -50] }], hitBox: [50, 50, 100, 100] },
    { id: SpriteId.Grass0, states: [{ tileId: TileId.Grass0 }] },
    { id: SpriteId.Grass1, states: [{ tileId: TileId.Grass1 }] },
    { id: SpriteId.Bush, states: [{ tileId: TileId.Bush }], hitBox: [3, 3, 35, 35] },
    {
        id: SpriteId.Chest,
        states: [
            { label: SpriteChestState.Closed, tileId: TileId.Chest, bbox: [0, 0, 65, 53] },
            { label: SpriteChestState.Opening, tileId: TileId.Chest, bbox: [0, 0, 65, 53], frames: 3, delay: 200 },
            { label: SpriteChestState.Open, tileId: TileId.Chest, bbox: [132, 0, 197, 53] },
        ],
        hitBox: [0, 7, 59, 48]
    },
    { id: SpriteId.Book, states: [{ tileId: TileId.Book }], hitBox: 'bbox' },
    { id: SpriteId.Plant, states: [{ tileId: TileId.Plant, bbox: [0, 51, 44, 86], anchor: [0, -51] }], hitBox: 'bbox', hitBoxAnchor: [0, -51] },
    { id: SpriteId.PlantOverlay, states: [{ tileId: TileId.Plant, bbox: [0, 0, 44, 50] }] },
    {
        id: SpriteId.Hero,
        states: [
            { label: SpriteHeroState.StillUp, tileId: TileId.Hero, bbox: [0, 66, 44, 134] },
            { label: SpriteHeroState.StillDown, tileId: TileId.Hero, bbox: [0, 0, 45, 66] },
            { label: SpriteHeroState.StillLeft, tileId: TileId.Hero, bbox: [3, 135, 41, 200] },
            { label: SpriteHeroState.StillRight, tileId: TileId.Hero, bbox: [3, 201, 41, 266] },
            { label: SpriteHeroState.WalkingUp, tileId: TileId.Hero, bbox: [0, 66, 44, 134], frames: 4 },
            { label: SpriteHeroState.WalkingDown, tileId: TileId.Hero, bbox: [0, 0, 44, 65], frames: 4 },
            { label: SpriteHeroState.WalkingLeft, tileId: TileId.Hero, bbox: [3, 135, 41, 200], frames: 4 },
            { label: SpriteHeroState.WalkingRight, tileId: TileId.Hero, bbox: [3, 201, 41, 266], frames: 4 },
        ],
        hitBox: [5, 30, 35, 65],
    }
];

var SceneDataItemType;
(function (SceneDataItemType) {
    SceneDataItemType[SceneDataItemType["Chest"] = 0] = "Chest";
    SceneDataItemType[SceneDataItemType["Hero"] = 1] = "Hero";
})(SceneDataItemType || (SceneDataItemType = {}));
const sceneData = {
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
        { spriteId: SpriteId.Chest, type: SceneDataItemType.Chest, x: 100, y: 300 },
        { spriteId: SpriteId.Book, x: 300, y: 100 },
    ],
    layer2: [
        { spriteId: SpriteId.Hero, type: SceneDataItemType.Hero, x: 50, y: 100 }
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

class SceneItem {
    _uniqueId;
    _sprite;
    _position;
    _lastSpriteUpdateOut;
    constructor(params) {
        this._uniqueId = getRandomId();
        this._sprite = params.sprite;
        this._position = new GeomPoint(params.x, params.y);
    }
    canCollide() {
        return this._sprite.hasHitBox();
    }
    get uniqueId() {
        return this._uniqueId;
    }
    get sprite() {
        return this._sprite;
    }
    get position() {
        return this._position;
    }
    get bbox() {
        return this._sprite.bbox;
    }
    get hitBox() {
        return this._sprite.hitBox;
    }
    processInputs(controlState, collider) { }
    update(dt, collider) {
        this._lastSpriteUpdateOut = this._sprite.update(dt);
    }
    render(drawContext) {
        this._sprite.render(drawContext, this._position);
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

class SceneChest extends SceneItem {
    isOpen = false;
    constructor(params) {
        super(params);
        this._sprite.selectState(SpriteChestState.Closed);
    }
    open() {
        if (this.isOpen) {
            this._sprite.selectState(SpriteChestState.Opening, true);
            this.isOpen = false;
        }
        else {
            this._sprite.selectState(SpriteChestState.Opening);
            this.isOpen = true;
        }
    }
    update(dt, collider) {
        super.update(dt, collider);
        if (this._lastSpriteUpdateOut.loopedAnimation) {
            this._sprite.selectState(this.isOpen ? SpriteChestState.Open : SpriteChestState.Closed);
        }
    }
}

const SPEED_WALKING = 0.1;
const SPEED_RUNNING = 0.2;
class SceneHero extends SceneItem {
    movingDirectionX;
    movingDirectionY;
    state;
    speed = SPEED_WALKING;
    constructor(params) {
        super(params);
        this.state = SpriteHeroState.StillDown;
        this.movingDirectionX = 0;
        this.movingDirectionY = 0;
    }
    processInputs(controlState, collider) {
        super.processInputs(controlState, collider);
        this.state = SpriteHeroState.StillDown;
        this.movingDirectionX = 0;
        if (controlState.left) {
            this.movingDirectionX = -1;
            this.state = SpriteHeroState.WalkingLeft;
        }
        else if (controlState.right) {
            this.movingDirectionX = 1;
            this.state = SpriteHeroState.WalkingRight;
        }
        this.movingDirectionY = 0;
        if (controlState.up) {
            this.movingDirectionY = -1;
            this.state = SpriteHeroState.WalkingUp;
        }
        else if (controlState.down) {
            this.movingDirectionY = 1;
            this.state = SpriteHeroState.WalkingDown;
        }
        this._sprite.selectState(this.state);
        this.speed = controlState.control ? SPEED_RUNNING : SPEED_WALKING;
        if (controlState.action) {
            const collideItem = collider.anyItemCollidesWith(this, this._position, { tolerance: 5 });
            if (collideItem !== undefined && collideItem instanceof SceneChest) {
                const chest = collideItem;
                chest.open();
            }
        }
    }
    update(dt, collider) {
        super.update(dt, collider);
        switch (this.state) {
            case SpriteHeroState.WalkingUp:
            case SpriteHeroState.WalkingDown:
            case SpriteHeroState.WalkingLeft:
            case SpriteHeroState.WalkingRight:
                this.handleWalk(dt, new GeomVector(this.movingDirectionX, 0), collider);
                this.handleWalk(dt, new GeomVector(0, this.movingDirectionY), collider);
                break;
        }
    }
    render(drawContext) {
        super.render(drawContext);
    }
    handleWalk(dt, direction, collider) {
        const moveDirection = direction.scale(this.speed * dt);
        const nextPosition = this._position.moveByVector(moveDirection);
        if (collider.anyItemCollidesWith(this, nextPosition)) {
            return;
        }
        this._position = this._position.moveByVector(moveDirection);
    }
}

class SpriteState {
    label;
    tile;
    _bbox;
    anchor;
    frames;
    delay;
    firstFrameBBoxX;
    currentFrame;
    millisecBeforeNextFrame;
    reverse = false;
    constructor(label, tile, _bbox, anchor, frames, delay) {
        this.label = label;
        this.tile = tile;
        this._bbox = _bbox;
        this.anchor = anchor;
        this.frames = frames;
        this.delay = delay;
        this.firstFrameBBoxX = this._bbox.x;
        this.currentFrame = 0;
        this.millisecBeforeNextFrame = this.delay;
    }
    get bbox() {
        return this._bbox;
    }
    get isReversed() {
        return this.reverse;
    }
    init(reverse) {
        this.currentFrame = reverse ? this.frames - 1 : 0;
        this.reverse = reverse;
        this._bbox.x = this.firstFrameBBoxX + this.currentFrame * this._bbox.w;
    }
    update(dt) {
        const out = {
            loopedAnimation: false,
        };
        if (this.frames > 1) {
            this.millisecBeforeNextFrame -= dt;
            if (this.millisecBeforeNextFrame < 0) {
                this.millisecBeforeNextFrame = this.delay;
                if (this.reverse) {
                    this.currentFrame--;
                    if (this.currentFrame < 0) {
                        this.currentFrame = this.frames - 1;
                        out.loopedAnimation = true;
                    }
                }
                else {
                    this.currentFrame++;
                    if (this.currentFrame >= this.frames) {
                        this.currentFrame = 0;
                        out.loopedAnimation = true;
                    }
                }
                this._bbox.x = this.firstFrameBBoxX + this.currentFrame * this._bbox.w;
            }
        }
        return out;
    }
    render(drawContext, position) {
        this.tile.render(drawContext, this._bbox, position.moveByVector(new GeomVector(-this.anchor.x, -this.anchor.y)));
    }
}
class Sprite {
    states;
    _hitBox;
    _hitBoxAnchor;
    currentState;
    constructor(states, _hitBox, _hitBoxAnchor) {
        this.states = states;
        this._hitBox = _hitBox;
        this._hitBoxAnchor = _hitBoxAnchor;
        if (states.length < 1) {
            console.error('Sprite states must have at least 1 state');
            throw new Error('');
        }
        this.currentState = this.states[0];
    }
    get bbox() {
        return this.currentState.bbox;
    }
    get hitBox() {
        return this._hitBox;
    }
    get hitBoxAnchor() {
        return this._hitBoxAnchor;
    }
    hasHitBox() {
        return this._hitBox !== undefined;
    }
    selectState(label, reverse) {
        if (label === this.currentState.label) {
            const reversed = reverse ?? false;
            if (this.currentState.isReversed === reversed) {
                return;
            }
        }
        this.currentState = this.states[0];
        const state = this.states.find(s => s.label === label);
        if (state !== undefined) {
            this.currentState = state;
        }
        this.currentState.init(reverse ?? false);
    }
    update(dt) {
        return this.currentState.update(dt);
    }
    render(drawContext, position) {
        this.currentState.render(drawContext, position);
    }
}

class SpriteManager {
    spritesData;
    tileManager;
    sprites = new Map();
    constructor(spritesData, tileManager) {
        this.spritesData = spritesData;
        this.tileManager = tileManager;
    }
    getSprite(id) {
        const spriteData = this.spritesData.find(s => s.id === id);
        if (spriteData === undefined) {
            console.error(`No sprite data for id '${id}'`);
            throw new Error();
        }
        let sprite = this.sprites.get(id);
        if (sprite === undefined) {
            sprite = this.createSprite(spriteData);
        }
        return sprite;
    }
    createSprite(spriteData) {
        const states = [];
        for (const state of spriteData.states) {
            const tile = this.tileManager.getTile(state.tileId);
            let bbox;
            if (state.bbox !== undefined) {
                bbox = new GeomRect(state.bbox[0], state.bbox[1], state.bbox[2] - state.bbox[0] + 1, state.bbox[3] - state.bbox[1] + 1);
            }
            else {
                bbox = tile.imageBBox;
            }
            let anchor;
            if (state.anchor !== undefined) {
                anchor = new GeomPoint(state.anchor[0], state.anchor[1]);
            }
            else {
                anchor = new GeomPoint(0, 0);
            }
            states.push(new SpriteState(state.label, tile, bbox, anchor, state.frames ?? 1, state.delay ?? 100));
        }
        let hitBox;
        if (spriteData.hitBox !== undefined) {
            if (spriteData.hitBox === 'bbox') {
                const bbox = states[0].bbox;
                hitBox = new GeomRect(0, 0, bbox.w, bbox.h);
            }
            else {
                hitBox = new GeomRect(spriteData.hitBox[0], spriteData.hitBox[1], spriteData.hitBox[2] - spriteData.hitBox[0] + 1, spriteData.hitBox[3] - spriteData.hitBox[1] + 1);
            }
        }
        let hitBoxAnchor;
        if (spriteData.hitBoxAnchor !== undefined) {
            hitBoxAnchor = new GeomPoint(spriteData.hitBoxAnchor[0], spriteData.hitBoxAnchor[1]);
        }
        return new Sprite(states, hitBox, hitBoxAnchor);
    }
}

class Factory {
    tileManager;
    spriteManager;
    game;
    scene;
    getTileManager() {
        if (this.tileManager === undefined) {
            this.tileManager = new TileManager();
        }
        return this.tileManager;
    }
    getSpriteManager() {
        if (this.spriteManager === undefined) {
            this.spriteManager = new SpriteManager(spritesData, this.getTileManager());
        }
        return this.spriteManager;
    }
    getGame(scene) {
        if (this.game === undefined) {
            this.game = new Game(scene);
        }
        return this.game;
    }
    getScene(sceneData) {
        if (this.scene === undefined) {
            this.scene = new Scene(sceneData.layer0.map(item => this.createSceneItem(this.getSpriteManager(), item)), sceneData.layer1.map(item => this.createSceneItem(this.getSpriteManager(), item)), sceneData.layer2.map(item => this.createSceneItem(this.getSpriteManager(), item)), sceneData.layer3.map(item => this.createSceneItem(this.getSpriteManager(), item)));
        }
        return this.scene;
    }
    createSceneItem(spriteManager, dataItem) {
        const sprite = spriteManager.getSprite(dataItem.spriteId);
        if (dataItem.type !== undefined) {
            switch (dataItem.type) {
                case SceneDataItemType.Chest:
                    return new SceneChest({ sprite, x: dataItem.x, y: dataItem.y });
                case SceneDataItemType.Hero:
                    return new SceneHero({ sprite, x: dataItem.x, y: dataItem.y });
                default:
                    console.error(`Unhandled item type '${dataItem.type}' at (x,y) = (${dataItem.x},${dataItem.y})`);
                    throw new Error();
            }
        }
        return new SceneItem({ sprite, x: dataItem.x, y: dataItem.y });
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
class App {
    canvas;
    drawContext;
    lastTimestamp;
    _game;
    animationRunning = true;
    constructor(canvas, drawContext) {
        this.canvas = canvas;
        this.drawContext = drawContext;
    }
    get game() {
        return this._game;
    }
    get isAnimationRunning() {
        return this.animationRunning;
    }
    async start(factory) {
        this.canvas.width = SCREEN_WIDTH;
        this.canvas.height = SCREEN_HEIGHT;
        const tileManager = factory.getTileManager();
        await tileManager.loadTiles(tilesData);
        const scene = factory.getScene(sceneData);
        this._game = factory.getGame(scene);
        this.setupControls();
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }
    enableAnimation(enabled) {
        this.animationRunning = enabled;
        if (this.animationRunning) {
            window.requestAnimationFrame(this.gameLoop.bind(this));
        }
    }
    goToNextFrame(dt) {
        this.drawBackground();
        this._game.nextFrame(this.drawContext, dt);
        this._game.updateControlState({ action: false });
    }
    gameLoop(timestamp) {
        this.lastTimestamp = this.lastTimestamp ?? timestamp;
        const dt = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        this.goToNextFrame(dt);
        if (this.animationRunning) {
            window.requestAnimationFrame(this.gameLoop.bind(this));
        }
    }
    drawBackground() {
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
    setupControls() {
        window.addEventListener('keydown', (event) => {
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
        window.addEventListener('keyup', (event) => {
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

class UI {
    gameApp;
    stopButton = document.getElementById('ui-btn-stop');
    startButton = document.getElementById('ui-btn-start');
    stepButton = document.getElementById('ui-btn-step');
    constructor(gameApp) {
        this.gameApp = gameApp;
        this.update();
    }
    update() {
        this.stopButton.style.display = this.gameApp.isAnimationRunning ? 'unset' : 'none';
        this.startButton.style.display = this.gameApp.isAnimationRunning ? 'none' : 'unset';
    }
}

let app;
let ui;
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
    const drawContext = new CanvasDrawContext(context);
    app = new App(canvasDiv, drawContext);
    ui = new UI(app);
    ui.stopButton.addEventListener('click', onStopAnimate);
    ui.startButton.addEventListener('click', onStartAnimate);
    ui.stepButton.addEventListener('click', onStepAnimate);
    const factory = new Factory();
    await app.start(factory);
}
function onStopAnimate(event) {
    app?.enableAnimation(false);
    ui?.update();
}
function onStartAnimate(event) {
    app?.enableAnimation(true);
    ui?.update();
}
function onStepAnimate(event) {
    app?.goToNextFrame(13);
    ui?.update();
}
bootstrap();

export { onStartAnimate, onStepAnimate, onStopAnimate };
//# sourceMappingURL=index.js.map
