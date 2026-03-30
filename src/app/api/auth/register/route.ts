// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and organization in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create organization
      const org = await tx.organization.create({
        data: {
          name: `${name}'s Organization`,
          slug: `${email.split('@')[0]}-${Date.now()}`,
        }
      })

      // Create user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        }
      })

      // Link user to organization via membership
      await tx.membership.create({
        data: {
          userId: newUser.id,
          organizationId: org.id,
          role: "OWNER",
          joinedAt: new Date(),
        }
      })

      return newUser
    })

    return NextResponse.json(
      { message: "User created successfully", user: { email: user.email, name: user.name } },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Registration error:", errorMessage, error)
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    )
  }
}