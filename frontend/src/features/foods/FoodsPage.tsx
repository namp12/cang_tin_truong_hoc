import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  UtensilsCrossed, 
  Flame, 
  Layers, 
  Eye,
  CheckCircle2
} from 'lucide-react';

interface FoodItem {
  id: number;
  code: string;
  name: string;
  category: string;
  basePrice: number;
  costPrice: number;
  status: 'ACTIVE' | 'SOLD_OUT' | 'DISCONTINUED';
  isFeatured: boolean;
  isBestSeller: boolean;
}

export const FoodsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [foods, setFoods] = useState<FoodItem[]>([
    { id: 1, code: 'FOOD-COM-GA', name: 'Cơm Gà Xối Mỡ Giòn Da', category: 'Cơm Phần', basePrice: 35000, costPrice: 18000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 2, code: 'FOOD-COM-SUON', name: 'Cơm Sườn Nướng Mật Ong', category: 'Cơm Phần', basePrice: 35000, costPrice: 17500, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 3, code: 'FOOD-COM-TAM', name: 'Cơm Tấm Sườn Bì Chả', category: 'Cơm Phần', basePrice: 40000, costPrice: 20000, status: 'ACTIVE', isFeatured: true, isBestSeller: false },
    { id: 7, code: 'FOOD-PHO-TAI', name: 'Phở Bò Tái Hà Nội', category: 'Bún - Phở', basePrice: 35000, costPrice: 17000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 9, code: 'FOOD-BUN-BO', name: 'Bún Bò Huế Đặc Biệt', category: 'Bún - Phở', basePrice: 40000, costPrice: 21000, status: 'ACTIVE', isFeatured: true, isBestSeller: false },
    { id: 13, code: 'FOOD-TRA-DAO', name: 'Trà Đào Cam Sả Size M', category: 'Đồ Uống', basePrice: 25000, costPrice: 9000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 15, code: 'FOOD-TRA-SUA', name: 'Trà Sữa Trân Châu Đường Đen', category: 'Đồ Uống', basePrice: 25000, costPrice: 10000, status: 'ACTIVE', isFeatured: false, isBestSeller: true },
    { id: 21, code: 'FOOD-BANH-MI', name: 'Bánh Mì Kẹp Thịt Chả', category: 'Bánh Mì', basePrice: 20000, costPrice: 9500, status: 'ACTIVE', isFeatured: true, isBestSeller: false },
  ]);

  const [newFood, setNewFood] = useState({
    name: '',
    category: 'Cơm Phần',
    basePrice: '',
    costPrice: '',
  });

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name || !newFood.basePrice) return;

    const created: FoodItem = {
      id: Date.now(),
      code: `FOOD-${Date.now().toString().slice(-4)}`,
      name: newFood.name,
      category: newFood.category,
      basePrice: Number(newFood.basePrice),
      costPrice: Number(newFood.costPrice) || Number(newFood.basePrice) * 0.5,
      status: 'ACTIVE',
      isFeatured: false,
      isBestSeller: false,
    };

    setFoods([created, ...foods]);
    setNewFood({ name: '', category: 'Cơm Phần', basePrice: '', costPrice: '' });
    setShowAddModal(false);
  };

  const filteredFoods = foods.filter((f) => {
    const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quản Lý Thực Đơn Món Ăn</h2>
          <p className="text-xs text-slate-500">Thêm mới, điều chỉnh giá bán, giá vốn và định lượng món ăn</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Thêm Món Ăn Mới
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm món ăn theo tên hoặc mã..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'Cơm Phần', 'Bún - Phở', 'Đồ Uống', 'Bánh Mì'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Foods Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Món Ăn</th>
                <th className="py-3.5 px-4">Danh Mục</th>
                <th className="py-3.5 px-4">Giá Bán</th>
                <th className="py-3.5 px-4">Giá Vốn</th>
                <th className="py-3.5 px-4">Biên Lợi Nhuận</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredFoods.map((food) => {
                const margin = Math.round(((food.basePrice - food.costPrice) / food.basePrice) * 100);
                return (
                  <tr key={food.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                          <UtensilsCrossed className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            {food.name}
                            {food.isBestSeller && (
                              <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.2 rounded font-bold">
                                HOT
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400">{food.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="neutral">{food.category}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(food.basePrice)}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatCurrency(food.costPrice)}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-600">~{margin}%</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" hasDot>
                        Đang bán
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        onClick={() => setFoods(foods.filter((f) => f.id !== food.id))}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-800">Thêm Món Ăn Mới</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddFood} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Món Ăn</label>
                <input
                  type="text"
                  required
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  placeholder="Ví dụ: Cơm Gà Xối Mỡ..."
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Danh Mục</label>
                <select
                  value={newFood.category}
                  onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                >
                  <option value="Cơm Phần">Cơm Phần</option>
                  <option value="Bún - Phở">Bún - Phở</option>
                  <option value="Bánh Mì">Bánh Mì</option>
                  <option value="Đồ Uống">Đồ Uống</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giá Bán (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={newFood.basePrice}
                    onChange={(e) => setNewFood({ ...newFood, basePrice: e.target.value })}
                    placeholder="35000"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giá Vốn (Ước tính)</label>
                  <input
                    type="number"
                    value={newFood.costPrice}
                    onChange={(e) => setNewFood({ ...newFood, costPrice: e.target.value })}
                    placeholder="18000"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
                <Button onClick={() => setShowAddModal(false)} type="button" variant="outline" size="sm">
                  Hủy
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Lưu Món Ăn
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
