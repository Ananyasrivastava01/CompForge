'use client';

export const dynamic = 'force-dynamic';
import { Suspense } from 'react';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function AuthCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  
  const { handleOAuthCallback } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const token = searchParams.get('token');
        const user = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setError('Authentication was cancelled or failed');
          return;
        }

        // Handle token-based authentication (from our backend)
        if (token) {
          try {
            const userData = user ? JSON.parse(decodeURIComponent(user)) : null;
            
            // Set the token in the auth store
            apiClient.setAuthToken(token);
            
            // Update auth store with user data
            useAuthStore.getState().setUser(userData);
            useAuthStore.getState().setToken(token);
            useAuthStore.getState().setAuthenticated(true);
            
            setStatus('success');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500);
            return;
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            setStatus('error');
            setError('Invalid user data received');
            return;
          }
        }

        // Handle code-based authentication (direct from OAuth provider)
        if (code) {
          await handleOAuthCallback('google', code);
          setStatus('success');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
          return;
        }

        setStatus('error');
        setError('No authorization code or token received');
      } catch (error: any) {
        setStatus('error');
        setError(error.response?.data?.message || 'Authentication failed');
      }
    };

    handleCallback();
  }, [searchParams, handleOAuthCallback, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Completing authentication...
              </h2>
              <p className="text-gray-600">
                Please wait while we complete your sign-in.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication successful!
              </h2>
              <p className="text-gray-600">
                Redirecting you to the dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication failed
              </h2>
              <p className="text-red-600 mb-4">
                {error}
              </p>
              <button
                onClick={() => router.push('/login')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}