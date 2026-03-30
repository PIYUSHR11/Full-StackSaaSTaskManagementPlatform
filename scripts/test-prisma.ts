//added accelerate
// scripts/test-prisma.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

// ... rest of your test

async function testPrisma() {
  console.log('🧪 Testing Prisma Client...')
  console.log('Node version:', process.version)
  console.log('Platform:', process.platform)
  console.log('Arch:', process.arch)

  try {
    const client = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL
    })

    console.log('✅ Client created, testing connection...')
    
    // Test query
    const result = await client.$queryRaw`SELECT 1 as connected`
    console.log('✅ Query successful:', result)

    await client.$disconnect()
    console.log('✅ Test passed! Prisma is working correctly.')
  } catch (error) {
    console.error('❌ Test failed:', error)
    
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      console.log('\n🔧 FIX: Run: npx prisma generate')
    }
  }
}

testPrisma()