// src/app/api/health/route.ts
import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test database connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    return NextResponse.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'unhealthy', 
      error: 'Database connection failed' 
    }, { status: 500 })
  }
}