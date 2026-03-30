// scripts/create-test-user.ts - CORRECT VERSION
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

async function createTestUser() {
  console.log('🚀 Starting test user creation...')
  
  // ✅ OPTION 1: No constructor options (simplest, recommended)
  const prisma = new PrismaClient()
  
  // ✅ OPTION 2: If you need options, use this format
  // const prisma = new PrismaClient({
  //   datasourceUrl: process.env.DATABASE_URL // Works in Prisma 7.5.0
  // })

  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected')

    const email = 'test@example.com'
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create organization
    const org = await prisma.organization.upsert({
      where: { slug: 'test-org' },
      update: {},
      create: {
        name: 'Test Organization',
        slug: 'test-org',
      },
    })

    // Create user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: 'Test User',
        email,
        password: hashedPassword,
        memberships: {
          create: {
            organizationId: org.id,
            role: 'OWNER',
          },
        },
      },
    })

    console.log('\n✅ SUCCESS!')
    console.log('Email: test@example.com')
    console.log('Password: password123')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()

//v3
// // scripts/create-test-user.ts
// import { PrismaClient } from '@prisma/client'
// import bcrypt from 'bcryptjs'

// // ✅ CORRECT: Use datasourceUrl option
// const prisma = new PrismaClient({
//   datasourceUrl: process.env.DATABASE_URL,
// })

// async function main() {
//   console.log('🚀 Starting test user creation...')
  
//   try {
//     const email = 'test@example.com'
//     const password = 'password123'
//     const hashedPassword = await bcrypt.hash(password, 12)

//     console.log('📦 Creating organization...')
    
//     const org = await prisma.organization.upsert({
//       where: { slug: 'test-org' },
//       update: {},
//       create: {
//         name: 'Test Organization',
//         slug: 'test-org',
//       },
//     })

//     console.log('✅ Organization created:', org.id)

//     console.log('👤 Creating user...')
    
//     const user = await prisma.user.upsert({
//       where: { email },
//       update: {},
//       create: {
//         name: 'Test User',
//         email,
//         password: hashedPassword,
//         organizationId: org.id,
//       },
//     })

//     console.log('✅ Test user created successfully!')
//     console.log('-----------------------------------')
//     console.log('📧 Email:    test@example.com')
//     console.log('🔑 Password: password123')
//     console.log('-----------------------------------')
//   } catch (error) {
//     console.error('❌ Error creating test user:', error)
//   } finally {
//     await prisma.$disconnect()
//   }
// }

// main()

//v2
// // scripts/create-test-user.ts
// import { PrismaClient } from '@prisma/client'
// import bcrypt from 'bcryptjs'

// // Create a dedicated Prisma client for the script
// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL,
//     },
//   },
// })

// async function main() {
//   console.log('🚀 Starting test user creation...')
  
//   try {
//     const email = 'test@example.com'
//     const password = 'password123'
//     const hashedPassword = await bcrypt.hash(password, 12)

//     console.log('📦 Creating organization...')
    
//     // Create organization first
//     const org = await prisma.organization.upsert({
//       where: { slug: 'test-org' },
//       update: {},
//       create: {
//         name: 'Test Organization',
//         slug: 'test-org',
//       },
//     })

//     console.log('✅ Organization created:', org.id)

//     console.log('👤 Creating user...')
    
//     // Create user
//     const user = await prisma.user.upsert({
//       where: { email },
//       update: {},
//       create: {
//         name: 'Test User',
//         email,
//         password: hashedPassword,
//         organizationId: org.id,
//       },
//     })

//     console.log('✅ Test user created successfully!')
//     console.log('-----------------------------------')
//     console.log('📧 Email:    test@example.com')
//     console.log('🔑 Password: password123')
//     console.log('-----------------------------------')
//     console.log('You can now login with these credentials.')
//   } catch (error) {
//     console.error('❌ Error creating test user:', error)
//   } finally {
//     await prisma.$disconnect()
//   }
// }

// main()

//v1
// // scripts/create-test-user.ts
// import { PrismaClient } from '@prisma/client'
// import bcrypt from 'bcryptjs'

// const prisma = new PrismaClient()

// async function main() {
//   const email = 'test@example.com'
//   const password = 'password123'
//   const hashedPassword = await bcrypt.hash(password, 12)

//   // Create organization first
//   const org = await prisma.organization.upsert({
//     where: { slug: 'test-org' },
//     update: {},
//     create: {
//       name: 'Test Organization',
//       slug: 'test-org',
//     },
//   })

//   // Create user
//   const user = await prisma.user.upsert({
//     where: { email },
//     update: {},
//     create: {
//       name: 'Test User',
//       email,
//       password: hashedPassword,
//       organizationId: org.id,
//     },
//   })

//   console.log('✅ Test user created:')
//   console.log(`Email: ${email}`)
//   console.log(`Password: ${password}`)
// }

// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect())