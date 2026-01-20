import { supabaseAdmin } from '../../../lib/supabase'
import { sendSubscriptionEmail } from '../../../lib/email'

export default async function handler(req, res) {
  const { reference } = req.query

  if (!reference) {
    return res.redirect('/pricing?error=missing_reference')
  }

  try {
    // Verify transaction with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    })

    const data = await response.json()

    if (!data.status || data.data.status !== 'success') {
      console.error('Payment verification failed:', data)
      return res.redirect('/pricing?error=payment_failed')
    }

    const { metadata, customer, authorization } = data.data
    const { user_id, user_name, user_email, plan, billing } = metadata

    // Calculate subscription end date
    const now = new Date()
    const endDate = new Date(now)
    if (billing === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else {
      endDate.setMonth(endDate.getMonth() + 1)
    }

    // Check if subscription exists
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', user_id)
      .single()

    if (existingSub) {
      // Update existing subscription
      await supabaseAdmin
        .from('subscriptions')
        .update({
          plan: plan,
          billing: billing,
          status: 'active',
          paystack_customer_code: customer.customer_code,
          paystack_authorization: authorization,
          paystack_subscription_code: data.data.subscription_code || null,
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('user_id', user_id)
    } else {
      // Create new subscription
      await supabaseAdmin
        .from('subscriptions')
        .insert([{
          user_id: user_id,
          plan: plan,
          billing: billing,
          status: 'active',
          paystack_customer_code: customer.customer_code,
          paystack_authorization: authorization,
          paystack_subscription_code: data.data.subscription_code || null,
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString()
        }])
    }

    // Send confirmation email
    await sendSubscriptionEmail(user_email, user_name, plan, billing)

    // Redirect to dashboard with success
    return res.redirect('/dashboard?success=true')
  } catch (error) {
    console.error('Callback error:', error)
    return res.redirect('/pricing?error=server_error')
  }
}
