import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { PLANS } from '../../../lib/plans'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get logged in user
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return res.status(401).json({ error: 'Please login first' })
    }

    const { plan, billing } = req.body

    // Validate plan
    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan selected' })
    }

    // Validate billing cycle
    if (!billing || !['monthly', 'yearly'].includes(billing)) {
      return res.status(400).json({ error: 'Invalid billing cycle' })
    }

    const selectedPlan = PLANS[plan]
    const planDetails = selectedPlan[billing]

    // Initialize Paystack transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: session.user.email,
        amount: planDetails.price,
        plan: planDetails.planCode,
        callback_url: `${process.env.NEXTAUTH_URL}/api/paystack/callback`,
        metadata: {
          user_id: session.user.id,
          user_name: session.user.name,
          user_email: session.user.email,
          plan: plan,
          billing: billing
        }
      })
    })

    const data = await response.json()

    if (!data.status) {
      console.error('Paystack error:', data)
      return res.status(400).json({ error: data.message || 'Payment initialization failed' })
    }

    return res.status(200).json({
      success: true,
      authorization_url: data.data.authorization_url,
      reference: data.data.reference
    })
  } catch (error) {
    console.error('Payment init error:', error)
    return res.status(500).json({ error: 'Failed to initialize payment' })
  }
}
