import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { formatNumber } from '../../utils/format.js';
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
  ArrowRight
} from 'lucide-react';

export const AiAnalyticsPage: React.FC = () => {
  const tomorrowForecasts = [
    { food: 'Cơm Rang Dưa Bò Hà Nội', quantity: 165, trend: '+22%', reason: 'Lịch học tập trung ca trưa Khoa CNTT & Dược Tòa G' },
    { food: 'Bún Chả Hà Nội Nướng Than', quantity: 135, trend: '+15%', reason: 'Nhu cầu cao điểm giải lao 11:30 - 12:30' },
    { food: 'Trà Đào Cam Sả Hà Đông', quantity: 150, trend: '+28%', reason: 'Dự báo thời tiết Phú Lãm - Hà Đông ngày mai nắng nóng (34°C)' },
    { food: 'Phở Bò Tái Lăn DNU', quantity: 85, trend: '+10%', reason: 'Sinh viên ăn sáng & ca 1 Giảng đường Tòa AB' },
    { food: 'Cà Phê Cốt Dừa Hà Nội', quantity: 95, trend: '+18%', reason: 'Xu hướng chọn đồ uống giải khát tăng cao' },
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Chuẩn bị thêm 30kg thịt thăn bò & dưa chua',
      desc: 'Nhu cầu Cơm Rang Dưa Bò & Phở Bò Tái Lăn ngày mai tại Căng tin Tòa G dự kiến đạt 250 suất. Cần nhập thịt bò tươi trước 06:00 sáng.',
      confidence: 95,
      priority: 'HIGH',
      action: 'Tạo phiếu nhập bò & dưa',
    },
    {
      id: 2,
      title: 'Tăng cường 60 ly Trà Đào Cam Sả & Cốt Dừa Tòa G',
      desc: 'Dự báo thời tiết Hà Đông nắng gắt (34°C). Sinh viên DNU K16, K17, K18 có xu hướng chọn đồ uống giải nhiệt tăng 28%.',
      confidence: 91,
      priority: 'MEDIUM',
      action: 'Chuẩn bị đào ngâm & cốt dừa',
    },
    {
      id: 3,
      title: 'Cảnh báo hạn sử dụng lô xúc xích Đức Vissan (Batch #DNU-0824)',
      desc: 'Còn 80 cây xúc xích trong kho Tòa G cần ưu tiên chế biến món Bánh Mì Chảo DNU hoặc Cơm Chiên trong hôm nay.',
      confidence: 99,
      priority: 'CRITICAL',
      action: 'Đẩy vào menu hôm nay',
    },
  ];

  return (
    <div className="space-y-6">
      {/* AI Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Analytics & Demand Forecasting Module
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Trí Tuệ Nhân Tạo Dự Báo Vận Hành & Thực Đơn
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Hệ thống phân tích dữ liệu lịch sử bán hàng, xu hướng thời tiết và lịch học để dự đoán chính xác số lượng suất ăn cần chuẩn bị, giúp giảm 35% lãng phí thực phẩm và chống đứt gãy nguyên liệu.
          </p>
        </div>
      </div>

      {/* KPI AI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">Độ Chính Xác Dự Báo (MAPE)</span>
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mt-2">91.4%</h3>
          <p className="text-[11px] text-muted-foreground mt-1">Dựa trên 24.500 đơn hàng lịch sử</p>
        </Card>

        <Card className="p-4 border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-500">Giảm Thiểu Hao Hụt Thực Phẩm</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mt-2">-34.8%</h3>
          <p className="text-[11px] text-muted-foreground mt-1">Tiết kiệm ~12.5 triệu VNĐ/tháng</p>
        </Card>

        <Card className="p-4 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-500">Khuyến Nghị Cần Xử Lý</span>
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mt-2">3 Khuyến nghị</h3>
          <p className="text-[11px] text-muted-foreground mt-1">1 mức độ khẩn cấp (Hạn sử dụng)</p>
        </Card>
      </div>

      {/* Demand Forecast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dự Báo Số Suất Ăn Ngày Mai (28/08/2026)</CardTitle>
                  <CardDescription>Số lượng món dự kiến tiêu thụ tại Căng tin Khu A</CardDescription>
                </div>
                <Badge variant="success">Confidence: 91%</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {tomorrowForecasts.map((fc, idx) => (
                  <div key={idx} className="p-4 hover:bg-muted/40 transition-colors flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-foreground truncate">{fc.food}</h4>
                        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.2 rounded">
                          {fc.trend}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{fc.reason}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-foreground">{fc.quantity}</span>
                      <p className="text-[10px] text-muted-foreground uppercase">Suất dự kiến</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Actionable Recommendations */}
        <div className="space-y-4">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <CardTitle>Khuyến Nghị Từ AI</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-3 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground leading-tight">{rec.title}</span>
                    <Badge variant={rec.priority === 'CRITICAL' ? 'destructive' : 'warning'} hasDot>
                      {rec.confidence}%
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{rec.desc}</p>
                  <Button variant="outline" size="sm" className="w-full text-xs h-7 mt-1">
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
