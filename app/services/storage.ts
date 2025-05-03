import AsyncStorage from '@react-native-async-storage/async-storage';

import { Reminder } from '../utils';

export const REMINDERS_KEY = '@MindMile_reminders';

export const saveReminder = async (reminder: Reminder): Promise<void> => {
  try {
    const existingReminders = await getReminders();
    const newReminders = [...existingReminders, reminder];
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(newReminders));
  } catch (e) {
    console.error('Failed to save reminder', e);
    throw e;
  }
};

export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const reminders = await AsyncStorage.getItem(REMINDERS_KEY);
    return reminders ? JSON.parse(reminders) : [];
  } catch (e) {
    console.error('Failed to get reminders', e);
    return [];
  }
};

export const deleteReminder = async (id: string): Promise<void> => {
  try {
    const reminders = await getReminders();
    const filtered = reminders.filter(r => r.id !== id);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete reminder', e);
    throw e;
  }
};
