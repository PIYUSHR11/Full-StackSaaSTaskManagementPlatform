// src/app/api/auth/test-google-callback/route.ts
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  
  return NextResponse.json({
    message: "Google OAuth callback received",
    hasCode: !!code,
    hasError: !!error,
    error,
    code: code ? code.substring(0, 20) + "..." : null,
    url: request.url,
  })
}