import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service.js';
import { ApiResponse } from '../../utils/response.js';

export class ReportsController {
  static async getDailyRevenueReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, startDate, endDate, branchId } = req.query;

      const dateStr = typeof date === 'string' ? date : undefined;
      const startDateStr = typeof startDate === 'string' ? startDate : undefined;
      const endDateStr = typeof endDate === 'string' ? endDate : undefined;
      const branchIdNum = branchId ? Number(branchId) : undefined;

      const reportData = await ReportsService.getDailyRevenueReport(
        dateStr,
        startDateStr,
        endDateStr,
        branchIdNum
      );

      return ApiResponse.success(res, reportData, 'Lấy báo cáo doanh thu kinh doanh thành công');
    } catch (error) {
      next(error);
    }
  }
}
