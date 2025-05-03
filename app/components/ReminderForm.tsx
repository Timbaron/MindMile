import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Reminder } from '../utils';
import MapPicker from './MapPicker';

interface ReminderFormProps {
    initialData?: Partial<Reminder>;
    onSubmit: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'triggered'>) => void;
    onCancel?: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
}) => {
    const [title, setTitle] = useState(initialData?.title ?? '');
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(
        initialData?.location ?? null
    );
    const [locationName, setLocationName] = useState(initialData?.locationName ?? '');
    const [radius, setRadius] = useState(initialData?.radius ?? 100);
    const [time, setTime] = useState(initialData?.time ?? '');
    const [date, setDate] = useState(initialData?.date ?? '');
    const [isTimePickerVisible, setTimePickerVisibility] = useState<boolean>(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const handleSubmit = () => {
        if (!title || !location) {
            // You might want to show an error here
            return;
        }

        onSubmit({
            title,
            location,
            locationName,
            radius,
            ...(time && { time }),
            ...(date && { date }),
        });
    };

    const handleTimeConfirm = (selectedTime: Date) => {
        const hours = selectedTime.getHours().toString().padStart(2, '0');
        const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);
        setTimePickerVisibility(false);
    };

    const handleDateConfirm = (selectedDate: Date) => {
        const day = selectedDate.getDate().toString().padStart(2, '0');
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const year = selectedDate.getFullYear();
        setDate(`${year}-${month}-${day}`);
        setDatePickerVisibility(false);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Reminder title*"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                accessibilityLabel="Reminder title input"
            />

            <TextInput
                placeholder="Location name (optional)"
                value={locationName}
                onChangeText={setLocationName}
                style={styles.input}
                accessibilityLabel="Location name input"
            />

            <View style={styles.row}>
                <Text style={styles.label}>Trigger when within (meters):</Text>
                <TextInput
                    value={radius.toString()}
                    onChangeText={(text) => setRadius(parseInt(text) || 100)}
                    keyboardType="numeric"
                    style={[styles.input, styles.radiusInput]}
                    accessibilityLabel="Radius input"
                />
            </View>

            <View style={styles.timeDateContainer}>
                <TouchableOpacity
                    style={styles.timeDateButton}
                    onPress={() => setTimePickerVisibility(true)}
                >
                    <MaterialIcons name="access-time" size={20} color="#555" />
                    <Text style={styles.timeDateText}>
                        {time ?? 'Set time (optional)'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.timeDateButton}
                    onPress={() => setDatePickerVisibility(true)}
                >
                    <MaterialIcons name="event" size={20} color="#555" />
                    <Text style={styles.timeDateText}>
                        {date ?? 'Set date (optional)'}
                    </Text>
                </TouchableOpacity>
            </View>

            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={() => setTimePickerVisibility(false)}
            />

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisibility(false)}
            />

            <MapPicker
                onLocationSelect={(loc, name) => {
                    setLocation(loc);
                    if (name) {
                        setLocationName(name);
                    }
                }}
                initialLocation={location}
            />

            <View style={styles.buttonContainer}>
                {onCancel && (
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={onCancel}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmit}
                    disabled={!title || !location}
                >
                    <Text style={styles.buttonText}>
                        {initialData?.id ? 'Update' : 'Create'} Reminder
                    </Text>
                </TouchableOpacity>
            </View>
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
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    label: {
        marginRight: 10,
        fontSize: 16,
    },
    radiusInput: {
        width: 80,
        textAlign: 'center',
    },
    timeDateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    timeDateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
    },
    timeDateText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    submitButton: {
        backgroundColor: '#2ecc71',
        opacity: 1,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ReminderForm;