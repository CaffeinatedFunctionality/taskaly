import { NextResponse } from 'next/server';
import Stripe from 'stripe';

let stripe: Stripe | null = null;

export async function POST(request: Request) {
  try {
    if (!stripe) {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2026-03-25.dahlia',
      });
    }

    const { userId } = await request.json();

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PRO!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId,
      },
    });

    // Redirect to Stripe Checkout
    return NextResponse.redirect(session.url as string, 303);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}