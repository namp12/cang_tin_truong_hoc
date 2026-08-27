import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Sheet, SheetHeader, SheetTitle, SheetClose } from '../../components/ui/sheet.js';
import { ReceiptModal, ReceiptData } from '../../components/common/ReceiptModal.js';
import { useSocket } from '../../contexts/SocketContext.js';
import { orderStorage, OrderItem } from '../../services/orderStorage.js';
import { formatCurrency, formatDateTime } from '../../utils/format.js';
import { 
  Search, 
  Receipt, 
  Eye, 
  Printer,
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChefHat, 
  Download,
  User,
  MapPin,
  CreditCard,
  Layers,
  Wifi,
  CheckCheck
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { latestOrder, latestStatusUpdate, isConnected, emitStatusUpdate } = useSocket();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const [orders, setOrders] = useState<OrderItem[]>(() => orderStorage.getOrders());

  const handlePrintOrder = (order: OrderItem) => {
    const sub = order.itemsDetail.reduce((s, i) => s + i.price * i.qty, 0);
    const disc = Math.max(0, sub - order.finalAmount);

    setReceiptData({
      orderNumber: order.code,
      orderTime: order.orderedAt,
      cashierName: 'Phạm Quỳnh Như (Quầy POS Tòa G)',
      canteenName: order.canteenName,
      tableNumber: order.tableNumber,
      customerName: order.customerName,
      items: order.itemsDetail,
      subtotal: sub,
      discount: disc,
      finalTotal: order.finalAmount,
      paymentMethod: order.paymentMethod,
    });
    setShowReceipt(true);
  };

  // Listen to incoming WebSocket orders
  useEffect(() => {
    if (latestOrder) {
      const exists = orders.some((o) => o.id === latestOrder.orderId);
      if (!exists) {
        const { order } = orderStorage.addOrder({
          id: latestOrder.orderId,
          code: latestOrder.orderNumber,
          customerName: latestOrder.customerName || 'Khách Quầy POS / App',
          canteenName: 'Căng tin Tòa G (Hà Đông)',
          tableNumber: latestOrder.tableNumber,
          itemsSummary: latestOrder.items.map((i) => `${i.qty}× ${i.name}`).join(', '),
          itemsDetail: latestOrder.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price || 30000, note: i.note })),
          finalAmount: latestOrder.totalAmount || 50000,
          status: 'PREPARING',
          paymentStatus: 'PAID',
          paymentMethod: 'Ví DNU Pay',
          orderedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        });
        setOrders((prev) => [order, ...prev]);
      }
    }
  }, [latestOrder]);

  // Listen to status changes from Kitchen & sync
  useEffect(() => {
    if (latestStatusUpdate) {
      const { orders: updated } = orderStorage.updateTicketStatus(
        latestStatusUpdate.orderId,
        latestStatusUpdate.status as any
      );
      setOrders(updated);
    }
  }, [latestStatusUpdate]);

  const handleChangeStatus = (orderId: number, nextStatus: OrderItem['status']) => {
    const { orders: updated } = orderStorage.updateTicketStatus(orderId, nextStatus as any);
    setOrders(updated);

    const target = updated.find((o) => o.id === orderId);
    if (target) {
      emitStatusUpdate(orderId, target.code, nextStatus, 1);
    }
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: nextStatus });
    }
  };

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success" hasDot>Đã trả món (Xong)</Badge>;
      case 'READY':
        return <Badge variant="success" hasDot>Sẵn sàng</Badge>;
      case 'PREPARING':
        return <Badge variant="info" hasDot>Bếp đang nấu</Badge>;
      case 'WAITING':
      case 'CONFIRMED':
        return <Badge variant="warning" hasDot>Chờ chế biến</Badge>;
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
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Quản Lý Đơn Hàng Căng Tin DNU</span>
            <Badge variant="primary" className="text-xs font-mono">
              {orders.length} đơn
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Theo dõi đơn hàng tại quầy POS, Kiosk, Cổng sinh viên và cập nhật trạng thái chế biến theo thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" className="bg-emerald-600 text-white flex items-center gap-1 text-xs py-1">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span>{isConnected ? 'Realtime DB Active' : 'Offline Cached'}</span>
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã đơn, tên sinh viên..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/60 border border-input rounded-lg text-xs text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'WAITING', label: 'Chờ nấu' },
              { id: 'PREPARING', label: 'Đang nấu' },
              { id: 'READY', label: 'Sẵn sàng' },
              { id: 'COMPLETED', label: 'Đã hoàn tất / Đã trả món' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === st.id
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {st.label}
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
                <th className="py-3.5 px-4">Khách Hàng</th>
                <th className="py-3.5 px-4">Vị Trí / Bàn</th>
                <th className="py-3.5 px-4">Món Ăn</th>
                <th className="py-3.5 px-4">Tổng Tiền</th>
                <th className="py-3.5 px-4">Thanh Toán</th>
                <th className="py-3.5 px-4">Trạng Thái Bếp</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs text-foreground">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{order.code}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-foreground">{order.customerName}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{formatDateTime(order.orderedAt)}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium">{order.tableNumber}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-foreground line-clamp-1 max-w-[220px]">{order.itemsSummary}</p>
                    <p className="text-[11px] text-muted-foreground">{order.itemsDetail.length} món</p>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-foreground font-mono">
                    {formatCurrency(order.finalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {order.paymentStatus === 'PAID' ? 'Đã thu tiền' : 'Chưa thanh toán'}
                      </span>
                      <p className="text-[10px] text-muted-foreground">{order.paymentMethod}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {order.status === 'READY' && (
                        <button
                          onClick={() => handleChangeStatus(order.id, 'COMPLETED')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1"
                          title="Xác nhận trả món cho khách"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>Trả món</span>
                        </button>
                      )}

                      <button
                        onClick={() => handlePrintOrder(order)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="In hóa đơn K80"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
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
          <div className="space-y-6 text-xs">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="text-sm font-bold">Chi Tiết Đơn Hàng {selectedOrder.code}</SheetTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(selectedOrder.orderedAt)}</p>
                </div>
                <SheetClose onClick={() => setSelectedOrder(null)} />
              </div>
            </SheetHeader>

            {/* Quick Status Bar */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
              <div>
                <span className="text-muted-foreground">Trạng thái:</span>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div className="flex gap-1.5">
                {selectedOrder.status !== 'COMPLETED' && (
                  <Button
                    onClick={() => handleChangeStatus(selectedOrder.id, 'COMPLETED')}
                    variant="default"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
                  >
                    <CheckCheck className="w-3.5 h-3.5 mr-1" />
                    Đã Trả Món
                  </Button>
                )}
              </div>
            </div>

            {/* Items Summary Table */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-foreground">Danh Sách Món Ăn</h5>
              <div className="p-3 rounded-xl bg-card border border-border space-y-2 text-xs">
                {selectedOrder.itemsDetail.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      {item.note && <p className="text-[11px] text-amber-600 dark:text-amber-400">Ghi chú: {item.note}</p>}
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-muted-foreground mr-3">x{item.qty}</span>
                      <span className="font-bold text-foreground font-mono">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-1.5 text-xs p-3 bg-muted/20 rounded-xl border border-border">
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
                <span>Tổng tiền:</span>
                <span className="text-base text-primary font-mono">{formatCurrency(selectedOrder.finalAmount)}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <Button onClick={() => handlePrintOrder(selectedOrder)} variant="default" className="flex-1 font-bold">
                <Printer className="w-3.5 h-3.5 mr-1" /> In Hóa Đơn (K80)
              </Button>
              <Button onClick={() => setSelectedOrder(null)} variant="outline">
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Sheet>

      {/* Thermal Receipt Modal */}
      {receiptData && (
        <ReceiptModal open={showReceipt} onOpenChange={setShowReceipt} data={receiptData} />
      )}
    </div>
  );
};
