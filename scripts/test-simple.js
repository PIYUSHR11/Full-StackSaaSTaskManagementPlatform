// scripts/test-simple.js
const { PrismaClient } = require('@prisma/client')

async function test() {
  console.log('Testing Prisma...')
  const prisma = new PrismaClient()
  
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Works!', result)
  } catch (e) {
    console.log('Failed:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()