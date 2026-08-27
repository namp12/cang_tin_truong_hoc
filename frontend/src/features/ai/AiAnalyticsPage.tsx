import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { formatCurrency, formatNumber } from '../../utils/format.js';
import { dnuStore } from '../../services/dnuStore.js';
import { orderStorage } from '../../services/orderStorage.js';
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  BrainCircuit, 
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  Clock
} from 'lucide-react';

export const AiAnalyticsPage: React.FC = () => {
  // Fetch real data
  const orders = orderStorage.getOrders();
  const stocks = dnuStore.getStocks();

  // Define dates
  const todayStr = '2026-08-27';
  const yesterdayStr = '2026-08-26';

  const todayOrders = orders.filter(o => o.orderedAt.includes(todayStr));
  const yesterdayOrders = orders.filter(o => o.orderedAt.includes(yesterdayStr));

  // Compute revenues
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.finalAmount, 0);
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.finalAmount, 0);

  // Compute best sellers today vs yesterday
  const itemSalesToday: { [name: string]: number } = {};
  todayOrders.forEach(o => {
    o.itemsDetail.forEach(item => {
      itemSalesToday[item.name] = (itemSalesToday[item.name] || 0) + item.qty;
    });
  });

  const itemSalesYesterday: { [name: string]: number } = {};
  yesterdayOrders.forEach(o => {
    o.itemsDetail.forEach(item => {
      itemSalesYesterday[item.name] = (itemSalesYesterday[item.name] || 0) + item.qty;
    });
  });

  const sortedBestSellersToday = Object.entries(itemSalesToday)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);

  const sortedBestSellersYesterday = Object.entries(itemSalesYesterday)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);

  // Last 7 days comparison trend
  const getNDaysAgo = (n: number) => {
    const d = new Date('2026-08-27');
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  };

  const last7DaysData = Array.from({ length: 7 }, (_, i) => {
    const dateStr = getNDaysAgo(6 - i);
    const dayOrders = orders.filter(o => o.orderedAt.includes(dateStr));
    const revenue = dayOrders.reduce((sum, o) => sum + o.finalAmount, 0);
    return {
      date: dateStr,
      ordersCount: dayOrders.length,
      revenue,
    };
  });

  // Dynamic forecast list for tomorrow
  const tomorrowForecasts = Object.keys(itemSalesToday).map(name => {
    const qtyToday = itemSalesToday[name];
    const qtyYesterday = itemSalesYesterday[name] || 0;
    let pctChange = 0;
    if (qtyYesterday > 0) {
      pctChange = Math.round(((qtyToday - qtyYesterday) / qtyYesterday) * 100);
    } else {
      pctChange = qtyToday > 0 ? 100 : 0;
    }

    const trendPrefix = pctChange >= 0 ? '+' : '';
    const trendStr = `${trendPrefix}${pctChange}%`;
    const forecastQty = Math.round(qtyToday * (pctChange >= 0 ? 1.15 : 0.85)) || 20;

    let reason = '';
    if (pctChange >= 15) {
      reason = `Tăng trưởng mạnh ca học tự chọn. Đề xuất tăng sản lượng chuẩn bị lên ${forecastQty} suất.`;
    } else if (pctChange <= -15) {
      reason = `Nhu cầu giảm nhẹ. Đề xuất giảm sản lượng về ${forecastQty} suất để chống lãng phí.`;
    } else {
      reason = `Nhu cầu ổn định. Duy trì chuẩn bị thông thường.`;
    }

    return {
      food: name,
      quantity: forecastQty,
      trend: trendStr,
      reason,
      isPositive: pctChange >= 0,
    };
  }).slice(0, 5);

  if (tomorrowForecasts.length === 0) {
    tomorrowForecasts.push(
      { food: 'Cơm Rang Dưa Bò Hà Nội', quantity: 165, trend: '+22%', reason: 'Lịch học tập trung ca trưa Khoa CNTT & Dược Tòa G', isPositive: true },
      { food: 'Bún Chả Hà Nội Nướng Than', quantity: 135, trend: '+15%', reason: 'Nhu cầu cao điểm giải lao 11:30 - 12:30', isPositive: true },
      { food: 'Trà Đào Cam Sả Hà Đông', quantity: 150, trend: '+28%', reason: 'Dự báo thời tiết Hà Đông nắng nóng ca chiều (34°C)', isPositive: true }
    );
  }

  // Dynamic AI recommendations based on warehouse scan
  const recommendations: any[] = [];
  let recId = 1;
  const todayDate = new Date('2026-08-27');

  // Check soon expiring items (critical)
  stocks.forEach(item => {
    if (item.expiryDate) {
      const expDate = new Date(item.expiryDate);
      const diffTime = expDate.getTime() - todayDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 3 && diffDays >= 0) {
        recommendations.push({
          id: recId++,
          title: `Cảnh báo HSD: ${item.name} (${diffDays} ngày)`,
          desc: `Lô hàng ${item.name} sẽ hết hạn vào ngày ${item.expiryDate}. Khuyến nghị ưu tiên các món liên quan như Cơm, Phở hoặc đồ uống để đẩy tồn kho.`,
          confidence: 99,
          priority: 'CRITICAL',
          action: 'Đưa lên Menu Hôm nay',
        });
      }
    }
  });

  // Check low stock
  stocks.forEach(item => {
    if (item.quantity <= item.minStock) {
      recommendations.push({
        id: recId++,
        title: `Nhập gấp nguyên liệu: ${item.name}`,
        desc: `Tồn kho hiện tại của ${item.name} chỉ còn ${item.quantity} ${item.unit} (Dưới mức an toàn ${item.minStock} ${item.unit}). Cần tạo phiếu nhập gấp từ nhà phân phối ${item.supplierName || 'đối tác'}.`,
        confidence: 95,
        priority: 'HIGH',
        action: 'Tạo Phiếu Nhập Kho',
      });
    }
  });

  // Check overstock
  stocks.forEach(item => {
    if (item.quantity >= item.minStock * 8) {
      recommendations.push({
        id: recId++,
        title: `Tồn kho quá nhiều: ${item.name}`,
        desc: `Mặt hàng ${item.name} đang overstock (${item.quantity} ${item.unit} so với Min ${item.minStock} ${item.unit}). Gợi ý tạo combo khuyến mại hoặc tạm dừng nhập hàng.`,
        confidence: 88,
        priority: 'MEDIUM',
        action: 'Đề xuất Giảm giá',
      });
    }
  });

  // Default recommendation if none
  if (recommendations.length === 0) {
    recommendations.push({
      id: recId++,
      title: 'Chuẩn bị thêm thịt bò thăn & dưa cải',
      desc: 'Doanh số Cơm Rang Dưa Bò đang duy trì ở mức cao. Đề xuất nhập bổ sung thực phẩm tươi trước 06:00 sáng mai.',
      confidence: 92,
      priority: 'HIGH',
      action: 'Liên hệ HANOIFOOD',
    });
  }

  const maxRevenue = Math.max(...last7DaysData.map(d => d.revenue), 100000);

  return (
    <div className="space-y-6">
      {/* AI Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Demand Forecasting Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Trí Tuệ Nhân Tạo Dự Báo & Tối Ưu Tồn Kho
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-medium">
            AI tự động phân tích dữ liệu {orders.length} đơn hàng thực tế của Căng tin Đại học Đại Nam và tồn kho {stocks.length} nguyên liệu để cảnh báo rủi ro hết hạn, tối ưu hóa lượng suất ăn chuẩn bị hàng ngày và lên lịch nhập kho chuẩn xác.
          </p>
        </div>
      </div>

      {/* KPI AI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Doanh thu & Đơn hàng Hôm nay</span>
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-foreground mt-2">{formatCurrency(todayRevenue)}</h3>
          <p className="text-[11px] text-muted-foreground mt-1 font-semibold">
            Đạt {todayOrders.length} đơn hàng (Hôm qua: {yesterdayOrders.length} đơn - {formatCurrency(yesterdayRevenue)})
          </p>
        </Card>

        <Card className="p-4 border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Món Best-Seller Hôm Nay</span>
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
          <h3 className="text-lg font-extrabold text-foreground truncate mt-2">
            {sortedBestSellersToday[0]?.name || 'Chưa ghi nhận'}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1 font-semibold">
            Bán ra {sortedBestSellersToday[0]?.qty || 0} phần hôm nay (Hôm qua: {sortedBestSellersYesterday[0]?.name || 'N/A'} - {sortedBestSellersYesterday[0]?.qty || 0} phần)
          </p>
        </Card>

        <Card className="p-4 border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-500">Khuyến Nghị Từ Kho Thực Tế</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-foreground mt-2">{recommendations.length} Chỉ thị</h3>
          <p className="text-[11px] text-muted-foreground mt-1 font-semibold">
            Có {recommendations.filter(r => r.priority === 'CRITICAL').length} lô sắp hết hạn dùng gấp
          </p>
        </Card>
      </div>

      {/* Demand Forecast & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Khuyến Nghị Số Suất Chuẩn Bị Ngày Mai (28/08/2026)</CardTitle>
                  <CardDescription>Số lượng món dự đoán dựa trên xu hướng bán hàng của ca trưa/ca tối</CardDescription>
                </div>
                <Badge variant="success" className="font-extrabold text-white">Confidence: 94%</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {tomorrowForecasts.map((fc, idx) => (
                  <div key={idx} className="p-4 hover:bg-muted/40 transition-colors flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-foreground truncate">{fc.food}</h4>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
                          fc.isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {fc.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {fc.trend}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 font-medium">{fc.reason}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-foreground">{fc.quantity}</span>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Suất đề xuất</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 7-day Sales Chart Card */}
          <Card className="p-5">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle>So Sánh Biến Động Doanh Thu 7 Ngày</CardTitle>
              <CardDescription>Dữ liệu bán hàng chi tiết từ {getNDaysAgo(6)} đến nay</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="flex justify-between items-end h-40 pt-4 px-2 border-b border-border">
                {last7DaysData.map((day, idx) => {
                  const barHeight = Math.round((day.revenue / maxRevenue) * 110) || 4;
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-mono px-2 py-0.5 rounded absolute -translate-y-8 font-bold pointer-events-none">
                        {formatCurrency(day.revenue)} ({day.ordersCount}đơn)
                      </div>
                      <div 
                        className={`w-7 sm:w-10 rounded-t-lg transition-all duration-300 cursor-pointer ${
                          day.date === todayStr 
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/25 hover:from-emerald-500 hover:to-emerald-300' 
                            : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                        }`}
                        style={{ height: `${barHeight}px` }}
                      ></div>
                      <div className={`text-[10px] font-extrabold mt-2.5 font-mono ${
                        day.date === todayStr ? 'text-emerald-500' : 'text-muted-foreground'
                      }`}>
                        {day.date.slice(-2)}/{day.date.slice(5, 7)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground font-semibold px-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-sm"></div>
                  <span>Hôm nay (27/08)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-sm"></div>
                  <span>Các ngày trước</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Actionable Recommendations */}
        <div className="space-y-4">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <CardTitle>Khuyến Nghị Từ Kho & AI</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5 flex-1 overflow-y-auto max-h-[70vh] lg:max-h-none pr-1">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className={`p-3.5 rounded-xl border space-y-2.5 transition-all hover:scale-[1.01] ${
                    rec.priority === 'CRITICAL' 
                      ? 'border-rose-500/30 bg-rose-500/5' 
                      : rec.priority === 'HIGH' 
                        ? 'border-amber-500/30 bg-amber-500/5' 
                        : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-extrabold text-foreground leading-snug flex items-center gap-1.5">
                      {rec.priority === 'CRITICAL' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      ) : rec.priority === 'HIGH' ? (
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <Lightbulb className="w-4 h-4 text-primary shrink-0" />
                      )}
                      {rec.title}
                    </span>
                    <Badge variant={rec.priority === 'CRITICAL' ? 'destructive' : 'warning'} className="font-mono text-[9px] py-0 font-extrabold">
                      {rec.confidence}% AI
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold">{rec.desc}</p>
                  <Button 
                    variant={rec.priority === 'CRITICAL' ? 'destructive' : 'outline'} 
                    size="sm" 
                    className="w-full text-[10px] h-7 font-extrabold uppercase mt-1"
                  >
                    {rec.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
