import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Get user's subscription
    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (error || !subscription) {
      return res.status(200).json({
        plan: null,
        status: 'inactive',
        billing: null
      })
    }

    // Check if subscription is expired
    let status = subscription.status
    if (subscription.current_period_end) {
      const endDate = new Date(subscription.current_period_end)
      if (endDate < new Date() && status === 'active') {
        status = 'expired'
        
        // Update status in database
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('user_id', session.user.id)
      }
    }

    return res.status(200).json({
      plan: subscription.plan,
      billing: subscription.billing,
      status: status,
      current_period_end: subscription.current_period_end,
      created_at: subscription.created_at
    })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return res.status(500).json({ error: 'Failed to fetch subscription' })
  }
}
