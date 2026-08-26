import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Sheet, SheetHeader, SheetTitle, SheetClose } from '../../components/ui/sheet.js';
import { formatCurrency, formatDateTime } from '../../utils/format.js';
import { 
  Search, 
  Receipt, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChefHat, 
  Download,
  User,
  MapPin,
  CreditCard,
  Layers
} from 'lucide-react';

interface OrderItemRow {
  id: number;
  code: string;
  customerName: string;
  canteenName: string;
  tableNumber: string;
  itemsSummary: string;
  itemsDetail: { name: string; qty: number; price: number; note?: string }[];
  finalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
  paymentMethod: string;
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
      itemsDetail: [
        { name: 'Cơm Gà Xối Mỡ Giòn Da', qty: 1, price: 35000, note: 'Nhiều cơm' },
        { name: 'Trứng Ốp La', qty: 1, price: 6000 },
      ],
      finalAmount: 32800,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      paymentMethod: 'Ví MoMo QR',
      orderedAt: '2026-08-26 07:15:00',
    },
    {
      id: 2,
      code: 'ORD-20260826-0002',
      customerName: 'Lê Khánh Hòa (SV K21)',
      canteenName: 'Căng tin Khu A (H1)',
      tableNumber: 'Bàn A1-02',
      itemsSummary: '1× Phở Bò Tái Hà Nội',
      itemsDetail: [
        { name: 'Phở Bò Tái Hà Nội', qty: 1, price: 35000, note: 'Không hành tây' },
      ],
      finalAmount: 35000,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      paymentMethod: 'Tiền mặt',
      orderedAt: '2026-08-26 07:20:00',
    },
    {
      id: 16,
      code: 'ORD-20260826-0016',
      customerName: 'Cao Minh Trí (SV K21)',
      canteenName: 'Căng tin Khu A (H1)',
      tableNumber: 'Bàn A1-01',
      itemsSummary: '1× Cơm Gà Xối Mỡ Giòn Da',
      itemsDetail: [
        { name: 'Cơm Gà Xối Mỡ Giòn Da', qty: 1, price: 35000 },
      ],
      finalAmount: 35000,
      status: 'PREPARING',
      paymentStatus: 'PAID',
      paymentMethod: 'Ví SV Bách Khoa',
      orderedAt: '2026-08-26 12:45:00',
    },
    {
      id: 17,
      code: 'ORD-20260826-0017',
      customerName: 'Phan Hải Yến (SV K22)',
      canteenName: 'Căng tin Khu A (H1)',
      tableNumber: 'Bàn A1-02',
      itemsSummary: '1× Cơm Sườn Nướng Mật Ong',
      itemsDetail: [
        { name: 'Cơm Sườn Nướng Mật Ong', qty: 1, price: 35000 },
      ],
      finalAmount: 35000,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'Ví MoMo QR',
      orderedAt: '2026-08-26 12:48:00',
    },
    {
      id: 19,
      code: 'ORD-20260826-0019',
      customerName: 'Dương Thùy Linh (SV K21)',
      canteenName: 'Căng tin Khu A (H1)',
      tableNumber: 'Mang về',
      itemsSummary: '1× Cà Phê Sữa Đá',
      itemsDetail: [
        { name: 'Cà Phê Sữa Đá', qty: 1, price: 18000, note: 'Ít đường' },
      ],
      finalAmount: 18000,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      paymentMethod: 'Chưa thanh toán',
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
        return <Badge variant="outline" hasDot>Chờ xử lý</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive" hasDot>Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          <h2 className="text-xl font-bold text-foreground tracking-tight">Quản Lý Đơn Hàng</h2>
          <p className="text-xs text-muted-foreground">Theo dõi, lọc và xử lý toàn bộ các đơn hàng đặt trực tiếp và online</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
          Xuất Báo Cáo Đơn
        </Button>
      </div>

      {/* Filter Card */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã đơn hoặc tên khách..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/60 border border-input rounded-lg text-xs text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === st ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-muted text-muted-foreground hover:text-foreground'
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
              <tr className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">Mã Đơn</th>
                <th className="py-3.5 px-4">Khách Hàng / Vị Trí</th>
                <th className="py-3.5 px-4">Chi Tiết Món</th>
                <th className="py-3.5 px-4">Tổng Tiền</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4">Thanh Toán</th>
                <th className="py-3.5 px-4">Thời Gian</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs text-foreground">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold font-mono">{order.code}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-foreground">{order.customerName}</p>
                    <p className="text-[11px] text-primary font-medium">{order.tableNumber}</p>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-muted-foreground">{order.itemsSummary}</td>
                  <td className="py-3.5 px-4 font-bold text-foreground">{formatCurrency(order.finalAmount)}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'warning'} hasDot>
                      {order.paymentStatus === 'PAID' ? 'Đã thu' : 'Chưa thu'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">{formatDateTime(order.orderedAt)}</td>
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

      {/* Order Detail Sheet Drawer */}
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <div className="space-y-6">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle>Chi Tiết Đơn Hàng {selectedOrder.code}</SheetTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(selectedOrder.orderedAt)}</p>
                </div>
                <SheetClose onClick={() => setSelectedOrder(null)} />
              </div>
            </SheetHeader>

            {/* Order Timeline */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
              <h5 className="text-xs font-bold text-foreground">Hành Trình Đơn Hàng</h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Đã đặt hàng ({selectedOrder.orderedAt.slice(-8)})</span>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Đã xác nhận & thanh toán ({selectedOrder.paymentMethod})</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Đang nấu tại Bếp Căng tin Khu A</span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-foreground">Danh Sách Món Ăn</h5>
              <div className="divide-y divide-border border border-border rounded-xl p-3 bg-card space-y-2">
                {selectedOrder.itemsDetail.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                    <div>
                      <p className="font-bold text-foreground">{item.qty}× {item.name}</p>
                      {item.note && <p className="text-[11px] text-muted-foreground italic">Ghi chú: {item.note}</p>}
                    </div>
                    <span className="font-semibold text-foreground">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Location Info */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Khách hàng:</span>
                <span className="font-bold text-foreground">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Vị trí nhận món:</span>
                <span className="font-bold text-primary">{selectedOrder.tableNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Phương thức thanh toán:</span>
                <span className="font-bold text-foreground">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold text-foreground">
                <span>Tổng cộng:</span>
                <span className="text-base text-primary">{formatCurrency(selectedOrder.finalAmount)}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <Button onClick={() => setSelectedOrder(null)} variant="default" className="flex-1">
                In Hóa Đơn
              </Button>
              <Button onClick={() => setSelectedOrder(null)} variant="outline">
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
};
