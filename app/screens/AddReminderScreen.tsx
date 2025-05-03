import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import MapPicker from '../components/MapPicker';
import { saveReminder } from '../services/storage';
import { Location, Reminder, RootStackParamList } from '../utils';

type AddReminderScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'AddReminder'
>;

const AddReminderScreen: React.FC = () => {
    const navigation = useNavigation<AddReminderScreenNavigationProp>();
    const [title, setTitle] = useState<string>('');
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationName, setLocationName] = useState<string>('');
    const [radius, setRadius] = useState<number>(100);
    const [time, setTime] = useState<string>('');

    const handleSave = async (): Promise<void> => {
        if (!title || !location) {
            return;
        }

        const newReminder: Reminder = {
            id: Date.now().toString(),
            title,
            location,
            locationName,
            radius,
            time: time || undefined,
            createdAt: new Date().toISOString(),
            triggered: false,
        };

        try {
            await saveReminder(newReminder);
            navigation.goBack();
        } catch (error) {
            console.error('Error saving reminder:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Reminder title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />

            <TextInput
                placeholder="Location name (optional)"
                value={locationName}
                onChangeText={setLocationName}
                style={styles.input}
            />

            <Text>Trigger when within (meters):</Text>
            <TextInput
                value={radius.toString()}
                onChangeText={(text) => setRadius(parseInt(text, 10) || 100)}
                keyboardType="numeric"
                style={styles.input}
            />

            <TextInput
                placeholder="Time (optional - HH:MM)"
                value={time}
                onChangeText={setTime}
                style={styles.input}
            />

            <MapPicker
                onLocationSelect={(loc: Location, name: string) => {
                    setLocation(loc);
                    if (name) {
                        setLocationName(name);
                    }
                }}
            />

            <Button title="Save Reminder" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
});

export default AddReminderScreen;
