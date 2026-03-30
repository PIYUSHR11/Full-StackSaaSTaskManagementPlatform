//v2
// src/lib/auth/guards.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

// ✅ FIX 1: Use getServerSession() instead of calling authOptions()
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }  
  return session;
}

// ✅ FIX 2: This works as is (depends on requireAuth which is now fixed)
export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard");
  }
  
  return session;
}

// ✅ FIX 3: Added missing prisma import and fixed
export async function requireOrgAccess(organizationId: string) {
  const session = await requireAuth();
  
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
  }); 
  
  if (!membership) {
    redirect("/dashboard");
  }
  
  return { session, membership };
}

// ✅ FIX 4: Use getServerSession here too
export function withRoleGuard(allowedRoles: Role[]) {
  return function (handler: Function) {
    return async (req: Request, ...args: any[]) => {
      const session = await getServerSession(authOptions);
      
      if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
      }  
      
      if (!allowedRoles.includes(session.user.role)) {
        return new Response("Forbidden", { status: 403 });
      }
      
      return handler(req, ...args);
    };
  };
}
