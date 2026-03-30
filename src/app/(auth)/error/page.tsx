// src/app/api/auth/error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You denied access to your account.",
    Verification: "The verification link is invalid or has expired.",
    OAuthSignin: "Error in the OAuth sign-in process.",
    OAuthCallback: "Error in the OAuth callback process.",
    OAuthCreateAccount: "Could not create OAuth account.",
    EmailCreateAccount: "Could not create email account.",
    Callback: "Error in the callback process.",
    OAuthAccountNotLinked: "This email is already associated with another account.",
    EmailSignin: "Error sending the email.",
    CredentialsSignin: "Invalid credentials.",
    SessionRequired: "You must be signed in to access this page.",
    Default: "An authentication error occurred."
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 text-2xl font-bold mb-4">
            !
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6">
            {error ? errorMessages[error] || errorMessages.Default : errorMessages.Default}
          </p>
          {error && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-mono text-gray-700">Error code: {error}</p>
            </div>
          )}
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}