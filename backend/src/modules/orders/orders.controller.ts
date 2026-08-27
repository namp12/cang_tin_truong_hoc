import { Request, Response } from 'express';
import { pool } from '../../config/database.js';

// In-memory memory store as persistent cache if DB connection is offline
let memoryOrders: any[] = [
  {
    id: 1,
    code: 'ORD-20260826-0001',
    customerName: 'Nguyễn Thành Nam (SV CNTT K16)',
    canteenName: 'Căng tin Tòa G (Hà Đông)',
    tableNumber: 'Bàn G1-01',
    itemsSummary: '1× Cơm Rang Dưa Bò, 1× Trà Đào Cam Sả',
    itemsDetail: [
      { name: 'Cơm Rang Dưa Bò Hà Nội', qty: 1, price: 35000, note: 'Nhiều dưa chua' },
      { name: 'Trà Đào Cam Sả Hà Đông', qty: 1, price: 25000 },
    ],
    finalAmount: 45000,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'Ví DNU Pay',
    orderedAt: '2026-08-26 11:15:00',
  },
  {
    id: 2,
    code: 'ORD-20260826-0002',
    customerName: 'Lê Khánh Hòa (SV Dược K17)',
    canteenName: 'Căng tin Tòa G (Hà Đông)',
    tableNumber: 'Bàn G1-02',
    itemsSummary: '1× Phở Bò Tái Lăn DNU',
    itemsDetail: [
      { name: 'Phở Bò Tái Lăn DNU', qty: 1, price: 40000, note: 'Thêm quẩy giòn' },
    ],
    finalAmount: 40000,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'QR MoMo',
    orderedAt: '2026-08-26 11:22:00',
  },
  {
    id: 1029,
    code: 'ORD-20260827-1029',
    customerName: 'Trần Minh Đức (SV Kinh Tế K18)',
    canteenName: 'Căng tin Tòa G (Hà Đông)',
    tableNumber: 'Bàn G1-01',
    itemsSummary: '2× Cơm Rang Dưa Bò, 2× Trà Đào Cam Sả',
    itemsDetail: [
      { name: 'Cơm Rang Dưa Bò Hà Nội', qty: 2, price: 35000, note: 'Nhiều dưa chua, xào tái lăn' },
      { name: 'Trà Đào Cam Sả Hà Đông', qty: 2, price: 25000, note: 'Ít đường, nhiều đào miếng' },
    ],
    finalAmount: 120000,
    status: 'PREPARING',
    paymentStatus: 'PAID',
    paymentMethod: 'Ví DNU Pay',
    orderedAt: '2026-08-27 11:45:00',
  },
  {
    id: 1030,
    code: 'ORD-20260827-1030',
    customerName: 'Hoàng Thùy Linh (SV Ngôn Ngữ Anh K17)',
    canteenName: 'Căng tin Tòa G (Hà Đông)',
    tableNumber: 'Bàn G1-02',
    itemsSummary: '1× Phở Bò Tái Lăn, 1× Cà Phê Cốt Dừa',
    itemsDetail: [
      { name: 'Phở Bò Tái Lăn DNU', qty: 1, price: 40000, note: 'Nước béo, thêm quẩy giòn' },
      { name: 'Cà Phê Cốt Dừa Hà Nội', qty: 1, price: 25000 },
    ],
    finalAmount: 65000,
    status: 'WAITING',
    paymentStatus: 'PAID',
    paymentMethod: 'QR MoMo',
    orderedAt: '2026-08-27 11:48:00',
  },
  {
    id: 1031,
    code: 'ORD-20260827-1031',
    customerName: 'Bùi Anh Tuấn (SV Điều Dưỡng K16)',
    canteenName: 'Căng tin Tòa G (Hà Đông)',
    tableNumber: 'Mang Về (KTX Tòa A)',
    itemsSummary: '2× Bún Chả Nướng Than, 1× Bánh Mì Chảo',
    itemsDetail: [
      { name: 'Bún Chả Hà Nội Nướng Than', qty: 2, price: 35000, note: 'Nước chấm riêng, thêm ớt' },
      { name: 'Bánh Mì Chảo Đặc Biệt DNU', qty: 1, price: 30000, note: 'Trứng lòng đào' },
    ],
    finalAmount: 100000,
    status: 'WAITING',
    paymentStatus: 'PAID',
    paymentMethod: 'Ví DNU Pay',
    orderedAt: '2026-08-27 11:50:00',
  },
  {
    id: 1027,
    code: 'ORD-20260827-1027',
    customerName: 'Đỗ Văn Toàn (SV Du Lịch K17)',
    canteenName: 'Căng tin Tòa G (Hà Đông)',
    tableNumber: 'Bàn GD-01 (Khu Thể Thao)',
    itemsSummary: '2× Cơm Gà Xối Mỡ, 2× Trà Chanh Giã Tay',
    itemsDetail: [
      { name: 'Cơm Gà Xối Mỡ Giòn Da', qty: 2, price: 35000 },
      { name: 'Trà Chanh Giã Tay DNU', qty: 2, price: 18000 },
    ],
    finalAmount: 106000,
    status: 'READY',
    paymentStatus: 'PAID',
    paymentMethod: 'Tiền mặt',
    orderedAt: '2026-08-27 11:35:00',
  },
];

