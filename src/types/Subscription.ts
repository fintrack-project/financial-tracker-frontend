export interface UpdateSubscriptionRequest {
  accountId: string;  // UUID string
  planName: string;   // Plan name instead of planId
  paymentMethodId: string;
}

export interface SubscriptionResponse {
  subscriptionId: string;
  status: 'active' | 'pending' | 'failed';
  currentPeriodEnd: string;
  planId: string;
  clientSecret?: string;  // Stripe payment intent client secret
  paymentRequired: boolean;
  amount: number;
  currency: string;
}

export interface SubscriptionPlanResponse {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: string;
  features: SubscriptionFeature[];
}

export interface SubscriptionFeature {
  id: number;
  name: string;
  description: string;
}