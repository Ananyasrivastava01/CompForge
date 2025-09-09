import Link from 'next/link'

export default function ApiPage() {
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
        <h1 className="text-5xl font-bold mb-4">API</h1>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
          Use our REST API to automate component generation from your own apps.
        </p>
      </main>
    </div>
  );
}


