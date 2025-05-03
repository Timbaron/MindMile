import React, { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddReminderScreen from './screens/AddReminderScreen';
import HomeScreen from './screens/HomeScreen';
import { requestLocationPermission } from './services/location';
import {
	configureNotifications,
	showNotification,
} from './services/notifications';
import { getReminders, REMINDERS_KEY } from './services/storage';
import { Reminder } from './utils';
import { calculateDistance } from './utils/helpers';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [watchId, setWatchId] = useState<number | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                await configureNotifications();
                const hasPermission = await requestLocationPermission();

                if (hasPermission) {
                    await loadReminders();
                    setupLocationWatcher();
                }
            } catch (error) {
                console.error('Initialization error:', error);
            }
        };

        init();

        return () => {
            // Clean up the location watcher when component unmounts
            if (watchId !== null) {
                Geolocation.clearWatch(watchId);
            }
        };
    }, []);

    const loadReminders = async (): Promise<void> => {
        try {
            const storedReminders = await getReminders();
            setReminders(storedReminders);
        } catch (error) {
            console.error('Failed to load reminders:', error);
        }
    };

    const setupLocationWatcher = (): void => {
        const id = Geolocation.watchPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const currentReminders = await getReminders();

                    const updatedReminders = await Promise.all(
                        currentReminders.map(async (reminder) => {
                            if (reminder.triggered) {
                                return reminder;
                            }

                            const distance = calculateDistance(
                                latitude,
                                longitude,
                                reminder.location.latitude,
                                reminder.location.longitude
                            );

                            if (distance <= reminder.radius) {
                                await showNotification(
                                    reminder.title,
                                    `You've arrived at ${reminder.locationName}`
                                );
                                return { ...reminder, triggered: true };
                            }
                            return reminder;
                        })
                    );

                    // Only update if any reminders were triggered
                    if (JSON.stringify(updatedReminders) !== JSON.stringify(currentReminders)) {
                        await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updatedReminders));
                        setReminders(updatedReminders);
                    }
                } catch (error) {
                    console.error('Location watcher error:', error);
                }
            },
            (error) => console.error('Location watch error:', error),
            {
                enableHighAccuracy: true,
                distanceFilter: 50,
                interval: 10000,
                fastestInterval: 5000,
                showLocationDialog: true,
                forceRequestLocation: true,
            }
        );

        setWatchId(id);
    };

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#f4511e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'MindMile' }}
                />
                <Stack.Screen
                    name="AddReminder"
                    component={AddReminderScreen}
                    options={{ title: 'Add Reminder' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
