import { useEffect, useState } from "react";
import { useCities } from "../context/CitiesContext";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ActivityIndicator } from "react-native/types_generated/index";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

//helper function to turn country code into flag emojis
function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function AddCityFormScreen({ route, navigation }) {
  const { lat, lng } = route.params;
  const { createCity, isLoading } = useCities();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setGeocodingError("");

        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode) {
          throw new Error(
            "That doesn's seem to be a city. Click somewhere else! 😉",
          );
        }

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeocodingError(err.message);
        Alert.alert("Error", err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  const handleSubmit = async () => {
    if (!cityName) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigatioon.navigate("Map View"); // redirects back to map tab after saving
  };

  if (isLoadingGeocoding) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#00c466" />
      </View>
    );
  }

  if (geocoddingError) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{geocodingError}</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          color="#ffb545"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>City name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={cityName}
            onChangeText={setCityName}
          />
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Notes about your trip to {cityName}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          placeholder="What made this place special?"
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.buttons}>
        <Button
          title={isLoading ? "Adding..." : "Add City"}
          onPress={handleSubmit}
          color="#00c466"
          disabled={isLoading || !cityName}
        />
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          color="#aaa"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d3436",
    padding: 24,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderRadius: 6,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top", //crucial for android text alignment
  },
  emoji: {
    fontSize: 14,
    paddingHorizontal: 12,
  },
  buttons: {
    marginTop: 10,
    gap: 12,
  },
  errorText: {
    color: "#ffb545",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});
