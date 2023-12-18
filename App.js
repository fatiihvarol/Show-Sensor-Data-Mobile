import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [gasValue, setGasValue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.thingspeak.com/channels/2383791/feeds.json?api_key=3QLU9IB80P85R6L2&results=1"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const latestEntry = data.feeds[0];

        setTemperature(latestEntry.field1);
        setHumidity(latestEntry.field2);
        setGasValue(latestEntry.field3);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch data every second
    const intervalId = setInterval(fetchData, 100);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.label}>Sıcaklık:</Text>
          <Text style={styles.value}>{temperature} °C</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nem:</Text>
          <Text style={styles.value}>{humidity}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>MQ2 Gaz Değeri:</Text>
          <Text style={styles.value}>{gasValue}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  table: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
  },
  value: {
    marginLeft: 10,
    fontSize: 18,
  },
});
