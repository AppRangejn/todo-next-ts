'use client';

import { useCreateTask } from '@/hooks/useTasks';
import { getApiErrorMessage } from '@/lib/api';
import {
  ALLOWED_STATUSES,
  TASK_STATUSES,
  type TaskStatus,
} from '@/utils/constants';
import { validateForm, type FormFieldErrors } from '@/utils/validateForm';
import {
  createTaskSchema,
  type CreateTaskInput,
} from '@/validation/taskSchemas';
import { useState, type FormEvent } from 'react';

const STATUS_LABELS: Record<TaskStatus, string> = {
  [TASK_STATUSES.TODO]: 'To Do',
  [TASK_STATUSES.IN_PROGRESS]: 'In Progress',
  [TASK_STATUSES.DONE]: 'Done',
};

export function TaskForm() {
  const createTaskMutation = useCreateTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TASK_STATUSES.TODO);
  const [fieldErrors, setFieldErrors] = useState<
    FormFieldErrors<CreateTaskInput>
  >({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    createTaskMutation.reset();

    const result = await validateForm(createTaskSchema, {
      title,
      description,
      status,
    });

    if (!result.isValid) {
      setFieldErrors(result.errors);
      return;
    }

    try {
      await createTaskMutation.mutateAsync(result.data);

      setTitle('');
      setDescription('');
      setStatus(TASK_STATUSES.TODO);
    } catch {
      // API error is displayed via createTaskMutation.isError
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      noValidate
    >
      <h2 className="text-lg font-semibold text-slate-900">New Task</h2>

      {createTaskMutation.isError && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {getApiErrorMessage(createTaskMutation.error)}
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-slate-700"
          >
            Task Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="buying"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
          {fieldErrors.title && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="task-status"
            className="block text-sm font-medium text-slate-700"
          >
            Status
          </label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          >
            {ALLOWED_STATUSES.map((item) => (
              <option key={item} value={item}>
                {STATUS_LABELS[item]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="task-description"
          className="block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="task-description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task details..."
          className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        />
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={createTaskMutation.isPending}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
