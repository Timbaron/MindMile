import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView, { LatLng, Marker } from 'react-native-maps';

interface MapPickerProps {
    onLocationSelect: (location: LatLng, name: string) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect }) => {
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [address, setAddress] = useState<string>('');
    const [marker, setMarker] = useState<LatLng | null>(null);

    const handleMapPress = (e: { nativeEvent: { coordinate: LatLng } }) => {
        const newMarker = e.nativeEvent.coordinate;
        setMarker(newMarker);
        reverseGeocode(newMarker);
    };

    const reverseGeocode = async (coordinate: LatLng) => {
        try {
            const json = await Geocoder.from(coordinate);
            const Geoaddress = json.results[0]?.formatted_address || '';
            onLocationSelect(coordinate, Geoaddress);
        } catch (error) {
            console.error(error);
            onLocationSelect(coordinate, '');
        }
    };

    const handleSearch = async () => {
        try {
            const json = await Geocoder.from(address);
            const geometry = json.results[0]?.geometry;

            if (!geometry) {
                throw new Error('Location not found.');
            }

            const location = {
                latitude: geometry.location.lat,
                longitude: geometry.location.lng,
            } as LatLng;

            const newRegion = {
                ...location,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };

            setRegion(newRegion);
            setMarker(location);
            onLocationSelect(location, address);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search address"
                value={address}
                onChangeText={setAddress}
                style={styles.searchInput}
            />
            <Button title="Search" onPress={handleSearch} />

            <MapView
                style={styles.map}
                region={region}
                onPress={handleMapPress}
            >
                {marker && <Marker coordinate={marker} />}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 16,
    },
    map: {
        width: '100%',
        height: 300,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 8,
        borderRadius: 4,
    },
});

export default MapPicker;
