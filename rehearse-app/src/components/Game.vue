<script lang="ts" setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useEventListener } from '@vueuse/core'
import { Game } from '../logic/Game';
import { MidiJSON } from '@tonejs/midi';
import { onMIDIKeyUp, onMIDIKeyDown } from '../logic/midi';

const props = defineProps<{
  midi: MidiJSON
}>()
const emits = defineEmits(['back'])

const canvas = ref<HTMLCanvasElement | undefined>(undefined)
const score = ref(0)
const combo = ref(0)
let game: Game | undefined;

onMounted(() => {
  game = new Game(canvas.value!, 10, 1.5, score, combo)
  game.loadMidi(props.midi)
  game.start()
})
useEventListener('keydown', (ev) => ev.key === ' ' && game?.toggle())
onMIDIKeyDown((i) => game?.keyDown(i))
onMIDIKeyUp((i) => game?.keyUp(i))
</script>

<template>
  <div class="px-2 py-3">
    <a class="bg-primary-400 p-2 rounded-sm" @click="$emit('back')">Back</a>
    <span class="ml-4">Score: {{ score }}</span>
  </div>
  <div class="relative h-full flex flex-col">
    <div
      class="absolute top-1/2 left-1/2 transform -translate-y-4/2 -translate-x-1/2 text-center"
      v-show="combo"
    >
      <p class="text-surface-400 uppercase mb-4">combo</p>
      <h1 class="text-4xl font-light">{{ combo }}</h1>
    </div>
    <canvas class="flex-1 w-full bg-surface-800" ref="canvas" />
  </div>
</template>