import { loadStripe } from '@stripe/stripe-js';

// Get the publishable key from environment variables
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

// Comprehensive debug logging
console.log('=== Stripe Configuration Debug ===');
console.log('1. Environment Check:', {
  NODE_ENV: process.env.NODE_ENV,
  hasStripeKey: !!STRIPE_PUBLISHABLE_KEY,
  keyLength: STRIPE_PUBLISHABLE_KEY?.length,
  keyPrefix: STRIPE_PUBLISHABLE_KEY?.substring(0, 7),
  keySuffix: STRIPE_PUBLISHABLE_KEY?.slice(-4),
  allEnvVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
});

console.log('2. Stripe Key Details:', {
  fullKey: STRIPE_PUBLISHABLE_KEY,
  isTestKey: STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_'),
  isLiveKey: STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_'),
  keyFormat: STRIPE_PUBLISHABLE_KEY?.match(/^pk_(test|live)_[a-zA-Z0-9]{24,}$/) ? 'Valid Format' : 'Invalid Format'
});

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('3. Error: Stripe publishable key is missing');
  throw new Error('Stripe publishable key is not set in environment variables. Please set REACT_APP_STRIPE_PUBLISHABLE_KEY.');
}

// Initialize Stripe
console.log('4. Initializing Stripe...');
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Helper function to check if Stripe is properly initialized
export const isStripeInitialized = () => {
  const initialized = !!STRIPE_PUBLISHABLE_KEY;
  console.log('5. Stripe Initialization Status:', {
    initialized,
    keyPresent: !!STRIPE_PUBLISHABLE_KEY,
    keyLength: STRIPE_PUBLISHABLE_KEY?.length
  });
  return initialized;
}; 