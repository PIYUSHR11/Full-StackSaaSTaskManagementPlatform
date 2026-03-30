// src/app/(auth)/register/actions.ts
"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(formData: FormData) {
  try {
    const validatedFields = registerSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const { name, email, password } = validatedFields;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Create organization
      const org = await tx.organization.create({
        data: {
          name: `${name}'s Organization`,
          slug: `${email.split('@')[0]}-${Date.now()}`,
        },
      });

      // Create membership
      await tx.membership.create({
        data: {
          userId: newUser.id,
          organizationId: org.id,
          role: "OWNER",
        },
      });

      // Create subscription
      await tx.subscription.create({
        data: {
          organizationId: org.id,
          plan: "FREE",
        },
      });

      return newUser;
    });

    return { success: true, user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Something went wrong" };
  }
}