<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Game from './components/Game.vue';

const keysDown = reactive(new Set())

function onMIDIInit(midi: WebMidi.MIDIAccess) {
  console.log(midi)
  const midiAccess = midi
  let haveAtLeastOneDevice = false
  const inputs = midiAccess.inputs.values()
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.addEventListener("midimessage", onMIDIKey)
    haveAtLeastOneDevice = true
  }
  if (!haveAtLeastOneDevice)
    alert('No MIDI input devices present.  You\'re gonna have a bad time.')
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

onMounted(async () => {
  onMIDIInit(await navigator.requestMIDIAccess());
})

const numInputs = ref(0)

const tryConnect = async () => {
  const result = await navigator.requestMIDIAccess()
  numInputs.value = result.inputs.size
}
</script>

<template>
  <div>
    <button @click="tryConnect" class="p-3 bg-primary-500">Refresh inputs</button>
    {{ keysDown }}
    <Game />
  </div>
</template>
