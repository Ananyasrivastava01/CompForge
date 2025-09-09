'use client';

export const dynamic = 'force-dynamic';
import { Suspense } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Authentication failed';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Failed
          </h2>
          <p className="text-red-600 mb-6">
            {message}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
            
            <Link
              href="/"
              className="w-full flex justify-center items-center gap-2 px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}