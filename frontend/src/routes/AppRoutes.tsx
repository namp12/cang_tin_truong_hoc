import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { AdminLayout } from '../components/layout/AdminLayout.js';
import { StudentLayout } from '../components/layout/StudentLayout.js';
import { LoginPage } from '../features/auth/LoginPage.js';
import { DashboardPage } from '../features/dashboard/DashboardPage.js';
import { PosPage } from '../features/pos/PosPage.js';
import { OrdersPage } from '../features/orders/OrdersPage.js';
import { KitchenPage } from '../features/kitchen/KitchenPage.js';
import { FoodsPage } from '../features/foods/FoodsPage.js';
import { InventoryPage } from '../features/inventory/InventoryPage.js';
import { StudentHomePage } from '../features/student/StudentHomePage.js';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-emerald-400 font-bold text-sm">
        Đang khởi động hệ thống Smart Canteen...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isStudent } = useAuth();

  return (
    <Routes>
      {/* Root Redirection */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            isStudent ? <Navigate to="/student/home" replace /> : <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />

      {/* Admin SaaS Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="pos" element={<PosPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="kitchen" element={<KitchenPage />} />
        <Route path="foods" element={<FoodsPage />} />
        <Route path="categories" element={<FoodsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="suppliers" element={<InventoryPage />} />
        <Route path="employees" element={<DashboardPage />} />
        <Route path="finance" element={<DashboardPage />} />
        <Route path="promotions" element={<DashboardPage />} />
        <Route path="reviews" element={<DashboardPage />} />
        <Route path="reports" element={<DashboardPage />} />
        <Route path="ai-analytics" element={<DashboardPage />} />
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
