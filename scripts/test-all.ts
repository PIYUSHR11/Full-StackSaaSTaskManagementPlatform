//added accelerate
// scripts/test-all.ts
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { withAccelerate } from "@prisma/extension-accelerate";

import path from 'path'

// Load .env file manually
config({ path: path.resolve(process.cwd(), '.env') })

console.log('='.repeat(50))
console.log('PRISMA DIAGNOSTIC TOOL')
console.log('='.repeat(50))

console.log('\n📋 ENVIRONMENT:')
console.log('Node version:', process.version)
console.log('Working directory:', process.cwd())
console.log('DATABASE_URL set:', !!process.env.DATABASE_URL)
if (process.env.DATABASE_URL) {
  const masked = process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@')
  console.log('Database URL:', masked)
}

console.log('\n📦 PRISMA INFO:')
console.log('PrismaClient version:', (PrismaClient as any).version || 'unknown')

console.log('\n🧪 TESTING DIFFERENT CONSTRUCTORS:')

// Test 1: No options
console.log('\nTest 1: new PrismaClient()')
try {
  const client = new PrismaClient()
  console.log('✅ Success - No options')
  await client.$disconnect()
} catch (e: any) {
  console.log('❌ Failed:', e.message)
}

// Test 2: With datasourceUrl
console.log('\nTest 2: new PrismaClient({ datasourceUrl })')
try {
  const client = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
  })
  console.log('✅ Success - With datasourceUrl')
  await client.$disconnect()

} catch (e: any) {
  console.log('❌ Failed:', e.message)
}

// Test 3: Minimal options
console.log('\nTest 3: new PrismaClient({ log: ["error"] })')
try {
  const client = new PrismaClient({
    log: ['error']
  })
  console.log('✅ Success - With log only')
  await client.$disconnect()
} catch (e: any) {
  console.log('❌ Failed:', e.message)
}

console.log('\n' + '='.repeat(50))
console.log('DIAGNOSIS COMPLETE')
console.log('='.repeat(50))