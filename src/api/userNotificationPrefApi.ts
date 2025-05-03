import axios from 'axios';

// Fetch notification preferences
export const fetchNotificationPreferencesApi = async (accountId: string) => {
  return axios.get(`/api/user/notification-preference/fetch`, {
    params: { accountId },
  });
};

// Update notification preferences
export const updateNotificationPreferenceApi = async (
  accountId: string,
  notificationType: string,
  isEnabled: boolean
) => {
  return axios.post(`/api/user/notification-preference/update`, {
    accountId,
    notificationType,
    isEnabled,
  });
};