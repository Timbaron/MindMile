// Location type
export interface Location {
  latitude: number;
  longitude: number;
}

// Reminder type
export interface Reminder {
  id: string;
  title: string;
  location: Location;
  locationName: string;
  radius: number; // in meters
  createdAt: string;
  triggered: boolean;
  // Optional time-based properties
  time?: string;
  date?: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  AddReminder: undefined;
  ReminderDetail: { reminderId: string };
};

// Extend this as needed for your navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
