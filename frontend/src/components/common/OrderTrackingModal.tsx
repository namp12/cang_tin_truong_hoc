import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import { formatCurrency } from '../../utils/format.js';
import { dnuStore } from '../../services/dnuStore.js';
import { 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  UtensilsCrossed, 
  MapPin, 
  Store, 
  Bell, 
  AlertCircle,
  Star
} from 'lucide-react';

interface OrderTrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: {
    orderNumber: string;
    status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED';
    canteenName: string;
    tableNumber: string;
    items: { name: string; qty: number }[];
    totalAmount: number;
    orderedAt: string;
  } | null;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ open, onOpenChange, order }) => {
  if (!order) return null;

  const steps = [
    { key: 'CONFIRMED', title: 'Đã Tiếp Nhận Đơn', desc: 'Hệ thống đã gửi phiếu vào Bếp' },
    { key: 'PREPARING', title: 'Đầu Bếp Đang Nấu', desc: 'Ước tính thời gian: 5 - 8 phút' },
    { key: 'READY', title: 'Món Đã Sẵn Sàng', desc: 'Mời bạn tới Quầy 1 để lấy món' },
    { key: 'COMPLETED', title: 'Đã Hoàn Tất', desc: 'Chúc bạn có bữa ăn ngon miệng!' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 0;
      case 'PREPARING':
        return 1;
      case 'READY':
        return 2;
      case 'COMPLETED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <ChefHat className="w-5 h-5 text-orange-600" />
              <span>Tiến Trình Chế Biến Đơn Hàng</span>
            </DialogTitle>
            <Badge variant="warning" className="font-mono text-xs">
              {order.orderNumber}
            </Badge>
          </div>
          <DialogDescription>
            Theo dõi trạng thái chế biến món ăn thời gian thực từ Bếp Căng tin DNU
          </DialogDescription>
        </DialogHeader>

        {/* Live Status Hero Banner */}
        <div className={`p-4 rounded-xl text-white text-center space-y-1 shadow-md ${
          order.status === 'COMPLETED'
            ? 'bg-gradient-to-r from-teal-600 to-emerald-600'
            : order.status === 'READY'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse'
            : order.status === 'PREPARING'
            ? 'bg-gradient-to-r from-orange-600 to-amber-600'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}>
          <p className="text-[10px] uppercase font-bold tracking-wider opacity-90">TRẠNG THÁI HIỆN TẠI</p>
          <h3 className="text-lg font-black tracking-tight">
            {order.status === 'COMPLETED'
              ? '🎉 ĐƠN HÀNG ĐÃ HOÀN TẤT!'
              : order.status === 'READY'
              ? '🔔 MÓN ĂN ĐÃ SẴN SÀNG TẠI QUẦY 1!'
              : order.status === 'PREPARING'
              ? '🍳 ĐẦU BẾP ĐANG CHẾ BIẾN MÓN...'
              : '📋 ĐƠN HÀNG ĐÃ ĐƯỢC XÁC NHẬN'}
          </h3>
          <p className="text-xs opacity-90">Vị trí nhận: {order.canteenName} ({order.tableNumber})</p>
        </div>

        {/* 4 Steps Timeline */}
        <div className="py-3 space-y-4 text-xs">
          {steps.map((step, idx) => {
            const isPassed = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={step.key} className="flex items-start gap-3 relative">
                {/* Step Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-colors ${
                    isCurrent
                      ? 'bg-orange-600 text-white ring-4 ring-orange-500/20'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                {/* Step Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-xs ${isCurrent ? 'text-orange-600 dark:text-orange-400' : 'text-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                </div>

                {/* Vertical connecting line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-7 w-0.5 h-6 -translate-x-1/2 ${
                      idx < currentStep ? 'bg-emerald-600' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Ordered Items Summary */}
        <div className="p-3 bg-muted/40 rounded-xl border border-border/60 text-xs space-y-1.5">
          <p className="font-bold text-[11px] text-foreground uppercase tracking-wider">Danh sách món ăn:</p>
          <ul className="space-y-1">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between text-muted-foreground">
                <span className="font-medium text-foreground">{it.qty}× {it.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Review Section */}
        <QuickOrderReview order={order} />
      </DialogContent>
    </Dialog>
  );
};

const QuickOrderReview: React.FC<{ order: NonNullable<OrderTrackingModalProps['order']> }> = ({ order }) => {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [selectedFood, setSelectedFood] = React.useState(order.items[0]?.name || '');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    dnuStore.addReview({
      studentName: 'Nguyễn Thành Nam',
      studentClass: 'K16 Khoa CNTT DNU',
      foodName: selectedFood || order.items[0]?.name || 'Món ăn DNU',
      rating,
      comment,
      sentiment: rating >= 4 ? 'POSITIVE' : rating === 3 ? 'NEUTRAL' : 'CRITICAL',
      canteenName: order.canteenName,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-center space-y-1">
        <p className="font-bold text-xs text-emerald-700 dark:text-emerald-300">🎉 Cảm ơn bạn đã gửi đánh giá món ăn!</p>
        <p className="text-[10px] text-muted-foreground">Đánh giá của bạn đã được ghi nhận vào hệ thống Căng tin DNU.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>Đánh giá món ăn vừa nhận:</span>
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              className="p-0.5 hover:scale-110 transition-transform"
            >
              <Star className={`w-4 h-4 ${s <= rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`} />
            </button>
          ))}
        </div>
      </div>

      {order.items.length > 1 && (
        <select
          value={selectedFood}
          onChange={(e) => setSelectedFood(e.target.value)}
          className="w-full px-2 py-1 text-[11px] bg-background border border-input rounded-md"
        >
          {order.items.map((it, i) => (
            <option key={i} value={it.name}>{it.name}</option>
          ))}
        </select>
      )}

      <div className="flex gap-1.5">
        <input
          type="text"
          placeholder="Món ăn thế nào? (VD: Rất ngon, nóng hổi...)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 px-2.5 py-1 text-xs bg-background border border-input rounded-lg"
        />
        <Button type="submit" size="sm" variant="default" className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0">
          Gửi
        </Button>
      </div>
    </form>
  );
};

