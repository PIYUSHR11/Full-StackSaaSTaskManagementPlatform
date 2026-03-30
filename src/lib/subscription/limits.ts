// src/lib/subscription/limits.ts
import { prisma } from "@/lib/db/prisma";
import { PLANS } from "@/lib/stripe/config";

export async function checkSubscriptionLimit(
  organizationId: string,
  resource: keyof typeof PLANS.FREE.limits
): Promise<boolean> {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { subscription: true },
  });
  
  if (!organization) return false;
  
  const plan = organization.subscription?.plan || "FREE";
  const limit = PLANS[plan].limits[resource];
  
  // -1 means unlimited
  if (limit === -1) return true;
  
  // Count current usage
  let currentUsage = 0;
  
  switch (resource) {
    case "tasks":
      currentUsage = await prisma.task.count({
        where: { organizationId },
      });
      break;
    case "teamMembers":
      currentUsage = await prisma.membership.count({
        where: { organizationId },
      });
      break;
    case "storage":
      // Implement storage calculation logic
      currentUsage = 0;
      break;
  }
  
  return currentUsage < limit;
}

export async function getSubscriptionUsage(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { subscription: true },
  });
  
  if (!organization) return null;
  
  const plan = organization.subscription?.plan || "FREE";
  const limits = PLANS[plan].limits;
  
  const taskCount = await prisma.task.count({
    where: { organizationId },
  });
  
  const memberCount = await prisma.membership.count({
    where: { organizationId },
  });
  
  return {
    tasks: {
      current: taskCount,
      limit: limits.tasks,
      percentage: limits.tasks === -1 ? 0 : (taskCount / limits.tasks) * 100,
    },
    teamMembers: {
      current: memberCount,
      limit: limits.teamMembers,
      percentage: limits.teamMembers === -1 ? 0 : (memberCount / limits.teamMembers) * 100,
    },
    plan,
  };
}