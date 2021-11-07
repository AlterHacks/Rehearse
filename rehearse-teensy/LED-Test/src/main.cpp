#include <Arduino.h>

const int LED_NUM = 5;

void setup()
{
    for (int i = 0; i < LED_NUM; i++) {
        pinMode(i, OUTPUT);
    }
}

void loop()
{
    for (int i = 0; i < LED_NUM; i++) {
        digitalWrite(i, HIGH);
    }
}