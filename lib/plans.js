// All subscription plans with pricing
// IMPORTANT: After creating plans in Paystack dashboard, replace the plan codes below

export const PLANS = {
  basic: {
    name: 'Basic',
    description: 'Perfect for getting started',
    features: [
      'Access to basic dashboard',
      'Email support',
      '5 projects',
      'Basic analytics'
    ],
    monthly: {
      price: 700000, // ₦7,000 in kobo
      display: '₦7,000',
      planCode: 'PLN_basic_monthly' // Replace with your Paystack plan code
    },
    yearly: {
      price: 6720000, // ₦67,200 in kobo (20% off)
      display: '₦67,200',
      savings: '₦16,800',
      planCode: 'PLN_basic_yearly' // Replace with your Paystack plan code
    }
  },
  pro: {
    name: 'Pro',
    description: 'Most popular for professionals',
    popular: true,
    features: [
      'Everything in Basic',
      'Priority support',
      'Unlimited projects',
      'Advanced analytics',
      'API access',
      'Team collaboration'
    ],
    monthly: {
      price: 1600000, // ₦16,000 in kobo
      display: '₦16,000',
      planCode: 'PLN_pro_monthly' // Replace with your Paystack plan code
    },
    yearly: {
      price: 15360000, // ₦153,600 in kobo (20% off)
      display: '₦153,600',
      savings: '₦38,400',
      planCode: 'PLN_pro_yearly' // Replace with your Paystack plan code
    }
  },
  premium: {
    name: 'Premium',
    description: 'For enterprises and power users',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'White-label options',
      'SLA guarantee',
      'Onboarding session',
      'Custom features'
    ],
    monthly: {
      price: 3000000, // ₦30,000 in kobo
      display: '₦30,000',
      planCode: 'PLN_premium_monthly' // Replace with your Paystack plan code
    },
    yearly: {
      price: 27000000, // ₦270,000 in kobo (25% off)
      display: '₦270,000',
      savings: '₦90,000',
      planCode: 'PLN_premium_yearly' // Replace with your Paystack plan code
    }
  }
}

// Get plan details by plan ID
export function getPlan(planId) {
  return PLANS[planId] || null
}

// Get all plans as array
export function getAllPlans() {
  return Object.entries(PLANS).map(([id, plan]) => ({
    id,
    ...plan
  }))
}
