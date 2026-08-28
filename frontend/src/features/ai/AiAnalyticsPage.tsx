import React, { useState } from 'react';
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
  Clock,
  Send,
  MessageSquare,
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiAnalyticsPage: React.FC = () => {
  // Fetch real data
  const orders = orderStorage.getOrders();
  const stocks = dnuStore.getStocks();

  // AI Copilot Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: '🤖 Xin chào Bếp trưởng & Ban Quản Lý Căng Tin DNU! Tôi là AI Canteen Copilot. Tôi có thể giúp bạn dự báo số suất ăn trưa/tối, kiểm tra nguyên liệu tồn kho cần nhập gấp, hoặc gợi ý combo khuyến mãi.',
      time: 'Vừa xong',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString().slice(0, 5),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('dự báo') || q.includes('suất') || q.includes('cơm gà') || q.includes('bún chả')) {
        reply = `📊 **Dự Báo Sản Lượng Ca Trưa Hôm Nay (28/08/2026):**\n- **Cơm Rang Dưa Bò**: Đề xuất nấu **55 suất** (+18% do thứ 6 sinh viên học đông).\n- **Bún Chả Nướng Than**: Đề xuất **45 suất**.\n- **Trà Đào Cam Sả**: Đề xuất pha **60 ly** (nhiệt độ Hà Đông dự báo 34°C, nhu cầu nước giải khát tăng cao).\n👉 *Khuyến nghị*: Bếp nên sơ chế thịt bò và ướp chả từ 09:30 để kịp phục vụ lúc 11:30 cao điểm!`;
      } else if (q.includes('kho') || q.includes('tồn') || q.includes('hết hạn') || q.includes('minstock') || q.includes('thiếu')) {
        const lowStockItems = stocks.filter(s => s.available <= s.minStock);
        if (lowStockItems.length > 0) {
          reply = `⚠️ **Cảnh Báo Tồn Kho Cận Ngưỡng An Toàn:**\n${lowStockItems.map(s => `• **${s.name}**: Còn ${s.available} ${s.unit} (Ngưỡng an toàn: ${s.minStock} ${s.unit}) - *Nhà cung cấp: ${s.supplierName}*`).join('\n')}\n👉 *Hành động*: Bạn có thể qua tab **Kho Nguyên Liệu** và bấm nút **[⚡ 1-Click Đặt Hàng & Nhập Kho]** để bổ sung ngay lập tức!`;
        } else {
          reply = `✅ **Trạng Thái Kho Hoàn Hảo**: Toàn bộ ${stocks.length} mặt hàng nguyên liệu đều đang ở mức an toàn trên ngưỡng minStock. Không có nguy cơ đứt gãy chế biến trong 48h tới.`;
        }
      } else if (q.includes('combo') || q.includes('khuyến mãi') || q.includes('tăng doanh thu')) {
        reply = `💡 **Đề Xuất Combo Vàng Cho Sinh Viên Tuần Này:**\n1. **Combo "No Nê Đạt A"**: Cơm Rang Dưa Bò + Trà Đào Cam Sả (Giá lẻ 50k ➔ Giảm còn **42k**, dự kiến tăng doanh thu 22%).\n2. **Combo "Sáng Năng Lượng"**: Bánh Mì Chảo + Cà Phê Muối DNU (Giá ưu đãi **32k** cho ca sáng từ 07:00 - 08:30).`;
      } else {
        reply = `🤖 **Phân Tích Tổng Quan Căng Tin Tòa G:**\n- Hôm nay ghi nhận **${todayOrders.length} đơn hàng** thành công với tổng doanh thu **${formatCurrency(todayRevenue)}**.\n- Món ăn được yêu thích nhất: **${sortedBestSellersToday[0]?.name || 'Cơm Rang Dưa Bò'}** (${sortedBestSellersToday[0]?.qty || 30} phần).\n- Bạn cần tôi hỗ trợ phân tích chi tiết về Bếp KDS, Kho hàng hay Báo cáo tài chính?`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString().slice(0, 5),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

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
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Tự động phân tích lịch sử bán hàng theo ca học sinh viên DNU, thời tiết Hà Đông và cảnh báo hạn dùng thực phẩm để tối ưu vận hành nhà bếp.
          </p>
        </div>
      </div>

      {/* AI Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Độ Chính Xác Dự Báo (Confidence)</span>
            <BrainCircuit className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-foreground mt-2">94.8%</h3>
          <p className="text-[11px] text-muted-foreground mt-1 font-semibold">Dựa trên mô hình phân tích chuỗi thời gian</p>
        </Card>

        <Card className="p-5 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Lãng Phí Thực Phẩm Đã Giảm</span>
            <TrendingDown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-foreground mt-2">-32.4%</h3>
          <p className="text-[11px] text-muted-foreground mt-1 font-semibold">Nhờ định lượng chuẩn theo BOM nguyên liệu</p>
        </Card>

        <Card className="p-5 border-rose-500/30 bg-rose-500/5">
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

      {/* DNU CANTEEN AI COPILOT INTERACTIVE CHAT */}
      <Card className="p-5 border-emerald-500/30 bg-gradient-to-br from-card via-card to-emerald-500/5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                <span>Trợ Lý Trí Tuệ Nhân Tạo (DNU Canteen AI Copilot)</span>
                <Badge variant="success" className="text-[10px] py-0 bg-emerald-600 text-white font-bold">
                  Trực Tuyến 24/7
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground">Hỏi đáp trực tiếp về số liệu kho bãi, ca nấu ăn của bếp, dự báo sức mua và tối ưu doanh thu</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setMessages([
                {
                  id: '1',
                  sender: 'ai',
                  text: '🤖 Đã làm mới đoạn chat! Hãy hỏi tôi bất kỳ điều gì về nghiệp vụ Căng tin DNU.',
                  time: 'Vừa xong',
                },
              ])
            }
            className="text-xs font-bold gap-1 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Xóa chat</span>
          </Button>
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-bold text-muted-foreground self-center">Gợi ý câu hỏi nhanh:</span>
          {[
            '📊 Dự báo số suất Cơm Gà và Bún Chả ca trưa nay?',
            '⚠️ Kiểm tra các nguyên liệu kho sắp hết dưới mức an toàn?',
            '💡 Gợi ý combo món ăn bán kèm để tăng doanh thu tuần này?',
            '💰 Tổng kết doanh thu hôm nay và món bán chạy nhất?',
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-muted/50 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-foreground transition-all shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3 max-h-72 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed font-medium whitespace-pre-line shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-card border border-border text-foreground rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[9px] mt-1 text-right font-mono ${
                    msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2.5 items-center text-xs text-muted-foreground font-semibold">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">AI đang phân tích dữ liệu kho và đơn hàng...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Nhập câu hỏi cho AI Canteen Copilot (VD: dự báo suất ăn, nguyên liệu kho, combo...)..."
            className="flex-1 px-4 py-2.5 bg-card border border-input rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
          <Button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Send className="w-4 h-4" />
            <span>Gửi</span>
          </Button>
        </form>
      </Card>
    </div>
  );
};
