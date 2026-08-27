import { Router } from 'express';
import { ReportsController } from './reports.controller.js';

const router = Router();

// GET /api/v1/reports/daily-revenue?date=YYYY-MM-DD
router.get('/daily-revenue', ReportsController.getDailyRevenueReport);

export default router;
