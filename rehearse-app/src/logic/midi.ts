import { reactive, onMounted } from 'vue';
import mitt from 'mitt'

const handlers = mitt<{
  midiUp: number;
  midiDown: number;
}>()

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
        handlers.emit('midiDown', event.data[1] % 12)
      }
      break
    // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
      handlers.emit('midiUp', event.data[1]  % 12)
  }
}

export const useMIDI = () => {
  onMounted(async () => {
    onMIDIInit(await navigator.requestMIDIAccess());
  })
}

export const onMIDIKeyDown = (cb: (key: number) => any) => {
  handlers.on('midiDown', cb)
}

export const onMIDIKeyUp = (cb: (key: number) => any) => {
  handlers.on('midiUp', cb)
}
