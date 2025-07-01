import { SubscriptionResponse } from '../features/subscription/types/SubscriptionPlan';
import { confirmSubscriptionPaymentApi } from '../features/subscription/api/userSubscriptionApi';

export const finalizeSubscription = async (
  subscriptionId: string,
  clientSecret: string,
  stripe: any,
  paymentMethodId: string
): Promise<SubscriptionResponse> => {
  try {
    console.log('🔄 Confirming Stripe payment:', { 
      clientSecret,
      paymentMethodId 
    });
    
    // 1. Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: paymentMethodId
      }
    );
    
    if (error) {
      console.error('❌ Stripe payment confirmation failed:', error);
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }

    if (!paymentIntent) {
      console.error('❌ No payment intent returned from Stripe');
      throw new Error('Payment confirmation failed: No payment intent returned');
    }

    console.log('✅ Stripe payment confirmed:', { 
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status 
    });

    // 2. Confirm with backend
    const response = await confirmSubscriptionPaymentApi(
      paymentIntent.id,
      subscriptionId
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to confirm subscription payment');
    }

    console.log('✅ Backend payment confirmation successful:', {
      status: response.data.status,
      paymentStatus: response.data.paymentStatus
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error finalizing subscription:', error);
    throw error;
  }
}; 