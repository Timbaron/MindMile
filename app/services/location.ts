import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'MindMile needs access to your location',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const getCurrentLocation = (): Promise<Geolocation.GeoPosition> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(new Error(error.message)),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        showLocationDialog: true,
        forceRequestLocation: true,
      }
    );
  });
};

export const watchLocation = (
  callback: (position: Geolocation.GeoPosition) => void
): number => {
  return Geolocation.watchPosition(
    position => callback(position),
    error => console.error(error),
    {
      enableHighAccuracy: true,
      distanceFilter: 50,
      interval: 10000,
      fastestInterval: 5000,
      showLocationDialog: true,
      forceRequestLocation: true,
    }
  );
};
