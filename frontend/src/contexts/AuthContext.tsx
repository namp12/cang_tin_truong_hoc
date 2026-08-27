import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleCode } from '../types/index.js';
import { authApi } from '../services/auth.service.js';
import { dnuStore } from '../services/dnuStore.js';

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
          const parsed = JSON.parse(savedUser);
          const localUsers = dnuStore.getUsers();
          const checkLocked = localUsers.find(
            (u) => u.username.toLowerCase() === parsed.username?.toLowerCase()
          );
          if (checkLocked && checkLocked.status === 'LOCKED') {
            console.warn('Current account is locked, logging out');
            localStorage.removeItem('canteen_access_token');
            localStorage.removeItem('canteen_refresh_token');
            localStorage.removeItem('canteen_user');
            setUser(null);
            setIsLoading(false);
            return;
          }
          setUser(parsed);
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
      const cleanCred = credential.trim().toLowerCase();
      // Check if user is locked in dnuStore
      const localUsers = dnuStore.getUsers();
      const localUser = localUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanCred ||
          u.email.toLowerCase() === cleanCred ||
          u.phone === cleanCred
      );
      if (localUser && localUser.status === 'LOCKED') {
        throw new Error('Tài khoản này đã bị khóa bởi Quản trị viên. Vui lòng liên hệ quản lý căng tin DNU.');
      }

      const response = await authApi.login(credential, password);
      
      // Double check returned user against locked list
      const checkReturned = localUsers.find(
        (u) => u.username.toLowerCase() === response.user.username.toLowerCase()
      );
      if (checkReturned && checkReturned.status === 'LOCKED') {
        throw new Error('Tài khoản này đã bị khóa bởi Quản trị viên. Vui lòng liên hệ quản lý căng tin DNU.');
      }

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
