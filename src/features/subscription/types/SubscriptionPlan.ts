import type { UserSubscription } from './UserSubscription';

export type SubscriptionPlanType = 'FREE' | 'BASIC' | 'PREMIUM';
export type SubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid' | 'paused';

export interface SubscriptionPlan {
  id: string;
  plan_group_id: string;  // Groups plans like 'plan_basic' and 'plan_basic_annual'
  name: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  description?: string;
  features: string[];
}

export interface SubscriptionFeature {
  id: number;
  name: string;
  description: string;
}

export interface SubscriptionResponse {
  subscriptionId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  planId: string;
  clientSecret?: string;  // Stripe payment intent client secret
  paymentRequired: boolean;
  amount: number;
  currency: string;
}

// API Response types
export interface SubscriptionPlanResponse {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: string;
  features: SubscriptionFeature[];
}

export interface SubscriptionDetails {
  subscription: UserSubscription;
  plan: SubscriptionPlan;
}

// API Request/Response types
export interface UpdateSubscriptionRequest {
  accountId: string;
  planName: string;
  paymentMethodId: string;
  returnUrl: string;
}

export interface SubscriptionUpdateResponse {
  subscriptionId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  planId: string;
  clientSecret?: string;
  paymentRequired: boolean;
  amount: number;
  currency: string;
  paymentStatus: 'incomplete' | 'incomplete_expired' | 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid' | 'paused';
}

export interface UserSubscriptionDetailsResponse {
  subscription: UserSubscription;
  plan: SubscriptionPlan;
} 