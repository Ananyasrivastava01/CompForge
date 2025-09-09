import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600">
      <header className="border-b border-white/20 bg-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/10 sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between text-white">
          <Link href="/" className="text-sm font-medium hover:underline">Home</Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition text-sm">Back to Dashboard</Link>
          </div>
        </div>
      </header>
      <main className="container px-4 py-20 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Pricing</h1>
        <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
          Choose the plan that fits your needs. Upgrade anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pro */}
          <div className="p-8 rounded-2xl bg-gray-900/80 border border-gray-700 shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Pro</h3>
            <p className="text-gray-300 mb-6">
              Extended limits on Agent, unlimited Tab completions, max context
              windows, and more.
            </p>
            <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition">
              Upgrade to Pro
            </button>
          </div>

          {/* Pro+ */}
          <div className="p-8 rounded-2xl bg-gray-900/80 border-2 border-blue-400 shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Pro+</h3>
            <p className="text-gray-300 mb-6">
              3.5x higher limits than Pro for OpenAI, Claude, Gemini and Grok models.
            </p>
            <button className="w-full py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-xl font-semibold transition">
              Upgrade to Pro+
            </button>
          </div>

          {/* Ultra */}
          <div className="p-8 rounded-2xl bg-gray-900/80 border border-gray-700 shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Ultra</h3>
            <p className="text-gray-300 mb-6">
              20x higher limits for OpenAI, Claude, Gemini, Grok models, and early
              access to advanced features.
            </p>
            <button className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition">
              Upgrade to Ultra
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
