'use client'
// src/components/tasks/TasksList.tsx
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { deleteTask } from '@/app/(dashboard)/tasks/actions'
import { useTransition } from 'react'
import { TaskFilters } from '@/lib/validations/task'

// Matches the Prisma query include shape from getTasks
type TaskUser = {
  id: string
  name: string | null
  email: string
  image: string | null
}

type Task = {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: Date | null
  completedAt: Date | null
  createdById: string
  assignedToId: string | null
  organizationId: string
  createdAt: Date
  updatedAt: Date
  createdBy: TaskUser
  assignedTo: TaskUser | null
}

type Pagination = {
  page: number
  limit: number
  total: number
  pages: number
}

interface TasksListProps {
  initialTasks: Task[] | undefined
  pagination: Pagination | undefined
  filters: TaskFilters
}

const STATUS_LABELS: Record<Task['status'], string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done',
}

const STATUS_COLORS: Record<Task['status'], string> = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  REVIEW: 'bg-yellow-100 text-yellow-700',
  DONE: 'bg-green-100 text-green-700',
}

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
}

export function TasksList({ initialTasks, pagination, filters }: TasksListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const tasks = initialTasks ?? []

  function handleDelete(id: string) {
    if (!confirm('Delete this task?')) return
    startTransition(async () => {
      const result = await deleteTask(id)
      if (result?.error) {
        alert(result.error)
      }
    })
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">No tasks found</p>
        <p className="text-sm mt-1">Create your first task to get started.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg border border-gray-200 p-4 flex items-start justify-between gap-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[task.status]}`}>
                  {STATUS_LABELS[task.status]}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
              {task.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                By {task.createdBy.name ?? task.createdBy.email}
                {task.assignedTo && ` · Assigned to ${task.assignedTo.name ?? task.assignedTo.email}`}
              </p>
            </div>

            <button
              onClick={() => handleDelete(task.id)}
              disabled={isPending}
              className="text-gray-400 hover:text-red-500 text-xs shrink-0 disabled:opacity-40"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages} ({pagination.total} tasks)
          </span>
          <button
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
