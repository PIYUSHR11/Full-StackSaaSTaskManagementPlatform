// src/lib/db/queries.ts
import { cache } from "react";
import { prisma }  from "./prisma";
import { unstable_cache } from "next/cache";

// Cache user data for 5 minutes
export const getUserById = cache(async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });
});

// Cache dashboard stats with revalidation
export const getDashboardStats = unstable_cache(
  async (organizationId: string) => {
    const [totalTasks, completedTasks, pendingTasks, overdueTasks] =
      await Promise.all([
        prisma.task.count({ where: { organizationId } }),
        prisma.task.count({
          where: { organizationId, status: "DONE" },
        }),
        prisma.task.count({
          where: { organizationId, status: { not: "DONE" } },
        }),
        prisma.task.count({
          where: {
            organizationId,
            status: { not: "DONE" },
            dueDate: { lt: new Date() },
          },
        }),
      ]);
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
    };
  },
  ["dashboard-stats"],
  { revalidate: 300, tags: ["dashboard"] } // 5 minutes
);