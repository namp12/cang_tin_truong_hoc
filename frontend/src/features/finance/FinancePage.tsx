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
  PieChart as PieIcon,
  BarChart3,
  Truck,
  Zap,
  Users,
  Package,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
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
    category: 'CAPITAL_INFLOW' as 'CAPITAL_INFLOW' | 'POS_ORDER' | 'WALLET_TOPUP' | 'OTHER',
    paymentMethod: 'CASH' as 'CASH' | 'BANK_TRANSFER',
    counterpart: 'Phòng Kế Toán / Ban Quản Lý DNU',
    canteenName: 'Căng tin Tòa G',
    notes: '',
  });

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'OPERATING_COST' as 'SUPPLIER_PAYMENT' | 'OPERATING_COST' | 'SALARY' | 'OTHER',
    paymentMethod: 'CASH' as 'CASH' | 'BANK_TRANSFER',
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
      code: `PT-DNU-${Date.now().toString().slice(-4)}`,
      type: 'INCOME',
      category: incomeForm.category,
      categoryLabel: incomeForm.category === 'CAPITAL_INFLOW' ? 'Bổ sung vốn lưu động' : 'Thu tiền dịch vụ ngoài',
      title: incomeForm.title || 'Thu tiền bổ sung quỹ căng tin',
      amount: amountNum,
      paymentMethod: incomeForm.paymentMethod,
      paymentMethodLabel: incomeForm.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản / Ví',
      counterpart: incomeForm.counterpart,
      performedBy: 'Kế toán Phạm Quỳnh Như',
      canteenName: incomeForm.canteenName,
      notes: incomeForm.notes,
    });

    setActionSuccess(`Đã lập Phiếu Thu ${formatCurrency(amountNum)} thành công!`);
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
      code: `PC-DNU-${Date.now().toString().slice(-4)}`,
      type: 'EXPENSE',
      category: expenseForm.category,
      categoryLabel:
        expenseForm.category === 'SUPPLIER_PAYMENT'
          ? 'Chi trả Nhà Cung Cấp'
          : expenseForm.category === 'OPERATING_COST'
          ? 'Chi phí Điện Nước & Vận hành'
          : 'Chi lương nhân sự & Phụ cấp',
      title: expenseForm.title || 'Chi tiền hoạt động căng tin',
      amount: amountNum,
      paymentMethod: expenseForm.paymentMethod,
      paymentMethodLabel: expenseForm.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản',
      counterpart: expenseForm.counterpart,
      performedBy: 'Căng tin Đại Nam',
      canteenName: expenseForm.canteenName,
      notes: expenseForm.notes,
    });

    setActionSuccess(`Đã lập Phiếu Chi ${formatCurrency(amountNum)} thành công!`);
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
      tx.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  // 7-day Cashflow Data for Bar/Area Chart
  const cashflowData = [
    { day: 'T2', thu: 24500000, chi: 13200000, lai: 11300000 },
    { day: 'T3', thu: 28200000, chi: 14800000, lai: 13400000 },
    { day: 'T4', thu: 31500000, chi: 16100000, lai: 15400000 },
    { day: 'T5', thu: 35800000, chi: 18200000, lai: 17600000 },
    { day: 'T6', thu: 29000000, chi: 15000000, lai: 14000000 },
    { day: 'T7', thu: 16500000, chi: 8900000, lai: 7600000 },
    { day: 'Hôm nay', thu: summary.totalIncome, chi: summary.totalExpense, lai: Math.max(0, summary.netBalance) },
  ];

  // Detailed Expense Breakdown for Donut Chart
  const expensePieData = [
    { name: 'Thực Phẩm & NCC (Thịt, Rau, Sữa)', value: summary.supplierExpense || 12450000, color: '#EA580C', icon: Truck },
    { name: 'Điện Nước & Mặt Bằng Tòa G', value: summary.operatingExpense || 3200000, color: '#3B82F6', icon: Zap },
    { name: 'Lương Nhân Sự (Bếp, Thu Ngân)', value: 5500000, color: '#10B981', icon: Users },
    { name: 'Bao Bì & Vật Tư Tiêu Hao', value: 1850000, color: '#8B5CF6', icon: Package },
  ];
  const totalCategorizedExpense = expensePieData.reduce((s, i) => s + i.value, 0);

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
            <h2 className="text-xl font-bold text-foreground tracking-tight">Sổ Quỹ & Quản Trị Tài Chính Căng Tin</h2>
            <Badge variant="primary" className="bg-orange-600 text-white font-mono text-[10px]">
              DNU TREASURY
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Theo dõi dòng tiền thu chi minh bạch, phân tích cơ cấu chi phí vận hành và quản lý số dư khả dụng
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setShowIncomeModal(true)}
            variant="default"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Lập Phiếu Thu Tiền
          </Button>

          <Button
            onClick={() => setShowExpenseModal(true)}
            variant="default"
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
            leftIcon={<Minus className="w-4 h-4" />}
          >
            - Lập Phiếu Chi Tiền
          </Button>

          <Button
            onClick={() => setShowStudentTopupModal(true)}
            variant="outline"
            size="sm"
            className="border-orange-500/40 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 font-bold text-xs"
            leftIcon={<Wallet className="w-4 h-4 text-orange-600" />}
          >
            ⚡ Trợ Cấp Ví Sinh Viên
          </Button>
        </div>
      </div>

      {/* 4 Financial KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Income */}
        <Card className="p-4 bg-gradient-to-br from-emerald-500/5 via-card to-card border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">1. TỔNG THU (TIỀN VÀO)</span>
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono tracking-tight">
            {formatCurrency(summary.totalIncome)}
          </p>
          <div className="mt-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex justify-between">
            <span>POS & Kiosk: <strong>{formatCurrency(summary.posIncome + summary.kioskIncome)}</strong></span>
            <span>Nạp ví: <strong>{formatCurrency(summary.walletTopupIncome)}</strong></span>
          </div>
        </Card>

        {/* 2. Total Expense */}
        <Card className="p-4 bg-gradient-to-br from-rose-500/5 via-card to-card border-rose-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-400">2. TỔNG CHI (TIỀN RA)</span>
            <span className="p-2 rounded-xl bg-rose-500/15 text-rose-600">
              <ArrowDownRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2 font-mono tracking-tight">
            {formatCurrency(summary.totalExpense)}
          </p>
          <div className="mt-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex justify-between">
            <span>Trả NCC: <strong>{formatCurrency(summary.supplierExpense)}</strong></span>
            <span>Vận hành: <strong>{formatCurrency(summary.operatingExpense)}</strong></span>
          </div>
        </Card>

        {/* 3. Net Cash Balance */}
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 via-card to-card border-blue-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-400">3. SỐ DƯ QUỸ KHẢ DỤNG (NET)</span>
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 font-mono tracking-tight">
            {formatCurrency(summary.netBalance)}
          </p>
          <div className="mt-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
            <span>= Tổng Thu trừ đi Tổng Chi thực tế</span>
          </div>
        </Card>

        {/* 4. DNU Pay Circulation */}
        <Card className="p-4 bg-gradient-to-br from-orange-500/10 via-card to-card border-orange-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-800 dark:text-orange-400">4. VÍ DNU PAY LƯU THÔNG</span>
            <span className="p-2 rounded-xl bg-orange-600 text-white shadow-xs">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-2 font-mono tracking-tight">
            {formatCurrency(summary.walletTopupIncome + 1250000)}
          </p>
          <div className="mt-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
            <span>Số dư sinh viên đang sẵn sàng thanh toán</span>
          </div>
        </Card>
      </div>

      {/* Visual Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Chart: Phân Chia Cơ Cấu Chi Phí (Donut Chart - 5 Cols) */}
        <Card className="lg:col-span-5 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-foreground">Phân Chia Cơ Cấu Chi Phí Căng Tin</h3>
            </div>
            <Badge variant="neutral" className="text-[10px]">THEO DANH MỤC</Badge>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed breakdown list */}
          <div className="space-y-2 pt-1 border-t border-border text-xs">
            {expensePieData.map((item, idx) => {
              const percent = Math.round((item.value / totalCategorizedExpense) * 100);
              return (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground truncate">{item.name}:</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="font-bold text-foreground">{formatCurrency(item.value)}</span>
                    <span className="font-semibold text-muted-foreground text-[11px] w-9 text-right">({percent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right Chart: Biểu Đồ Thu - Chi - Lãi 7 Ngày (Bar / Area Chart - 7 Cols) */}
        <Card className="lg:col-span-7 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-foreground">Biểu Đồ So Sánh Thu Nhập & Chi Phí (7 Ngày Gần Nhất)</h3>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Thu Vào
              </span>
              <span className="flex items-center gap-1 font-bold text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Chi Ra
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v / 1000000}tr`} />
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="thu" name="Tiền Thu Vào" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="chi" name="Tiền Chi Ra" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Sổ Quỹ Thu Chi Realtime (Live Cashbook Ledger Table) */}
      <Card className="overflow-hidden border-border">
        <CardHeader className="p-4 border-b border-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">Sổ Quỹ Thu Chi Realtime (Live Financial Ledger)</CardTitle>
              <Badge variant="primary" className="text-[10px] bg-orange-600 text-white font-mono">
                {filteredTxs.length} Chứng Từ
              </Badge>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'ALL' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tất Cả ({transactions.length})
              </button>
              <button
                onClick={() => setFilterType('INCOME')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                + Thu Vào ({transactions.filter((t) => t.type === 'INCOME').length})
              </button>
              <button
                onClick={() => setFilterType('EXPENSE')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                - Chi Ra ({transactions.filter((t) => t.type === 'EXPENSE').length})
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
              placeholder="Tìm theo mã chứng từ (PT-xxx, PC-xxx), nội dung, người nộp/nhận hoặc danh mục..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-muted/40 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">Mã Chứng Từ</th>
                  <th className="p-3">Loại Thu / Chi</th>
                  <th className="p-3">Danh Mục</th>
                  <th className="p-3">Nội Dung Chi Tiết</th>
                  <th className="p-3">Số Tiền</th>
                  <th className="p-3">Hình Thức</th>
                  <th className="p-3">Người Nộp / Nhận</th>
                  <th className="p-3">Thời Gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground text-xs">
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
                        {tx.type === 'INCOME' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] border border-emerald-500/20">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>Thu Vào</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold text-[10px] border border-rose-500/20">
                            <ArrowDownRight className="w-3 h-3" />
                            <span>Chi Ra</span>
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="p-3 font-semibold text-muted-foreground">
                        {tx.categoryLabel || tx.category}
                      </td>

                      {/* Title */}
                      <td className="p-3 font-medium text-foreground max-w-xs truncate" title={tx.title}>
                        {tx.title}
                      </td>

                      {/* Amount */}
                      <td className="p-3 font-mono font-black text-sm whitespace-nowrap">
                        <span className={tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {tx.type === 'INCOME' ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="p-3">
                        <Badge variant="neutral" className="text-[10px]">
                          {tx.paymentMethodLabel || tx.paymentMethod}
                        </Badge>
                      </td>

                      {/* Counterpart */}
                      <td className="p-3 text-muted-foreground">
                        <p className="font-semibold text-foreground">{tx.counterpart}</p>
                        <p className="text-[10px]">Thực hiện: {tx.performedBy}</p>
                      </td>

                      {/* Time */}
                      <td className="p-3 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                        {formatDateTime(tx.createdAt)}
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
      {/* MODAL 1: LẬP PHIẾU THU TIỀN                               */}
      {/* ========================================================= */}
      <Dialog open={showIncomeModal} onOpenChange={setShowIncomeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <Plus className="w-5 h-5" />
              <span>Lập Phiếu Thu Tiền / Bổ Sung Vốn</span>
            </DialogTitle>
            <DialogDescription>
              Ghi nhận nguồn thu ngoài, vốn cấp từ nhà trường hoặc hoàn ứng vào sổ quỹ
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateIncome} className="space-y-3 text-xs py-2">
            <div>
              <label className="block font-semibold text-foreground mb-1">Danh mục thu *</label>
              <select
                value={incomeForm.category}
                onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              >
                <option value="CAPITAL_INFLOW">Bổ sung vốn lưu động / Cấp ngân sách</option>
                <option value="POS_ORDER">Thu tiền dịch vụ ngoài POS</option>
                <option value="WALLET_TOPUP">Thu nạp ví trực tiếp tại quầy</option>
                <option value="OTHER">Thu thanh lý phế liệu / Thu khác</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Số tiền thu (VNĐ) *</label>
              <input
                type="number"
                required
                min={1000}
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                placeholder="Ví dụ: 5000000"
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-mono font-bold text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Nội dung thu tiền *</label>
              <input
                type="text"
                required
                value={incomeForm.title}
                onChange={(e) => setIncomeForm({ ...incomeForm, title: e.target.value })}
                placeholder="Ví dụ: Cấp bổ sung quỹ chi tiêu đầu tháng 9"
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-foreground mb-1">Hình thức *</label>
                <select
                  value={incomeForm.paymentMethod}
                  onChange={(e) => setIncomeForm({ ...incomeForm, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
                >
                  <option value="CASH">Tiền mặt</option>
                  <option value="BANK_TRANSFER">Chuyển khoản</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Người nộp tiền</label>
                <input
                  type="text"
                  value={incomeForm.counterpart}
                  onChange={(e) => setIncomeForm({ ...incomeForm, counterpart: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
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
      {/* MODAL 2: LẬP PHIẾU CHI TIỀN                               */}
      {/* ========================================================= */}
      <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <Minus className="w-5 h-5" />
              <span>Lập Phiếu Chi Quỹ / Thanh Toán</span>
            </DialogTitle>
            <DialogDescription>
              Chi trả tiền hàng cho Nhà Cung Cấp, thanh toán điện nước hoặc chi lương nhân sự
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateExpense} className="space-y-3 text-xs py-2">
            <div>
              <label className="block font-semibold text-foreground mb-1">Loại chi phí *</label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              >
                <option value="SUPPLIER_PAYMENT">Chi trả Nhà Cung Cấp thực phẩm</option>
                <option value="OPERATING_COST">Chi phí Điện Nước & Mặt Bằng Tòa G</option>
                <option value="SALARY">Chi Lương & Phụ Cấp Nhân Sự</option>
                <option value="OTHER">Chi mua sắm vật tư tiêu hao / Bao bì</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Số tiền chi (VNĐ) *</label>
              <input
                type="number"
                required
                min={1000}
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                placeholder="Ví dụ: 3500000"
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-mono font-bold text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Lý do / Nội dung chi *</label>
              <input
                type="text"
                required
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                placeholder="Ví dụ: Quyết toán tiền thịt gà CP Foods đợt 2"
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-foreground mb-1">Hình thức *</label>
                <select
                  value={expenseForm.paymentMethod}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
                >
                  <option value="CASH">Tiền mặt</option>
                  <option value="BANK_TRANSFER">Chuyển khoản</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Người / Đơn vị nhận</label>
                <input
                  type="text"
                  value={expenseForm.counterpart}
                  onChange={(e) => setExpenseForm({ ...expenseForm, counterpart: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowExpenseModal(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="default" className="bg-rose-600 hover:bg-rose-700 text-white font-bold">
                Xác Nhận Chi Tiền
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 3: ADMIN NẠP TRỢ CẤP VÍ SINH VIÊN                  */}
      {/* ========================================================= */}
      <Dialog open={showStudentTopupModal} onOpenChange={setShowStudentTopupModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <Wallet className="w-5 h-5" />
              <span>Nạp Tiền Trợ Giá / Học Bổng Ví Sinh Viên</span>
            </DialogTitle>
            <DialogDescription>
              Cộng trực tiếp số dư vào Ví DNU Pay của sinh viên từ ngân sách căng tin
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdminTopupStudent} className="space-y-3 text-xs py-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-foreground mb-1">Mã SV (MSSV) *</label>
                <input
                  type="text"
                  required
                  value={studentTopupForm.mssv}
                  onChange={(e) => setStudentTopupForm({ ...studentTopupForm, mssv: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Họ tên sinh viên *</label>
                <input
                  type="text"
                  required
                  value={studentTopupForm.studentName}
                  onChange={(e) => setStudentTopupForm({ ...studentTopupForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Số tiền nạp trợ cấp (VNĐ) *</label>
              <input
                type="number"
                required
                min={10000}
                value={studentTopupForm.amount}
                onChange={(e) => setStudentTopupForm({ ...studentTopupForm, amount: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg font-mono font-bold text-sm text-orange-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Lý do nạp trợ cấp</label>
              <input
                type="text"
                value={studentTopupForm.reason}
                onChange={(e) => setStudentTopupForm({ ...studentTopupForm, reason: e.target.value })}
                className="w-full px-3 py-2 bg-muted/40 border border-input rounded-lg"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowStudentTopupModal(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="default" className="bg-orange-600 hover:bg-orange-700 text-white font-bold">
                Xác Nhận Nạp Vào Ví
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
