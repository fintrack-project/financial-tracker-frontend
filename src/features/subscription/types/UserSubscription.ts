export interface UserSubscription {
  id: number;
  accountId: string;
  stripeSubscriptionId: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string | null;
  isActive: boolean;
  lastPaymentDate: string | null;
  nextBillingDate: string | null;
  status: string;
  createdAt: string;
  stripeCustomerId: string;
  planId: string;
  cancelAtPeriodEnd: boolean;
} 