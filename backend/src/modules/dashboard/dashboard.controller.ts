import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service.js';
import { ApiResponse } from '../../utils/response.js';

export class DashboardController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const canteenId = Number(req.query.canteenId) || req.user?.canteenId || 1;
      const data = await DashboardService.getStats(canteenId);
      return ApiResponse.success(res, data, 'Lấy thống kê thành công');
    } catch (error) {
      next(error);
    }
  }

  static async getRevenueChart(req: Request, res: Response, next: NextFunction) {
    try {
      const canteenId = Number(req.query.canteenId) || req.user?.canteenId || 1;
      const data = await DashboardService.getRevenueChart(canteenId);
      return ApiResponse.success(res, data, 'Lấy biểu đồ doanh thu thành công');
    } catch (error) {
      next(error);
    }
  }

  static async getOrderStatusDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const canteenId = Number(req.query.canteenId) || req.user?.canteenId || 1;
      const data = await DashboardService.getOrderStatusDistribution(canteenId);
      return ApiResponse.success(res, data, 'Lấy tỷ lệ trạng thái đơn thành công');
    } catch (error) {
      next(error);
    }
  }

  static async getBestSellers(req: Request, res: Response, next: NextFunction) {
    try {
      const canteenId = Number(req.query.canteenId) || req.user?.canteenId || 1;
      const limit = Number(req.query.limit) || 5;
      const data = await DashboardService.getBestSellers(canteenId, limit);
      return ApiResponse.success(res, data, 'Lấy danh sách món bán chạy thành công');
    } catch (error) {
      next(error);
    }
  }

  static async getAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getSystemAlerts();
      return ApiResponse.success(res, data, 'Lấy cảnh báo hệ thống thành công');
    } catch (error) {
      next(error);
    }
  }
}
