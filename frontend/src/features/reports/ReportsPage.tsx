import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Clock, 
  Store, 
  TrendingUp, 
  FileSpreadsheet, 
  Printer, 
  CheckCircle2, 
  UtensilsCrossed 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('TODAY');

  const shiftData = [
    { shift: 'Ca Sáng (06:30 - 09:30)', orders: 185, revenue: 6475000, topFood: 'Bánh Mì Chảo & Phở Bò Tái Lăn' },
    { shift: 'Ca Trưa (11:00 - 13:30)', orders: 640, revenue: 22400000, topFood: 'Cơm Rang Dưa Bò & Bún Chả' },
    { shift: 'Ca Chiều & Tối (16:30 - 19:30)', orders: 215, revenue: 6925000, topFood: 'Cơm Gà Xối Mỡ & Trà Đào' },
  ];

  const canteenComparison = [
    { name: 'Căng tin Tòa G (Hà Đông)', revenue: 19800000, orders: 580, avgOrder: 34100 },
    { name: 'Căng tin Tòa A-B DNU', revenue: 11200000, orders: 340, avgOrder: 32900 },
    { name: 'DNU Garden & Coffee', revenue: 4800000, orders: 160, avgOrder: 30000 },
  ];

  const handleExportExcel = () => {
    alert('Đang tạo và tải xuống file Báo Cáo Doanh Thu Căng Tin DNU (.xlsx)...');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Báo Cáo Kinh Doanh Căng Tin DNU</h2>
          <p className="text-xs text-muted-foreground">Thống kê doanh số theo ca phục vụ, phân tích 3 cơ sở căng tin và xuất dữ liệu đối soát</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrintReport} variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />}>
            In Báo Cáo
          </Button>
          <Button onClick={handleExportExcel} variant="default" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
            Xuất File Excel
          </Button>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card">
          <p className="text-xs font-semibold text-muted-foreground">Tổng Doanh Số Hôm Nay</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">35.800.000 đ</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Đạt 119% chỉ tiêu ngày</p>
        </Card>

        <Card className="p-4 bg-card">
          <p className="text-xs font-semibold text-muted-foreground">Tổng Suất Ăn & Đồ Uống</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">1.040 suất</p>
          <p className="text-[11px] text-muted-foreground mt-1">Phục vụ sinh viên K16 - K18 DNU</p>
        </Card>

        <Card className="p-4 bg-card">
          <p className="text-xs font-semibold text-muted-foreground">Giá Trị Đơn Trung Bình (AOV)</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">34.400 đ</p>
          <p className="text-[11px] text-muted-foreground mt-1">Phù hợp định mức sinh viên</p>
        </Card>
      </div>

      {/* Shift Breakdown Table */}
      <Card>
        <CardHeader className="p-4 pb-2 border-b border-border">
          <CardTitle className="text-sm font-bold text-foreground">Báo Cáo Hiệu Suất Theo Ca Phục Vụ</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground">
            <thead className="bg-muted/50 text-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Khung Giờ / Ca Làm Việc</th>
                <th className="py-3 px-4">Số Đơn Hàng</th>
                <th className="py-3 px-4">Doanh Thu</th>
                <th className="py-3 px-4">Món Bán Chạy Nhất</th>
                <th className="py-3 px-4 text-right">Tỷ Trọng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shiftData.map((s, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">{s.shift}</td>
                  <td className="py-3.5 px-4 font-bold text-foreground">{s.orders} đơn</td>
                  <td className="py-3.5 px-4 font-extrabold text-primary">{formatCurrency(s.revenue)}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-foreground">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{s.topFood}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-foreground">
                    {idx === 1 ? (
                      <Badge variant="warning" className="text-[10px]">62.5% (Cao điểm)</Badge>
                    ) : (
                      <span>{idx === 0 ? '18.1%' : '19.4%'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Canteen Comparison Grid */}
      <Card>
        <CardHeader className="p-4 pb-2 border-b border-border">
          <CardTitle className="text-sm font-bold text-foreground">So Sánh Doanh Thu 3 Chi Nhánh Căng Tin DNU</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {canteenComparison.map((c) => (
              <div key={c.name} className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-xs text-foreground">{c.name}</h4>
                </div>
                <p className="text-lg font-extrabold text-foreground">{formatCurrency(c.revenue)}</p>
                <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1 border-t border-border">
                  <p>Số đơn: <strong className="text-foreground">{c.orders} đơn</strong></p>
                  <p>Đơn TB: <strong className="text-foreground">{formatCurrency(c.avgOrder)}/đơn</strong></p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
