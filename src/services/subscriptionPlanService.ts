import { SubscriptionResponse } from '../types/SubscriptionPlan';
import { confirmSubscriptionPaymentApi } from '../api/userSubscriptionApi';

export const finalizeSubscription = async (
  subscriptionId: string,
  clientSecret: string,
  stripe: any,
  maxAttempts = 10,
  intervalMs = 2000
): Promise<SubscriptionResponse> => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      // If payment confirmation is needed and we have stripe instance
      if (clientSecret && stripe) {
        console.log('🔄 Confirming Stripe payment:', { clientSecret });
        
        try {
          // First, retrieve the payment intent to check its status
          const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);
          console.log('📊 Payment intent status:', paymentIntent.paymentIntent?.status);

          if (paymentIntent.paymentIntent?.status === 'succeeded') {
            console.log('✅ Payment already succeeded:', { 
              paymentIntentId: paymentIntent.paymentIntent.id,
              status: paymentIntent.paymentIntent.status 
            });
            
            // Proceed with backend confirmation
            const response = await confirmSubscriptionPaymentApi(paymentIntent.paymentIntent.id, subscriptionId);
            if (!response.success || !response.data) {
              throw new Error(response.message || 'Failed to confirm subscription payment');
            }
            
            return response.data;
          }

          // If not succeeded, confirm the payment with the saved payment method
          const { error, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: paymentIntent.paymentIntent?.payment_method
            }
          );
          
          if (error) {
            console.error('❌ Stripe payment confirmation failed:', error);
            throw new Error(`Payment confirmation failed: ${error.message}`);
          }

          if (!confirmedIntent) {
            console.error('❌ No payment intent returned from Stripe');
            throw new Error('Payment confirmation failed: No payment intent returned');
          }

          if (confirmedIntent.status !== 'succeeded') {
            console.error('❌ Payment intent not succeeded:', confirmedIntent.status);
            throw new Error(`Payment not completed: ${confirmedIntent.status}`);
          }
          
          console.log('✅ Stripe payment confirmed:', { 
            paymentIntentId: confirmedIntent.id,
            status: confirmedIntent.status 
          });
          
          // Only proceed with backend confirmation if Stripe payment was successful
          const response = await confirmSubscriptionPaymentApi(confirmedIntent.id, subscriptionId);
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to confirm subscription payment');
          }
          
          return response.data;
        } catch (stripeError) {
          console.error('❌ Stripe API error:', stripeError);
          // Check if it's a Stripe error with a specific message
          if (stripeError instanceof Error) {
            throw new Error(`Stripe payment failed: ${stripeError.message}`);
          }
          throw new Error('Payment confirmation failed: Unknown error occurred');
        }
      }
      
      // If still processing, wait and try again
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      attempts++;
      
    } catch (error) {
      console.error('❌ Error finalizing subscription:', error);
      throw error; // Re-throw to be handled by the caller
    }
  }
  
  throw new Error('Timeout waiting for subscription to finalize');
}; 