'use client'

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-gray-600 border border-gray-300 px-4 py-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      Sign Out
    </button>
  )
}