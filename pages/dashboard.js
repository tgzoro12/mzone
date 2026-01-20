import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const { success } = router.query

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/dashboard')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchSubscription()
    }
  }, [session])

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/user/subscription')
      const data = await res.json()
      setSubscription(data)
    } catch (err) {
      console.error('Failed to fetch subscription:', err)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Check if user has active subscription
  const hasActiveSubscription = subscription?.status === 'active'

  // If no active subscription, show upgrade prompt
  if (!hasActiveSubscription) {
    return (
      <>
        <Head>
          <title>Subscribe - MemberHub</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Subscription Required
            </h1>
            <p className="text-gray-600 mb-8">
              Hi {session.user.name}! You need an active subscription to access the dashboard.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              View Plans
            </Link>
            <button
              onClick={() => signOut()}
              className="block w-full mt-4 text-gray-600 hover:text-gray-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </>
    )
  }

  // Active subscription - show full dashboard
  return (
    <>
      <Head>
        <title>Dashboard - MemberHub</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">MemberHub</Link>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{session.user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-8">
              🎉 Payment successful! Welcome to your premium membership.
            </div>
          )}

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session.user.name}!
            </h1>
            <p className="text-purple-200">
              You're on the {subscription?.plan?.charAt(0).toUpperCase() + subscription?.plan?.slice(1)} plan
            </p>
          </div>

          {/* Subscription Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Current Plan</h3>
              <p className="text-2xl font-bold text-gray-800">
                {subscription?.plan?.charAt(0).toUpperCase() + subscription?.plan?.slice(1)}
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Billing Cycle</h3>
              <p className="text-2xl font-bold text-gray-800">
                {subscription?.billing === 'yearly' ? 'Yearly' : 'Monthly'}
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Status</h3>
              <p className="text-2xl font-bold text-green-600">Active ✓</p>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  📊 View Analytics
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  📁 My Projects
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  ⚙️ Account Settings
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  💬 Get Support
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Subscription activated</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Account created</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Prompt for Basic/Pro */}
          {subscription?.plan !== 'premium' && (
            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Unlock More Features</h3>
                  <p className="text-gray-600">Upgrade to Premium for unlimited access and priority support.</p>
                </div>
                <Link
                  href="/pricing"
                  className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                >
                  Upgrade
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
