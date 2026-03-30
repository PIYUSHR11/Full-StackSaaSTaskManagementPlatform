// lib/db.ts
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