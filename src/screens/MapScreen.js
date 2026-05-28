import { useState } from "react";
import { StyleSheet, View, Text, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { useCities } from "../context/CitiesContext";


export default function MapScreen({ navigation }) {
    const { cities } = useCities();
    const [mapRegion, setMapRegion] = useState({
        latitude: 40,
        longitude: 0,
        latitudeDelta: 20,
        longitudeDelta: 20,
    });

    const handleGetLocation = async () => {
        let { status } = await Location.requestForegrounfPermissionAsync();
        if (status !== 'granted'){
            Alert.alert('Permission Denied', 'Allow local access to use your location');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.latitude,
            latitudeDelta: 3,
            longitudeDelta: 3,
        });
    };

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinates;
        // navigate to form screen passing coordinates
        navigation.navigate('AddCityForm', { lat: latitude, lng: longitude});
    };

    return(
        <View style={styles.containter}>
            <MapView
                style={styles.map}
                region={mapRegion}
                onLongPress={handleMapPress}
            >
                {cities.map((city) => (
                    <Marker 
                        key={city.id}
                        coordinate={{ latitude: city.position.lat, longitude: city.position.lng }}
                        title={city.cityName}
                        description={city.notes}
                        onCalloutPress={() => navigation.navigate('CityDetails', { id: city.id })}
                    />
                ))}
            </MapView>
            <View style={styles.buttonContainer}>
                <Button title="Use My Position" onPress={handleGetLocation} color="00c466" />
            </View>
        </View>
    );
}

const tyles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: '#2d3436',
        borderRadius: 8,
        padding: 4
    }
})