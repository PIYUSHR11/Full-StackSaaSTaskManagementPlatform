// src/lib/activity-logger.ts
import { getPrismaClient } from '@/lib/db'

interface LogActivityParams {
  action: string
  entityType: 'TASK' | 'USER' | 'ORGANIZATION'
  entityId: string
  userId: string
  organizationId: string
  metadata?: Record<string, unknown>
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