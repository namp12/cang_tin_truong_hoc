import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleCode } from '../types/index.js';
import { authApi } from '../services/auth.service.js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credential: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: RoleCode[]) => boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('canteen_access_token');
      const savedUser = localStorage.getItem('canteen_user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Refresh user profile in background
          const refreshedUser = await authApi.getMe();
          setUser(refreshedUser);
          localStorage.setItem('canteen_user', JSON.stringify(refreshedUser));
        } catch (error) {
          console.warn('Session expired or invalid, using stored profile');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credential: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credential, password);
      localStorage.setItem('canteen_access_token', response.tokens.accessToken);
      localStorage.setItem('canteen_refresh_token', response.tokens.refreshToken);
      localStorage.setItem('canteen_user', JSON.stringify(response.user));
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('canteen_access_token');
    localStorage.removeItem('canteen_refresh_token');
    localStorage.removeItem('canteen_user');
    setUser(null);
    window.location.href = '/auth/login';
  };

  const hasRole = (...roles: RoleCode[]): boolean => {
    if (!user) return false;
    if (user.roles.includes('SUPER_ADMIN')) return true;
    return roles.some((role) => user.roles.includes(role));
  };

  const isAdmin = hasRole('SUPER_ADMIN', 'ADMIN', 'CANTEEN_MANAGER');
  const isStaff = hasRole('CASHIER', 'KITCHEN_STAFF', 'WAREHOUSE_MANAGER', 'ACCOUNTANT', 'STAFF');
  const isStudent = hasRole('STUDENT', 'TEACHER');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
        isAdmin,
        isStaff,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
