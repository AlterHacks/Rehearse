<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Game } from '../logic/Game';

const canvas = ref<HTMLCanvasElement | undefined>(undefined)
onMounted(async () => {
  const game = new Game(canvas.value!, 13, 2)
  await game.loadMidi('../assets/midi/golden_wind.json')
  game.start()
})
</script>

<template>
  <canvas class="h-60 w-full bg-surface-800" ref="canvas" />
</template>