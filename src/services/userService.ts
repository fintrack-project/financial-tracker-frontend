import axios from 'axios';

export interface UserDetails {
  userId: string;
  password: string;
  email: string;
  phone: string | null;
  address: string | null;
  accountTier: string;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  isActiveSubscription: boolean;
  paymentMethod: string | null;
  billingAddress: string | null;
  lastPaymentDate: string | null;
  nextBillingDate: string | null;
  paymentStatus: string | null;
  timezone: string | null;
  twoFactorEnabled: boolean;
  lastLogin: string | null;
  failedLoginAttempts: number;
  accountLocked: boolean;
  signupDate: string;
  lastActivityDate: string | null;
  storageLimit: number;
  apiUsageLimit: number;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export const fetchUserDetails = async (accountId: string): Promise<UserDetails> => {
  try {
    const userDataResponse = await axios.post('/api/user/fetch', {
      accountId, // Send accountId directly in the request body
    });

    return userDataResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during registration.');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};

export const fetchNotificationPreferences = async (accountId: string): Promise<NotificationPreferences> => {
  try {
    const response = await axios.get(`/api/notification-preferences`, {
      params: { accountId },
    });

    // Transform the response data into the desired format
    const preferences = response.data.reduce(
      (acc: NotificationPreferences, pref: { notification_type: string; is_enabled: boolean }) => {
        if (pref.notification_type === 'EMAIL') acc.email = pref.is_enabled;
        if (pref.notification_type === 'SMS') acc.sms = pref.is_enabled;
        if (pref.notification_type === 'PUSH') acc.push = pref.is_enabled;
        return acc;
      },
      { email: false, sms: false, push: false }
    );

    return preferences;
  } catch (error) {
    console.error('Failed to fetch notification preferences:', error);
    throw new Error('Unable to fetch notification preferences.');
  }
};