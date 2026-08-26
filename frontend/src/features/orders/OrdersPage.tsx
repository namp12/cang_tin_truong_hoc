import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { formatCurrency, formatDateTime } from '../../utils/format.js';
import { 
  Search, 
  Receipt, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChefHat, 
  Filter,
  Download
} from 'lucide-react';

interface OrderItemRow {
  id: number;
  code: string;
  customerName: string;
  canteenName: string;
  tableNumber: string;
  itemsSummary: string;
  finalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
  orderedAt: string;
}

export const OrdersPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderItemRow | null>(null);

  const orders: OrderItemRow[] = [
    {
      id: 1,
      code: 'ORD-20260826-0001',
      customerName: 'Nguyễn Thành Nam (SV K21)',
      canteenName: 'Căng tin Khu A (H1)',
      tableNumber: 'Bàn A1-01',
      itemsSummary: '1× Cơm Gà Xối Mỡ, 1× Trứng ốp la',
      finalAmount: 32800,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      orderedAt: '2026-08-26 07:15:00',
    },
    {
      id: 2,
      code: 'ORD-20260826-0002',
      customerName: 'Lê Khánh Hòa (SV K21)',
      canteenName: 'Căng tin Khu A (H1)',
      tableNumber: 'Bàn A1-02',
      itemsSummary: '1× Phở Bò Tái Hà Nội',
      finalAmount: 35000,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      orderedAt: '2026-08-26 07:20:00',
    },
    {
      id: 16,
      code: 'ORD-20260826-0016',
      customerName: 'Cao Minh Trí (SV K21)',
      canteenName: 'Căng tin Khu A (H1)',
      tableNumber: 'Bàn A1-01',
      itemsSummary: '1× Cơm Gà Xối Mỡ Giòn Da',
      finalAmount: 35000,
      status: 'PREPARING',
      paymentStatus: 'PAID',
      orderedAt: '2026-08-26 12:45:00',
    },
    {
      id: 17,
      code: 'ORD-20260826-0017',
      customerName: 'Phan Hải Yến (SV K22)',
      canteenName: 'Căng tin Khu A (H1)',
      tableNumber: 'Bàn A1-02',
      itemsSummary: '1× Cơm Sườn Nướng Mật Ong',
      finalAmount: 35000,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      orderedAt: '2026-08-26 12:48:00',
    },
    {
      id: 19,
      code: 'ORD-20260826-0019',
      customerName: 'Dương Thùy Linh (SV K21)',
      canteenName: 'Căng tin Khu A (H1)',
      tableNumber: 'Mang về',
      itemsSummary: '1× Cà Phê Sữa Đá',
      finalAmount: 18000,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      orderedAt: '2026-08-26 12:52:00',
    },
  ];

  const getStatusBadge = (status: OrderItemRow['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success" hasDot>Hoàn thành</Badge>;
      case 'PREPARING':
        return <Badge variant="info" hasDot>Đang nấu</Badge>;
      case 'CONFIRMED':
        return <Badge variant="warning" hasDot>Đã xác nhận</Badge>;
      case 'PENDING':
        return <Badge variant="neutral" hasDot>Chờ xử lý</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger" hasDot>Đã hủy</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchSearch =
      o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quản Lý Đơn Hàng</h2>
          <p className="text-xs text-slate-500">Theo dõi, lọc và xử lý toàn bộ các đơn hàng đặt trực tiếp và online</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
          Xuất Báo Cáo Đơn
        </Button>
      </div>

      {/* Filter Card */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã đơn hoặc tên khách..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === st ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'Tất cả' : st}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Mã Đơn</th>
                <th className="py-3.5 px-4">Khách Hàng / Bàn</th>
                <th className="py-3.5 px-4">Chi Tiết Món</th>
                <th className="py-3.5 px-4">Tổng Tiền</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4">Thanh Toán</th>
                <th className="py-3.5 px-4">Thời Gian</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{order.code}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{order.customerName}</p>
                    <p className="text-[11px] text-emerald-600 font-medium">{order.tableNumber}</p>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate">{order.itemsSummary}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(order.finalAmount)}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'warning'} size="sm">
                      {order.paymentStatus === 'PAID' ? 'Đã thu' : 'Chưa thu'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDateTime(order.orderedAt)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Button onClick={() => setSelectedOrder(order)} variant="ghost" size="sm">
                      <Eye className="w-3.5 h-3.5 mr-1" /> Chi Tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-800">{selectedOrder.code}</h4>
                <p className="text-xs text-slate-500">{formatDateTime(selectedOrder.orderedAt)}</p>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            <div className="space-y-2 text-xs">
              <p><span className="font-bold text-slate-700">Khách hàng:</span> {selectedOrder.customerName}</p>
              <p><span className="font-bold text-slate-700">Vị trí phục vụ:</span> {selectedOrder.tableNumber}</p>
              <p><span className="font-bold text-slate-700">Món đã đặt:</span> {selectedOrder.itemsSummary}</p>
              <p><span className="font-bold text-slate-700">Tổng thanh toán:</span> <span className="font-bold text-emerald-600 text-sm">{formatCurrency(selectedOrder.finalAmount)}</span></p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setSelectedOrder(null)} variant="primary" size="sm">
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
