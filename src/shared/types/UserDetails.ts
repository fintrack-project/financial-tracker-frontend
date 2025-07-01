export interface UserDetails {
  userId: string;
  password: string;
  email: string;
  phone: string | null;
  countryCode: string | null;
  address: string | null;
  accountId: string; // UUID
  timezone: string | null;
  twoFactorEnabled: boolean;
  lastLogin: number[] | null;
  failedLoginAttempts: number;
  accountLocked: boolean;
  signupDate: number[];
  lastActivityDate: number[] | null;
  storageLimit: number;
  apiUsageLimit: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorSecret: string | null;
}