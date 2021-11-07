<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useEventListener } from '@vueuse/core'
import { Game } from '../logic/Game';
import { MidiJSON } from '@tonejs/midi';

const props = defineProps<{
  midi: MidiJSON
}>()
const emits = defineEmits(['back'])

const canvas = ref<HTMLCanvasElement | undefined>(undefined)
let game: Game | undefined;
const timer = ref(3)

onMounted(async () => {
  game = new Game(canvas.value!, 13, 2)
  game.loadMidi(props.midi)
  game.update(0)
  const counter = setInterval(() => {
    timer.value -= 1
    if (timer.value <= 0) {
      clearInterval(counter)
      game!.start()
    }
  }, 1000)
})

useEventListener('keypress', (ev) => {
  if (ev.key === ' ') {
    game?.toggle()
  }
  if (ev.key === 'g') {
    game?.keyDown(0)
  }
})

useEventListener('keyup', (ev) => {
  if (ev.key === 'g') {
    game?.keyUp(0)
  }
})
</script>

<template>
  <div class="px-2 py-3">
    <a class="bg-primary-400 p-2 rounded-sm" @click="$emit('back')">Back</a>
  </div>
  <div class="relative h-full flex flex-col">
    <canvas class="flex-1 w-full bg-surface-800" ref="canvas" />
    <div
      v-show="timer"
      class="bg-opacity-40 bg-black w-full h-full absolute top-0 h-full flex justify-center items-center"
    >
      <span class="text-9xl font-bold">{{ timer }}</span>
    </div>
  </div>
</template>