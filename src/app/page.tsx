'use client';

import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { getApiErrorMessage } from '@/lib/api';
import {
  ALLOWED_STATUSES,
  TASK_STATUSES,
  type TaskStatus,
} from '@/utils/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FilterOption = TaskStatus | 'all';

const FILTER_LABELS: Record<FilterOption, string> = {
  all: 'All',
  [TASK_STATUSES.TODO]: 'To Do',
  [TASK_STATUSES.IN_PROGRESS]: 'In Progress',
  [TASK_STATUSES.DONE]: 'Done',
};

export default function HomePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isInitialized, logout } = useAuth();

  const [statusFilter, setStatusFilter] = useState<FilterOption>('all');

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useTasks(statusFilter, isInitialized && isAuthenticated);

  const handleLogout = () => {
    queryClient.clear();
    logout();
  };

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  const filterTabs: FilterOption[] = ['all', ...ALLOWED_STATUSES];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Task Manager</h1>
            <p className="text-xs text-slate-500">
              {user?.full_name} ({user?.email})
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <TaskForm />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => {
              const isActive = statusFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {FILTER_LABELS[tab]}
                </button>
              );
            })}
          </div>

          {tasks && (
            <span className="text-xs text-slate-500">
              Tasks found: {tasks.length}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading tasks...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Failed to load tasks: {getApiErrorMessage(error)}
          </div>
        )}

        {!isLoading && !isError && tasks?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            No tasks in this category yet. Create your first one above!
          </div>
        )}

        {!isLoading && !isError && tasks && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
