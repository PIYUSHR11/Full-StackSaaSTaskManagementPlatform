// src/app/api/auth/test-google/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = "http://localhost:3000/api/auth/callback/google"
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`
  
  return NextResponse.json({
    message: "Try accessing this URL manually:",
    url: authUrl,
    redirectUri,
    clientId: clientId?.substring(0, 10) + "...",
  })
}