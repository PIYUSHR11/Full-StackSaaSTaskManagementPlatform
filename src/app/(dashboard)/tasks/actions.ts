// src/app/(dashboard)/tasks/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { requireAuth, requireOrgAccess } from "@/lib/auth/guards";
import { createTaskSchema, updateTaskSchema, type TaskFilters } from "@/lib/validations/task";
import { logActivity } from "@/lib/activity-logger";
import { checkSubscriptionLimit } from "@/lib/subscription/limits";
import { z } from "zod";

export async function createTask(formData: FormData) {
  try {
    const session = await requireAuth();
    const organizationId = session.user.organizationId!;
    
    // Check subscription limits
    const withinLimit = await checkSubscriptionLimit(
      organizationId,
      "tasks"
    );
    
    if (!withinLimit) {
      return { 
        error: "Task limit reached for your plan. Upgrade to Pro for unlimited tasks." 
      };
    }
    
    const validated = createTaskSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
      priority: formData.get("priority"),
      dueDate: formData.get("dueDate"),
      assignedToId: formData.get("assignedToId"),
    });
    
    const task = await prisma.$transaction(async (tx) => {
      // Create task
      const newTask = await tx.task.create({
        data: {
          ...validated,
          dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
          createdById: session.user.id,
          organizationId,
        },
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      
      // Log activity
      await logActivity({
        action: "TASK_CREATED",
        entityType: "TASK",
        entityId: newTask.id,
        userId: session.user.id,
        organizationId,
        metadata: { title: newTask.title },
      });
      
      return newTask;
    });
    
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    
    return { success: true, task };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Create task error:", error);
    return { error: "Failed to create task" };
  }
}

export async function updateTask(formData: FormData) {
  try {
    const session = await requireAuth();
    const organizationId = session.user.organizationId!;
    
    const validated = updateTaskSchema.parse({
      id: formData.get("id"),
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
      priority: formData.get("priority"),
      dueDate: formData.get("dueDate"),
      assignedToId: formData.get("assignedToId"),
    });
    
    const { id, ...data } = validated;
    
    // Verify task belongs to organization
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        organizationId,
      },
    });
    
    if (!existingTask) {
      return { error: "Task not found" };
    }
    
    // Check permissions
    if (existingTask.createdById !== session.user.id && 
        session.user.role !== "ADMIN" && 
        session.user.role !== "SUPER_ADMIN") {
      return { error: "You don't have permission to update this task" };
    }
    
    const task = await prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id },
        data: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          ...(data.status === "DONE" && !existingTask.completedAt
            ? { completedAt: new Date() }
            : {}),
        },
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      
      await logActivity({
        action: "TASK_UPDATED",
        entityType: "TASK",
        entityId: updated.id,
        userId: session.user.id,
        organizationId,
        metadata: { changes: data },
      });
      
      return updated;
    });
    
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath(`/tasks/${id}`);
    
    return { success: true, task };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Failed to update task" };
  }
}

export async function deleteTask(id: string) {
  try {
    const session = await requireAuth();
    const organizationId = session.user.organizationId!;
    
    // Verify task belongs to organization
    const task = await prisma.task.findFirst({
      where: {
        id,
        organizationId,
      },
    });
    
    if (!task) {
      return { error: "Task not found" };
    }
    
    // Check permissions
    if (task.createdById !== session.user.id && 
        session.user.role !== "ADMIN" && 
        session.user.role !== "SUPER_ADMIN") {
      return { error: "You don't have permission to delete this task" };
    }
    
    await prisma.$transaction(async (tx) => {
      await tx.task.delete({ where: { id } });
      
      await logActivity({
        action: "TASK_DELETED",
        entityType: "TASK",
        entityId: id,
        userId: session.user.id,
        organizationId,
        metadata: { title: task.title },
      });
    });
    
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete task" };
  }
}

export async function getTasks(filters: TaskFilters) {
  try {
    const session = await requireAuth();
    const organizationId = session.user.organizationId!;
    
    const { status, priority, assignedToId, search, page, limit } = filters;
    
    const where = {
      organizationId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assignedToId && { assignedToId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    };
    
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true, image: true },
          },
          assignedTo: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: [
          { priority: "desc" },
          { dueDate: "asc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);
    
    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    return { error: "Failed to fetch tasks" };
  }
}