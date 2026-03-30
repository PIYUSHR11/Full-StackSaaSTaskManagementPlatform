// src/app/api/debug/db/route.ts
import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test database connection
    const result = await prisma.$queryRaw`SELECT current_database() as db_name, current_user as db_user`
    
    // Get counts
    const userCount = await prisma.user.count()
    const orgCount = await prisma.organization.count()
    
    return NextResponse.json({
      success: true,
      database: result,
      stats: {
        users: userCount,
        organizations: orgCount,
      },
    })
  } catch (error) {
    console.error('Database debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}