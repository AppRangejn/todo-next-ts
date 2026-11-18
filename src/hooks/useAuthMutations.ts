'use client';

import { type AuthUser } from '@/context/AuthContext';
import api from '@/lib/api';
import { type LoginInput, type RegisterInput } from '@/validation/authSchemas';
import { useMutation } from '@tanstack/react-query';

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (credentials) => {
      const { data } = await api.post<LoginResponse>(
        '/auth/login',
        credentials,
      );
      return data;
    },
  });
}

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterInput>({
    mutationFn: async (payload) => {
      const { data } = await api.post<RegisterResponse>(
        '/auth/register',
        payload,
      );
      return data;
    },
  });
}
