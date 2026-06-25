// src/app/(dashboard)/tasks/page.tsx
import { Suspense } from "react";
import { TasksList } from "@/components/tasks/TasksList";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { CreateTaskButton } from "@/components/tasks/CreateTaskButton";
import { getTasks } from "./actions";
import { TaskFilters as TaskFiltersType } from "@/lib/validations/task";

// ISR: Revalidate every 60 seconds for near-real-time task updates
export const revalidate = 60;

interface TasksPageProps {
  searchParams: {
    status?: string;
    priority?: string;
    assignedToId?: string;
    search?: string;
    page?: string;
    dueDate?: string;
  };
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const filters: TaskFiltersType = {
    status: searchParams.status as any,
    priority: searchParams.priority as any,
    assignedToId: searchParams.assignedToId,
    search: searchParams.search,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 10,
    dueDate: searchParams.dueDate || "",
  };
  
  const result = await getTasks(filters);
  
  if (result.error) {
    return <div>Error loading tasks</div>;
  }
  
  const { tasks, pagination } = result;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <CreateTaskButton />
      </div>
      
      <TaskFilters />
      
      <Suspense fallback={<div>Loading tasks...</div>}>
        <TasksList 
          initialTasks={tasks} 
          pagination={pagination}
          filters={filters}
        />
      </Suspense>
    </div>
  );
}