#include <Arduino.h>

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

const int pressureThreshold = 900;

void setup() {
    Serial.begin(9600);
}

void loop() {
    Serial.print("rThumb: ");
    Serial.print(analogRead(rThumb) > pressureThreshold ? "1" : "0");
    Serial.print("\trIndex: ");
    Serial.print(analogRead(rIndex) > pressureThreshold ? "1" : "0");
    Serial.print("\trMiddle: ");
    Serial.print(analogRead(rMiddle) > pressureThreshold ? "1" : "0");
    Serial.print("\trRing: ");
    Serial.print(analogRead(rRing) > pressureThreshold ? "1" : "0");
    Serial.print("\trPinky: ");
    Serial.print(analogRead(rPinky) > pressureThreshold ? "1" : "0");
    Serial.print("\tlThumb: ");
    Serial.print(analogRead(lThumb) > pressureThreshold ? "1" : "0");
    Serial.print("\tlIndex: ");
    Serial.print(analogRead(lIndex) > pressureThreshold ? "1" : "0");
    Serial.print("\tlMiddle: ");
    Serial.print(analogRead(lMiddle) > pressureThreshold ? "1" : "0");
    Serial.print("\tlRing: ");
    Serial.print(analogRead(lRing) > pressureThreshold ? "1" : "0");
    Serial.print("\tlPinky: ");
    Serial.print(analogRead(lPinky) > pressureThreshold ? "1" : "0");
    Serial.print("\n");
}