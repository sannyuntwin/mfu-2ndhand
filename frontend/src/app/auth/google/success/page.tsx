'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/auth.context'

export default function GoogleSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken } = useAuth()
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const token = searchParams.get('token')
        
        if (!token) {
          setError('No authentication token received')
          setProcessing(false)
          return
        }

        console.log('🔑 OAuth token received:', token)
        
        // Store token in auth context
        await setToken(token)
        
        // Get the original URL to redirect back to
        const redirectUrl = sessionStorage.getItem('oauth_redirect_url') || '/'
        sessionStorage.removeItem('oauth_redirect_url')
        
        console.log('🔄 Redirecting to:', redirectUrl)
        
        // Small delay to ensure auth context is updated
        setTimeout(() => {
          router.push(redirectUrl)
        }, 500)
        
      } catch (err) {
        console.error('OAuth error:', err)
        setError('Authentication failed. Please try again.')
        setProcessing(false)
      }
    }

    handleOAuthSuccess()
  }, [searchParams, setToken, router])

  // If there's an error, show error message with retry option
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {processing ? 'Connecting to Google...' : 'Authentication Successful'}
        </h2>
        <p className="text-gray-600">
          {processing 
            ? 'Please wait while we complete the authentication process.' 
            : 'Redirecting you to the application...'
          }
        </p>
      </div>
    </div>
  )
}