export type RoleCode = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'CANTEEN_MANAGER' 
  | 'CASHIER' 
  | 'KITCHEN_STAFF' 
  | 'WAREHOUSE_MANAGER' 
  | 'ACCOUNTANT' 
  | 'STUDENT' 
  | 'TEACHER' 
  | 'STAFF';

export type UserType = 'STUDENT' | 'TEACHER' | 'EMPLOYEE' | 'ADMIN' | 'EXTERNAL';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  userType: UserType;
  roles: RoleCode[];
  canteenId?: number;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface DashboardStats {
  revenueToday: number;
  yesterdayRevenue: number;
  growthRate: number;
  totalOrdersToday: number;
  completedOrdersToday: number;
  inProgressOrdersToday: number;
  estimatedGrossProfit: number;
  activeCustomersToday: number;
  lowStockAlertsCount: number;
  expiringAlertsCount: number;
}

export interface RevenueChartData {
  date: string;
  day_name: string;
  orders: number;
  revenue: number;
  profit: number;
}

export interface OrderStatusPieData {
  name: string;
  value: number;
  color?: string;
}

export interface BestSellerFood {
  id: number;
  name: string;
  category_name: string;
  base_price: number;
  total_sold: number;
  total_revenue: number;
  thumbnail_url?: string;
}

export interface SystemAlert {
  id: number;
  type: 'DANGER' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  message: string;
  time: string;
}
