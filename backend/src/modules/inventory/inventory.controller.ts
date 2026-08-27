import { Request, Response } from 'express';
import { InventoryService } from './inventory.service.js';

export class InventoryController {
  static async getStocks(req: Request, res: Response) {
    const data = await InventoryService.getStocks();
    res.json({ success: true, data });
  }

  static async getKitchenRequisitions(req: Request, res: Response) {
    const data = await InventoryService.getKitchenRequisitions();
    res.json({ success: true, data });
  }

  static async createKitchenRequisition(req: Request, res: Response) {
    const data = await InventoryService.createKitchenRequisition(req.body);
    res.status(201).json({ success: true, data });
  }

  static async approveRequisition(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await InventoryService.approveRequisition(id);
    res.json({ success: true, result });
  }

  static async getInboundReceipts(req: Request, res: Response) {
    const data = await InventoryService.getInboundReceipts();
    res.json({ success: true, data });
  }

  static async getOutboundIssues(req: Request, res: Response) {
    const data = await InventoryService.getOutboundIssues();
    res.json({ success: true, data });
  }
}
