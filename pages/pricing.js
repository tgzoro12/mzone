import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { PLANS } from '../lib/plans'

export default function Pricing() {
  const { data: session } = useSession()
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')
  const { welcome } = router.query

  const handleSubscribe = async (planId) => {
    if (!session) {
      router.push('/login?redirect=/pricing')
      return
    }

    setLoading(planId)
    setError('')

    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          billing: billingCycle
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to initialize payment')
        setLoading(null)
        return
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorization_url
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(null)
    }
  }

  return (
    <>
      <Head>
        <title>Pricing Plans - MemberHub</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">MemberHub</Link>
              <div className="space-x-4">
                {session ? (
                  <Link href="/dashboard" className="text-purple-600 font-medium hover:underline">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/login" className="text-purple-600 font-medium hover:underline">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-12">
          {/* Welcome Message */}
          {welcome && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-8 text-center max-w-2xl mx-auto">
              🎉 Account created successfully! Choose a plan to get started.
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your journey today. All plans include a 7-day money-back guarantee.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-gray-200 p-1 rounded-xl inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-purple-600 shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-purple-600 shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Save 20-25%
                </span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl mb-8 text-center max-w-2xl mx-auto">
              {error}
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(PLANS).map(([planId, plan]) => (
              <div
                key={planId}
                className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                  plan.popular ? 'ring-2 ring-purple-600 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">
                    {plan[billingCycle].display}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                  {billingCycle === 'yearly' && plan[billingCycle].savings && (
                    <p className="text-green-600 text-sm mt-1">
                      Save {plan[billingCycle].savings}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(planId)}
                  disabled={loading === planId}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === planId ? 'Processing...' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-semibold text-gray-800 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-semibold text-gray-800 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major debit/credit cards, bank transfers, and USSD payments through Paystack.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-semibold text-gray-800 mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-600">Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
