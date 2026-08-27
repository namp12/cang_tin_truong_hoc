import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
import { useSocket } from '../../contexts/SocketContext.js';
import { orderStorage, KitchenTicket } from '../../services/orderStorage.js';
import { dnuStore, KitchenRequisition, StockItem } from '../../services/dnuStore.js';
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
  CheckCheck,
  PackagePlus,
  Send,
  ClipboardList
} from 'lucide-react';

export const KitchenPage: React.FC = () => {
  const { latestOrder, emitStatusUpdate, isConnected } = useSocket();

  const [tickets, setTickets] = useState<KitchenTicket[]>(() => orderStorage.getKitchenTickets());
  const [showCompletedHistory, setShowCompletedHistory] = useState(false);

  // Kitchen Requisition State
  const [showRequisitionModal, setShowRequisitionModal] = useState(false);
  const [showRequisitionHistory, setShowRequisitionHistory] = useState(false);
  const [requisitions, setRequisitions] = useState<KitchenRequisition[]>(() => dnuStore.getKitchenRequisitions());
  const [stocksList, setStocksList] = useState<StockItem[]>(() => dnuStore.getStocks());
  const [reqSuccess, setReqSuccess] = useState<string | null>(null);

  const [requisitionForm, setRequisitionForm] = useState({
    chefName: 'Bếp trưởng Võ Hoàng Hải',
    ingredientName: stocksList[0]?.name || 'Thịt thăn bò tươi loại 1',
    qty: 10,
    unit: 'kg',
    urgency: 'HIGH' as 'NORMAL' | 'HIGH' | 'URGENT',
    reason: 'Nguyên liệu sắp hết, cần cấp gấp cho ca nấu trưa',
  });

  // Sync tickets & requisitions whenever storage or store is updated
  useEffect(() => {
    const handleSync = () => {
      setTickets(orderStorage.getKitchenTickets());
      setRequisitions(dnuStore.getKitchenRequisitions());
      setStocksList(dnuStore.getStocks());
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

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <Badge variant="warning">{waitingTickets.length} Chờ nấu</Badge>
          <Badge variant="info">{preparingTickets.length} Đang nấu</Badge>
          <Badge variant="success">{readyTickets.length} Sẵn sàng</Badge>

          {/* Kitchen Material Requisition Button */}
          <Button
            onClick={() => setShowRequisitionModal(true)}
            variant="default"
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs"
          >
            <PackagePlus className="w-4 h-4 mr-1" />
            Yêu Cầu Cấp Nguyên Liệu
          </Button>

          {/* Requisition Status Drawer Button */}
          <Button
            onClick={() => setShowRequisitionHistory(!showRequisitionHistory)}
            variant="outline"
            size="sm"
            className="text-xs font-bold"
          >
            <ClipboardList className="w-3.5 h-3.5 mr-1 text-orange-600" />
            Yêu Cầu Đã Gửi ({requisitions.length})
          </Button>

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

      {/* SUCCESS ALERT */}
      {reqSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{reqSuccess}</span>
          </div>
          <Badge variant="success" className="text-[10px]">Đã Bắn Ting-Ting Tới Kho</Badge>
        </div>
      )}

      {/* REQUISITION HISTORY SECTION (Danh sách yêu cầu cấp nguyên liệu của bếp) */}
      {showRequisitionHistory && (
        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-orange-800 dark:text-orange-300 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-orange-600" />
              <span>Tiến Độ Cấp Phát Nguyên Liệu Từ Kho Căng Tin ({requisitions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {requisitions.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">Bếp chưa gửi yêu cầu cấp nguyên liệu nào.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {requisitions.map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl bg-card border border-border shadow-xs text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-foreground font-mono">{r.code}</span>
                      {r.status === 'APPROVED' ? (
                        <Badge variant="success" className="text-[9px]">Đã xuất kho ✅</Badge>
                      ) : r.status === 'REJECTED' ? (
                        <Badge variant="danger" className="text-[9px]">Từ chối ❌</Badge>
                      ) : (
                        <Badge variant="warning" className="text-[9px] animate-pulse">Chờ thủ kho cấp 🟡</Badge>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{r.qty} {r.unit} - {r.ingredientName}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{r.reason}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-border/60 text-[10px] text-muted-foreground">
                      <span>Mức độ: <strong className={r.urgency === 'URGENT' ? 'text-red-600 font-bold' : r.urgency === 'HIGH' ? 'text-amber-600 font-bold' : 'text-foreground'}>{r.urgency === 'URGENT' ? 'Khẩn cấp 🔴' : r.urgency === 'HIGH' ? 'Ưu tiên cao 🟡' : 'Bình thường'}</strong></span>
                      <span>{r.requestedAt?.slice(11, 16) || 'Vừa xong'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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

      {/* MODAL: TẠO PHIẾU YÊU CẦU CẤP NGUYÊN LIỆU CHO BẾP */}
      <Dialog open={showRequisitionModal} onOpenChange={setShowRequisitionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <PackagePlus className="w-5 h-5 text-orange-600" />
              <span>Phiếu Yêu Cầu Cấp Nguyên Liệu (Bếp $\rightarrow$ Kho)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Gửi yêu cầu xuất kho tức thì tới Thủ kho Căng tin Tòa G khi nguyên liệu tại bếp sắp cạn kiệt
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!requisitionForm.ingredientName || !requisitionForm.qty) return;

              dnuStore.addKitchenRequisition({
                chefName: requisitionForm.chefName,
                ingredientName: requisitionForm.ingredientName,
                qty: Number(requisitionForm.qty),
                unit: requisitionForm.unit,
                urgency: requisitionForm.urgency,
                reason: requisitionForm.reason,
                canteenName: 'Căng tin Tòa G',
              });

              setReqSuccess(`Đã gửi yêu cầu cấp ${requisitionForm.qty} ${requisitionForm.unit} ${requisitionForm.ingredientName} tới Thủ kho thành công!`);
              setShowRequisitionModal(false);
              setTimeout(() => setReqSuccess(null), 4000);
            }}
            className="space-y-3.5 py-2 text-xs"
          >
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Đầu Bếp / Người Lập Yêu Cầu
              </label>
              <input
                type="text"
                value={requisitionForm.chefName}
                onChange={(e) => setRequisitionForm({ ...requisitionForm, chefName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-input text-foreground text-xs focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Chọn Nguyên Liệu Cần Cấp Từ Kho
              </label>
              <select
                value={requisitionForm.ingredientName}
                onChange={(e) => {
                  const selName = e.target.value;
                  const found = stocksList.find((s) => s.name === selName);
                  setRequisitionForm({
                    ...requisitionForm,
                    ingredientName: selName,
                    unit: found?.unit || 'kg',
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-background border border-input text-foreground text-xs focus:ring-1 focus:ring-orange-500"
              >
                {stocksList.map((st) => (
                  <option key={st.id} value={st.name}>
                    {st.name} (Tồn khả dụng: {st.available} {st.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Số Lượng Cần Cấp
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={requisitionForm.qty}
                  onChange={(e) => setRequisitionForm({ ...requisitionForm, qty: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-input text-foreground text-xs font-mono font-bold focus:ring-1 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Mức Độ Cấp Bách
                </label>
                <select
                  value={requisitionForm.urgency}
                  onChange={(e) => setRequisitionForm({ ...requisitionForm, urgency: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-input text-foreground text-xs font-semibold focus:ring-1 focus:ring-orange-500"
                >
                  <option value="NORMAL">🟢 Thông thường (Đầu ca)</option>
                  <option value="HIGH">🟡 Ưu tiên cao (Sắp hết)</option>
                  <option value="URGENT">🔴 Khẩn cấp (Đang nghẽn đơn)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Lý Do / Ghi Chú Ca Chế Biến
              </label>
              <textarea
                rows={2}
                value={requisitionForm.reason}
                onChange={(e) => setRequisitionForm({ ...requisitionForm, reason: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-input text-foreground text-xs focus:ring-1 focus:ring-orange-500"
                placeholder="Ví dụ: Bếp hết thịt bò, sinh viên đặt đông cần cấp gấp..."
                required
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowRequisitionModal(false)}>
                Hủy Bỏ
              </Button>
              <Button type="submit" variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold">
                <Send className="w-4 h-4 mr-1" />
                Gửi Yêu Cầu Sang Kho
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
