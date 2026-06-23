// lib/db.ts
/*
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

neonConfig.webSocketConstructor = ws  // required for Node.js non-edge environments

export function getPrismaClient() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not defined')

  const pool = new Pool({ connectionString: url })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}
*/
// lib/db.ts
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

// 1. Define the global variable to store the singleton instance
const globalForPrisma = globalThis as unknown as { 
  pool: Pool, 
  prisma: PrismaClient 
}

// 2. Create the pool and client once
const pool = globalForPrisma.pool || new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaNeon(pool)
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

// 3. Store them in globalThis during development to prevent hot-reload recreation
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pool = pool
  globalForPrisma.prisma = prisma
}

export function getPrismaClient() {
  return prisma
}