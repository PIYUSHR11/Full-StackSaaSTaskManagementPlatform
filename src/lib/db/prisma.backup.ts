// src/lib/db/prisma.ts
import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a function to initialize PrismaClient with proper configuration
function createPrismaClient() {
  // Log the database URL (without credentials) for debugging
  const dbUrl = process.env.DATABASE_URL || ''
  const maskedUrl = dbUrl.replace(/:[^:@]*@/, ':***@')
  console.log('Initializing PrismaClient with:', maskedUrl)

  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Use existing client or create new one
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Handle cleanup on app termination
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// //v2
// // src/lib/db/prisma.ts
// import { PrismaClient } from '@prisma/client'
// import { Pool } from '@neondatabase/serverless'
// import { PrismaNeon } from '@prisma/adapter-neon'

// // Create a connection pool for Neon
// const pool = new Pool({ 
//   connectionString: process.env.DATABASE_URL 
// })

// // Create the Neon adapter
// const adapter = new PrismaNeon(pool)

// // Create Prisma Client with the adapter
// const prismaClientSingleton = () => {
//   return new PrismaClient({ adapter })  // ✅ Pass adapter inside options object
// }

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined
// }

// export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

//v1
// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma