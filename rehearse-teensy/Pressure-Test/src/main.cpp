#include <Arduino.h>

const uint8_t rThumb = A5;
const uint8_t rIndex = A7;
const uint8_t rMiddle = A8;
const uint8_t rRing = A9;
const uint8_t rPinky = A6;

void setup() {
    Serial.begin(9600);
}

void loop() {
    Serial.print("thumb: ");
    Serial.print(analogRead(rThumb) > 950 ? "1" : "0");
    Serial.print("\tindex: ");
    Serial.print(analogRead(rIndex) > 950 ? "1" : "0");
    Serial.print("\tmiddle: ");
    Serial.print(analogRead(rMiddle) > 950 ? "1" : "0");
    Serial.print("\tring: ");
    Serial.print(analogRead(rRing) > 950 ? "1" : "0");
    Serial.print("\tpinky: ");
    Serial.print(analogRead(rPinky) > 950 ? "1" : "0");
    Serial.print("\n");
}