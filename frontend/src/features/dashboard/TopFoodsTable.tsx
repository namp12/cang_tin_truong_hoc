import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { BestSellerFood } from '../../types/index.js';
import { formatCurrency, formatNumber } from '../../utils/format.js';
import { Utensils, Flame } from 'lucide-react';

interface TopFoodsTableProps {
  foods: BestSellerFood[];
}

export const TopFoodsTable: React.FC<TopFoodsTableProps> = ({ foods }) => {
  const maxSold = foods.length > 0 ? Math.max(...foods.map((f) => f.total_sold)) : 1;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>Top Món Ăn Bán Chạy Nhất</CardTitle>
            <CardDescription>Thống kê số lượng suất ăn tiêu thụ nhiều nhất</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 overflow-x-auto">
          {foods.map((food, index) => {
            const percentage = Math.round((food.total_sold / maxSold) * 100);
            return (
              <div key={food.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center gap-4">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                  #{index + 1}
                </div>

                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Utensils className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{food.name}</h4>
                    <span className="text-xs font-bold text-slate-900">{formatCurrency(food.base_price)}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <Badge variant="neutral" size="sm">
                      {food.category_name}
                    </Badge>
                    <span className="font-semibold text-emerald-700">
                      {formatNumber(food.total_sold)} suất • {formatCurrency(food.total_revenue)}
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
