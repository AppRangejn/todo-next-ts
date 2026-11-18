export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in progress',
  DONE: 'done',
} as const;

export type TaskStatus = (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES];

export const ALLOWED_STATUSES: TaskStatus[] = Object.values(TASK_STATUSES);
