import React, { useEffect, useState } from 'react';
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { deleteReminder, getReminders } from '../services/storage';
import { Reminder, RootStackParamList } from '../utils';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [reminders, setReminders] = useState<Reminder[]>([]);

    const loadReminders = async (): Promise<void> => {
        const storedReminders = await getReminders();
        setReminders(storedReminders);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadReminders);
        return unsubscribe;
    }, [navigation]);

    const handleDelete = async (id: string): Promise<void> => {
        try {
            await deleteReminder(id);
            await loadReminders();
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={reminders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reminderItem}>
                        <View style={styles.reminderContent}>
                            <Text style={styles.reminderTitle}>{item.title}</Text>
                            <Text>{item.locationName || 'Custom location'}</Text>
                            <Text>Radius: {item.radius}m</Text>
                            {item.time && <Text>Time: {item.time}</Text>}
                        </View>
                        <TouchableOpacity
                            onPress={() => handleDelete(item.id)}
                            style={styles.deleteButton}
                        >
                            <MaterialIcons name="delete" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No reminders yet. Add your first one!</Text>
                }
            />

            <Button
                title="Add Reminder"
                onPress={() => navigation.navigate('AddReminder')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    reminderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    reminderContent: {
        flex: 1,
    },
    reminderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    deleteButton: {
        padding: 8,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 32,
        fontSize: 16,
        color: '#888',
    },
});

export default HomeScreen;
