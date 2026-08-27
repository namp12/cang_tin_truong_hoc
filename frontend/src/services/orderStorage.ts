import { dnuStore } from './dnuStore.js';

export interface OrderItem {
  id: number;
  code: string;
  customerName: string;
  canteenName: string;
  tableNumber: string;
  itemsSummary: string;
  itemsDetail: { name: string; qty: number; price: number; note?: string }[];
  finalAmount: number;
  status: 'PENDING' | 'WAITING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
  paymentMethod: string;
  orderedAt: string;
}

export interface KitchenTicket {
  id: number;
  orderNumber: string;
  table: string;
  customerName?: string;
  items: { name: string; qty: number; note?: string }[];
  status: 'WAITING' | 'PREPARING' | 'READY' | 'COMPLETED';
  orderTime: string;
  elapsedMinutes: number;
  completedAt?: string;
  isRealtimeNew?: boolean;
}

const STORAGE_ORDERS_KEY = 'dnu_canteen_orders_v2';
const STORAGE_TICKETS_KEY = 'dnu_canteen_kds_tickets_v2';

const initialOrders: OrderItem[] = [
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
    code: '#1029',
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
    code: '#1030',
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
    code: '#1031',
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
    code: '#1027',
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

const initialTickets: KitchenTicket[] = [
  {
    id: 1029,
    orderNumber: '#1029',
    table: 'Bàn G1-01',
    customerName: 'Trần Minh Đức (SV Kinh Tế K18)',
    items: [
      { name: 'Cơm Rang Dưa Bò Hà Nội', qty: 2, note: 'Nhiều dưa chua, xào tái lăn' },
      { name: 'Trà Đào Cam Sả Hà Đông', qty: 2, note: 'Ít đường, nhiều đào miếng' },
    ],
    status: 'PREPARING',
    orderTime: '11:45',
    elapsedMinutes: 8,
  },
  {
    id: 1030,
    orderNumber: '#1030',
    table: 'Bàn G1-02',
    customerName: 'Hoàng Thùy Linh (SV Ngôn Ngữ Anh K17)',
    items: [
      { name: 'Phở Bò Tái Lăn DNU', qty: 1, note: 'Nước béo, thêm quẩy giòn' },
      { name: 'Cà Phê Cốt Dừa Hà Nội', qty: 1 },
    ],
    status: 'WAITING',
    orderTime: '11:48',
    elapsedMinutes: 5,
  },
  {
    id: 1031,
    orderNumber: '#1031',
    table: 'Mang Về (KTX Tòa A)',
    customerName: 'Bùi Anh Tuấn (SV Điều Dưỡng K16)',
    items: [
      { name: 'Bún Chả Hà Nội Nướng Than', qty: 2, note: 'Nước chấm riêng, thêm ớt' },
      { name: 'Bánh Mì Chảo Đặc Biệt DNU', qty: 1, note: 'Trứng lòng đào' },
    ],
    status: 'WAITING',
    orderTime: '11:50',
    elapsedMinutes: 3,
  },
  {
    id: 1027,
    orderNumber: '#1027',
    table: 'Bàn GD-01 (Khu Thể Thao)',
    customerName: 'Đỗ Văn Toàn (SV Du Lịch K17)',
    items: [
      { name: 'Cơm Gà Xối Mỡ Giòn Da', qty: 2 },
      { name: 'Trà Chanh Giã Tay DNU', qty: 2 },
    ],
    status: 'READY',
    orderTime: '11:35',
    elapsedMinutes: 18,
  },
];

export const orderStorage = {
  getOrders(): OrderItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return initialOrders;
  },

  saveOrders(orders: OrderItem[]) {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  },

  getKitchenTickets(): KitchenTicket[] {
    try {
      const stored = localStorage.getItem(STORAGE_TICKETS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return initialTickets;
  },

  saveKitchenTickets(tickets: KitchenTicket[]) {
    try {
      localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  },

  addOrder(order: OrderItem) {
    const orders = this.getOrders();
    const updatedOrders = [order, ...orders.filter((o) => o.id !== order.id)];
    this.saveOrders(updatedOrders);

    // Also add to kitchen tickets
    const tickets = this.getKitchenTickets();
    const newTicket: KitchenTicket = {
      id: order.id,
      orderNumber: order.code,
      table: order.tableNumber,
      customerName: order.customerName,
      items: order.itemsDetail.map((i) => ({ name: i.name, qty: i.qty, note: i.note })),
      status: 'WAITING',
      orderTime: new Date().toLocaleTimeString().slice(0, 5),
      elapsedMinutes: 0,
      isRealtimeNew: true,
    };
    const updatedTickets = [newTicket, ...tickets.filter((t) => t.id !== order.id)];
    this.saveKitchenTickets(updatedTickets);

    // Auto deduct ingredients from warehouse stock based on Recipe BOM
    try {
      dnuStore.deductIngredientsForOrder(order.code, order.itemsDetail);
    } catch (e) {
      console.warn('Auto stock deduction warning:', e);
    }

    // Also sync to backend API in background
    try {
      fetch('http://localhost:5000/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      }).catch(() => {});
    } catch (e) {}

    return { order, ticket: newTicket };
  },

  updateTicketStatus(ticketId: number, nextStatus: KitchenTicket['status']) {
    // 1. Update Kitchen Tickets
    const tickets = this.getKitchenTickets();
    const updatedTickets = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: nextStatus,
          isRealtimeNew: false,
          completedAt: nextStatus === 'COMPLETED' ? new Date().toLocaleTimeString().slice(0, 5) : t.completedAt,
        };
      }
      return t;
    });
    this.saveKitchenTickets(updatedTickets);

    // 2. Synchronize Orders
    const orders = this.getOrders();
    const updatedOrders = orders.map((o) => {
      if (o.id === ticketId || o.code === `#${ticketId}`) {
        return {
          ...o,
          status: (nextStatus as OrderItem['status']),
        };
      }
      return o;
    });
    this.saveOrders(updatedOrders);

    // 3. Sync to backend API in background
    try {
      fetch(`http://localhost:5000/api/v1/orders/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      }).catch(() => {});
    } catch (e) {}

    return { tickets: updatedTickets, orders: updatedOrders };
  },

  getStudentOrderedFoods(studentFullName?: string, studentUsername?: string): { foodName: string; orderCode: string; orderDate: string }[] {
    const orders = this.getOrders();
    const nameLower = (studentFullName || '').toLowerCase();
    const userLower = (studentUsername || '').toLowerCase();

    const studentOrders = orders.filter((o) => {
      if (o.status !== 'COMPLETED') return false;
      const cLower = (o.customerName || '').toLowerCase();
      return (
        (nameLower && cLower.includes(nameLower)) ||
        (userLower && cLower.includes(userLower)) ||
        cLower.includes('nguyễn thành nam') ||
        cLower.includes('sinh viên dnu') ||
        cLower.includes('sv cntt')
      );
    });

    const orderedFoods: { foodName: string; orderCode: string; orderDate: string }[] = [];
    studentOrders.forEach((o) => {
      o.itemsDetail.forEach((item) => {
        if (!orderedFoods.some((f) => f.foodName.toLowerCase() === item.name.toLowerCase())) {
          orderedFoods.push({
            foodName: item.name,
            orderCode: o.code,
            orderDate: o.orderedAt,
          });
        }
      });
    });

    return orderedFoods;
  },
};
