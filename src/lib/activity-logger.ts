// src/lib/activity-logger.ts
/*
import { getPrismaClient } from '@/lib/db'

interface LogActivityParams {
  action: string
  entityType: 'TASK' | 'USER' | 'ORGANIZATION'
  entityId: string
  userId: string
  organizationId: string
 // metadata?: Record<string, unknown>
 metadata?: NullableJsonNullValueInput | InputJsonValue; // Adjusted type
  
}

export async function logActivity({
  action,
  entityType,
  entityId,
  userId,
  organizationId,
  metadata,
}: LogActivityParams): Promise<void> {
  const prisma = getPrismaClient()

  try {
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId,
        organizationId,
        metadata: metadata ?? undefined,
      },
    })
  } catch (error) {
    // Non-fatal — log to console but don't crash the main operation
    console.error('[activity-logger] Failed to log activity:', error)
  } finally {
    await prisma.$disconnect()
  }
}
*/

import { getPrismaClient } from '@/lib/db'
import { Prisma } from '@prisma/client'

interface LogActivityParams {
  action: string
  entityType: 'TASK' | 'USER' | 'ORGANIZATION'
  entityId: string
  userId: string
  organizationId: string
  // Use InputJsonValue to allow any valid JSON-serializable object
  metadata?: Prisma.InputJsonValue 
}

export async function logActivity({
  action,
  entityType,
  entityId,
  userId,
  organizationId,
  metadata,
}: LogActivityParams): Promise<void> {
  // Assuming getPrismaClient() returns the singleton instance we created earlier
  const prisma = getPrismaClient()

  try {
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId,
        organizationId,
        // The cast here ensures the TypeScript compiler stops complaining
        metadata: (metadata as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      },
    })
  } catch (error) {
    // Audit logs should never block the primary user action
    console.error('[activity-logger] Failed to log activity:', error)
  }
  // REMOVED: await prisma.$disconnect()
  // Let the connection pooler manage the lifecycle for better performance
}