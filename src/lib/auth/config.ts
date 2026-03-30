// src/lib/auth/config.ts
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
// import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import bcrypt from "bcryptjs"
import { OrgRole, Role } from "@prisma/client" // ✅ Added Role import for type safety

// ✅ Enhanced Prisma verification with detailed error
if (!prisma) {
  console.error("❌ CRITICAL: Prisma client failed to initialize")
  throw new Error("Prisma client not initialized - Check database connection")
}

// ✅ Test database connection on startup (optional but recommended)
async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log("✅ Database connection verified")
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    throw new Error("Cannot connect to database")
  }
}

// Run connection test in development only
if (process.env.NODE_ENV === 'development') {
  testDatabaseConnection().catch(console.error)
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // ✅ Added error handling for missing env vars
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // ✅ Input validation
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          // ✅ Find user with error handling
          let user
          try {
            user = await prisma.user.findUnique({
              where: { email: credentials.email },
              select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
              }
            })
          } catch (dbError) {
            console.error("Database error during user lookup:", dbError)
            throw new Error("Database error")
          }

          // ✅ User not found
          if (!user) {
            console.log(`No user found with email: ${credentials.email}`)
            return null
          }

          // ✅ User has no password (OAuth user trying credentials)
          if (!user.password) {
            console.log(`User ${credentials.email} has no password (OAuth only)`)
            return null
          }

          // ✅ Verify password with timing-safe comparison
          let passwordMatch
          try {
            passwordMatch = await bcrypt.compare(credentials.password, user.password)
          } catch (bcryptError) {
            console.error("Bcrypt comparison error:", bcryptError)
            throw new Error("Authentication error")
          }

          if (!passwordMatch) {
            console.log(`Invalid password for: ${credentials.email}`)
            return null
          }

          // ✅ Successful authentication
          console.log(`✅ User authenticated: ${credentials.email}`)
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          // ✅ Log the full error but return null to client
          console.error("Authorize function error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    // ✅ JWT callback with error handling
    async jwt({ token, user, account, trigger }) {
      try {
        // Initial sign in
        if (user) {
          token.id = user.id
          token.email = user.email
          token.name = user.name
          token.role = (user as any).role || Role.USER
          
          // Fetch organizationId for all sign-in methods (credentials + OAuth)
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email! },
              include: {
                memberships: {
                  take: 1,
                  select: { organizationId: true, role: true }
                }
              }
            })
            if (dbUser) {
              token.role = dbUser.role
              token.organizationId = dbUser.memberships[0]?.organizationId ?? undefined
              token.orgRole = dbUser.memberships[0]?.role ?? undefined
            }
          } catch (error) {
            console.error("Failed to fetch user membership:", error)
          }
        }
        
        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },
    
    // ✅ Session callback with error handling
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.id as string
          session.user.email = token.email as string
          session.user.name = token.name as string
          session.user.role = token.role as Role
          session.user.organizationId = token.organizationId as string | undefined
        session.user.orgRole = token.orgRole as OrgRole | undefined
        }
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    },
    
    // ✅ SignIn callback for additional validation
    async signIn({ user, account, profile }) {
      try {
        // Always allow sign in for now
        // Add custom logic here if needed (email verification, domain restrictions, etc.)
        console.log(`Sign in attempt: ${user.email} via ${account?.provider}`)
        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },
    
    // ✅ Redirect callback to handle redirects safely
    async redirect({ url, baseUrl }) {
      try {
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
      } catch (error) {
        console.error("Redirect callback error:", error)
        return baseUrl
      }
    }
  },
  
  // ✅ Events for logging and side effects
  events: {
    async signIn({ user, account, profile }) {
      console.log(`✅ User signed in: ${user.email} via ${account?.provider}`)
    },
    async signOut({ session, token }) {
      console.log(`👋 User signed out: ${token?.email}`)
    },
    async createUser({ user }) {
      console.log(`🎉 New user created: ${user.email}`)
      
      // Optional: Create default organization for new users
      try {
        const org = await prisma.organization.create({
          data: {
             name: `${user.name || user.email?.split('@')[0]}'s Organization`,
    slug: `${user.email?.split('@')[0]}-${Date.now()}`,
/*            
users: {
              connect: { id: user.id }
            }
*/
          }
        })
	
await prisma.membership.create({
  data: {
    userId: user.id,
    organizationId: org.id,
    role: 'OWNER',
    joinedAt: new Date(),
  }
})
        console.log(`✅ Organization created: ${org.name}`)
      } catch (error) {
        console.error("Failed to create organization:", error)
      }
    },
    async linkAccount({ user, account, profile }) {
      console.log(`🔗 Account linked: ${user.email} - ${account.provider}`)
    },
  },
  
  // ✅ Error page for auth failures
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/auth/error", // Custom error page
  },
  
  // ✅ Debug mode (automatically disabled in production)
  debug: process.env.NODE_ENV === "development",
  
  // ✅ Secret from environment
  secret: process.env.NEXTAUTH_SECRET,
}

// ✅ Validate required environment variables
function validateEnv() {
  const required = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET',
    'DATABASE_URL'
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  console.log("✅ Environment variables validated")
}

// Validate in development
if (process.env.NODE_ENV === 'development') {
  validateEnv()
}
