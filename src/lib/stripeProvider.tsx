'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PropsWithChildren } from 'react';

// Load Stripe.js with the publishable key from environment
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const StripeProvider = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};