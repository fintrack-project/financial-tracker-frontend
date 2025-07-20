import { apiClient } from '../../../shared/utils/apiClient';

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
  }
}; 