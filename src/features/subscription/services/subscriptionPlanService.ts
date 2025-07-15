import { SubscriptionResponse, SubscriptionStatus } from '../types/SubscriptionPlan';
import { confirmSubscriptionPaymentApi } from '../api/userSubscriptionApi';

/**
 * Finalizes a subscription payment with improved 3D Secure support
 * 
 * IMPROVEMENTS:
 * 1. Better 3D Secure handling with proper return URL
 * 2. Enhanced error handling and logging
 * 3. Simplified payment confirmation flow
 * 4. Support for both 3D Secure and non-3D Secure cards
 * 
 * @param subscriptionId Backend subscription ID
 * @param clientSecret Stripe payment intent client secret
 * @param stripe Stripe instance
 * @param paymentMethodId Payment method ID
 * @param returnUrl URL to return to after 3D Secure authentication (optional)
 * @returns Promise<SubscriptionResponse>
 */
export const finalizeSubscription = async (
  subscriptionId: string,
  clientSecret: string,
  stripe: any,
  paymentMethodId: string,
  returnUrl?: string
): Promise<SubscriptionResponse> => {
  try {
    console.log('🔄 Starting payment confirmation process:', { 
      subscriptionId,
      paymentMethodId,
      hasReturnUrl: !!returnUrl,
      returnUrl
    });
    
    // STEP 1: Prepare payment confirmation parameters
    const confirmParams: any = {
      payment_method: paymentMethodId
    };

    // Add return URL for 3D Secure authentication if provided
    if (returnUrl) {
      confirmParams.return_url = returnUrl;
      console.log('🔐 3D Secure authentication enabled with return URL:', returnUrl);
    }

    console.log('📋 Payment confirmation parameters:', confirmParams);
    
    // STEP 2: Confirm payment with Stripe
    console.log('💳 Confirming payment with Stripe...');
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      confirmParams
    );
    
    // STEP 3: Handle payment confirmation result
    if (error) {
      // Check if this is a "already confirmed" error
      if (error.code === 'payment_intent_unexpected_state') {
        console.log('ℹ️ Payment intent already confirmed, checking status...');
        // Try to retrieve the payment intent to check its current status
        try {
          const retrievedPaymentIntent = await stripe.retrievePaymentIntent(clientSecret);
          if (retrievedPaymentIntent.paymentIntent) {
            console.log('✅ Payment intent already confirmed, status:', retrievedPaymentIntent.paymentIntent.status);
            return handlePaymentIntentStatus(retrievedPaymentIntent.paymentIntent, subscriptionId);
          }
        } catch (retrieveError) {
          console.error('❌ Failed to retrieve payment intent:', retrieveError);
        }
      }
      console.error('❌ Stripe payment confirmation failed:', {
        code: error.code,
        message: error.message,
        decline_code: error.decline_code,
        param: error.param
      });
      
      // Provide user-friendly error messages
      let userMessage = 'Payment confirmation failed';
      if (error.code === 'card_declined') {
        userMessage = `Card was declined: ${error.decline_code || 'Unknown reason'}`;
      } else if (error.code === 'expired_card') {
        userMessage = 'Card has expired. Please use a different payment method.';
      } else if (error.code === 'incorrect_cvc') {
        userMessage = 'Incorrect CVC. Please check your card details.';
      } else if (error.code === 'processing_error') {
        userMessage = 'Payment processing error. Please try again.';
      } else if (error.code === 'insufficient_funds') {
        userMessage = 'Insufficient funds. Please use a different payment method.';
      } else {
        userMessage = error.message || 'Payment confirmation failed';
      }
      
      throw new Error(userMessage);
    }

    if (!paymentIntent) {
      console.error('❌ No payment intent returned from Stripe');
      throw new Error('Payment confirmation failed: No payment intent returned');
    }

    console.log('✅ Stripe payment confirmed successfully:', { 
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      requiresAction: paymentIntent.status === 'requires_action',
      requiresConfirmation: paymentIntent.status === 'requires_confirmation'
    });

    // STEP 4: Handle different payment intent statuses
    return handlePaymentIntentStatus(paymentIntent, subscriptionId);

  } catch (error) {
    console.error('❌ Error finalizing subscription:', error);
    throw error;
  }
};

/**
 * Handles payment intent status and returns appropriate response
 * 
 * @param paymentIntent Stripe payment intent object
 * @param subscriptionId Backend subscription ID
 * @returns Promise<SubscriptionResponse>
 */
const handlePaymentIntentStatus = async (
  paymentIntent: any,
  subscriptionId: string
): Promise<SubscriptionResponse> => {
  console.log('🔄 Handling payment intent status:', { 
    status: paymentIntent.status,
    id: paymentIntent.id 
  });

  if (paymentIntent.status === 'requires_action') {
    console.log('🔐 Payment requires additional authentication (3D Secure)');
    return {
      subscriptionId: subscriptionId,
      status: 'incomplete' as SubscriptionStatus,
      currentPeriodEnd: new Date().toISOString(),
      planId: '',
      paymentRequired: true,
      amount: 0,
      currency: '',
      clientSecret: paymentIntent.client_secret
    } as SubscriptionResponse;
  }

  if (paymentIntent.status === 'succeeded') {
    console.log('✅ Payment succeeded, confirming with backend...');
    console.log('🔍 Payment Intent Details:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
    
    try {
      const response = await confirmSubscriptionPaymentApi(
        paymentIntent.id,
        subscriptionId
      );

      if (!response.success || !response.data) {
        console.error('❌ Backend payment confirmation failed:', response.message);
        throw new Error(response.message || 'Failed to confirm subscription payment');
      }

      console.log('✅ Backend payment confirmation successful:', response.data);
      console.log('🔍 Backend Response Details:', {
        status: response.data.status,
        paymentRequired: response.data.paymentRequired
      });
      return response.data;
    } catch (error) {
      console.error('❌ Backend confirmation error:', error);
      // Don't override backend status - let the backend handle the actual status
      throw new Error('Failed to confirm subscription payment: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  if (paymentIntent.status === 'requires_confirmation') {
    console.log('⏳ Payment requires confirmation');
    throw new Error('Payment requires confirmation. Please try again.');
  }

  // Handle other statuses
  console.warn('⚠️ Unexpected payment status:', paymentIntent.status);
  throw new Error(`Unexpected payment status: ${paymentIntent.status}`);
};

/**
 * Handles payment intent status updates from Stripe webhooks or return URL
 * 
 * @param paymentIntentId Stripe payment intent ID
 * @param subscriptionId Backend subscription ID
 * @returns Promise<SubscriptionResponse>
 */
export const handlePaymentIntentUpdate = async (
  paymentIntentId: string,
  subscriptionId: string
): Promise<SubscriptionResponse> => {
  try {
    console.log('🔄 Handling payment intent update:', { paymentIntentId, subscriptionId });
    
    const response = await confirmSubscriptionPaymentApi(
      paymentIntentId,
      subscriptionId
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update subscription payment');
    }

    console.log('✅ Payment intent update successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error handling payment intent update:', error);
    throw error;
  }
}; 