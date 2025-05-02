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
  emailVerifed: boolean;
  phoneVerified: boolean;
}