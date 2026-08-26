import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.js';
import { SystemAlert } from '../../types/index.js';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn.js';

interface AlertsCardProps {
  alerts: SystemAlert[];
}

export const AlertsCard: React.FC<AlertsCardProps> = ({ alerts }) => {
  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'DANGER':
        return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'INFO':
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  const getAlertBg = (type: SystemAlert['type']) => {
    switch (type) {
      case 'DANGER':
        return 'bg-red-50/70 border-red-200/60 text-red-900';
      case 'WARNING':
        return 'bg-amber-50/70 border-amber-200/60 text-amber-900';
      case 'INFO':
        return 'bg-blue-50/70 border-blue-200/60 text-blue-900';
      case 'SUCCESS':
        return 'bg-emerald-50/70 border-emerald-200/60 text-emerald-900';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Cảnh Báo & Hoạt Động Vận Hành</CardTitle>
          <CardDescription>Thông báo tồn kho, hết hạn và giờ cao điểm</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn('p-3.5 rounded-xl border flex items-start gap-3 transition-all hover:shadow-xs', getAlertBg(alert.type))}
          >
            {getAlertIcon(alert.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold">{alert.title}</h5>
                <span className="text-[10px] text-slate-500 font-medium">{alert.time}</span>
              </div>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{alert.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
