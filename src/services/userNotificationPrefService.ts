import axios from 'axios';
import {
  fetchNotificationPreferencesApi,
  updateNotificationPreferenceApi,
} from '../api/userNotificationPrefApi'; // Adjust the import path as necessary
import { NotificationPreferences } from '../types/NotificationPreferences';

interface NotificationPreferenceResponse {
  notification_type: string;
  is_enabled: boolean;
}

export const fetchNotificationPreferences = async (accountId: string): Promise<NotificationPreferences> => {
  try {
    const response = await fetchNotificationPreferencesApi(accountId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch notification preferences');
    }

    // Transform the array into the NotificationPreferences object
    const preferences = response.data.reduce<NotificationPreferences>(
      (acc, pref) => {
        if (pref.notification_type === 'EMAIL') acc.email = pref.is_enabled;
        if (pref.notification_type === 'SMS') acc.sms = pref.is_enabled;
        if (pref.notification_type === 'PUSH') acc.push = pref.is_enabled;
        return acc;
      },
      { email: false, sms: false, push: false } // Default values
    );

    return preferences;
  } catch (error) {
    console.error('Failed to fetch notification preferences:', error);
    throw new Error('Unable to fetch notification preferences.');
  }
};

// Update notification preferences
export const updateNotificationPreference = async (
  accountId: string,
  notificationType: string,
  isEnabled: boolean
): Promise<void> => {
  try {
    const response = await updateNotificationPreferenceApi(accountId, notificationType, isEnabled);
    if (!response.success) {
      throw new Error(response.message || `Failed to update ${notificationType} preference`);
    }
    console.log(`Updated ${notificationType} to ${isEnabled}`);
  } catch (error) {
    console.error(`Failed to update ${notificationType}:`, error);
    throw new Error(`Unable to update ${notificationType} preference.`);
  }
};