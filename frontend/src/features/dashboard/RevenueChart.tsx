import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.js';
import { RevenueChartData } from '../../types/index.js';
import { formatCurrency, formatNumber } from '../../utils/format.js';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface RevenueChartProps {
  data: RevenueChartData[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Xu Hướng Doanh Thu & Lợi Nhuận (7 Ngày)</CardTitle>
          <CardDescription>Tổng quan doanh thu thực tế và ước tính lợi nhuận gộp</CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
            <span className="text-slate-600">Doanh thu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block" />
            <span className="text-slate-600">Lợi nhuận</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Tr`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                        <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">
                          {label} ({item.day_name})
                        </p>
                        <p className="text-emerald-400 font-semibold flex justify-between gap-4">
                          <span>Doanh thu:</span>
                          <span>{formatCurrency(item.revenue)}</span>
                        </p>
                        <p className="text-blue-400 font-semibold flex justify-between gap-4">
                          <span>Lợi nhuận gộp:</span>
                          <span>{formatCurrency(item.profit)}</span>
                        </p>
                        <p className="text-slate-400 flex justify-between gap-4 pt-1 border-t border-slate-800">
                          <span>Số đơn hàng:</span>
                          <span className="font-bold text-white">{formatNumber(item.orders)} đơn</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProfit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
