#include <Arduino.h>

const uint8_t rThumb = A1;
const uint8_t rIndex = A0;
const uint8_t rMiddle = A2;
const uint8_t rRing = A3;
const uint8_t rPinky = A4;

const int pressureThreshold = 900;

void setup() {
    Serial.begin(9600);
}

void loop() {
    Serial.print("thumb: ");
    Serial.print(analogRead(rThumb) > pressureThreshold ? "1" : "0");
    Serial.print("\tindex: ");
    Serial.print(analogRead(rIndex) > pressureThreshold ? "1" : "0");
    Serial.print("\tmiddle: ");
    Serial.print(analogRead(rMiddle) > pressureThreshold ? "1" : "0");
    Serial.print("\tring: ");
    Serial.print(analogRead(rRing) > pressureThreshold ? "1" : "0");
    Serial.print("\tpinky: ");
    Serial.print(analogRead(rPinky) > pressureThreshold ? "1" : "0");
    Serial.print("\n");
}