import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { AdminLayout } from '../components/layout/AdminLayout.js';
import { StudentLayout } from '../components/layout/StudentLayout.js';
import { LoginPage } from '../features/auth/LoginPage.js';
import { RegisterPage } from '../features/auth/RegisterPage.js';
import { DashboardPage } from '../features/dashboard/DashboardPage.js';
import { PosPage } from '../features/pos/PosPage.js';
import { OrdersPage } from '../features/orders/OrdersPage.js';
import { KitchenPage } from '../features/kitchen/KitchenPage.js';
import { FoodsPage } from '../features/foods/FoodsPage.js';
import { InventoryPage } from '../features/inventory/InventoryPage.js';
import { UsersPage } from '../features/users/UsersPage.js';
import { AiAnalyticsPage } from '../features/ai/AiAnalyticsPage.js';
import { StudentHomePage } from '../features/student/StudentHomePage.js';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-primary font-bold text-sm">
        Đang tải hệ thống DNU Smart Canteen...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user, isStudent } = useAuth();

  const getSmartRedirect = () => {
    if (!user) return <Navigate to="/auth/login" replace />;
    if (isStudent || user.userType === 'STUDENT' || user.roles?.includes('STUDENT')) {
      return <Navigate to="/student/home" replace />;
    }
    if (user.roles?.includes('CASHIER') && !user.roles?.includes('SUPER_ADMIN')) {
      return <Navigate to="/admin/pos" replace />;
    }
    if (user.roles?.includes('KITCHEN_STAFF') && !user.roles?.includes('SUPER_ADMIN')) {
      return <Navigate to="/admin/kitchen" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  };

  return (
    <Routes>
      {/* Root Redirection */}
      <Route path="/" element={isAuthenticated ? getSmartRedirect() : <Navigate to="/auth/login" replace />} />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* Admin SaaS Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={getSmartRedirect()} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="pos" element={<PosPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="kitchen" element={<KitchenPage />} />
        <Route path="foods" element={<FoodsPage />} />
        <Route path="categories" element={<FoodsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="suppliers" element={<InventoryPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="employees" element={<UsersPage />} />
        <Route path="finance" element={<DashboardPage />} />
        <Route path="promotions" element={<DashboardPage />} />
        <Route path="reviews" element={<DashboardPage />} />
        <Route path="reports" element={<DashboardPage />} />
        <Route path="ai-analytics" element={<AiAnalyticsPage />} />
        <Route path="settings" element={<DashboardPage />} />
      </Route>

      {/* Student Portal Mobile-First Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="/student/home" replace />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="menu" element={<StudentHomePage />} />
        <Route path="cart" element={<PosPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="profile" element={<StudentHomePage />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
