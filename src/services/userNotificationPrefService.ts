import axios from 'axios';

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export const fetchNotificationPreferences = async (accountId: string): Promise<NotificationPreferences> => {
  try {
    const response = await axios.get(`/api/user/notification-preferences`, {
      params: { accountId },
    });

    console.log('Notification preferences response:', response.data);

    // Transform the array into the NotificationPreferences object
    const preferences = response.data.reduce(
      (acc: NotificationPreferences, pref: { notification_type: string; is_enabled: boolean }) => {
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