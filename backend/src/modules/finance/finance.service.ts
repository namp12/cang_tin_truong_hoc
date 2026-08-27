import { pool } from '../../config/database.js';

export class FinanceService {
  static async getTransactions() {
    try {
      const [rows] = await pool.query('SELECT * FROM finance_transactions ORDER BY created_at DESC');
      return rows;
    } catch (e) {
      return [];
    }
  }

  static async createTransaction(data: {
    code?: string;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    categoryLabel?: string;
    title: string;
    amount: number;
    paymentMethod?: string;
    paymentMethodLabel?: string;
    counterpart?: string;
    performedBy?: string;
    canteenName?: string;
    notes?: string;
  }) {
    const id = Date.now();
    const code = data.code || `${data.type === 'INCOME' ? 'PT' : 'PC'}-${Date.now().toString().slice(-4)}`;
    try {
      await pool.query(
        `INSERT INTO finance_transactions (id, code, type, category, category_label, title, amount, payment_method, payment_method_label, counterpart, performed_by, canteen_name, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          id,
          code,
          data.type,
          data.category,
          data.categoryLabel || data.category,
          data.title,
          data.amount,
          data.paymentMethod || 'CASH',
          data.paymentMethodLabel || 'Tiền mặt',
          data.counterpart || 'Khách hàng',
          data.performedBy || 'Admin',
          data.canteenName || 'Căng tin Tòa G',
          data.notes || '',
        ]
      );
      return { id, code, ...data };
    } catch (e) {
      return { id, code, ...data };
    }
  }

  static async getSummary() {
    try {
      const [incomeRows]: any = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM finance_transactions WHERE type = "INCOME"');
      const [expenseRows]: any = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM finance_transactions WHERE type = "EXPENSE"');

      const totalIncome = Number(incomeRows[0]?.total || 0);
      const totalExpense = Number(expenseRows[0]?.total || 0);
      const netBalance = totalIncome - totalExpense;

      return { totalIncome, totalExpense, netBalance };
    } catch (e) {
      return { totalIncome: 0, totalExpense: 0, netBalance: 0 };
    }
  }
}
