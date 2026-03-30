//v4
// src/app/(auth)/login/page.tsx
'use client'

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { AiOutlineMail } from "react-icons/ai"
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check if user just registered
  const justRegistered = searchParams.get("registered") === "true"

  console.log('DATABASE_URL exists: Login', !!process.env.DATABASE_URL)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError("")
    
    try {
      await signIn("google", { 
        callbackUrl,
        redirect: true 
      })
    } catch (error) {
      setError("Failed to sign in with Google")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-lg font-bold mb-4">
            TF
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to continue to TaskFlow</p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {justRegistered && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">
                ✓ Account created successfully! Please sign in.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            <FcGoogle className="w-5 h-5" />
            <span className="font-medium">
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign in with email</span>
            </div>
          </div>

          {/* Email Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

//v3
// src/app/(auth)/login/page.tsx
// 'use client'

// import { signIn, useSession } from "next-auth/react"
// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import Link from "next/link"

// export default function LoginPage() {
//   const router = useRouter()
//   const { data: session, status } = useSession()
//   const searchParams = useSearchParams()
//   const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)

//   // If already authenticated, redirect to dashboard
//   useEffect(() => {
//     if (status === "authenticated") {
//       router.push("/dashboard")
//     }
//   }, [status, router])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError("")

//     try {
//       const result = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//         callbackUrl,
//       })

//       if (result?.error) {
//         setError("Invalid email or password")
//       } else {
//         router.push(callbackUrl)
//         router.refresh()
//       }
//     } catch (error) {
//       setError("Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Show nothing while checking session
//   if (status === "loading") {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>
//   }

//   // If authenticated, don't render login form
//   if (status === "authenticated") {
//     return null
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="text-3xl font-bold text-center">Sign In</h2>
//           <p className="text-center text-gray-600 mt-2">
//             Welcome back to TaskFlow
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-50 text-red-500 p-3 rounded-md text-center">
//               {error}
//             </div>
//           )}

//           <div className="space-y-4">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email address"
//               className="w-full px-3 py-2 border rounded-md"
//               required
//             />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               className="w-full px-3 py-2 border rounded-md"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-gray-50 text-gray-500">Or</span>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={() => signIn("google", { callbackUrl })}
//             className="w-full bg-white text-gray-700 py-2 rounded-md border hover:bg-gray-50"
//           >
//             Continue with Google
//           </button>

//           <p className="text-center text-sm text-gray-600">
//             Don't have an account?{" "}
//             <Link href="/register" className="text-blue-600 hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   )
// }

// src/app/(auth)/login/page.tsx
//v2
// 'use client'

// import { signIn } from "next-auth/react"
// import { useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import Link from "next/link"

// export default function LoginPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError("")

//     try {
//       const result = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//         callbackUrl,
//       })

//       if (result?.error) {
//         setError("Invalid email or password")
//       } else {
//         router.push(callbackUrl)
//         router.refresh()
//       }
//     } catch (error) {
//       setError("Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="text-3xl font-bold text-center">Sign In</h2>
//           <p className="text-center text-gray-600 mt-2">
//             Welcome back to TaskFlow
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-50 text-red-500 p-3 rounded-md text-center">
//               {error}
//             </div>
//           )}

//           <div className="space-y-4">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email address"
//               className="w-full px-3 py-2 border rounded-md"
//               required
//             />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               className="w-full px-3 py-2 border rounded-md"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-gray-50 text-gray-500">Or</span>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={() => signIn("google", { callbackUrl })}
//             className="w-full bg-white text-gray-700 py-2 rounded-md border hover:bg-gray-50"
//           >
//             Continue with Google
//           </button>

//           <p className="text-center text-sm text-gray-600">
//             Don't have an account?{" "}
//             <Link href="/register" className="text-blue-600 hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   )
// }

//v1
// src/app/login/page.tsx
// 'use client'

// import { signIn } from "next-auth/react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"

// export default function LoginPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     })

//     if (result?.error) {
//       setError("Invalid credentials")
//     } else {
//       router.push("/dashboard")
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8">
//         <h2 className="text-3xl font-bold text-center">Sign In</h2>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && <p className="text-red-500 text-center">{error}</p>}
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//           >
//             Sign In
//           </button>
//           <button
//             type="button"
//             onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
//             className="w-full bg-white text-gray-700 py-2 rounded-md border hover:bg-gray-50"
//           >
//             Sign in with Google
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }