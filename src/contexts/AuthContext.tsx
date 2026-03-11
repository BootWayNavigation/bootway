'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useApi';
import { User, isAdminOrHR } from '@/services/apiService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: any;
  isAuthenticated: boolean;
  isAdminOrHR: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<{ role: string }>;
  register: (userData: any) => Promise<void>;
  updatePassword: (passwordData: any) => Promise<void>;
  logout: () => void;
  loginLoading: boolean;
  googleLoginLoading: boolean;
  registerLoading: boolean;
  updatePasswordLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  const value: AuthContextType = {
    user: auth.user || null,
    isLoading: auth.isLoading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    isAdminOrHR: isAdminOrHR(auth.user || null),
    login: async (email: string, password: string) => {
      await auth.login({ email, password });
    },
    googleLogin: async (credential: string) => {
      const res = await auth.googleLogin(credential) as any;
      return { role: res?.user?.role || 'candidate' };
    },
    register: async (userData: any) => {
      await auth.register(userData);
    },
    updatePassword: async (passwordData: any) => {
      await auth.updatePassword(passwordData);
    },
    logout: auth.logout,
    loginLoading: auth.loginLoading,
    googleLoginLoading: auth.googleLoginLoading,
    registerLoading: auth.registerLoading,
    updatePasswordLoading: auth.updatePasswordLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
