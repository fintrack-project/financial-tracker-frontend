export interface UserDetails {
  userId: string;
  password: string;
  email: string;
  phone: string | null;
  countryCode: string | null;
  address: string | null;
  accountTier: string;
  subscriptionStartDate: number[] | null;
  subscriptionEndDate: number[] | null;
  isActiveSubscription: boolean;
  paymentMethod: string | null;
  billingAddress: string | null;
  lastPaymentDate: number[] | null;
  nextBillingDate: number[] | null;
  paymentStatus: string | null;
  timezone: string | null;
  twoFactorEnabled: boolean;
  lastLogin: string | null;
  failedLoginAttempts: number;
  accountLocked: boolean;
  signupDate: number[];
  lastActivityDate: number[] | null;
  storageLimit: number;
  apiUsageLimit: number;
  emailVerified: boolean;
  phoneVerified: boolean;
}