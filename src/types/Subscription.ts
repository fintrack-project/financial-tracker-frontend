export interface CreateSubscriptionRequest {
  planId: string;
  paymentMethodId: string;
}

export interface SubscriptionResponse {
  subscriptionId: string;
  status: 'active' | 'pending' | 'failed';
  currentPeriodEnd: string;
  planId: string;
}