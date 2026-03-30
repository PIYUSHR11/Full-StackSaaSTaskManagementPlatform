// src/app/api/auth/test/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      session: session,
      env: {
        hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }
    })
  } catch (error) {
    console.error("Auth test error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}