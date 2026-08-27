import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  Calendar, 
  Download,
  Receipt,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';

export const FinancePage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'WEEK' | 'MONTH' | 'YEAR'>('WEEK');

  const cashflowData = [
    { day: 'T2', revenue: 24500000, cost: 13200000, profit: 11300000 },
    { day: 'T3', revenue: 28200000, cost: 14800000, profit: 13400000 },
    { day: 'T4', revenue: 31500000, cost: 16100000, profit: 15400000 },
    { day: 'T5 (Hôm nay)', revenue: 35800000, cost: 18200000, profit: 17600000 },
    { day: 'T6', revenue: 29000000, cost: 15000000, profit: 14000000 },
    { day: 'T7', revenue: 16500000, cost: 8900000, profit: 7600000 },
    { day: 'CN', revenue: 8200000, cost: 4500000, profit: 3700000 },
  ];

  const paymentMethods = [
    { method: 'Ví Sinh Viên DNU Pay', share: '48%', amount: 83500000, icon: Wallet, color: 'text-orange-500 bg-orange-500/10' },
    { method: 'QR Chuyển Khoản MoMo / VNPAY', share: '34%', amount: 59100000, icon: CreditCard, color: 'text-blue-500 bg-blue-500/10' },
    { method: 'Tiền Mặt Tại Quầy POS', share: '18%', amount: 31100000, icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
  ];

  const costBreakdown = [
    { label: 'Nguyên Liệu Thực Phẩm Tươi', amount: 90700000, percent: '52%' },
    { label: 'Nhân Công (Thu Ngân & Bếp)', amount: 43600000, percent: '25%' },
    { label: 'Điện, Nước & Gas Căng Tin', amount: 20900000, percent: '12%' },
    { label: 'Khấu Hao Dụng Cụ & Thiết Bị POS', amount: 19200000, percent: '11%' },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Dòng Tiền & Quản Trị Tài Chính DNU</h2>
          <p className="text-xs text-muted-foreground">Theo dõi doanh thu, cơ cấu giá vốn, đối soát thanh toán và lợi nhuận ròng 3 căng tin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Xuất Báo Cáo Sổ Quỹ
          </Button>
        </div>
      </div>

      {/* 4 Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Tổng Doanh Thu Tuần</p>
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-2">173.700.000 đ</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.8% so với tuần trước</span>
          </p>
        </Card>

        <Card className="p-4 bg-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Chi Phí Hoạt Động (Cost)</p>
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-2">90.700.000 đ</p>
          <p className="text-[11px] text-muted-foreground mt-1">Chiếm 52.2% doanh thu gộp</p>
        </Card>

        <Card className="p-4 bg-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Lợi Nhuận Ròng (Net Profit)</p>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">83.000.000 đ</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Biên lợi nhuận: 47.8%</p>
        </Card>

        <Card className="p-4 bg-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Ví DNU Pay Chiếm</p>
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 mt-2">48.0%</p>
          <p className="text-[11px] text-muted-foreground mt-1">Kênh thanh toán số 1 của SV</p>
        </Card>
      </div>

      {/* Cashflow Chart */}
      <Card>
        <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between border-b border-border">
          <CardTitle className="text-sm font-bold text-foreground">Biểu Đồ Doanh Thu & Lợi Nhuận Tuần Này</CardTitle>
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg text-xs font-semibold">
            {['Tuần này', 'Tháng này', 'Năm nay'].map((tab, i) => (
              <button
                key={tab}
                className={`px-3 py-1 rounded-md transition-colors ${
                  i === 0 ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v / 1000000}tr`} />
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#EA580C" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" name="Lợi nhuận ròng" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods & Cost Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payment Channels */}
        <Card>
          <CardHeader className="p-4 pb-2 border-b border-border">
            <CardTitle className="text-sm font-bold text-foreground">Cơ Cấu Phương Thức Thanh Toán</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {paymentMethods.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.method} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${p.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{p.method}</p>
                      <p className="text-[11px] text-muted-foreground">Tỷ trọng: {p.share}</p>
                    </div>
                  </div>
                  <p className="text-xs font-extrabold text-foreground">{formatCurrency(p.amount)}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader className="p-4 pb-2 border-b border-border">
            <CardTitle className="text-sm font-bold text-foreground">Phân Bổ Chi Phí Vận Hành</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {costBreakdown.map((c) => (
              <div key={c.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{c.label}</span>
                  <span className="font-bold text-foreground">{formatCurrency(c.amount)} ({c.percent})</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: c.percent }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
