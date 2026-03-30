// src/app/api/debug/auth/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    environment: {
      databaseUrl: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
      googleClientId: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
      nextauthSecret: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
      nextauthUrl: process.env.NEXTAUTH_URL || '❌ Missing',
      nodeEnv: process.env.NODE_ENV,
    },
    redirectUris: [
      `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
      "http://localhost:3000/api/auth/callback/google",
    ],
  })
}