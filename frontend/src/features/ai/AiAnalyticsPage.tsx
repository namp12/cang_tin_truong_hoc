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
    { food: 'Cơm Gà Xối Mỡ Giòn Da', quantity: 142, trend: '+18%', reason: 'Thứ 5 thường có lượng đặt món cơm gà cao nhất tuần' },
    { food: 'Trà Đào Cam Sả Size M', quantity: 125, trend: '+24%', reason: 'Dự báo thời tiết ngày mai nắng nóng (34°C)' },
    { food: 'Cơm Sườn Nướng Mật Ong', quantity: 98, trend: '+8%', reason: 'Nhu cầu ổn định ca trưa' },
    { food: 'Phở Bò Tái Hà Nội', quantity: 65, trend: '-5%', reason: 'Dự kiến giảm nhẹ ca sáng' },
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Chuẩn bị thêm 25kg thịt đùi gà phi lê',
      desc: 'Nhu cầu Cơm Gà Xối Mỡ ngày mai dự kiến tăng 18%. Cần nhập thêm thịt gà từ NCC San Hà trước 06:30 sáng.',
      confidence: 94,
      priority: 'HIGH',
      action: 'Tạo phiếu nhập gà',
    },
    {
      id: 2,
      title: 'Tăng cường 40 ly Trà Đào đá cho khung giờ 11:30 - 12:30',
      desc: 'Dự báo thời tiết ngày mai nắng gắt (34°C). Học sinh/sinh viên có xu hướng chọn combo nước giải khát tăng 24%.',
      confidence: 88,
      priority: 'MEDIUM',
      action: 'Chuẩn bị syrup & đào',
    },
    {
      id: 3,
      title: 'Cảnh báo hạn sử dụng lô trứng Ba Huân (Batch #0821)',
      desc: 'Còn 120 quả trứng trong kho cần ưu tiên chế biến món trứng ốp la hoặc cơm tấm trong ngày hôm nay.',
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
