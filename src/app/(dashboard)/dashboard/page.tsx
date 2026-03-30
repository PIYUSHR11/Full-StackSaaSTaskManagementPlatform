// src/app/(dashboard)/dashboard/page.tsx
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/config"
import { getDashboardStats } from "@/lib/db/queries"
import Link from "next/link"

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const organizationId = session.user.organizationId

  // Fetch stats if user has an organization
  const stats = organizationId
    ? await getDashboardStats(organizationId)
    : null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user.name || session.user.email}!
        </h1>
        {organizationId && (
          <p className="text-gray-600 mt-1">Here&apos;s your task overview</p>
        )}
      </div>

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalTasks}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedTasks}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingTasks}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdueTasks}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No organization found. Please contact support.
        </div>
      )}

      {stats && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Completion Rate</h2>
            <span className="text-2xl font-bold text-blue-600">
              {stats.completionRate.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/tasks"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Tasks
        </Link>
      </div>
    </div>
  )
}
