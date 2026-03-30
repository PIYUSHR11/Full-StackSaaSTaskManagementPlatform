// // src/lib/auth.ts or auth.config.ts
// import { NextAuthOptions } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "@/lib/db/prisma"
// import bcrypt from "bcryptjs"

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Invalid credentials")
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email }
//         })

//         if (!user || !user.password) {
//           throw new Error("Invalid credentials")
//         }

//         const passwordMatch = await bcrypt.compare(credentials.password, user.password)

//         if (!passwordMatch) {
//           throw new Error("Invalid credentials")
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string
//       }
//       return session
//     }
//   },
//   pages: {
//     signIn: "/login",
//     error: "/auth/error",
//   },
//   debug: process.env.NODE_ENV === "development",
// }