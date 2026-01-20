import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Premium Membership - Access Exclusive Content</title>
        <meta name="description" content="Join our premium membership for exclusive content and features" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">MemberHub</h1>
            <div className="space-x-4">
              {session ? (
                <>
                  <Link href="/dashboard" className="text-white hover:text-purple-300">
                    Dashboard
                  </Link>
                  <Link href="/api/auth/signout" className="bg-white text-purple-900 px-4 py-2 rounded-lg font-semibold hover:bg-purple-100">
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-white hover:text-purple-300">
                    Login
                  </Link>
                  <Link href="/register" className="bg-white text-purple-900 px-4 py-2 rounded-lg font-semibold hover:bg-purple-100">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Unlock Premium
              <span className="block text-purple-300">Membership Benefits</span>
            </h2>
            <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
              Get exclusive access to our premium dashboard, advanced features, and priority support. Choose the plan that fits your needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="bg-white text-purple-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-100 transition-all transform hover:scale-105">
                View Pricing Plans
              </Link>
              <Link href="/register" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-900 transition-all">
                Create Free Account
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Dashboard</h3>
              <p className="text-purple-200">Access exclusive tools and features designed for power users.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-2">Priority Support</h3>
              <p className="text-purple-200">Get help when you need it with dedicated support channels.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">Advanced Analytics</h3>
              <p className="text-purple-200">Track your progress with detailed insights and reports.</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-purple-300">
          <p>&copy; 2025 MemberHub. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}
