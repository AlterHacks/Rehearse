#include <Arduino.h>

const uint8_t rThumbLed = 1;
const uint8_t rIndexLed = 4;
const uint8_t rMiddleLed = 2;
const uint8_t rRingLed = 3;
const uint8_t rPinkyLed = 0;

const int LED_NUM = 5;
const uint8_t ledPins[] = {rThumbLed, rIndexLed, rMiddleLed, rRingLed, rPinkyLed};

void setup()
{
    for (int i = 0; i < LED_NUM; i++) {
        pinMode(ledPins[i], OUTPUT);
    }
}

void loop()
{
    for (int i = 0; i < LED_NUM; i++) {
        digitalWrite(ledPins[i], HIGH);
        delay(2000);
        digitalWrite(ledPins[i], LOW);
        delay(2000);
    }
}