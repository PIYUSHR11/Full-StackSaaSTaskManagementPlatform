// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Define public paths that don't require authentication
    const isPublicPath = path === "/login" ||
                         path === "/register" ||
                         path.startsWith("/api/auth")

    // If user is authenticated and tries to access public paths, redirect to dashboard
    if (token && isPublicPath) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // If user is not authenticated and tries to access protected path, let withAuth handle it
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Allow public paths without token
        if (path === "/login" || path === "/register" || path.startsWith("/api/auth")) {
          return true
        }

        // Require token for all other paths
        return !!token
      }
    },
    pages: {
      signIn: "/login",
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
