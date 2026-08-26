import React from 'react';
import { Card } from '../../components/ui/Card.js';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn.js';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  growthRate?: number;
  icon: React.ReactNode;
  iconBgColor?: string;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  growthRate,
  icon,
  iconBgColor = 'bg-emerald-50 text-emerald-600',
  className,
}) => {
  const isPositive = growthRate !== undefined && growthRate >= 0;

  return (
    <Card hoverEffect className={cn('p-5 flex flex-col justify-between', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{value}</h3>
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs', iconBgColor)}>
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
        {growthRate !== undefined ? (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[11px]',
                isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {Math.abs(growthRate)}%
            </span>
            <span className="text-slate-400 font-medium">so với hôm qua</span>
          </div>
        ) : (
          <span className="text-slate-500 font-medium">{subtext}</span>
        )}
      </div>
    </Card>
  );
};
