// // scripts/debug-prisma.ts
// import { PrismaClient } from '@prisma/client'

// console.log('Testing different Prisma constructor patterns:')

// try {
//   console.log('\n1. Testing with datasourceUrl:')
//   const client1 = new PrismaClient({
//     datasourceUrl: process.env.DATABASE_URL
//   })
//   console.log('✅ Pattern 1 works!')
// } catch (e: any) {
//   console.log('❌ Pattern 1 failed:', e.message)
// }

// try {
//   console.log('\n2. Testing with empty constructor:')
//   const client2 = new PrismaClient()
//   console.log('✅ Pattern 2 works!')
// } catch (e: any) {
//   console.log('❌ Pattern 2 failed:', e.message)
// }