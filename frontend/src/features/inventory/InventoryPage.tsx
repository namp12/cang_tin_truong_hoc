import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { formatCurrency, formatNumber } from '../../utils/format.js';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Plus, 
  Truck, 
  Calendar, 
  ArrowDownUp, 
  Layers
} from 'lucide-react';

interface StockItem {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  reserved: number;
  available: number;
  unit: string;
  minStock: number;
  status: 'NORMAL' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const stocks: StockItem[] = [
    { id: 1, code: 'ING-GAO', name: 'Gạo thơm lài ST25', category: 'Ngũ Cốc', quantity: 450, reserved: 20, available: 430, unit: 'kg', minStock: 50, status: 'NORMAL' },
    { id: 2, code: 'ING-THIT-GA', name: 'Thịt đùi gà phi lê', category: 'Thịt Tươi', quantity: 8.5, reserved: 2, available: 6.5, unit: 'kg', minStock: 20, status: 'LOW_STOCK' },
    { id: 3, code: 'ING-SUON-HEO', name: 'Sườn non heo tươi', category: 'Thịt Tươi', quantity: 60, reserved: 10, available: 50, unit: 'kg', minStock: 15, status: 'NORMAL' },
    { id: 4, code: 'ING-THIT-BO', name: 'Thịt thăn bò tươi', category: 'Thịt Tươi', quantity: 40, reserved: 5, available: 35, unit: 'kg', minStock: 10, status: 'NORMAL' },
    { id: 5, code: 'ING-TRUNG-GA', name: 'Trứng gà tươi Ba Huân', category: 'Gia Cầm', quantity: 800, reserved: 50, available: 750, unit: 'quả', minStock: 100, status: 'NORMAL' },
    { id: 6, code: 'ING-RAU-XA-LACH', name: 'Xà lách tươi sạch', category: 'Rau Củ', quantity: 4, reserved: 1, available: 3, unit: 'kg', minStock: 5, status: 'LOW_STOCK' },
    { id: 18, code: 'ING-COCA', name: 'Coca Cola Lon 320ml', category: 'Đồ Uống', quantity: 350, reserved: 20, available: 330, unit: 'lon', minStock: 50, status: 'NORMAL' },
    { id: 20, code: 'ING-AQUAFINA', name: 'Nước Suối Aquafina 500ml', category: 'Đồ Uống', quantity: 500, reserved: 30, available: 470, unit: 'chai', minStock: 100, status: 'NORMAL' },
  ];

  const filteredStocks = stocks.filter((s) => {
    const matchFilter = filterType === 'ALL' || (filterType === 'LOW' && s.status === 'LOW_STOCK');
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quản Lý Tồn Kho & Nguyên Liệu</h2>
          <p className="text-xs text-slate-500">Kiểm soát tồn kho tức thời, hạn sử dụng FEFO và nhập xuất nguyên liệu</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Tạo Phiếu Nhập Kho
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-emerald-50/50 border-emerald-100">
          <p className="text-xs font-semibold text-emerald-800">Tổng Nguyên Liệu Đang Quản Lý</p>
          <h3 className="text-2xl font-bold text-emerald-950 mt-1">30 Mặt hàng</h3>
        </Card>
        <Card className="p-4 bg-amber-50/50 border-amber-100">
          <p className="text-xs font-semibold text-amber-800">Nguyên Liệu Dưới Ngưỡng Tối Thiểu</p>
          <h3 className="text-2xl font-bold text-amber-950 mt-1">2 Mặt hàng (Cần nhập)</h3>
        </Card>
        <Card className="p-4 bg-blue-50/50 border-blue-100">
          <p className="text-xs font-semibold text-blue-800">Lô Hàng Sắp Hết Hạn (&lt; 7 Ngày)</p>
          <h3 className="text-2xl font-bold text-blue-950 mt-1">1 Lô (Thịt gà)</h3>
        </Card>
      </div>

      {/* Stock Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã hoặc tên nguyên liệu..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  filterType === 'ALL' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tất cả tồn kho
              </button>
              <button
                onClick={() => setFilterType('LOW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  filterType === 'LOW' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Cảnh báo sắp hết
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Mã</th>
                  <th className="py-3 px-4">Tên Nguyên Liệu</th>
                  <th className="py-3 px-4">Nhóm</th>
                  <th className="py-3 px-4">Tồn Thực Tế</th>
                  <th className="py-3 px-4">Khả Dụng</th>
                  <th className="py-3 px-4">Ngưỡng Min</th>
                  <th className="py-3 px-4">Tình Trạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredStocks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{item.name}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4 font-bold">
                      {formatNumber(item.quantity)} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">
                      {formatNumber(item.available)} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatNumber(item.minStock)} {item.unit}
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'LOW_STOCK' ? (
                        <Badge variant="warning" hasDot>
                          Sắp hết
                        </Badge>
                      ) : (
                        <Badge variant="success" hasDot>
                          Đầy đủ
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
