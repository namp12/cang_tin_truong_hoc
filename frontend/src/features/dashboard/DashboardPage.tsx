import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { dashboardApi } from '../../services/dashboard.service.js';
import { 
  DashboardStats, 
  RevenueChartData, 
  OrderStatusPieData, 
  BestSellerFood, 
  SystemAlert 
} from '../../types/index.js';
import { formatCurrency, formatNumber } from '../../utils/format.js';
import { KpiCard } from './KpiCard.js';
import { RevenueChart } from './RevenueChart.js';
import { OrderStatusChart } from './OrderStatusChart.js';
import { TopFoodsTable } from './TopFoodsTable.js';
import { AlertsCard } from './AlertsCard.js';
import { Button } from '../../components/ui/Button.js';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  AlertOctagon, 
  PlusCircle, 
  PackagePlus, 
  FileText,
  RotateCw,
  Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatusPieData[]>([]);
  const [bestSellers, setBestSellers] = useState<BestSellerFood[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [s, rc, os, bs, al] = await Promise.all([
        dashboardApi.getStats(1),
        dashboardApi.getRevenueChart(1),
        dashboardApi.getOrderStatusDistribution(1),
        dashboardApi.getBestSellers(1, 5),
        dashboardApi.getAlerts(),
      ]);
      setStats(s);
      setRevenueChart(rc);
      setOrderStatus(os);
      setBestSellers(bs);
      setAlerts(al);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ● Hệ thống hoạt động bình thường
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Xin chào, {user?.fullName || 'Quản trị viên DNU'} 👋
          </h2>
          <p className="text-xs text-slate-300">
            Tổng quan tình hình kinh doanh Căng tin Tòa G (Đại Học Đại Nam - Hà Đông) hôm nay.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => navigate('/admin/pos')}
            variant="primary"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Tạo Đơn POS
          </Button>
          <Button
            onClick={() => navigate('/admin/inventory')}
            variant="outline"
            size="sm"
            className="text-slate-200 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white"
            leftIcon={<PackagePlus className="w-4 h-4" />}
          >
            Nhập Kho
          </Button>
          <Button
            onClick={fetchDashboardData}
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:bg-slate-800 hover:text-white"
            title="Làm mới dữ liệu"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          title="Doanh Thu Hôm Nay"
          value={formatCurrency(stats?.revenueToday)}
          growthRate={stats?.growthRate}
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
          iconBgColor="bg-emerald-50 text-emerald-600"
        />

        <KpiCard
          title="Tổng Số Đơn Hàng"
          value={`${formatNumber(stats?.totalOrdersToday)} đơn`}
          subtext={`${stats?.completedOrdersToday || 0} hoàn thành • ${stats?.inProgressOrdersToday || 0} đang nấu`}
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-50 text-blue-600"
        />

        <KpiCard
          title="Lợi Nhuận Gộp (Tạm tính)"
          value={formatCurrency(stats?.estimatedGrossProfit)}
          subtext="Biên lợi nhuận gộp ~45%"
          icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
          iconBgColor="bg-indigo-50 text-indigo-600"
        />

        <KpiCard
          title="Cảnh Báo Vận Hành"
          value={`${(stats?.lowStockAlertsCount || 0) + (stats?.expiringAlertsCount || 0)} cảnh báo`}
          subtext={`${stats?.lowStockAlertsCount || 0} sắp hết • ${stats?.expiringAlertsCount || 0} sắp hết hạn`}
          icon={<AlertOctagon className="w-6 h-6 text-amber-600" />}
          iconBgColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueChart} />
        </div>
        <div className="lg:col-span-1">
          <OrderStatusChart data={orderStatus} />
        </div>
      </div>

      {/* Bottom Tables & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopFoodsTable foods={bestSellers} />
        <AlertsCard alerts={alerts} />
      </div>
    </div>
  );
};
