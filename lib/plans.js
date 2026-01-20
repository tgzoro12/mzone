// All subscription plans with pricing
// Your Paystack plan codes are included below

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
      price: 700000,
      display: '₦7,000',
      planCode: 'PLN_bw49u8bo5x603ze'
    },
    yearly: {
      price: 6720000,
      display: '₦67,200',
      savings: '₦16,800',
      planCode: 'PLN_am5v0bi1ptontm5'
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
      price: 1600000,
      display: '₦16,000',
      planCode: 'PLN_cooh2tzwo0flxir'
    },
    yearly: {
      price: 15360000,
      display: '₦153,600',
      savings: '₦38,400',
      planCode: 'PLN_0wu1wto6fe8zuc5'
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
      price: 3000000,
      display: '₦30,000',
      planCode: 'PLN_oncvzo1f41061fb'
    },
    yearly: {
      price: 27000000,
      display: '₦270,000',
      savings: '₦90,000',
      planCode: 'PLN_ypwdo7j4j6w8wpt'
    }
  }
}

export function getPlan(planId) {
  return PLANS[planId] || null
}

export function getAllPlans() {
  return Object.entries(PLANS).map(([id, plan]) => ({
    id,
    ...plan
  }))
}
