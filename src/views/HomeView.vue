<script setup lang="ts">
import { Factory } from '@/engine/factory';
import type { IGame } from '@/engine/interfaces/i-game';
import { gameSprites } from '@/engine/game-sprites';
import { onMounted, ref } from 'vue';

const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const SCREEN_WIDTH_PX = `${SCREEN_WIDTH}px`;

const canvas = ref<HTMLCanvasElement>();

const factory = new Factory();
let game: IGame;

onMounted(async () => {
  if (canvas.value === undefined) {
    return;
  }

  canvas.value.width = SCREEN_WIDTH;
  canvas.value.height = SCREEN_HEIGHT;

  const context = canvas.value.getContext('2d');
  if (context === null) {
    console.log('no context');
    return;
  }

  factory.setDrawContext(context);

  const spriteManager = factory.getSpriteManager();
  await spriteManager.loadSprites(gameSprites);

  window.requestAnimationFrame(gameLoop);
});

function gameLoop(timestamp: number): void {
  game = factory.getGame();
  game.loop(timestamp).then(() => {
    window.requestAnimationFrame(gameLoop);
  });
}

window.addEventListener('keydown', (event: KeyboardEvent): void => {
  switch (event.code) {
    case 'ArrowUp':
      game.updateControls({ up: true });
      event.preventDefault();
      break;
    case 'ArrowDown':
      game.updateControls({ down: true });
      event.preventDefault();
      break;
    case 'ArrowLeft':
      game.updateControls({ left: true });
      event.preventDefault();
      break;
    case 'ArrowRight':
      game.updateControls({ right: true });
      event.preventDefault();
      break;
  }
});

window.addEventListener('keyup', (event: KeyboardEvent): void => {
  switch (event.code) {
    case 'ArrowUp':
      game.updateControls({ up: false });
      event.preventDefault();
      break;
    case 'ArrowDown':
      game.updateControls({ down: false });
      event.preventDefault();
      break;
    case 'ArrowLeft':
      game.updateControls({ left: false });
      event.preventDefault();
      break;
    case 'ArrowRight':
      game.updateControls({ right: false });
      event.preventDefault();
      break;
  }
});
</script>

<template>
  <main>
    <!-- <header>header</header> -->
    <div id="game">
      <canvas ref="canvas"></canvas>
    </div>
    <!-- <footer>footer</footer> -->
  </main>
</template>

<style lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  // header {
  //   width: v-bind(SCREEN_WIDTH_PX);
  //   background-color: blanchedalmond;
  // }

  #game {
    background-color: beige;
  }

  // footer {
  //   width: v-bind(SCREEN_WIDTH_PX);
  //   background-color: blanchedalmond;
  // }
}
</style>
