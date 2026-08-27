import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  Wallet, 
  Plus, 
  QrCode, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  CreditCard,
  Sparkles,
  History
} from 'lucide-react';

interface StudentWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StudentWalletModal: React.FC<StudentWalletModalProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(185000);
  const [activeTab, setActiveTab] = useState<'CARD' | 'TOPUP' | 'HISTORY'>('CARD');
  const [selectedTopupAmount, setSelectedTopupAmount] = useState(100000);
  const [isTopupSuccess, setIsTopupSuccess] = useState(false);

  const topupPackages = [50000, 100000, 200000, 500000];

  const transactions = [
    { id: 1, type: 'PAYMENT', title: 'Ăn trưa Cơm Rang Dưa Bò + Trà Đào', amount: -45000, time: 'Hôm nay, 12:15', status: 'SUCCESS' },
    { id: 2, type: 'TOPUP', title: 'Nạp tiền Ví qua VietQR MoMo', amount: 100000, time: 'Hôm nay, 10:30', status: 'SUCCESS' },
    { id: 3, type: 'REFUND', title: 'Hoàn tiền Khuyến mãi mã DNUCHAO2026', amount: 15000, time: 'Hôm qua, 18:00', status: 'SUCCESS' },
    { id: 4, type: 'PAYMENT', title: 'Ăn trưa Bún Chả Hà Nội Nướng Than', amount: -35000, time: 'Hôm qua, 11:45', status: 'SUCCESS' },
  ];

  const handleConfirmTopup = () => {
    setIsTopupSuccess(true);
    setBalance((prev) => prev + selectedTopupAmount);
    setTimeout(() => {
      setIsTopupSuccess(false);
      setActiveTab('CARD');
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Wallet className="w-5 h-5 text-orange-600" />
            <span>Ví Sinh Viên DNU Pay</span>
          </DialogTitle>
          <DialogDescription>
            Thanh toán không tiền mặt siêu tốc tại Căng tin Đại Học Đại Nam
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg text-xs font-semibold my-1">
          <button
            type="button"
            onClick={() => setActiveTab('CARD')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeTab === 'CARD' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Thẻ Sinh Viên & QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TOPUP')}
            className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 ${
              activeTab === 'TOPUP' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-orange-600" />
            <span>Nạp Tiền Nhanh</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('HISTORY')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeTab === 'HISTORY' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Lịch Sử Ví
          </button>
        </div>

        {/* TAB 1: Digital Student Card & QR */}
        {activeTab === 'CARD' && (
          <div className="space-y-4 py-2 text-xs">
            {/* DNU Pay Holographic Virtual Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-600 to-emerald-600 text-white shadow-xl relative overflow-hidden space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-100">ĐẠI HỌC ĐẠI NAM</p>
                  <h3 className="text-base font-black tracking-tight">DNU SMART PASS</h3>
                </div>
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <p className="text-[10px] text-orange-100 uppercase">Số dư khả dụng</p>
                <p className="text-2xl font-black font-mono tracking-tight">{formatCurrency(balance)}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/20 text-orange-100">
                <span>SV: {user?.fullName || 'Nguyễn Thành Nam'}</span>
                <span className="font-mono">MSSV: 2110001</span>
              </div>
            </div>

            {/* QR Code For POS Scanner */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-center space-y-2">
              <p className="font-bold text-xs text-foreground">Mã QR Thanh Toán Tại Quầy POS</p>
              <div className="w-36 h-36 bg-white border border-slate-300 rounded-xl mx-auto flex items-center justify-center p-2 shadow-sm">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <p className="text-[11px] text-muted-foreground">Đưa mã QR này vào máy quét tại Quầy 1 để thanh toán tức thì</p>
            </div>
          </div>
        )}

        {/* TAB 2: Top-up via VietQR / MoMo */}
        {activeTab === 'TOPUP' && (
          <div className="space-y-4 py-2 text-xs">
            {isTopupSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="font-bold text-sm text-foreground">Nạp Tiền Thành Công!</h3>
                <p className="text-xs text-muted-foreground">
                  Đã cộng <strong className="text-emerald-600 font-bold">{formatCurrency(selectedTopupAmount)}</strong> vào ví DNU Pay của bạn.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block font-semibold text-foreground mb-1.5">Chọn mệnh giá nạp:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {topupPackages.map((pkg) => (
                      <button
                        key={pkg}
                        type="button"
                        onClick={() => setSelectedTopupAmount(pkg)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                          selectedTopupAmount === pkg
                            ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400'
                            : 'bg-muted/40 border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {formatCurrency(pkg)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-center space-y-2">
                  <p className="font-bold text-xs text-foreground">Quét mã VietQR / MoMo để nạp</p>
                  <div className="w-32 h-32 bg-white border border-slate-300 rounded-xl mx-auto flex items-center justify-center p-2 shadow-sm">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-0.5">
                    <p>Ngân hàng: <strong>MB Bank (Ngân Hàng Quân Đội)</strong></p>
                    <p>Số tài khoản: <strong className="font-mono text-foreground">DNU2110001</strong></p>
                    <p>Số tiền: <strong className="text-orange-600">{formatCurrency(selectedTopupAmount)}</strong></p>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleConfirmTopup} variant="default" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold">
                    Tôi Đã Chuyển Khoản & Nạp Tiền
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        )}

        {/* TAB 3: History */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-2 py-2 text-xs max-h-64 overflow-y-auto divide-y divide-border">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}
                  >
                    {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-xs leading-tight">{tx.title}</p>
                    <p className="text-[10px] text-muted-foreground">{tx.time}</p>
                  </div>
                </div>
                <span className={`font-mono font-extrabold ${tx.amount > 0 ? 'text-emerald-600' : 'text-foreground'}`}>
                  {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
