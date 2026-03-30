//v9
// src/lib/db/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error('❌ DATABASE_URL is not set in environment variables')
  }

  const maskedUrl = dbUrl.replace(/:[^:@]*@/, ':***@')
  console.log('🔧 Initializing Prisma Client with Neon adapter...')
  console.log(`   Using database: ${maskedUrl}`)

  // PrismaNeon accepts PoolConfig and creates the Pool internally
  const adapter = new PrismaNeon({ connectionString: dbUrl })

  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  })

  console.log('✅ Prisma Client created')
  return client

  // try {
  //   // Create a connection pool for Neon
  //   const pool = new Pool({ connectionString: dbUrl })
  //   // Test pool connectivity immediately (optional but helpful)
  //   pool.connect((err, client, release) => {
  //     if (err) {
  //       console.error('❌ Neon pool connection test failed:', err.message)
  //     } else {
  //       console.log('✅ Neon pool connection successful')
  //       release()
  //     }
  //   })
    
  //   // Create the Neon adapter
  //   const adapter = new PrismaNeon(pool)

  //   // ✅ CORRECT: Pass the adapter in the constructor
  //   const client = new PrismaClient({
  //     adapter,
  //     log: process.env.NODE_ENV === 'development' 
  //       ? ['query', 'info', 'warn', 'error'] 
  //       : ['error'],
  //   })

  //   console.log('✅ Prisma Client initialized successfully')
  //   return client
  // } catch (error) {
  //   console.error('❌ Failed to initialize Prisma Client:')
  //   console.error(error)

  //   // Provide helpful troubleshooting info
  //   if (error instanceof Error && error.message.includes('adapter')) {
  //     console.error('\n📋 Possible fixes:')
  //     console.error('1. Ensure @prisma/adapter-neon and @neondatabase/serverless are installed')
  //     console.error('2. Check that DATABASE_URL is correct')
  //     console.error('3. Run: npx prisma generate')
  //   }
  //   throw error
  // }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


//added accelerate
//v6
// src/lib/db/prisma.ts
// import { PrismaClient } from '@prisma/client'
// import { withAccelerate } from "@prisma/extension-accelerate";


// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// function createPrismaClient() {
//   const dbUrl = process.env.DATABASE_URL
  
//   if (!dbUrl) {
//     throw new Error('❌ DATABASE_URL is not set in environment variables')
//   }

//   console.log('🔧 Creating Prisma Client...')
//   // console.log('Prisma version:', PrismaClient.version)
//   console.log('Node version:', process.version)

//   try {
//     // METHOD 1: Try with datasourceUrl (Prisma 5.2.0+)
//     try {
//       const client = new PrismaClient({
//         datasourceUrl: dbUrl,
//         log: ['error']
//       })
//         // const prisma = new PrismaClient({
//         //   accelerateUrl: process.env.DATABASE_URL,
//         // }).$extends(withAccelerate());
      
//       console.log('✅ Created with datasourceUrl option')
//       //return client
//       return prisma
//     } catch (e: any) {
//       console.log('⚠️ datasourceUrl failed:', e.message)
      
//       // METHOD 2: Try without options (uses env var)
//       console.log('🔄 Trying without options...')
//       const client = new PrismaClient({
//         log: ['error']
//       })
//       console.log('✅ Created with no options')
//       return client
//     }
//   } catch (error) {
//     console.error('❌ All Prisma initialization methods failed')
//     console.error(error)
//     throw error
//   }
// }

// export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// //v5
// // src/lib/db/prisma.ts
// import { PrismaClient } from '@prisma/client'

// // PrismaClient is attached to the `global` object in development to prevent
// // exhausting your database connection limit.
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// // Enhanced error handling for Windows
// function createPrismaClient() {
//   const dbUrl = process.env.DATABASE_URL
  
//   if (!dbUrl) {
//     throw new Error('❌ DATABASE_URL is not set in environment variables')
//   }

//   try {
//     console.log('🔧 Initializing Prisma Client...')
    
//     const client = new PrismaClient({
//       datasourceUrl: dbUrl,
//       log: process.env.NODE_ENV === 'development' 
//         ? ['error', 'warn'] // Reduced logging to avoid noise
//         : ['error'],
//     })

//     console.log('✅ Prisma Client initialized successfully')
//     return client
//   } catch (error) {
//     console.error('❌ Failed to initialize Prisma Client:')
//     console.error(error)
    
//     // Provide helpful error message
//     if (error instanceof Error && error.message.includes('.prisma/client')) {
//       console.error('\n📋 FIX: Run these commands:')
//       console.error('1. npx prisma generate')
//       console.error('2. npx prisma db push')
//       console.error('3. npm run dev')
//     }
    
//     throw error
//   }
// }

// export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


//v4
// // src/lib/db/prisma.ts
// // src/lib/db/prisma.new.ts
// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// // Simplest possible initialization
// export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

//v3
// src/lib/db/prisma.ts
// import { PrismaClient } from '@prisma/client'

// // PrismaClient is attached to the `global` object in development to prevent
// // exhausting your database connection limit.
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// // Create a function to initialize PrismaClient with proper configuration
// function createPrismaClient() {
//   // Log the database URL (without credentials) for debugging
//   const dbUrl = process.env.DATABASE_URL || ''
//   const maskedUrl = dbUrl.replace(/:[^:@]*@/, ':***@')
//   console.log('Initializing PrismaClient with:', maskedUrl)

//   if (!dbUrl) {
//     throw new Error('DATABASE_URL environment variable is not set')
//   }

//   // ✅ CORRECT: Pass the URL directly in the constructor, not in a datasources object
//   return new PrismaClient({
//     datasourceUrl: dbUrl,  // ← Use 'datasourceUrl' property (singular, correct option)
//     log: process.env.NODE_ENV === 'development' 
//       ? ['query', 'info', 'warn', 'error'] 
//       : ['error'],
//   })
// }

// // Use existing client or create new one
// export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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