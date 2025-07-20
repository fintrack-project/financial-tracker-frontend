import { apiClient } from '../../../shared/utils/apiClient';
import {
  SubscriptionPolicy,
  PolicyAcceptance,
  SubscriptionChangeAudit,
  PolicyAcceptanceRequest
} from '../types';

const BASE_URL = '/api/subscription-policies';

// Proration calculation interface for display purposes
export interface ProrationCalculation {
  fromPlanId: string;
  toPlanId: string;
  daysRemaining: number;
  currentAmount: number;
  newAmount: number;
  prorationAmount: number;
  nextBillingAmount: number;
  totalImpact: number;
  savings: number;
  calculationDate: string;
  prorationType: 'charge' | 'credit';
}

export const subscriptionPolicyApi = {
  // Get current policy
  getCurrentPolicy: async (policyType?: string): Promise<SubscriptionPolicy> => {
    const params = policyType ? { policyType } : {};
    const response = await apiClient.get(`${BASE_URL}/current`, { params });
    return response.data.data;
  },

  // Get all active policies
  getAllActivePolicies: async (): Promise<SubscriptionPolicy[]> => {
    const response = await apiClient.get(`${BASE_URL}/all`);
    return response.data.data;
  },

  // Accept policy
  acceptPolicy: async (request: PolicyAcceptanceRequest): Promise<PolicyAcceptance> => {
    const response = await apiClient.post(`${BASE_URL}/accept`, request);
    return response.data.data;
  },

  // Check if user has accepted a policy
  checkPolicyAcceptance: async (
    accountId: string,
    policyType: string,
    policyVersion: string
  ): Promise<boolean> => {
    const response = await apiClient.get(`${BASE_URL}/acceptance/check`, {
      params: { accountId, policyType, policyVersion }
    });
    return response.data.data;
  },

  // Get user's policy acceptances
  getUserPolicyAcceptances: async (accountId: string): Promise<PolicyAcceptance[]> => {
    const response = await apiClient.get(`${BASE_URL}/acceptance/user/${accountId}`);
    return response.data.data;
  },

  // Calculate proration for display purposes
  calculateProration: async (
    fromPlanId: string,
    toPlanId: string,
    daysRemaining: number
  ): Promise<ProrationCalculation> => {
    const response = await apiClient.get(`${BASE_URL}/calculations/proration`, {
      params: { fromPlanId, toPlanId, daysRemaining }
    });
    return response.data.data;
  },

  // Record subscription change
  recordSubscriptionChange: async (request: {
    accountId: string;
    changeType: string;
    fromPlanId?: string;
    toPlanId?: string;
    policyVersion?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<SubscriptionChangeAudit> => {
    const response = await apiClient.post(`${BASE_URL}/audit/record`, request);
    return response.data.data;
  }
}; 