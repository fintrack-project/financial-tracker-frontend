import { UserSubscription } from './UserSubscription';

export interface SubscriptionPlan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: string;
  description?: string;
  features?: string[];
}

export interface SubscriptionDetails {
  subscription: UserSubscription;
  plan: SubscriptionPlan;
} 