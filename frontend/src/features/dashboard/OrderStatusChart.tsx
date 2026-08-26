import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.js';
import { OrderStatusPieData } from '../../types/index.js';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface OrderStatusChartProps {
  data: OrderStatusPieData[];
}

export const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  const total = data.reduce((acc, curr) => acc + Number(curr.value || 0), 0);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <div>
          <CardTitle>Phân Bố Trạng Thái Đơn</CardTitle>
          <CardDescription>Tỷ lệ hoàn thành và xử lý hôm nay</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="h-48 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0];
                    return (
                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-lg font-medium">
                        <span>{d.name}: </span>
                        <span className="font-bold">{d.value} đơn</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute text-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-800">{total}</span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Tổng Đơn</p>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 w-full mt-4 pt-3 border-t border-slate-100">
          {data.map((item, idx) => (
            <div key={item.name} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color || COLORS[idx % COLORS.length] }}
                />
                <span className="text-slate-600 truncate">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
