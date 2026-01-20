import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabase'
import { sendSubscriptionEmail, sendPaymentFailedEmail } from '../../../lib/email'

export const config = {
  api: {
    bodyParser: true
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex')

    const signature = req.headers['x-paystack-signature']

    if (hash !== signature) {
      console.error('Invalid webhook signature')
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const event = req.body
    console.log('Webhook event:', event.event)

    switch (event.event) {
      case 'subscription.create':
      case 'charge.success':
        await handleSuccessfulPayment(event.data)
        break

      case 'subscription.not_renew':
      case 'subscription.disable':
        await handleSubscriptionCancelled(event.data)
        break

      case 'charge.failed':
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data)
        break

      default:
        console.log('Unhandled event:', event.event)
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({ error: 'Webhook processing failed' })
  }
}

async function handleSuccessfulPayment(data) {
  const { customer, metadata } = data

  if (!metadata?.user_id) {
    // Find user by email
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, name')
      .eq('email', customer.email)
      .single()

    if (!user) {
      console.error('User not found for payment')
      return
    }

    metadata.user_id = user.id
    metadata.user_name = user.name
  }

  const now = new Date()
  const endDate = new Date(now)
  
  if (metadata.billing === 'yearly') {
    endDate.setFullYear(endDate.getFullYear() + 1)
  } else {
    endDate.setMonth(endDate.getMonth() + 1)
  }

  await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: metadata.user_id,
      plan: metadata.plan || 'basic',
      billing: metadata.billing || 'monthly',
      status: 'active',
      paystack_customer_code: customer.customer_code,
      current_period_start: now.toISOString(),
      current_period_end: endDate.toISOString(),
      updated_at: now.toISOString()
    }, {
      onConflict: 'user_id'
    })

  await sendSubscriptionEmail(
    customer.email,
    metadata.user_name || 'Member',
    metadata.plan || 'basic',
    metadata.billing || 'monthly'
  )
}

async function handleSubscriptionCancelled(data) {
  const { customer } = data

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', customer.email)
    .single()

  if (user) {
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
  }
}

async function handlePaymentFailed(data) {
  const { customer } = data

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, name')
    .eq('email', customer.email)
    .single()

  if (user) {
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    await sendPaymentFailedEmail(customer.email, user.name)
  }
}
