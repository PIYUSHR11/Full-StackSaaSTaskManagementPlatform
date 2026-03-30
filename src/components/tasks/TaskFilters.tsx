'use client'
// src/components/tasks/TaskFilters.tsx
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function TaskFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page') // reset to page 1 on filter change
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  function clearFilters() {
    router.push(pathname)
  }

  const hasFilters =
    searchParams.has('status') ||
    searchParams.has('priority') ||
    searchParams.has('search')

  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center">
      <input
        type="text"
        placeholder="Search tasks..."
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(e) => updateFilter('search', e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
      />

      <select
        value={searchParams.get('status') ?? ''}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Statuses</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="REVIEW">Review</option>
        <option value="DONE">Done</option>
      </select>

      <select
        value={searchParams.get('priority') ?? ''}
        onChange={(e) => updateFilter('priority', e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-800 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
