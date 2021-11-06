#include <Arduino.h>

const int channel = 1;

void setup() {}

void loop() {
  while (true) {
    usbMIDI.sendNoteOn(2, 200, channel);
    delay(2000);
    usbMIDI.sendNoteOff(2, 0, channel);
    delay(2000);
    usbMIDI.sendNoteOn(3, 100, channel);
    delay(2000);
    usbMIDI.sendNoteOff(3, 0, channel);
    delay(2000);

    while (usbMIDI.read());
  }
}