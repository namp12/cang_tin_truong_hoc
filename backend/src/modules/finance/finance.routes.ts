import { Router } from 'express';
import { FinanceController } from './finance.controller.js';

const router = Router();

router.get('/transactions', FinanceController.getTransactions);
router.post('/transactions', FinanceController.createTransaction);
router.get('/summary', FinanceController.getSummary);

export default router;
