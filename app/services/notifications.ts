import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

export const configureNotifications = async (): Promise<void> => {
  await notifee.requestPermission();

  await notifee.createChannel({
    id: 'mindmile',
    name: 'MindMile Reminders',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
};

export const showNotification = async (
  title: string,
  body: string,
  reminderId?: string
): Promise<string> => {
  const notificationId = await notifee.displayNotification({
    id: reminderId,
    title: title,
    body: body,
    android: {
      channelId: 'mindmile',
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      sound: 'default',
    },
  });

  return notificationId;
};

export const setupNotificationHandlers = (
  onPress?: (reminderId?: string) => void
): (() => void) => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
      onPress?.(detail.notification?.id);
    }
  });
};
