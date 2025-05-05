import { loadStripe } from '@stripe/stripe-js';

// Get the publishable key from environment variables
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

// Comprehensive debug logging
console.log('=== Stripe Configuration Debug ===');
console.log('1. Environment Check:', {
  NODE_ENV: process.env.NODE_ENV,
  hasStripeKey: !!stripePublishableKey,
  keyLength: stripePublishableKey?.length,
  keyPrefix: stripePublishableKey?.substring(0, 7),
  keySuffix: stripePublishableKey?.slice(-4),
  allEnvVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
});

console.log('2. Stripe Key Details:', {
  fullKey: stripePublishableKey,
  isTestKey: stripePublishableKey?.startsWith('pk_test_'),
  isLiveKey: stripePublishableKey?.startsWith('pk_live_'),
  keyFormat: stripePublishableKey?.match(/^pk_(test|live)_[a-zA-Z0-9]{24,}$/) ? 'Valid Format' : 'Invalid Format'
});

if (!stripePublishableKey) {
  console.error('3. Error: Stripe publishable key is missing');
  throw new Error('Stripe publishable key is missing');
}

// Initialize Stripe
console.log('4. Initializing Stripe...');
export const stripePromise = loadStripe(stripePublishableKey);

// Helper function to check if Stripe is properly initialized
export const isStripeInitialized = () => {
  const initialized = !!stripePublishableKey;
  console.log('5. Stripe Initialization Status:', {
    initialized,
    keyPresent: !!stripePublishableKey,
    keyLength: stripePublishableKey?.length
  });
  return initialized;
}; 