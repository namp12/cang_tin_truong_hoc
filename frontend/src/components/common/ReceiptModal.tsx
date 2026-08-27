import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog.js';
import { Button } from '../ui/Button.js';
import { formatCurrency } from '../../utils/format.js';
import { Printer, CheckCircle2, UtensilsCrossed, QrCode } from 'lucide-react';

export interface ReceiptData {
  orderNumber: string;
  orderTime: string;
  cashierName: string;
  canteenName: string;
  tableNumber: string;
  customerName?: string;
  items: { name: string; qty: number; price: number; note?: string }[];
  subtotal: number;
  discount: number;
  voucherCode?: string;
  finalTotal: number;
  paymentMethod: string;
}

interface ReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ReceiptData | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ open, onOpenChange, data }) => {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[95vh] overflow-y-auto p-4 bg-white text-slate-900 border border-slate-300 shadow-2xl">
        <DialogHeader className="text-center pb-2 border-b border-dashed border-slate-300">
          <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center mx-auto mb-1.5 shadow-xs">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <DialogTitle className="text-sm font-black uppercase text-slate-900 leading-tight">
            TRƯỜNG ĐẠI HỌC ĐẠI NAM
          </DialogTitle>
          <p className="text-[11px] font-bold text-orange-600">{data.canteenName}</p>
          <p className="text-[9px] text-slate-500">Số 1 Phố Xốm, Phú Lãm, Hà Đông, Hà Nội</p>
          <p className="text-[9px] text-slate-500">Hotline Căng tin: 024 3557 7799</p>
        </DialogHeader>

        {/* Receipt Header Info */}
        <div className="py-2 text-[11px] border-b border-dashed border-slate-300 space-y-1 text-slate-700">
          <div className="flex justify-between font-bold text-xs text-slate-900">
            <span>PHIẾU THANH TOÁN</span>
            <span className="font-mono text-orange-600">{data.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Thời gian:</span>
            <span>{data.orderTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Thu ngân:</span>
            <span>{data.cashierName}</span>
          </div>
          <div className="flex justify-between">
            <span>Vị trí:</span>
            <span className="font-bold text-slate-900">{data.tableNumber}</span>
          </div>
          {data.customerName && (
            <div className="flex justify-between">
              <span>Khách hàng:</span>
              <span className="font-semibold text-slate-900">{data.customerName}</span>
            </div>
          )}
        </div>

        {/* Item Table */}
        <div className="py-2 border-b border-dashed border-slate-300">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="text-left py-1">Tên món</th>
                <th className="text-center py-1">SL</th>
                <th className="text-right py-1">Đ.Giá</th>
                <th className="text-right py-1">T.Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {data.items.map((item, idx) => (
                <tr key={idx} className="py-1">
                  <td className="py-1.5 text-left font-semibold text-slate-800">
                    <div>{item.name}</div>
                    {item.note && <div className="text-[9px] text-slate-400 font-normal">({item.note})</div>}
                  </td>
                  <td className="py-1.5 text-center font-bold text-slate-700">{item.qty}</td>
                  <td className="py-1.5 text-right text-slate-600">{formatCurrency(item.price)}</td>
                  <td className="py-1.5 text-right font-bold text-slate-900">{formatCurrency(item.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="py-2 text-[11px] border-b border-dashed border-slate-300 space-y-1.5">
          <div className="flex justify-between text-slate-600">
            <span>Tổng tiền món:</span>
            <span className="font-semibold">{formatCurrency(data.subtotal)}</span>
          </div>
          {data.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Giảm giá {data.voucherCode ? `(${data.voucherCode})` : ''}:</span>
              <span>-{formatCurrency(data.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
            <span>THANH TOÁN:</span>
            <span className="text-orange-600 font-mono text-base">{formatCurrency(data.finalTotal)}</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Phương thức:</span>
            <span className="font-bold text-slate-700 uppercase">{data.paymentMethod}</span>
          </div>
        </div>

        {/* QR Code & Footer Message */}
        <div className="pt-2 text-center space-y-1.5">
          <div className="w-16 h-16 border border-slate-300 rounded-lg mx-auto flex items-center justify-center p-1 bg-slate-50 shadow-inner">
            <QrCode className="w-12 h-12 text-slate-800" />
          </div>
          <p className="text-[10px] font-semibold text-slate-700">Quét mã để tra cứu hóa đơn điện tử DNU</p>
          <p className="text-[9px] text-slate-400 italic">Cảm ơn bạn & Chúc bạn có một bữa ăn ngon miệng!</p>
        </div>

        <DialogFooter className="pt-2">
          <Button onClick={handlePrint} variant="default" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold" size="sm">
            <Printer className="w-4 h-4 mr-1.5" />
            In Hóa Đơn Nhiệt (K80)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