export class OrdersController {
  // GET /api/v1/orders
  static async getAllOrders(req: Request, res: Response) {
    try {
      const [rows]: any = await pool.query('SELECT * FROM orders ORDER BY id DESC LIMIT 100');
      if (rows && rows.length > 0) {
        return res.json({ success: true, data: rows });
      }
    } catch (e) {
      // Fallback to memory
    }
    return res.json({ success: true, data: memoryOrders });
  }

  // POST /api/v1/orders
  static async createOrder(req: Request, res: Response) {
    const orderData = req.body;
    const newOrder = {
      id: orderData.id || Date.now(),
      code: orderData.code || `ORD-${Date.now()}`,
      customerName: orderData.customerName || 'Khách Vãng Lai',
      canteenName: orderData.canteenName || 'Căng tin Tòa G (Hà Đông)',
      tableNumber: orderData.tableNumber || 'Bàn G1-01',
      itemsSummary: orderData.itemsSummary || orderData.itemsDetail?.map((i: any) => `${i.qty}× ${i.name}`).join(', ') || 'Món ăn',
      itemsDetail: orderData.itemsDetail || [],
      finalAmount: orderData.finalAmount || 0,
      status: orderData.status || 'WAITING',
      paymentStatus: orderData.paymentStatus || 'PAID',
      paymentMethod: orderData.paymentMethod || 'Tiền mặt',
      orderedAt: orderData.orderedAt || new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    try {
      await pool.query(
        `INSERT INTO orders (id, order_code, canteen_id, customer_name, table_number, final_amount, order_status, payment_status, payment_method, ordered_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [newOrder.id, newOrder.code, 1, newOrder.customerName, newOrder.tableNumber, newOrder.finalAmount, newOrder.status, newOrder.paymentStatus, newOrder.paymentMethod]
      );
    } catch (e) {
      // Fallback
    }

    memoryOrders = [newOrder, ...memoryOrders];
    return res.status(201).json({ success: true, data: newOrder });
  }

  // PATCH /api/v1/orders/:id/status
  static async updateOrderStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      await pool.query('UPDATE orders SET order_status = ? WHERE id = ?', [status, id]);
    } catch (e) {
      // Fallback
    }

    memoryOrders = memoryOrders.map((o) => (o.id.toString() === id.toString() ? { ...o, status } : o));

    return res.json({ success: true, message: `Đã cập nhật trạng thái đơn #${id} thành ${status}` });
  }
}
