import React from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Reminder } from '../utils';

interface ReminderListProps {
    reminders: Reminder[];
    onPressItem: (reminder: Reminder) => void;
    onDeleteItem: (id: string) => void;
    emptyListText?: string;
}

const ReminderList: React.FC<ReminderListProps> = ({
    reminders,
    onPressItem,
    onDeleteItem,
    emptyListText = 'No reminders yet. Add your first one!',
}) => {
    const renderItem = ({ item }: { item: Reminder }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => onPressItem(item)}
        >
            <View style={styles.itemContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.location}>{item.locationName || 'Custom location'}</Text>

                <View style={styles.detailsRow}>
                    <Text style={styles.detail}>Radius: {item.radius}m</Text>
                    {item.time && (
                        <Text style={styles.detail}>Time: {item.time}</Text>
                    )}
                </View>

                {item.date && (
                    <Text style={styles.date}>Date: {item.date}</Text>
                )}
            </View>

            <TouchableOpacity
                onPress={() => onDeleteItem(item.id)}
                style={styles.deleteButton}
                accessibilityLabel="Delete reminder"
            >
                <MaterialIcons name="delete" size={24} color="#e74c3c" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={reminders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={reminders.length === 0 ? styles.emptyContainer : null}
            ListEmptyComponent={
                <Text style={styles.emptyText}>{emptyListText}</Text>
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    itemContent: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#2c3e50',
    },
    location: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 8,
    },
    detailsRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    detail: {
        fontSize: 14,
        color: '#34495e',
        marginRight: 16,
    },
    date: {
        fontSize: 14,
        color: '#34495e',
    },
    deleteButton: {
        padding: 8,
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#95a5a6',
        textAlign: 'center',
        marginTop: 32,
    },
    separator: {
        height: 1,
        backgroundColor: '#ecf0f1',
        marginHorizontal: 8,
    },
});

export default ReminderList;
