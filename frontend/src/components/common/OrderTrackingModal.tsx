import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  UtensilsCrossed, 
  MapPin, 
  Store, 
  Bell, 
  AlertCircle 
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
          order.status === 'READY'
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 animate-pulse'
            : order.status === 'PREPARING'
            ? 'bg-gradient-to-r from-orange-600 to-amber-600'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}>
          <p className="text-[10px] uppercase font-bold tracking-wider opacity-90">TRẠNG THÁI HIỆN TẠI</p>
          <h3 className="text-lg font-black tracking-tight">
            {order.status === 'READY'
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
      </DialogContent>
    </Dialog>
  );
};
