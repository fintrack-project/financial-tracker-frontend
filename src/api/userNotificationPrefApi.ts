import { apiClient } from '../utils/apiClient';

interface NotificationPreferences {
  [key: string]: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Fetch notification preferences
export const fetchNotificationPreferencesApi = async (accountId: string): Promise<ApiResponse<NotificationPreferences>> => {
  try {
    const response = await apiClient.get<ApiResponse<NotificationPreferences>>('/api/user/notification-preference/fetch', {
      params: { accountId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};

// Update notification preferences
export const updateNotificationPreferenceApi = async (
  accountId: string,
  notificationType: string,
  isEnabled: boolean
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/user/notification-preference/update', {
      accountId,
      notificationType,
      isEnabled,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating notification preference:', error);
    throw error;
  }
};