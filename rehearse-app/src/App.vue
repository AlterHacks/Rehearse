<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Game from './components/Game.vue';
import { MidiJSON } from '@tonejs/midi';

interface ISong {
  title: string;
  author: string;
  difficulty: number;
  background: string;
  midi: () => Promise<MidiJSON>;
}

const availableSongs: ISong[] = [
  {
    title: 'Pink Panther',
    author: 'Henry Mancini',
    difficulty: 0.2,
    background: '/img/pink_panther.png',
    midi: () => import('./assets/midi/golden_wind.json') as Promise<MidiJSON>,
  },
  {
    title: 'Fly Me To The Moon',
    author: 'Bart Howard',
    difficulty: 0.6,
    background: '/img/fly_me_to_the_moon.jpg',
    midi: () => import('./assets/midi/golden_wind.json') as Promise<MidiJSON>,
  },
  {
    title: 'Golden Wind',
    author: 'Yugo Kanno',
    difficulty: 0.8,
    background: '/img/Golden_Wind.png',
    midi: () => import('./assets/midi/golden_wind.json') as Promise<MidiJSON>,
  },

]

const keysDown = reactive<Set<number>>(new Set())
const selectedSong = ref<MidiJSON | undefined>(undefined)

function onMIDIInit(midi: WebMidi.MIDIAccess) {
  const inputs = midi.inputs.values()
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.addEventListener("midimessage", onMIDIKey)
  }
}

function onMIDIKey(event: WebMidi.MIDIMessageEvent) {
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xF0) {
    case 0x90:
      if (event.data[2] != 0) { // if velocity != 0, this is a note-on message
        keysDown.add(event.data[1] - 36 % 12)
      }
      break
    // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
      keysDown.delete(event.data[1] - 36 % 12)
  }
}

async function onSongSelect(song: ISong) {
  selectedSong.value = (await song.midi()).default
}

onMounted(async () => {
  onMIDIInit(await navigator.requestMIDIAccess());
})
</script>

<template>
  <div class="h-full flex flex-col">
    <Game v-if="selectedSong" :midi="selectedSong" @back="selectedSong = undefined" />
    <div v-else class="p-3">
      <h1 class="text-3xl mb-4">Available Songs</h1>
      <div class="grid grid-cols-3">
        <div
          v-for="song in availableSongs"
          :style="{ backgroundImage: `url(${song.background})` }"
          class="card"
          @click="() => onSongSelect(song)"
        >
          <div class="absolute w-full h-full top-0 left-0 -z-1 overlay"></div>
          <h1 class="text-2xl font-bold">{{ song.title }}</h1>
          <p class="mt-1 text-surface-300">{{ song.author }}</p>
          <div class="absolute bottom-2 w-full">
            <p class="mt-3">
              Difficulty:
              {{ song.difficulty }}
            </p>
          </div>
        </div>
      </div>
      <h1 class="text-3xl my-4">Test MIDI Input</h1>
      <div class="p-3 bg-surface-800">
        <p class="text-lg">Held down keys</p>
        <div class="flex gap-2 mt-2" v-if="keysDown.size">
          <div class="bg-primary-700 p-1 font-bold" v-for="key in keysDown" :id="`${key}`">{{ key }}</div>
        </div>
        <p v-else class="mt-2 text-yellow-400 mb-2">No keys held down</p>
      </div>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
.card {
  @apply p-3 bg-surface-700 cursor-pointer 
         transition-all duration-100 
         transform hover:bg-primary-500 hover:-translate-y-1 hover:shadow-lg
         active:translate-y-0
         min-h-40 select-none relative bg-cover bg-center;

  &:hover > .overlay {
    opacity: 0.8;
    background: linear-gradient(
      to right,
      rgb(var(--surface-800)) 0%,
      transparent 500%
    );
  }
}

.overlay {
  @apply transition-all duration-100;
  opacity: 1;
  background: linear-gradient(
    to right,
    rgb(var(--surface-800)) 20%,
    transparent 500%
  );
}
</style>