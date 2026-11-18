import { ALLOWED_STATUSES, TASK_STATUSES, TaskStatus } from '@/utils/constants';
import * as yup from 'yup';

export const createTaskSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters')
    .required('Title is required'),
  description: yup
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters')
    .required('Description is required'),
  status: yup
    .mixed<TaskStatus>()
    .oneOf(ALLOWED_STATUSES, 'Invalid status value')
    .default(TASK_STATUSES.TODO),
});

export const updateTaskSchema = yup
  .object({
    title: yup
      .string()
      .trim()
      .min(1, 'Title cannot be empty')
      .max(255, 'Title must be at most 255 characters'),
    description: yup
      .string()
      .trim()
      .min(1, 'Description cannot be empty')
      .max(1000, 'Description must be at most 1000 characters'),
    status: yup
      .mixed<TaskStatus>()
      .oneOf(ALLOWED_STATUSES, 'Invalid status value'),
  })
  .test(
    'at-least-one-field',
    'At least one field (title, description, or status) must be provided',
    (value) =>
      Boolean(
        value &&
        (value.title !== undefined ||
          value.description !== undefined ||
          value.status !== undefined),
      ),
  );

export type CreateTaskInput = yup.InferType<typeof createTaskSchema>;
export type UpdateTaskInput = yup.InferType<typeof updateTaskSchema>;
