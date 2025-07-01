import { apiClient } from '../../../shared/utils/apiClient';
import { ApiResponse } from '../../../shared/types/ApiTypes';

interface NotificationPreferenceResponse {
  notification_type: string;
  is_enabled: boolean;
}

// Fetch notification preferences
export const fetchNotificationPreferencesApi = async (accountId: string): Promise<ApiResponse<NotificationPreferenceResponse[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<NotificationPreferenceResponse[]>>('/api/user/notification-preference/fetch', {
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