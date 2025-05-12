import { SubscriptionResponse } from '../types/SubscriptionPlan';
import { confirmSubscriptionPaymentApi } from '../api/userSubscriptionApi';

export const finalizeSubscription = async (
  subscriptionId: string,
  paymentIntentId: string,
  stripe: any,
  maxAttempts = 10,
  intervalMs = 2000
): Promise<SubscriptionResponse> => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      // If payment confirmation is needed and we have stripe instance
      if (paymentIntentId && stripe) {
        const { error } = await stripe.confirmCardPayment(paymentIntentId);
        if (error) {
          throw new Error(error.message);
        }
        
        // Confirm the subscription payment with our backend
        const response = await confirmSubscriptionPaymentApi(paymentIntentId, subscriptionId);
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to confirm subscription payment');
        }
        
        return response.data;
      }
      
      // If still processing, wait and try again
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      attempts++;
      
    } catch (error) {
      console.error('Error finalizing subscription:', error);
      throw error;
    }
  }
  
  throw new Error('Timeout waiting for subscription to finalize');
}; 