import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateJwt);

router.get('/stats', DashboardController.getStats);
router.get('/revenue-chart', DashboardController.getRevenueChart);
router.get('/order-status-distribution', DashboardController.getOrderStatusDistribution);
router.get('/best-sellers', DashboardController.getBestSellers);
router.get('/alerts', DashboardController.getAlerts);

export default router;
