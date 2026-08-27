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
    const checkActiveSession = async () => {
      const token = localStorage.getItem('canteen_access_token');
      const savedUser = localStorage.getItem('canteen_user');
      
      if (token && savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          const localUsers = dnuStore.getUsers();
          const checkUser = localUsers.find(
            (u) => u.username.toLowerCase() === parsed.username?.toLowerCase()
          );

          // If user was DELETED from system
          if (!checkUser) {
            console.warn('Current account was deleted from system, logging out');
            localStorage.removeItem('canteen_access_token');
            localStorage.removeItem('canteen_refresh_token');
            localStorage.removeItem('canteen_user');
            setUser(null);
            setIsLoading(false);
            if (!window.location.pathname.includes('/auth/')) {
              window.location.href = '/auth/login?reason=deleted';
            }
            return;
          }

          // If user was LOCKED by admin
          if (checkUser.status === 'LOCKED') {
            console.warn('Current account is locked, logging out');
            localStorage.removeItem('canteen_access_token');
            localStorage.removeItem('canteen_refresh_token');
            localStorage.removeItem('canteen_user');
            setUser(null);
            setIsLoading(false);
            if (!window.location.pathname.includes('/auth/')) {
              window.location.href = '/auth/login?reason=locked';
            }
            return;
          }

          setUser(parsed);
          // Refresh user profile in background
          const refreshedUser = await authApi.getMe();
          setUser(refreshedUser);
          localStorage.setItem('canteen_user', JSON.stringify(refreshedUser));
        } catch (error) {
          console.warn('Session check warning');
        }
      }
      setIsLoading(false);
    };

    checkActiveSession();

    window.addEventListener('dnu_store_updated', checkActiveSession);
    window.addEventListener('storage', checkActiveSession);
    return () => {
      window.removeEventListener('dnu_store_updated', checkActiveSession);
      window.removeEventListener('storage', checkActiveSession);
    };
  }, []);

  const login = async (credential: string, password: string) => {
    setIsLoading(true);
    try {
      const cleanCred = credential.trim().toLowerCase();
      // Check if user is in dnuStore
      const localUsers = dnuStore.getUsers();
      const localUser = localUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanCred ||
          u.email.toLowerCase() === cleanCred ||
          u.phone === cleanCred
      );

      // Check if account was deleted from system
      if (!localUser) {
        throw new Error('Tài khoản không tồn tại hoặc đã bị xóa khỏi hệ thống.');
      }

      // Check if account is locked
      if (localUser.status === 'LOCKED') {
        throw new Error('Tài khoản này đã bị khóa bởi Quản trị viên. Vui lòng liên hệ quản lý căng tin DNU.');
      }

      const response = await authApi.login(credential, password);
      
      // Double check returned user against locked/deleted list
      const checkReturned = localUsers.find(
        (u) => u.username.toLowerCase() === response.user.username.toLowerCase()
      );
      if (!checkReturned) {
        throw new Error('Tài khoản không tồn tại hoặc đã bị xóa khỏi hệ thống.');
      }
      if (checkReturned.status === 'LOCKED') {
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
