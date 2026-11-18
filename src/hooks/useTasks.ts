'use client';

import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { type TaskStatus } from '@/utils/constants';
import {
  type CreateTaskInput,
  type UpdateTaskInput,
} from '@/validation/taskSchemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface TaskItemData {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  tasks: TaskItemData[];
}

interface SingleTaskResponse {
  task: TaskItemData;
}

interface DeleteTaskResponse {
  message: string;
}

export function useTasks(statusFilter?: TaskStatus | 'all', enabled = true) {
  const { user } = useAuth();

  return useQuery<TaskItemData[]>({
    queryKey: ['tasks', user?.id ?? null, statusFilter ?? 'all'],
    enabled: enabled && Boolean(user?.id),
    queryFn: async () => {
      const params =
        statusFilter && statusFilter !== 'all'
          ? { status: statusFilter }
          : undefined;
      const { data } = await api.get<TasksResponse>('/tasks', { params });
      return data.tasks;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<TaskItemData, Error, CreateTaskInput>({
    mutationFn: async (payload) => {
      const { data } = await api.post<SingleTaskResponse>('/tasks', payload);
      return data.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<
    TaskItemData,
    Error,
    { id: number; data: UpdateTaskInput }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<SingleTaskResponse>(
        `/tasks/${id}`,
        data,
      );
      return response.data.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation<DeleteTaskResponse, Error, number>({
    mutationFn: async (id) => {
      const { data } = await api.delete<DeleteTaskResponse>(`/tasks/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
