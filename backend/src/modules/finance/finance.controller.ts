import { Request, Response } from 'express';
import { FinanceService } from './finance.service.js';

export class FinanceController {
  static async getTransactions(req: Request, res: Response) {
    const data = await FinanceService.getTransactions();
    res.json({ success: true, data });
  }

  static async createTransaction(req: Request, res: Response) {
    const data = await FinanceService.createTransaction(req.body);
    res.status(201).json({ success: true, data });
  }

  static async getSummary(req: Request, res: Response) {
    const data = await FinanceService.getSummary();
    res.json({ success: true, data });
  }
}
