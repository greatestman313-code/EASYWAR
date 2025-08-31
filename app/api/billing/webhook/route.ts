import { headers } from 'next/headers'

export async function POST() {
  // TODO: verify Stripe signature
  const sig = (await headers()).get('stripe-signature')
  console.log('Billing webhook received', sig)
  return new Response('ok')
}
