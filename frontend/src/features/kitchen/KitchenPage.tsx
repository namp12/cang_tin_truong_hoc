import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { useSocket } from '../../contexts/SocketContext.js';
import { orderStorage, KitchenTicket } from '../../services/orderStorage.js';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Play, 
  AlertCircle, 
  Wifi, 
  BellRing, 
  Sparkles,
  History,
  RotateCcw,
  CheckCheck
} from 'lucide-react';

export const KitchenPage: React.FC = () => {
  const { latestOrder, emitStatusUpdate, isConnected } = useSocket();

  const [tickets, setTickets] = useState<KitchenTicket[]>(() => orderStorage.getKitchenTickets());
  const [showCompletedHistory, setShowCompletedHistory] = useState(false);

  // Sync tickets whenever storage or store is updated
  useEffect(() => {
    const handleSync = () => {
      setTickets(orderStorage.getKitchenTickets());
    };
    window.addEventListener('dnu_store_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dnu_store_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Sync tickets whenever latestOrder arrives via Socket
  useEffect(() => {
    if (latestOrder) {
      const exists = tickets.some((t) => t.id === latestOrder.orderId);
      if (!exists) {
        const { ticket } = orderStorage.addOrder({
          id: latestOrder.orderId,
          code: latestOrder.orderNumber,
          customerName: latestOrder.customerName || 'Khách Quầy POS / App',
          canteenName: 'Căng tin Tòa G (Hà Đông)',
          tableNumber: latestOrder.tableNumber,
          itemsSummary: latestOrder.items.map((i) => `${i.qty}× ${i.name}`).join(', '),
          itemsDetail: latestOrder.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price || 30000, note: i.note })),
          finalAmount: latestOrder.totalAmount || 50000,
          status: 'WAITING',
          paymentStatus: 'PAID',
          paymentMethod: 'Ví DNU Pay',
          orderedAt: latestOrder.orderedAt || new Date().toISOString(),
        });
        setTickets((prev) => [ticket, ...prev]);
      }
    }
  }, [latestOrder]);

  const updateStatus = (id: number, nextStatus: KitchenTicket['status']) => {
    const { tickets: updated } = orderStorage.updateTicketStatus(id, nextStatus);
    setTickets(updated);

    const target = updated.find((t) => t.id === id);
    if (target) {
      emitStatusUpdate(id, target.orderNumber, nextStatus, 1);
    }
  };

  const waitingTickets = tickets.filter((t) => t.status === 'WAITING');
  const preparingTickets = tickets.filter((t) => t.status === 'PREPARING');
  const readyTickets = tickets.filter((t) => t.status === 'READY');
  const completedTickets = tickets.filter((t) => t.status === 'COMPLETED');

  return (
    <div className="space-y-5">
      {/* KDS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                Kitchen Display System (KDS Bếp DNU)
              </h2>
              <Badge variant="primary" className="text-[10px] bg-emerald-600 text-white flex items-center gap-1">
                <Wifi className="w-3 h-3 animate-pulse" />
                <span>{isConnected ? 'Realtime Database Synced' : 'Offline Storage Active'}</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Màn hình điều phối chế biến & trả món Bếp Căng tin Tòa G (Đại Học Đại Nam)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <Badge variant="warning">{waitingTickets.length} Chờ nấu</Badge>
          <Badge variant="info">{preparingTickets.length} Đang nấu</Badge>
          <Badge variant="success">{readyTickets.length} Sẵn sàng</Badge>
          <Button
            onClick={() => setShowCompletedHistory(!showCompletedHistory)}
            variant="outline"
            size="sm"
            className="text-xs font-bold"
          >
            <History className="w-3.5 h-3.5 mr-1" />
            {showCompletedHistory ? 'Ẩn Đã Trả Món' : `Đã Trả Món (${completedTickets.length})`}
          </Button>
        </div>
      </div>

      {/* COMPLETED TICKETS SECTION (Lịch sử đã trả món) */}
      {showCompletedHistory && (
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Danh Sách Món Ăn Đã Trả Khách Thành Công ({completedTickets.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {completedTickets.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">Chưa có món nào được trả trong ca này.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {completedTickets.map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-card border border-border shadow-xs text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-foreground">{t.orderNumber}</span>
                      <Badge variant="success" className="text-[9px]">Đã trả món</Badge>
                    </div>
                    <p className="font-semibold text-muted-foreground">{t.table}</p>
                    <div className="text-[11px] text-muted-foreground border-t border-border/50 pt-1">
                      {t.items.map((i, idx) => (
                        <div key={idx}>{i.qty}× {i.name}</div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[10px]">
                      <span className="text-emerald-600 font-bold">{t.completedAt || 'Vừa xong'}</span>
                      <button
                        onClick={() => updateStatus(t.id, 'READY')}
                        className="text-primary underline hover:text-primary/80 font-bold"
                        title="Chuyển lại về Sẵn sàng nếu bấm nhầm"
                      >
                        Khôi phục
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 3 Swimlanes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Lane 1: Waiting */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 font-bold text-xs">
            <span>⏳ ĐƠN CHỜ NẤU</span>
            <span>{waitingTickets.length}</span>
          </div>

          <div className="space-y-3">
            {waitingTickets.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                Không có đơn chờ nấu nào
              </div>
            ) : (
              waitingTickets.map((ticket) => (
                <Card key={ticket.id} className="border-amber-200 dark:border-amber-900/40 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="font-extrabold text-sm text-foreground">{ticket.orderNumber}</span>
                      <Badge variant="neutral" size="sm">{ticket.table}</Badge>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {ticket.items.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-foreground">{item.qty}× {item.name}</p>
                            {item.note && <p className="text-[11px] text-amber-600 dark:text-amber-400 italic font-medium">Ghi chú: {item.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {ticket.orderTime} ({ticket.elapsedMinutes}p)
                      </span>
                      <Button onClick={() => updateStatus(ticket.id, 'PREPARING')} variant="primary" size="sm">
                        <Play className="w-3 h-3 mr-1" /> Bắt Đầu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Lane 2: Preparing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-300 font-bold text-xs">
            <span>🔥 ĐANG CHẾ BIẾN</span>
            <span>{preparingTickets.length}</span>
          </div>

          <div className="space-y-3">
            {preparingTickets.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                Không có món nào đang nấu
              </div>
            ) : (
              preparingTickets.map((ticket) => (
                <Card key={ticket.id} className="border-blue-300 dark:border-blue-900/40 shadow-sm ring-1 ring-blue-400/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">{ticket.orderNumber}</span>
                      <Badge variant="info" size="sm">{ticket.table}</Badge>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {ticket.items.map((item, idx) => (
                        <div key={idx}>
                          <p className="font-bold text-foreground">{item.qty}× {item.name}</p>
                          {item.note && <p className="text-[11px] text-blue-600 dark:text-blue-400 italic font-medium">Ghi chú: {item.note}</p>}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                      <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" /> Đang nấu ({ticket.elapsedMinutes}p)
                      </span>
                      <Button onClick={() => updateStatus(ticket.id, 'READY')} variant="success" size="sm">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Nấu Xong
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Lane 3: Ready */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
            <span>✅ SẴN SÀNG TRẢ MÓN</span>
            <span>{readyTickets.length}</span>
          </div>

          <div className="space-y-3">
            {readyTickets.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                Tất cả món đã được trả cho khách
              </div>
            ) : (
              readyTickets.map((ticket) => (
                <Card key={ticket.id} className="border-emerald-300 dark:border-emerald-900/40 bg-emerald-500/5 shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">{ticket.orderNumber}</span>
                      <Badge variant="success" size="sm">{ticket.table}</Badge>
                    </div>

                    <div className="space-y-1 text-xs">
                      {ticket.items.map((item, idx) => (
                        <p key={idx} className="font-bold text-foreground">{item.qty}× {item.name}</p>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Chờ Quầy Giao Đồ</span>
                      </div>
                      <Button
                        onClick={() => {
                          emitStatusUpdate(ticket.id, ticket.orderNumber, 'READY', 1);
                        }}
                        variant="outline"
                        size="sm"
                        className="border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 font-bold text-xs shadow-xs"
                        title="Bấm để phát lại chuông báo nhận món tới Quầy Thu Ngân và Sinh Viên"
                      >
                        <BellRing className="w-3.5 h-3.5 mr-1 text-emerald-600 animate-bounce" />
                        Gọi Chuông
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
