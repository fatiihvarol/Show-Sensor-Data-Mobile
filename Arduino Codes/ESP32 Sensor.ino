#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

const char* ssid = "Fatih";
const char* password = "12345678";
const char* apiKey = "P71P8KMUQ7GKK94Z"; // ThingSpeak API key

const int DHTPin = 2;
DHT dht(DHTPin, DHT11);
const int MQ2Pin = 34;  // ESP32'nin pin GPIO34, MQ2 sensörünün AO pinine bağlı

void setup() {
  Serial.begin(115200);
  delay(1000);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("\nConnecting");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());

  dht.begin();
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int gasValue = analogRead(MQ2Pin);

  Serial.print("Sıcaklık: ");
  Serial.print(temperature);
  Serial.print(" °C, Nem: ");
  Serial.print(humidity);
  Serial.print(", MQ2 Gaz Değeri: ");
  Serial.println(gasValue);

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT11 sensöründen veri alınamadı!");
    delay(2000);
    return;
  }

  // ThingSpeak'e veri gönderme
  String url = "http://api.thingspeak.com/update?api_key=" + String(apiKey) +
               "&field1=" + String(temperature) +
               "&field2=" + String(humidity) +
               "&field3=" + String(gasValue);
  
  HTTPClient http;
  http.begin(url);

  int httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    Serial.println("ThingSpeak'e veri başarıyla gönderildi. Yanıt: " + payload);
  } else {
    Serial.println("ThingSpeak'e veri gönderme hatası. HTTP kodu: " + String(httpCode));
  }

  http.end();

  delay(2000);
}
