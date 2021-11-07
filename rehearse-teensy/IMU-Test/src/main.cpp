#include <Arduino.h>
#include <Wire.h>
#include <IMU_Wrapper.h>

IMU_Wrapper myImu(100);

adafruit_bno055_offsets_t offsets{-34, 51, -25,
                                  3, -1, 3,
                                  -98, 11, 318,
                                  1000, 722};

/**************************************************************************/
/*
    Arduino setup function (automatically called at startup)
*/
/**************************************************************************/
void setup(void)
{
    Serial.begin(115200);

    myImu.setOffsets(offsets);
    myImu.begin();
}

/**************************************************************************/
/*
    Arduino loop function, called once 'setup' is complete (your own code
    should go here)
*/
/**************************************************************************/
void loop(void)
{
    /* Get a new sensor information */
    myImu.update();

    Serial.print(myImu.getYaw());
    Serial.print("\t");
    Serial.print(myImu.getPitch());
    Serial.print("\t");
    Serial.print(myImu.getRoll());
    Serial.print("\n");
}