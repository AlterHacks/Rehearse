#include <Arduino.h>

const int channel = 1;

const uint8_t lThumb = A1;
const uint8_t lIndex = A0;
const uint8_t lMiddle = A2;
const uint8_t lRing = A3;
const uint8_t lPinky = A4;
const uint8_t rThumb = A5;
const uint8_t rIndex = A7;
const uint8_t rMiddle = A8;
const uint8_t rRing = A9;
const uint8_t rPinky = A6;

const int FINGERS = 10;
const uint8_t fingers[FINGERS] = {lThumb, lIndex, lMiddle, lRing, lPinky,
                                  rThumb, rIndex, rMiddle, rRing, rPinky};

void updateFinger(uint8_t analogPin, uint8_t note)
{
    int read = analogRead(analogPin);
    if (read > 900)
    {
        usbMIDI.sendNoteOn(note, read, channel);
    }
    else
    {
        usbMIDI.sendNoteOff(note, 0, channel);
    }
}

void setup()
{
    Serial.begin(9600);
}

void loop()
{
    for (int i = 0; i < FINGERS; i++) {
        updateFinger(fingers[i], i);
    }

    while (usbMIDI.read());
}