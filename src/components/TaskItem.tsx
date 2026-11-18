'use client';

import {
  useDeleteTask,
  useUpdateTask,
  type TaskItemData,
} from '@/hooks/useTasks';
import { getApiErrorMessage } from '@/lib/api';
import {
  ALLOWED_STATUSES,
  TASK_STATUSES,
  type TaskStatus,
} from '@/utils/constants';
import { validateForm, type FormFieldErrors } from '@/utils/validateForm';
import {
  updateTaskSchema,
  type UpdateTaskInput,
} from '@/validation/taskSchemas';
import { useState } from 'react';

interface TaskItemProps {
  task: TaskItemData;
}

const STATUS_STYLES: Record<TaskStatus, string> = {
  [TASK_STATUSES.TODO]: 'bg-slate-100 text-slate-700 border-slate-200',
  [TASK_STATUSES.IN_PROGRESS]: 'bg-amber-50 text-amber-700 border-amber-200',
  [TASK_STATUSES.DONE]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  [TASK_STATUSES.TODO]: 'To Do',
  [TASK_STATUSES.IN_PROGRESS]: 'In Progress',
  [TASK_STATUSES.DONE]: 'Done',
};

export function TaskItem({ task }: TaskItemProps) {
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [fieldErrors, setFieldErrors] = useState<
    FormFieldErrors<UpdateTaskInput>
  >({});

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;
    updateTaskMutation.mutate({
      id: task.id,
      data: { status: newStatus },
    });
  };

  const handleSaveEdit = async () => {
    setFieldErrors({});

    const result = await validateForm(updateTaskSchema, {
      title,
      description,
    });

    if (!result.isValid) {
      setFieldErrors(result.errors);
      return;
    }

    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data: result.data,
      });
      setIsEditing(false);
    } catch {
      // API error is displayed via updateTaskMutation.isError
    }
  };

  const handleCancelEdit = () => {
    setTitle(task.title);
    setDescription(task.description);
    setFieldErrors({});
    setIsEditing(false);
  };

  const isBusy = updateTaskMutation.isPending || deleteTaskMutation.isPending;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
      {(updateTaskMutation.isError || deleteTaskMutation.isError) && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {getApiErrorMessage(
            updateTaskMutation.error || deleteTaskMutation.error,
          )}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>
            )}
          </div>
          <div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.description}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isBusy}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={isBusy}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {updateTaskMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3
              className={`text-base font-semibold ${
                task.status === TASK_STATUSES.DONE
                  ? 'text-slate-400 line-through'
                  : 'text-slate-900'
              }`}
            >
              {task.title}
            </h3>
            <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
              {task.description}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Created: {new Date(task.createdAt).toLocaleString('en-US')}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <select
              aria-label="Task status"
              value={task.status}
              disabled={isBusy}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium outline-none transition ${
                STATUS_STYLES[task.status]
              }`}
            >
              {ALLOWED_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {STATUS_LABELS[item]}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isBusy}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => deleteTaskMutation.mutate(task.id)}
              disabled={isBusy}
              className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
