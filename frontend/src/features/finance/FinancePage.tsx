import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
import { formatCurrency, formatDateTime } from '../../utils/format.js';
import { dnuStore, FinanceTransaction } from '../../services/dnuStore.js';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Minus,
  Download,
  Receipt,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  Building2,
  Send,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

export const FinancePage: React.FC = () => {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(() => dnuStore.getFinanceTransactions());
  const [summary, setSummary] = useState(() => dnuStore.getFinanceSummary());
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showStudentTopupModal, setShowStudentTopupModal] = useState(false);

  // Form states
  const [incomeForm, setIncomeForm] = useState({
    title: '',
    amount: '',
    category: 'CAPITAL_INFLOW' as const,
    paymentMethod: 'CASH' as const,
    counterpart: 'Phòng Kế Toán / Ban Quản Lý DNU',
    canteenName: 'Căng tin Tòa G',
    notes: '',
  });

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'OPERATING_COST' as const,
    paymentMethod: 'CASH' as const,
    counterpart: 'Công Ty Điện Lực / Cung Ứng Dịch Vụ',
    canteenName: 'Căng tin Tòa G',
    notes: '',
  });

  const [studentTopupForm, setStudentTopupForm] = useState({
    mssv: '2110001',
    studentName: 'Nguyễn Thành Nam (K16 CNTT)',
    amount: '100000',
    reason: 'Trợ cấp học bổng sinh viên giỏi / Khuyến khích học tập',
  });

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Sync listener
  useEffect(() => {
    const handleSync = () => {
      setTransactions(dnuStore.getFinanceTransactions());
      setSummary(dnuStore.getFinanceSummary());
    };
    window.addEventListener('dnu_store_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dnu_store_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(incomeForm.amount);
    if (!amountNum || amountNum <= 0) return;

    dnuStore.addFinanceTransaction({
      code: `PT-${Date.now().toString().slice(-6)}`,
      type: 'INCOME',
      category: incomeForm.category,
      categoryLabel: incomeForm.category === 'CAPITAL_INFLOW' ? 'Bơm vốn quỹ' : 'Thu tiền khác',
      title: incomeForm.title || 'Nạp vốn lưu động quỹ tiền mặt Căng tin',
      amount: amountNum,
      paymentMethod: incomeForm.paymentMethod,
      paymentMethodLabel: incomeForm.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản',
      counterpart: incomeForm.counterpart,
      performedBy: 'Admin Quản Trị Hệ Thống',
      canteenName: incomeForm.canteenName,
      notes: incomeForm.notes,
    });

    setActionSuccess(`Tạo Phiếu Thu thành công: +${formatCurrency(amountNum)}`);
    setShowIncomeModal(false);
    setIncomeForm({
      title: '',
      amount: '',
      category: 'CAPITAL_INFLOW',
      paymentMethod: 'CASH',
      counterpart: 'Phòng Kế Toán / Ban Quản Lý DNU',
      canteenName: 'Căng tin Tòa G',
      notes: '',
    });
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(expenseForm.amount);
    if (!amountNum || amountNum <= 0) return;

    dnuStore.addFinanceTransaction({
      code: `PC-${Date.now().toString().slice(-6)}`,
      type: 'EXPENSE',
      category: expenseForm.category,
      categoryLabel: expenseForm.category === 'OPERATING_COST' ? 'Chi phí vận hành' : expenseForm.category === 'SALARY' ? 'Lương nhân sự' : 'Chi phí khác',
      title: expenseForm.title || 'Chi phí vận hành Căng tin',
      amount: amountNum,
      paymentMethod: expenseForm.paymentMethod,
      paymentMethodLabel: expenseForm.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản',
      counterpart: expenseForm.counterpart,
      performedBy: 'Admin Quản Trị Hệ Thống',
      canteenName: expenseForm.canteenName,
      notes: expenseForm.notes,
    });

    setActionSuccess(`Tạo Phiếu Chi thành công: -${formatCurrency(amountNum)}`);
    setShowExpenseModal(false);
    setExpenseForm({
      title: '',
      amount: '',
      category: 'OPERATING_COST',
      paymentMethod: 'CASH',
      counterpart: 'Công Ty Điện Lực / Cung Ứng Dịch Vụ',
      canteenName: 'Căng tin Tòa G',
      notes: '',
    });
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleAdminTopupStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(studentTopupForm.amount);
    if (!amountNum || amountNum <= 0) return;

    dnuStore.topupStudentWallet(
      amountNum,
      'Admin Nạp Trợ Giá Ví',
      studentTopupForm.mssv,
      studentTopupForm.studentName
    );

    setActionSuccess(`Đã nạp thành công ${formatCurrency(amountNum)} vào ví SV ${studentTopupForm.studentName} (MSSV: ${studentTopupForm.mssv})`);
    setShowStudentTopupModal(false);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Filtered transactions
  const filteredTxs = transactions.filter((tx) => {
    const matchType = filterType === 'ALL' || tx.type === filterType;
    const matchSearch =
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.counterpart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.performedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const cashflowData = [
    { day: 'T2', revenue: 24500000, cost: 13200000, profit: 11300000 },
    { day: 'T3', revenue: 28200000, cost: 14800000, profit: 13400000 },
    { day: 'T4', revenue: 31500000, cost: 16100000, profit: 15400000 },
    { day: 'T5', revenue: 35800000, cost: 18200000, profit: 17600000 },
    { day: 'T6', revenue: 29000000, cost: 15000000, profit: 14000000 },
    { day: 'T7', revenue: 16500000, cost: 8900000, profit: 7600000 },
    { day: 'Hôm nay', revenue: summary.totalIncome, cost: summary.totalExpense, profit: Math.max(0, summary.netBalance) },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs font-semibold opacity-70 hover:opacity-100">
            ✕ Đóng
          </button>
        </div>
      )}

      {/* Page Header & 3 Main Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Sổ Quỹ Dòng Tiền & Tài Chính Căng Tin</h2>
            <Badge variant="primary" className="bg-orange-600 text-white font-mono text-[10px]">
              DNU TREASURY
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản trị dòng tiền thu chi tự động, đối soát POS/Kiosk, nạp ví sinh viên và quyết toán nhà cung cấp
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setShowIncomeModal(true)}
            variant="default"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Thu Tiền / Bơm Vốn
          </Button>

          <Button
            onClick={() => setShowExpenseModal(true)}
            variant="default"
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
            leftIcon={<Minus className="w-4 h-4" />}
          >
            - Tạo Phiếu Chi Quỹ
          </Button>

          <Button
            onClick={() => setShowStudentTopupModal(true)}
            variant="outline"
            size="sm"
            className="border-orange-500/40 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 font-bold text-xs"
            leftIcon={<Wallet className="w-4 h-4 text-orange-600" />}
          >
            ⚡ Nạp Ví Sinh Viên
          </Button>
        </div>
      </div>

      {/* 4 Financial KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <Card className="p-4 bg-card border-border hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Tổng Thu (Tiền Vào)</p>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-foreground mt-2 font-mono tracking-tight">
            {formatCurrency(summary.totalIncome)}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Gồm POS, Kiosk & Nạp Ví DNU Pay</span>
          </p>
        </Card>

        {/* Total Expense */}
        <Card className="p-4 bg-card border-border hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Tổng Chi (Tiền Ra)</p>
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-foreground mt-2 font-mono tracking-tight">
            {formatCurrency(summary.totalExpense)}
          </p>
          <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Gồm Tiền NCC & Chi phí vận hành</span>
          </p>
        </Card>

        {/* Net Cash Balance */}
        <Card className="p-4 bg-gradient-to-br from-emerald-500/10 via-card to-card border-emerald-500/30">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Số Dư Quỹ Khả Dụng (Net)</p>
            <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono tracking-tight">
            {formatCurrency(summary.netBalance)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            = Tổng Thu trừ Tổng Chi thực tế
          </p>
        </Card>

        {/* DNU Pay Wallet Share */}
        <Card className="p-4 bg-gradient-to-br from-orange-500/10 via-card to-card border-orange-500/30">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-orange-700 dark:text-orange-400">Ví DNU Pay Chiếm</p>
            <span className="p-2 rounded-xl bg-orange-600 text-white shadow-xs">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-2 font-mono tracking-tight">
            {formatCurrency(summary.walletTopupIncome + summary.posIncome * 0.4)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Dòng tiền sinh viên luân chuyển qua Ví
          </p>
        </Card>
      </div>

      {/* Cashflow Chart */}
      <Card>
        <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between border-b border-border">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Biểu Đồ Biến Động Doanh Thu & Dòng Tiền Tuần Này</span>
          </CardTitle>
          <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
            7 NGÀY GẦN NHẤT
          </Badge>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v / 1000000}tr`} />
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" name="Tiền Thu Vào" stroke="#EA580C" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="cost" name="Tiền Chi Ra" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sổ Quỹ Thu Chi Realtime (Live Cashflow Ledger Table) */}
      <Card className="overflow-hidden border-border">
        <CardHeader className="p-4 border-b border-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">Sổ Quỹ Thu Chi Realtime (Live Ledger)</CardTitle>
              <Badge variant="primary" className="text-[10px] bg-orange-600 text-white">
                {filteredTxs.length} Bản Ghi
              </Badge>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterType === 'ALL' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tất Cả
              </button>
              <button
                onClick={() => setFilterType('INCOME')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterType === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                + Thu Tiền ({transactions.filter((t) => t.type === 'INCOME').length})
              </button>
              <button
                onClick={() => setFilterType('EXPENSE')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterType === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                - Chi Tiền ({transactions.filter((t) => t.type === 'EXPENSE').length})
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo mã chứng từ (PT-xxx, PC-xxx), nội dung, người nộp/nhận..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-muted/40 border border-input rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">Mã Chứng Từ</th>
                  <th className="p-3">Loại Dòng Tiền</th>
                  <th className="p-3">Nội Dung Thu / Chi</th>
                  <th className="p-3">Số Tiền</th>
                  <th className="p-3">Hình Thức</th>
                  <th className="p-3">Đối Tác / Người Nộp-Nhận</th>
                  <th className="p-3">Thời Gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                      Không tìm thấy bản ghi chứng từ nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredTxs.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                      {/* Code */}
                      <td className="p-3 font-mono font-bold text-foreground">
                        {tx.code}
                      </td>

                      {/* Type Badge */}
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.type === 'INCOME'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {tx.type === 'INCOME' ? '+ THU' : '- CHI'} • {tx.categoryLabel}
                        </span>
                      </td>

                      {/* Title & Notes */}
                      <td className="p-3 max-w-[260px]">
                        <p className="font-semibold text-foreground truncate">{tx.title}</p>
                        {tx.notes && <p className="text-[10px] text-muted-foreground truncate">{tx.notes}</p>}
                      </td>

                      {/* Amount */}
                      <td className="p-3 font-mono font-extrabold text-sm whitespace-nowrap">
                        <span className={tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {tx.type === 'INCOME' ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                        </span>
                      </td>

                      {/* Method */}
                      <td className="p-3 text-muted-foreground whitespace-nowrap">
                        <Badge variant="outline" className="text-[10px]">
                          {tx.paymentMethodLabel}
                        </Badge>
                      </td>

                      {/* Counterpart & Performer */}
                      <td className="p-3 whitespace-nowrap">
                        <p className="font-medium text-foreground">{tx.counterpart}</p>
                        <p className="text-[10px] text-muted-foreground">Thực hiện: {tx.performedBy}</p>
                      </td>

                      {/* Created At */}
                      <td className="p-3 text-[11px] text-muted-foreground whitespace-nowrap font-mono">
                        {tx.createdAt}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* MODAL 1: TẠO PHIẾU THU / BƠM VỐN QUỸ                      */}
      {/* ========================================================= */}
      <Dialog open={showIncomeModal} onOpenChange={setShowIncomeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600">
                <Plus className="w-5 h-5" />
              </span>
              <span>Tạo Phiếu Thu / Bơm Vốn Quỹ Tiền Mặt</span>
            </DialogTitle>
            <DialogDescription>
              Ghi nhận khoản thu nạp vốn lưu động hoặc thu khác vào quỹ Căng tin Đại Nam
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateIncome} className="space-y-3.5 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Nội dung khoản thu *</label>
              <input
                type="text"
                required
                placeholder="VD: Bơm vốn lưu động đầu kỳ cho quầy thu ngân"
                value={incomeForm.title}
                onChange={(e) => setIncomeForm({ ...incomeForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Số tiền (VNĐ) *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  placeholder="VD: 5000000"
                  value={incomeForm.amount}
                  onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-mono font-bold text-emerald-600 focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Hình thức thanh toán</label>
                <select
                  value={incomeForm.paymentMethod}
                  onChange={(e) => setIncomeForm({ ...incomeForm, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
                >
                  <option value="CASH">Tiền mặt tại quỹ</option>
                  <option value="BANK_TRANSFER">Chuyển khoản Ngân hàng</option>
                  <option value="QRMOMO">QR MoMo / VNPAY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Người / Đơn vị nộp tiền</label>
              <input
                type="text"
                value={incomeForm.counterpart}
                onChange={(e) => setIncomeForm({ ...incomeForm, counterpart: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Ghi chú chứng từ</label>
              <textarea
                rows={2}
                placeholder="Ghi chú thêm về lý do thu..."
                value={incomeForm.notes}
                onChange={(e) => setIncomeForm({ ...incomeForm, notes: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowIncomeModal(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Xác Nhận Thu Tiền
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 2: TẠO PHIẾU CHI VẬN HÀNH                           */}
      {/* ========================================================= */}
      <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <span className="p-2 rounded-xl bg-rose-500/15 text-rose-600">
                <Minus className="w-5 h-5" />
              </span>
              <span>Tạo Phiếu Chi Tiền Mặt / Vận Hành</span>
            </DialogTitle>
            <DialogDescription>
              Xuất quỹ chi trả tiền điện, nước, gas, mua thiết bị hoặc lương ca nhân viên
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateExpense} className="space-y-3.5 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Nội dung khoản chi *</label>
              <input
                type="text"
                required
                placeholder="VD: Chi tiền gas nấu ăn & tiền điện Căng tin Tòa G"
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Số tiền chi (VNĐ) *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  placeholder="VD: 2500000"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-mono font-bold text-rose-600 focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Danh mục chi phí</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
                >
                  <option value="OPERATING_COST">Điện, Nước, Gas Căng tin</option>
                  <option value="SALARY">Lương / Thưởng ca nhân viên</option>
                  <option value="OTHER">Mua sắm công cụ dụng cụ bếp</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Người / Đơn vị nhận tiền</label>
              <input
                type="text"
                value={expenseForm.counterpart}
                onChange={(e) => setExpenseForm({ ...expenseForm, counterpart: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Ghi chú chứng từ</label>
              <textarea
                rows={2}
                placeholder="Ghi chú hóa đơn VAT, số biên lai..."
                value={expenseForm.notes}
                onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowExpenseModal(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="default" className="bg-rose-600 hover:bg-rose-700 text-white font-bold">
                Xác Nhận Xuất Quỹ Chi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 3: ADMIN NẠP TIỀN TRỢ GIÁ VÍ SINH VIÊN             */}
      {/* ========================================================= */}
      <Dialog open={showStudentTopupModal} onOpenChange={setShowStudentTopupModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <span className="p-2 rounded-xl bg-orange-500/15 text-orange-600">
                <Wallet className="w-5 h-5" />
              </span>
              <span>Nạp Tiền Trợ Giá Ví Sinh Viên DNU Pay</span>
            </DialogTitle>
            <DialogDescription>
              Admin/Kế toán nạp tiền thưởng, học bổng hoặc tiền ăn vào ví DNU Pay của sinh viên
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdminTopupStudent} className="space-y-3.5 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Mã Sinh Viên (MSSV) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 2110001"
                  value={studentTopupForm.mssv}
                  onChange={(e) => setStudentTopupForm({ ...studentTopupForm, mssv: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Số tiền nạp (VNĐ) *</label>
                <input
                  type="number"
                  required
                  min="10000"
                  step="10000"
                  placeholder="VD: 100000"
                  value={studentTopupForm.amount}
                  onChange={(e) => setStudentTopupForm({ ...studentTopupForm, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-mono font-bold text-orange-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Họ và tên Sinh viên</label>
              <input
                type="text"
                required
                value={studentTopupForm.studentName}
                onChange={(e) => setStudentTopupForm({ ...studentTopupForm, studentName: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Lý do nạp trợ giá / cấp vốn</label>
              <input
                type="text"
                value={studentTopupForm.reason}
                onChange={(e) => setStudentTopupForm({ ...studentTopupForm, reason: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              />
            </div>

            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-800 dark:text-orange-300 text-[11px] space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Hiệu Lực Tức Thì:</span>
              </p>
              <p>Số dư ví của sinh viên sẽ tăng ngay lập tức và sinh viên có thể dùng để ăn trưa tại POS / Kiosk / App ngay sau khi nạp.</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowStudentTopupModal(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="default" className="bg-orange-600 hover:bg-orange-700 text-white font-bold">
                Xác Nhận Nạp Ví Cho Sinh Viên
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
