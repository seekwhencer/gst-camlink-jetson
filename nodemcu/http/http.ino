#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* ssid     = "jetson-nano";
const char* password = "CHANGE!ME";
int buttonPin = D5;
int buttonState = 0;
int buttonStateLatest = 0;
  
String triggerEndpoint= "http://jetson:8081/trigger/record";
HTTPClient http;

void setup() {
  Serial.begin(115200);
  delay(10);

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  pinMode(buttonPin, INPUT);
}


void loop() {
  buttonState = digitalRead(buttonPin);
  String triggerEndpointState;

  if(buttonState != buttonStateLatest){
    buttonStateLatest = buttonState;
    
    if (buttonState == HIGH) {
      triggerEndpointState = triggerEndpoint + "/on";
    } else {
      triggerEndpointState = triggerEndpoint + "/off";
    }

    http.begin(triggerEndpointState.c_str());
      int httpResponseCode = http.GET();
          
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end();
  }
  delay(100);
}
