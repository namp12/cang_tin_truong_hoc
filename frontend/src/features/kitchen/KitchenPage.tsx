import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { useSocket } from '../../contexts/SocketContext.js';
import { ChefHat, Clock, CheckCircle2, Play, AlertCircle, Wifi, BellRing, Sparkles } from 'lucide-react';

interface KitchenTicket {
  id: number;
  orderNumber: string;
  table: string;
  items: { name: string; qty: number; note?: string }[];
  status: 'WAITING' | 'PREPARING' | 'READY';
  orderTime: string;
  elapsedMinutes: number;
  isRealtimeNew?: boolean;
}

export const KitchenPage: React.FC = () => {
  const { latestOrder, emitStatusUpdate, isConnected } = useSocket();

  const [tickets, setTickets] = useState<KitchenTicket[]>([
    {
      id: 1,
      orderNumber: '#1029',
      table: 'Bàn G1-01',
      items: [
        { name: 'Cơm Rang Dưa Bò Hà Nội', qty: 2, note: 'Nhiều dưa chua, xào tái lăn' },
        { name: 'Trà Đào Cam Sả Hà Đông', qty: 2, note: 'Ít đường, nhiều đào miếng' },
      ],
      status: 'PREPARING',
      orderTime: '11:45',
      elapsedMinutes: 8,
    },
    {
      id: 2,
      orderNumber: '#1030',
      table: 'Bàn G1-02',
      items: [
        { name: 'Phở Bò Tái Lăn DNU', qty: 1, note: 'Nước béo, thêm quẩy giòn' },
        { name: 'Cà Phê Cốt Dừa Hà Nội', qty: 1 },
      ],
      status: 'WAITING',
      orderTime: '11:48',
      elapsedMinutes: 5,
    },
    {
      id: 3,
      orderNumber: '#1031',
      table: 'Mang Về (KTX Tòa A)',
      items: [
        { name: 'Bún Chả Hà Nội Nướng Than', qty: 2, note: 'Nước chấm riêng, thêm ớt' },
        { name: 'Bánh Mì Chảo Đặc Biệt DNU', qty: 1, note: 'Trứng lòng đào' },
      ],
      status: 'WAITING',
      orderTime: '11:50',
      elapsedMinutes: 3,
    },
    {
      id: 4,
      orderNumber: '#1027',
      table: 'Bàn GD-01 (Khu Thể Thao)',
      items: [
        { name: 'Cơm Gà Xối Mỡ Giòn Da', qty: 2 },
        { name: 'Trà Chanh Giã Tay DNU', qty: 2 },
      ],
      status: 'READY',
      orderTime: '11:35',
      elapsedMinutes: 18,
    },
  ]);

  // Listen to incoming WebSocket orders from POS or Student App in realtime
  useEffect(() => {
    if (latestOrder) {
      const newTicket: KitchenTicket = {
        id: latestOrder.orderId,
        orderNumber: latestOrder.orderNumber,
        table: latestOrder.tableNumber,
        items: latestOrder.items.map((i) => ({ name: i.name, qty: i.qty, note: i.note })),
        status: 'WAITING',
        orderTime: latestOrder.orderedAt,
        elapsedMinutes: 0,
        isRealtimeNew: true,
      };

      setTickets((prev) => [newTicket, ...prev]);
    }
  }, [latestOrder]);

  const updateStatus = (id: number, nextStatus: KitchenTicket['status']) => {
    setTickets((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target) {
        emitStatusUpdate(id, target.orderNumber, nextStatus, 1);
      }
      return prev.map((t) => (t.id === id ? { ...t, status: nextStatus, isRealtimeNew: false } : t));
    });
  };

  const waitingTickets = tickets.filter((t) => t.status === 'WAITING');
  const preparingTickets = tickets.filter((t) => t.status === 'PREPARING');
  const readyTickets = tickets.filter((t) => t.status === 'READY');

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
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-tight">Kitchen Display System (KDS Bếp DNU)</h2>
              <Badge variant="primary" className="text-[10px] bg-emerald-600 text-white flex items-center gap-1">
                <Wifi className="w-3 h-3 animate-pulse" />
                <span>{isConnected ? 'Realtime Live' : 'Connecting...'}</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Màn hình điều phối chế biến Bếp Căng tin Tòa G (Đại Học Đại Nam)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <Badge variant="warning">{waitingTickets.length} Chờ nấu</Badge>
          <Badge variant="info">{preparingTickets.length} Đang nấu</Badge>
          <Badge variant="success">{readyTickets.length} Sẵn sàng</Badge>
        </div>
      </div>

      {/* 3 Swimlanes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Lane 1: Waiting */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 font-bold text-xs">
            <span>⏳ ĐƠN CHỜ NẤU</span>
            <span>{waitingTickets.length}</span>
          </div>

          <div className="space-y-3">
            {waitingTickets.map((ticket) => (
              <Card key={ticket.id} className="border-amber-200 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-sm text-slate-900">{ticket.orderNumber}</span>
                    <Badge variant="neutral" size="sm">{ticket.table}</Badge>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {ticket.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-800">{item.qty}× {item.name}</p>
                          {item.note && <p className="text-[11px] text-amber-600 italic">Ghi chú: {item.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" /> {ticket.elapsedMinutes} phút trước
                    </span>
                    <Button onClick={() => updateStatus(ticket.id, 'PREPARING')} variant="primary" size="sm">
                      <Play className="w-3 h-3 mr-1" /> Bắt Đầu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lane 2: Preparing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-900 font-bold text-xs">
            <span>🔥 ĐANG CHẾ BIẾN</span>
            <span>{preparingTickets.length}</span>
          </div>

          <div className="space-y-3">
            {preparingTickets.map((ticket) => (
              <Card key={ticket.id} className="border-blue-300 shadow-sm ring-1 ring-blue-400/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-sm text-blue-700">{ticket.orderNumber}</span>
                    <Badge variant="info" size="sm">{ticket.table}</Badge>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {ticket.items.map((item, idx) => (
                      <div key={idx}>
                        <p className="font-bold text-slate-900">{item.qty}× {item.name}</p>
                        {item.note && <p className="text-[11px] text-blue-600 italic">Ghi chú: {item.note}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 animate-spin" /> Đang nấu ({ticket.elapsedMinutes}p)
                    </span>
                    <Button onClick={() => updateStatus(ticket.id, 'READY')} variant="success" size="sm">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Nấu Xong
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lane 3: Ready */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 font-bold text-xs">
            <span>✅ SẴN SÀNG TRẢ MÓN</span>
            <span>{readyTickets.length}</span>
          </div>

          <div className="space-y-3">
            {readyTickets.map((ticket) => (
              <Card key={ticket.id} className="border-emerald-300 bg-emerald-50/30 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-extrabold text-sm text-emerald-800">{ticket.orderNumber}</span>
                    <Badge variant="success" size="sm">{ticket.table}</Badge>
                  </div>

                  <div className="space-y-1 text-xs">
                    {ticket.items.map((item, idx) => (
                      <p key={idx} className="font-bold text-slate-800">{item.qty}× {item.name}</p>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-semibold">Đã báo khách</span>
                    <Button onClick={() => setTickets(tickets.filter((t) => t.id !== ticket.id))} variant="outline" size="sm">
                      Đã Trả Món
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
