// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('API test error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}