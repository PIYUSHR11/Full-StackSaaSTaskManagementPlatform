// scripts/check-prisma-types.ts
import 'dotenv/config' 
import { PrismaClient } from '@prisma/client'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { version } from '@prisma/client/package.json'

console.log('Prisma Client version:', version)

const url = process.env.DATABASE_URL
if (!url) {
  console.log('❌ DATABASE_URL not set')
  process.exit(1)
}

async function main() {
  const pool = new Pool({ connectionString: url })
  const adapter = new PrismaNeon(pool as any)

  try {
    const client = new PrismaClient({ adapter })
    console.log('✅ PrismaClient with Neon adapter works')
    await client.$disconnect()
  } catch (e: any) {
    console.log('❌ PrismaClient constructor failed:', e.message)
  }

  await pool.end()
}

main()