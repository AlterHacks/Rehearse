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

const uint8_t lThumbLed = 5;
const uint8_t lIndexLed = 5;
const uint8_t lMiddleLed = 5;
const uint8_t lRingLed = 5;
const uint8_t lPinkyLed = 5;
const uint8_t rThumbLed = 1;
const uint8_t rIndexLed = 4;
const uint8_t rMiddleLed = 2;
const uint8_t rRingLed = 3;
const uint8_t rPinkyLed = 0;

const uint8_t ledPins[FINGERS] = {lThumbLed, lIndexLed, lMiddleLed, lRingLed, lPinkyLed,
                                  rThumbLed, rIndexLed, rMiddleLed, rRingLed, rPinkyLed};

void updateFinger(uint8_t fingerId, uint8_t note)
{
    int read = analogRead(fingers[fingerId]);
    if (read > 900)
    {
        usbMIDI.sendNoteOn(note, read, channel);
        digitalWrite(ledPins[fingerId], HIGH);
    }
    else
    {
        usbMIDI.sendNoteOff(note, 0, channel);
        digitalWrite(ledPins[fingerId], LOW);
    }
}

void setup()
{
    Serial.begin(9600);

    for (int i = 0; i < FINGERS; i++)
    {
        pinMode(ledPins[i], OUTPUT);
    }
}

void loop()
{
    for (int i = 0; i < FINGERS; i++)
    {
        updateFinger(i, i);
    }

    while (usbMIDI.read());
}