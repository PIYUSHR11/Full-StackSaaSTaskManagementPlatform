// scripts/test-connection.ts
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

const dbUrl = process.env.DATABASE_URL
console.log('DATABASE_URL set?', !!dbUrl)

if (!dbUrl) {
  console.error('❌ DATABASE_URL missing')
  process.exit(1)
}

console.log('URL (masked):', dbUrl.replace(/:[^:@]*@/, ':***@'))

const pool = new Pool({ connectionString: dbUrl })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

async function test() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    console.log('✅ Query successful:', result)
  } catch (error) {
    console.error('❌ Query failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()

//v1
// // scripts/test-connection.ts
// import { PrismaClient } from '@prisma/client'
// import { Pool } from '@neondatabase/serverless'
// import { PrismaNeon } from '@prisma/adapter-neon'

// const dbUrl = process.env.DATABASE_URL
// console.log('DATABASE_URL set?', !!dbUrl)

// if (!dbUrl) {
//   console.error('❌ DATABASE_URL missing')
//   process.exit(1)
// }

// const pool = new Pool({ connectionString: dbUrl })
// const adapter = new PrismaNeon(pool)
// const prisma = new PrismaClient({ adapter })

// async function test() {
//   try {
//     const result = await prisma.$queryRaw`SELECT 1 as connected`
//     console.log('✅ Query successful:', result)
//   } catch (error) {
//     console.error('❌ Query failed:', error)
//   } finally {
//     await prisma.$disconnect()
//   }
// }

// test()