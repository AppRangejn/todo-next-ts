import { TaskStatus } from '@/utils/constants';
export type { TaskStatus };

export interface UserAttributes {
  id: number;
  full_name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskAttributes {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: TaskStatus;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface JwtPayload {
  userId: number;
  email: string;
}
