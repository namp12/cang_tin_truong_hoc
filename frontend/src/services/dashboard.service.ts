import { apiClient } from './api.js';
import { 
  DashboardStats, 
  RevenueChartData, 
  OrderStatusPieData, 
  BestSellerFood, 
  SystemAlert 
} from '../types/index.js';

export const dashboardApi = {
  getStats: async (canteenId: number = 1): Promise<DashboardStats> => {
    const res: any = await apiClient.get('/dashboard/stats', { params: { canteenId } });
    return res.data;
  },

  getRevenueChart: async (canteenId: number = 1): Promise<RevenueChartData[]> => {
    const res: any = await apiClient.get('/dashboard/revenue-chart', { params: { canteenId } });
    return res.data;
  },

  getOrderStatusDistribution: async (canteenId: number = 1): Promise<OrderStatusPieData[]> => {
    const res: any = await apiClient.get('/dashboard/order-status-distribution', { params: { canteenId } });
    return res.data;
  },

  getBestSellers: async (canteenId: number = 1, limit: number = 5): Promise<BestSellerFood[]> => {
    const res: any = await apiClient.get('/dashboard/best-sellers', { params: { canteenId, limit } });
    return res.data;
  },

  getAlerts: async (): Promise<SystemAlert[]> => {
    const res: any = await apiClient.get('/dashboard/alerts');
    return res.data;
  },
};
