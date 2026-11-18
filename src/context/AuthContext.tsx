'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
}

interface AuthSession {
  token: string | null;
  user: AuthUser | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAuthSession: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const EMPTY_SESSION: AuthSession = { token: null, user: null };
let cachedRawToken: string | null = null;
let cachedRawUser: string | null = null;
let cachedSession: AuthSession = EMPTY_SESSION;

const listeners = new Set<() => void>();

function emitAuthChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function getClientSnapshot(): AuthSession {
  const token = localStorage.getItem('token');
  const rawUser = localStorage.getItem('user');

  if (!token || !rawUser) {
    cachedRawToken = null;
    cachedRawUser = null;
    cachedSession = EMPTY_SESSION;
    return EMPTY_SESSION;
  }

  if (token === cachedRawToken && rawUser === cachedRawUser) {
    return cachedSession;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as AuthUser;
    cachedRawToken = token;
    cachedRawUser = rawUser;
    cachedSession = { token, user: parsedUser };
    return cachedSession;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    cachedRawToken = null;
    cachedRawUser = null;
    cachedSession = EMPTY_SESSION;
    return EMPTY_SESSION;
  }
}

function getServerSnapshot(): AuthSession {
  return EMPTY_SESSION;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const session = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const isInitialized = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const setAuthSession = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    emitAuthChange();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    emitAuthChange();
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        token: session.token,
        isAuthenticated: Boolean(session.token && session.user),
        isInitialized,
        setAuthSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
