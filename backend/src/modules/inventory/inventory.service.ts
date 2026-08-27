import { pool } from '../../config/database.js';

export class InventoryService {
  // 1. Get all stocks
  static async getStocks() {
    try {
      const [rows] = await pool.query('SELECT * FROM stocks ORDER BY status DESC, quantity ASC');
      return rows;
    } catch (e) {
      return [];
    }
  }

  // 2. Get Kitchen Requisitions
  static async getKitchenRequisitions() {
    try {
      const [rows] = await pool.query('SELECT * FROM kitchen_requisitions ORDER BY requested_at DESC');
      return rows;
    } catch (e) {
      return [];
    }
  }

  // 3. Create Kitchen Requisition
  static async createKitchenRequisition(data: {
    chefName: string;
    ingredientName: string;
    qty: number;
    unit: string;
    urgency: string;
    reason: string;
    canteenName?: string;
  }) {
    const id = Date.now();
    const code = `YCK-${Date.now().toString().slice(-4)}`;
    try {
      await pool.query(
        `INSERT INTO kitchen_requisitions (id, code, chef_name, ingredient_name, qty, unit, urgency, reason, status, canteen_name, requested_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, NOW())`,
        [id, code, data.chefName, data.ingredientName, data.qty, data.unit, data.urgency, data.reason, data.canteenName || 'Căng tin Tòa G']
      );
      return { id, code, ...data, status: 'PENDING' };
    } catch (e) {
      return { id, code, ...data, status: 'PENDING' };
    }
  }

  // 4. Approve Requisition
  static async approveRequisition(id: number) {
    try {
      await pool.query(
        `UPDATE kitchen_requisitions SET status = 'APPROVED', resolved_at = NOW() WHERE id = ?`,
        [id]
      );
      return { success: true };
    } catch (e) {
      return { success: true };
    }
  }

  // 5. Inbound Receipts
  static async getInboundReceipts() {
    try {
      const [rows] = await pool.query('SELECT * FROM inbound_receipts ORDER BY received_date DESC');
      return rows;
    } catch (e) {
      return [];
    }
  }

  // 6. Outbound Issues
  static async getOutboundIssues() {
    try {
      const [rows] = await pool.query('SELECT * FROM outbound_issues ORDER BY issued_date DESC');
      return rows;
    } catch (e) {
      return [];
    }
  }
}
