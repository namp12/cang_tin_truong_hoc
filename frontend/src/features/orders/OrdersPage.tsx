import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Sheet, SheetHeader, SheetTitle, SheetClose } from '../../components/ui/sheet.js';
import { useSocket } from '../../contexts/SocketContext.js';
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
  Layers,
  Wifi
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
  const { latestOrder, latestStatusUpdate, isConnected } = useSocket();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderItemRow | null>(null);

  const [orders, setOrders] = useState<OrderItemRow[]>([
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
      orderedAt: '2026-08-26 11:20:00',
    },
    {
      id: 16,
      code: 'ORD-20260826-0016',
      customerName: 'Cao Minh Trí (SV QTKD K18)',
      canteenName: 'Căng tin Tòa G (Hà Đông)',
      tableNumber: 'Bàn G1-03',
      itemsSummary: '1× Bún Chả Hà Nội Nướng Than, 1× Trà Tắc',
      itemsDetail: [
        { name: 'Bún Chả Hà Nội Nướng Than', qty: 1, price: 35000 },
        { name: 'Trà Quất Mật Ong Hoa Nhài', qty: 1, price: 15000 },
      ],
      finalAmount: 35000,
      status: 'PREPARING',
      paymentStatus: 'PAID',
      paymentMethod: 'Ví DNU Pay',
      orderedAt: '2026-08-26 11:45:00',
    },
    {
      id: 17,
      code: 'ORD-20260826-0017',
      customerName: 'Phan Hải Yến (SV Y Khoa K17)',
      canteenName: 'Căng tin Tòa G (Hà Đông)',
      tableNumber: 'Bàn G1-04',
      itemsSummary: '1× Bánh Mì Chảo DNU, 1× Cà Phê Cốt Dừa',
      itemsDetail: [
        { name: 'Bánh Mì Chảo Đặc Biệt DNU', qty: 1, price: 30000 },
        { name: 'Cà Phê Cốt Dừa Hà Nội', qty: 1, price: 25000 },
      ],
      finalAmount: 45000,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'QR MoMo',
      orderedAt: '2026-08-26 11:48:00',
    },
    {
      id: 19,
      code: 'ORD-20260826-0019',
      customerName: 'Dương Thùy Linh (SV Truyền Thông K18)',
      canteenName: 'Căng tin Tòa A-B DNU',
      tableNumber: 'Mang về (KTX)',
      itemsSummary: '1× Trà Chanh Giã Tay DNU',
      itemsDetail: [
        { name: 'Trà Chanh Giã Tay DNU', qty: 1, price: 18000, note: 'Ít ngọt' },
      ],
      finalAmount: 18000,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      paymentMethod: 'Tiền mặt',
      orderedAt: '2026-08-26 11:55:00',
    },
  ]);

  // Listen to new orders created in realtime via WebSocket
  useEffect(() => {
    if (latestOrder) {
      const newRow: OrderItemRow = {
        id: latestOrder.orderId,
        code: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${latestOrder.orderNumber.replace('#', '')}`,
        customerName: latestOrder.customerName,
        canteenName: 'Căng tin Tòa G (Hà Đông)',
        tableNumber: latestOrder.tableNumber,
        itemsSummary: latestOrder.items.map((i) => `${i.qty}× ${i.name}`).join(', '),
        itemsDetail: latestOrder.items,
        finalAmount: latestOrder.totalAmount,
        status: latestOrder.status,
        paymentStatus: 'PAID',
        paymentMethod: 'Quầy POS / DNU Pay',
        orderedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };

      setOrders((prev) => [newRow, ...prev]);
    }
  }, [latestOrder]);

  // Listen to status changes from Kitchen
  useEffect(() => {
    if (latestStatusUpdate) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === latestStatusUpdate.orderId || o.code.includes(latestStatusUpdate.orderNumber.replace('#', ''))
            ? { ...o, status: latestStatusUpdate.status as OrderItemRow['status'] }
            : o
        )
      );
    }
  }, [latestStatusUpdate]);

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
