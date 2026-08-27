import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { dnuStore, StudentWallet } from '../../services/dnuStore.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  User, 
  Wallet, 
  CreditCard, 
  History, 
  QrCode, 
  LogOut, 
  Sparkles, 
  Gift, 
  Phone, 
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Plus
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const studentMssv = user?.username ? user.username.replace(/\D/g, '') || '2110001' : '2110001';
  
  const [wallet, setWallet] = useState<StudentWallet>(() => dnuStore.getStudentWallet(studentMssv));
  const [topupAmount, setTopupAmount] = useState<number>(50000);
  const [topupSuccess, setTopupSuccess] = useState(false);

  useEffect(() => {
    const sync = () => {
      setWallet(dnuStore.getStudentWallet(studentMssv));
    };
    window.addEventListener('dnu_store_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('dnu_store_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, [studentMssv]);

  const handleTopup = (amount: number) => {
    dnuStore.topupStudentWallet(amount, 'QR MoMo', studentMssv, user?.fullName || 'Nguyễn Thành Nam');
    setTopupSuccess(true);
    setTimeout(() => setTopupSuccess(false), 2500);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Student ID Card Badge */}
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-5 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-white text-xs">
              DNU
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-orange-200">Thẻ Sinh Viên Điện Tử</p>
              <h3 className="text-xs font-bold">ĐẠI HỌC ĐẠI NAM</h3>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-0 text-[10px] font-bold">K16 CNTT</Badge>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-white text-orange-600 flex items-center justify-center font-black text-lg shadow-md shrink-0">
            {user?.fullName?.charAt(0) || 'N'}
          </div>
          <div>
            <h2 className="text-base font-extrabold">{user?.fullName || 'Nguyễn Thành Nam'}</h2>
            <p className="text-xs text-orange-100 font-mono">MSSV: {studentMssv}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
          <span className="text-orange-200">Khoa Công Nghệ Thông Tin</span>
          <span className="font-bold">Căng Tin Tòa G</span>
        </div>
      </div>

      {/* DNU Pay Balance Card */}
      <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Số Dư Ví DNU Pay</p>
              <h3 className="text-xl font-black text-orange-600 font-mono">{formatCurrency(wallet.balance)}</h3>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            Hoạt Động
          </span>
        </div>

        {/* Quick Topup Buttons */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-bold text-slate-600">Nạp tiền nhanh vào Ví DNU Pay:</label>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {[20000, 50000, 100000, 200000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleTopup(amt)}
                className="py-1.5 px-1 rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-100 text-orange-800 font-bold text-center transition-colors"
              >
                +{amt / 1000}k
              </button>
            ))}
          </div>
        </div>

        {topupSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Nạp tiền thành công! Số dư đã được cộng tức thì.</span>
          </div>
        )}
      </Card>

      {/* Wallet Transaction History */}
      <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <History className="w-4 h-4 text-orange-600" />
            <span>Lịch Sử Giao Dịch Gần Đây</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{wallet.transactions.length} giao dịch</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {wallet.transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
            >
              <div className="min-w-0 pr-2">
                <p className="font-bold text-slate-800 truncate">{tx.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{tx.time} • {tx.paymentMethod}</p>
              </div>
              <span
                className={`font-mono font-extrabold whitespace-nowrap ${
                  tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Support & Logout */}
      <div className="space-y-2">
        <button
          onClick={logout}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng Xuất Tài Khoản</span>
        </button>
      </div>
    </div>
  );
};
