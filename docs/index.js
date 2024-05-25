var t;!function(t){t[t.Debug01=0]="Debug01",t[t.Grass0=1]="Grass0",t[t.Grass1=2]="Grass1",t[t.Plant=3]="Plant",t[t.Bush=4]="Bush",t[t.Chest=5]="Chest",t[t.Book=6]="Book",t[t.Hero=7]="Hero"}(t||(t={}));const e="assets",i=[{id:t.Debug01,url:`${e}/debug01.png`},{id:t.Grass0,url:`${e}/grass-empty.png`},{id:t.Grass1,url:`${e}/grass.png`},{id:t.Plant,url:`${e}/plant.png`},{id:t.Bush,url:`${e}/bush.png`},{id:t.Chest,url:`${e}/chest.png`},{id:t.Book,url:`${e}/book.png`},{id:t.Hero,url:`${e}/hero.png`}];var s,r,o;!function(t){t.Debug01="debug01",t.Grass0="grass0",t.Grass1="grass1",t.Bush="bush",t.Chest="chest",t.Book="book",t.Plant="plant",t.PlantOverlay="plant-overlay",t.Hero="hero"}(s||(s={})),function(t){t.Closed="closed",t.Opening="opening",t.Open="open"}(r||(r={})),function(t){t.StillUp="still-up",t.StillDown="still-down",t.StillLeft="still-left",t.StillRight="still-right",t.WalkingUp="walking-up",t.WalkingDown="walking-down",t.WalkingLeft="walking-left",t.WalkingRight="walking-right",t.SwordUp="sword-up",t.SwordDown="sword-down",t.SwordLeft="sword-left",t.SwordRight="sword-right"}(o||(o={}));const n=[{id:s.Debug01,states:[{tileId:t.Debug01,bbox:[100,100,250,250],anchor:[0,-50]}],hitBox:[50,50,100,100]},{id:s.Grass0,states:[{tileId:t.Grass0}]},{id:s.Grass1,states:[{tileId:t.Grass1}]},{id:s.Bush,states:[{tileId:t.Bush}],hitBox:[3,3,35,35]},{id:s.Chest,states:[{label:r.Closed,tileId:t.Chest,bbox:[0,0,65,53]},{label:r.Opening,tileId:t.Chest,bbox:[0,0,65,53],frames:3,delay:200},{label:r.Open,tileId:t.Chest,bbox:[132,0,197,53]}],hitBox:[0,7,59,48]},{id:s.Book,states:[{tileId:t.Book}],hitBox:"bbox"},{id:s.Plant,states:[{tileId:t.Plant,bbox:[0,51,44,86],anchor:[0,-51]}],hitBox:"bbox",hitBoxAnchor:[0,-51]},{id:s.PlantOverlay,states:[{tileId:t.Plant,bbox:[0,0,44,50]}]},{id:s.Hero,states:[{label:o.StillUp,tileId:t.Hero,bbox:[0,66,44,134]},{label:o.StillDown,tileId:t.Hero,bbox:[0,0,45,66]},{label:o.StillLeft,tileId:t.Hero,bbox:[3,135,41,200]},{label:o.StillRight,tileId:t.Hero,bbox:[3,201,41,266]},{label:o.WalkingUp,tileId:t.Hero,bbox:[0,66,44,134],frames:4},{label:o.WalkingDown,tileId:t.Hero,bbox:[0,0,44,65],frames:4},{label:o.WalkingLeft,tileId:t.Hero,bbox:[3,135,41,200],frames:4},{label:o.WalkingRight,tileId:t.Hero,bbox:[3,201,41,266],frames:4},{label:o.SwordUp,tileId:t.Hero,bbox:[0,342,50,404],frames:4,delay:50},{label:o.SwordDown,tileId:t.Hero,bbox:[0,267,47,338],frames:4,delay:50},{label:o.SwordLeft,tileId:t.Hero,bbox:[0,407,59,469],frames:4,delay:50}],hitBox:[5,30,35,65]}];var a;!function(t){t[t.Chest=0]="Chest",t[t.Hero=1]="Hero"}(a||(a={}));const h={layer0:[{spriteId:s.Grass0,x:150,y:250},{spriteId:s.Grass1,x:189,y:250}],layer1:[{spriteId:s.Plant,x:150,y:100},{spriteId:s.Plant,x:205,y:100},{spriteId:s.Bush,x:300,y:210},{spriteId:s.Bush,x:300,y:255},{spriteId:s.Bush,x:300,y:300},{spriteId:s.Chest,type:a.Chest,x:100,y:300},{spriteId:s.Book,x:300,y:100}],layer2:[{spriteId:s.Hero,type:a.Hero,x:50,y:100}],layer3:[{spriteId:s.PlantOverlay,x:150,y:100},{spriteId:s.PlantOverlay,x:205,y:100}]};class c{targetFps;timer=0;frameCountInOneSecond=0;fps=0;constructor(t){this.targetFps=t.targetFps}shouldRender(t){return this.timer+=t,this.timer>1e3&&(this.fps=this.frameCountInOneSecond,this.frameCountInOneSecond=0,this.timer=0),this.frameCountInOneSecond++,Promise.resolve(!0)}}class l{scene;controlState;frameRateIterator;constructor(t){this.scene=t,this.controlState={up:!1,down:!1,left:!1,right:!1,control:!1,action1:!1,action2:!1},this.frameRateIterator=new c({targetFps:60})}nextFrame(t,e){this.scene.processInputs(e,this.controlState),this.scene.update(e),this.frameRateIterator.shouldRender(e).then((e=>{e&&this.render(t)}))}updateControlState(t){this.controlState.up=t.up??this.controlState.up,this.controlState.down=t.down??this.controlState.down,this.controlState.left=t.left??this.controlState.left,this.controlState.right=t.right??this.controlState.right,this.controlState.control=t.control??this.controlState.control,this.controlState.action1=t.action1??this.controlState.action1,this.controlState.action2=t.action2??this.controlState.action2}render(t){try{this.scene.render(t);const e=`FPS: ${this.frameRateIterator.fps}`;t.writeText(e,5,5,{horizontalAlign:"left",verticalAlign:"top"})}catch(t){console.error(t)}}}var d;!function(t){function e(t,e){return!1}t.rectIntersectsWithRect=function(t,e){return!(t.x>e.x+e.w)&&(!(t.x+t.w<e.x)&&(!(t.y>e.y+e.h)&&!(t.y+t.h<e.y)))},t.rectIntersectsWithCircle=e,t.circleIntersectsWithCircle=function(t,e){const i=e.x-t.x,s=e.y-t.y;return Math.sqrt(i*i+s*s)<t.r+e.r},t.circleIntersectsWithRect=function(t,e){return!1}}(d||(d={}));class u{x;y;w;h;constructor(t,e,i,s){this.x=t,this.y=e,this.w=i,this.h=s}equals(t){return this.x===t.x&&this.y===t.y&&this.w===t.w&&this.h===t.h}moveByVector(t){return new u(this.x+t.x,this.y+t.y,this.w,this.h)}intersectsWithRect(t){return d.rectIntersectsWithRect(this,t)}intersectsWithCircle(t){return d.rectIntersectsWithCircle(this,t)}}class p{id;image;imageBBox;constructor(t,e){this.id=t,this.image=e,this.imageBBox=new u(0,0,e.width,e.height)}getCroppedImage(t){const e=document.createElement("canvas");e.width=t.w,e.height=t.h;e.getContext("2d").drawImage(this.image,-t.x,-t.y);const i=document.createElement("img");return i.src=e.toDataURL(),i}render(t,e,i){e.equals(this.imageBBox)?t.drawImage(this.image,i.x,i.y,this.image.width,this.image.height):t.drawImageCropped(this.image,e.x,e.y,e.w,e.h,i.x,i.y,e.w,e.h)}}class x{textures=new Map;async loadTextures(t){for(const e of t){const t=await new Promise(((t,i)=>{const s=new Image;s.onload=()=>{t(new p(e.id,s))},s.onerror=()=>{i()},s.src=e.url}));this.textures.set(e.id,t)}}getTexture(t){const e=this.textures.get(t);if(void 0===e)throw new Error(`No texture for id '${t}'`);return e}scaleSprite(t,e){if(!Number.isInteger(e))throw console.error(`Invalid scale ${e}`),Error();if(1===e)return t;const i=document.createElement("canvas").getContext("2d");if(null===i)throw console.error("Error creating memory canvas"),Error();const s=t.width,r=t.height,o=s*e,n=r*e;i.drawImage(t,0,0,s,r);const a=i.getImageData(0,0,s,r),h=document.createElement("canvas");h.width=o,h.height=n;const c=h.getContext("2d");if(null===c)throw console.error("Error creating memory canvas"),Error();const l=c.createImageData(o,n);let d=0;for(let t=0;t<r;t++){const i=t*s*4,r=i+4*s,o=a.data.slice(i,r);for(let t=0;t<e;t++)for(let t=0;t<o.length;t+=4)for(let i=0;i<e;i++)l.data[d++]=o[t],l.data[d++]=o[t+1],l.data[d++]=o[t+2],l.data[d++]=o[t+3]}c.putImageData(l,0,0);const u=document.createElement("img");return u.src=h.toDataURL(),u}}class m{items;constructor(t){this.items=t}anyItemCollidesWith(t,e,i){for(const s of this.items)if(s.canCollide()&&s.uniqueId!==t.uniqueId&&this.checkCollision(t.sprite,e,s.sprite,s.position,i?.tolerance??0))return s}checkCollision(t,e,i,s,r){if(t.hitBox instanceof u){const o=new u(e.x-(t.hitBoxAnchor?.x??0)+t.hitBox.x-r,e.y-(t.hitBoxAnchor?.y??0)+t.hitBox.y-r,t.hitBox.w+r,t.hitBox.h+r);if(i.hitBox instanceof u){const t=new u(s.x-(i.hitBoxAnchor?.x??0)+i.hitBox.x-r,s.y-(i.hitBoxAnchor?.y??0)+i.hitBox.y-r,i.hitBox.w+r,i.hitBox.h+r);return o.intersectsWithRect(t)}}return!1}}class g{layer0;layer1;layer2;layer3;collider;constructor(t,e,i,s){this.layer0=t,this.layer1=e,this.layer2=i,this.layer3=s,this.collider=new m([...this.layer1,...this.layer2])}processInputs(t,e){this.layer2.forEach((t=>t.processInputs(e,this.collider)))}update(t){this.layer1.forEach((e=>e.update(t,this.collider))),this.layer2.forEach((e=>e.update(t,this.collider)))}render(t){this.layer0.forEach((e=>e.render(t)));[...this.layer1,...this.layer2].sort(((t,e)=>t.position.y+(t.hitBox?.h??0)-(e.position.y+(e.hitBox?.h??0)))).forEach((e=>e.render(t))),this.layer3.sort(((t,e)=>t.position.y-e.position.y)),this.layer3.forEach((e=>e.render(t)))}}class w{x;y;constructor(t,e){this.x=t,this.y=e}moveByVector(t){return new w(this.x+t.x,this.y+t.y)}}class y{x;y;constructor(t,e){this.x=t,this.y=e}normalize(){const t=Math.sqrt(this.x*this.x+this.y*this.y);if(t<=0)throw console.error(`Vector has an invalid magnitude (${this.x}, ${this.y})`),new Error(`Vector has an invalid magnitude (${this.x}, ${this.y})`);return new y(this.x/=t,this.y/=t)}scale(t){return new y(this.x*t,this.y*t)}}class b{label;texture;_bbox;anchor;frames;delay;firstFrameBBoxX;currentFrame;millisecBeforeNextFrame;reverse=!1;constructor(t,e,i,s,r,o){this.label=t,this.texture=e,this._bbox=i,this.anchor=s,this.frames=r,this.delay=o,this.firstFrameBBoxX=this._bbox.x,this.currentFrame=0,this.millisecBeforeNextFrame=this.delay}get bbox(){return this._bbox}get isReversed(){return this.reverse}init(t){this.currentFrame=t?this.frames-1:0,this.reverse=t,this._bbox.x=this.firstFrameBBoxX+this.currentFrame*this._bbox.w}update(t){const e={loopedAnimation:!1};return this.frames>1&&(this.millisecBeforeNextFrame-=t,this.millisecBeforeNextFrame<0&&(this.millisecBeforeNextFrame=this.delay,this.reverse?(this.currentFrame--,this.currentFrame<0&&(this.currentFrame=this.frames-1,e.loopedAnimation=!0)):(this.currentFrame++,this.currentFrame>=this.frames&&(this.currentFrame=0,e.loopedAnimation=!0)),this._bbox.x=this.firstFrameBBoxX+this.currentFrame*this._bbox.w)),e}render(t,e){this.texture.render(t,this._bbox,e.moveByVector(new y(-this.anchor.x,-this.anchor.y)))}}class f{states;_hitBox;_hitBoxAnchor;currentState;constructor(t,e,i){if(this.states=t,this._hitBox=e,this._hitBoxAnchor=i,t.length<1)throw console.error("Sprite states must have at least 1 state"),new Error("");this.currentState=this.states[0]}get bbox(){return this.currentState.bbox}get hitBox(){return this._hitBox}get hitBoxAnchor(){return this._hitBoxAnchor}hasHitBox(){return void 0!==this._hitBox}selectState(t,e){if(t===this.currentState.label){const t=e??!1;if(this.currentState.isReversed===t)return}this.currentState=this.states[0];const i=this.states.find((e=>e.label===t));void 0!==i&&(this.currentState=i),this.currentState.init(e??!1)}update(t){return this.currentState.update(t)}render(t,e){this.currentState.render(t,e)}}class B{spritesData;textureManager;sprites=new Map;constructor(t,e){this.spritesData=t,this.textureManager=e}getSprite(t){const e=this.spritesData.find((e=>e.id===t));if(void 0===e)throw console.error(`No sprite data for id '${t}'`),new Error;let i=this.sprites.get(t);return void 0===i&&(i=this.createSprite(e)),i}createSprite(t){const e=[];for(const i of t.states){const t=this.textureManager.getTexture(i.tileId);let s,r;s=void 0!==i.bbox?new u(i.bbox[0],i.bbox[1],i.bbox[2]-i.bbox[0]+1,i.bbox[3]-i.bbox[1]+1):t.imageBBox,r=void 0!==i.anchor?new w(i.anchor[0],i.anchor[1]):new w(0,0),e.push(new b(i.label,t,s,r,i.frames??1,i.delay??100))}let i,s;if(void 0!==t.hitBox)if("bbox"===t.hitBox){const t=e[0].bbox;i=new u(0,0,t.w,t.h)}else i=new u(t.hitBox[0],t.hitBox[1],t.hitBox[2]-t.hitBox[0]+1,t.hitBox[3]-t.hitBox[1]+1);return void 0!==t.hitBoxAnchor&&(s=new w(t.hitBoxAnchor[0],t.hitBoxAnchor[1])),new f(e,i,s)}}const v=500,S=500;class I{canvas;drawContext;lastTimestamp;_game;animationRunning=!0;constructor(t,e){this.canvas=t,this.drawContext=e}get game(){return this._game}get isAnimationRunning(){return this.animationRunning}async start(t,e,i){this.canvas.width=v,this.canvas.height=S;const s=new x;await s.loadTextures(t);const r=new B(e,s),o=new g(i.layer0.map((t=>this.createSceneItem(r,t))),i.layer1.map((t=>this.createSceneItem(r,t))),i.layer2.map((t=>this.createSceneItem(r,t))),i.layer3.map((t=>this.createSceneItem(r,t))));this._game=new l(o),this.setupControls(),window.requestAnimationFrame(this.gameLoop.bind(this))}enableAnimation(t){this.animationRunning=t,this.animationRunning&&window.requestAnimationFrame(this.gameLoop.bind(this))}goToNextFrame(t){this.drawBackground(),this._game.nextFrame(this.drawContext,t),this._game.updateControlState({action1:!1,action2:!1})}gameLoop(t){this.lastTimestamp=this.lastTimestamp??t;const e=t-this.lastTimestamp;this.lastTimestamp=t,this.goToNextFrame(e),this.animationRunning&&window.requestAnimationFrame(this.gameLoop.bind(this))}drawBackground(){this.drawContext.fillRect(0,0,v,S,{color:"#999"});for(let t=50;t<v;t+=50)this.drawContext.strokeRect(t,0,50,v,{color:"black"});for(let t=25;t<v;t+=25)this.drawContext.strokeRect(t,0,25,v,{color:"#888"});for(let t=50;t<S;t+=50)this.drawContext.strokeRect(0,t,S,50,{color:"black"});for(let t=25;t<S;t+=25)this.drawContext.strokeRect(0,t,S,25,{color:"#888"})}setupControls(){window.addEventListener("keydown",(t=>{switch(t.code.toLowerCase()){case"arrowup":this.game.updateControlState({up:!0}),t.preventDefault();break;case"arrowdown":this.game.updateControlState({down:!0}),t.preventDefault();break;case"arrowleft":this.game.updateControlState({left:!0}),t.preventDefault();break;case"arrowright":this.game.updateControlState({right:!0}),t.preventDefault();break;case"keyz":this.game.updateControlState({control:!0}),t.preventDefault()}})),window.addEventListener("keyup",(t=>{switch(t.code.toLowerCase()){case"arrowup":this.game.updateControlState({up:!1}),t.preventDefault();break;case"arrowdown":this.game.updateControlState({down:!1}),t.preventDefault();break;case"arrowleft":this.game.updateControlState({left:!1}),t.preventDefault();break;case"arrowright":this.game.updateControlState({right:!1}),t.preventDefault();break;case"keyz":this.game.updateControlState({control:!1}),t.preventDefault();break;case"keyx":this.game.updateControlState({action1:!0}),t.preventDefault();break;case"keyc":this.game.updateControlState({action2:!0}),t.preventDefault()}}))}}class k{_uniqueId;_sprite;_position;constructor(t){this._uniqueId=btoa(""+99999*Math.random()),this._sprite=t.sprite,this._position=new w(t.x,t.y)}canCollide(){return this._sprite.hasHitBox()}get uniqueId(){return this._uniqueId}get sprite(){return this._sprite}get position(){return this._position}get bbox(){return this._sprite.bbox}get hitBox(){return this._sprite.hitBox}processInputs(t,e){}update(t,e){this._sprite.update(t).loopedAnimation&&this.spriteAnimationLooped()}spriteAnimationLooped(){}render(t){this._sprite.render(t,this._position)}}class D extends k{isOpen=!1;constructor(t){super(t),this._sprite.selectState(r.Closed)}open(){this.isOpen?(this._sprite.selectState(r.Opening,!0),this.isOpen=!1):(this._sprite.selectState(r.Opening),this.isOpen=!0)}update(t,e){super.update(t,e)}spriteAnimationLooped(){this._sprite.selectState(this.isOpen?r.Open:r.Closed)}}var C;!function(t){t[t.Up=0]="Up",t[t.Down=1]="Down",t[t.Left=2]="Left",t[t.Right=3]="Right"}(C||(C={}));class _ extends k{movingDirectionX;movingDirectionY;primaryDirection;state;previousState;speed=.1;usingSword;constructor(t){super(t),this.state=o.StillDown,this.previousState=this.state,this.movingDirectionX=0,this.movingDirectionY=0,this.usingSword=!1}processInputs(t,e){if(super.processInputs(t,e),!this.usingSword){if(this.state=o.StillDown,this.primaryDirection=void 0,this.movingDirectionX=0,t.left?(this.movingDirectionX=-1,this.state=o.WalkingLeft,this.primaryDirection!==C.Up&&this.primaryDirection!==C.Down&&(this.primaryDirection=C.Left)):t.right&&(this.movingDirectionX=1,this.state=o.WalkingRight,this.primaryDirection!==C.Up&&this.primaryDirection!==C.Down&&(this.primaryDirection=C.Right)),this.movingDirectionY=0,t.up?(this.movingDirectionY=-1,this.state=o.WalkingUp,this.primaryDirection!==C.Left&&this.primaryDirection!==C.Right&&(this.primaryDirection=C.Up)):t.down&&(this.movingDirectionY=1,this.state=o.WalkingDown,this.primaryDirection!==C.Left&&this.primaryDirection!==C.Right&&(this.primaryDirection=C.Down)),t.action2){switch(this.previousState=this.state,this.primaryDirection){case C.Up:this.state=o.SwordUp;break;case C.Down:this.state=o.SwordDown;break;case C.Left:this.state=o.SwordLeft}this.usingSword=!0}if(this._sprite.selectState(this.state),this.speed=t.control?.2:.1,t.action1){const t=e.anyItemCollidesWith(this,this._position,{tolerance:5});if(void 0!==t&&t instanceof D){t.open()}}}}update(t,e){switch(super.update(t,e),this.state){case o.WalkingUp:case o.WalkingDown:case o.WalkingLeft:case o.WalkingRight:this.handleWalk(t,new y(this.movingDirectionX,0),e),this.handleWalk(t,new y(0,this.movingDirectionY),e)}}spriteAnimationLooped(){this.usingSword&&(this._sprite.selectState(this.previousState),this.state=this.previousState,this.usingSword=!1)}render(t){super.render(t)}handleWalk(t,e,i){const s=e.scale(this.speed*t),r=this._position.moveByVector(s);i.anyItemCollidesWith(this,r)||(this._position=this._position.moveByVector(s))}}const R=document.getElementById("canvas")??void 0;if(void 0===R)throw console.error("no canvas div"),new Error("no canvas div");const A=R.getContext("2d")??void 0;if(void 0===A)throw console.error("no context in canvas"),new Error("no context in canvas");const F=new class{context;constructor(t){this.context=t}strokeRect(t,e,i,s,r){this.context.save(),void 0!==r?.width&&(this.context.lineWidth=r.width),void 0!==r?.color&&(this.context.strokeStyle=r.color),this.context.strokeRect(t,e,i,s),this.context.restore()}fillRect(t,e,i,s,r){this.context.save(),void 0!==r?.color&&(this.context.fillStyle=r.color),this.context.fillRect(t,e,i,s),this.context.restore()}drawImage(t,e,i,s,r){this.context.save(),this.context.drawImage(t,e,i,s,r),this.context.restore()}drawImageCropped(t,e,i,s,r,o,n,a,h){this.context.save(),this.context.drawImage(t,e,i,s,r,o,n,a,h),this.context.restore()}writeText(t,e,i,s){if(this.context.save(),void 0!==s?.horizontalAlign)switch(s.horizontalAlign){case"left":this.context.textAlign="left";break;case"center":this.context.textAlign="center";break;case"right":this.context.textAlign="right"}if(void 0!==s?.verticalAlign)switch(s.verticalAlign){case"top":this.context.textBaseline="top";break;case"center":this.context.textBaseline="middle";break;case"bottom":this.context.textBaseline="bottom"}this.context.fillText(t,e,i),this.context.restore()}}(A),E=new class extends I{createSceneItem(t,e){const i=t.getSprite(e.spriteId);if(void 0!==e.type)switch(e.type){case a.Chest:return new D({sprite:i,x:e.x,y:e.y});case a.Hero:return new _({sprite:i,x:e.x,y:e.y});default:throw console.error(`Unhandled item type '${e.type}' at (x,y) = (${e.x},${e.y})`),new Error}return new k({sprite:i,x:e.x,y:e.y})}}(R,F),L=new class{app;stopButton=document.getElementById("ui-btn-stop");startButton=document.getElementById("ui-btn-start");stepButton=document.getElementById("ui-btn-step");constructor(t){this.app=t,this.update()}update(){this.stopButton.style.display=this.app.isAnimationRunning?"unset":"none",this.startButton.style.display=this.app.isAnimationRunning?"none":"unset"}}(E);L.stopButton.addEventListener("click",(t=>{E.enableAnimation(!1),L.update()})),L.startButton.addEventListener("click",(t=>{E.enableAnimation(!0),L.update()})),L.stepButton.addEventListener("click",(t=>{E.goToNextFrame(13),L.update()})),await E.start(i,n,h);
//# sourceMappingURL=index.js.map
