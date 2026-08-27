import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  UtensilsCrossed, 
  Flame, 
  Layers
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
    // Cơm Phần & Cơm Đĩa DNU
    { id: 31, code: 'FOOD-COM-RANG-DUA-BO', name: 'Cơm Rang Dưa Bò Hà Nội', category: 'Cơm Phần & Cơm Đĩa DNU', basePrice: 35000, costPrice: 18000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 1, code: 'FOOD-COM-GA', name: 'Cơm Gà Xối Mỡ Giòn Da', category: 'Cơm Phần & Cơm Đĩa DNU', basePrice: 35000, costPrice: 18000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 2, code: 'FOOD-COM-SUON', name: 'Cơm Sườn Nướng Mật Ong', category: 'Cơm Phần & Cơm Đĩa DNU', basePrice: 35000, costPrice: 17500, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 3, code: 'FOOD-COM-TAM', name: 'Cơm Tấm Sườn Bì Chả DNU', category: 'Cơm Phần & Cơm Đĩa DNU', basePrice: 40000, costPrice: 20000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 4, code: 'FOOD-COM-BO', name: 'Cơm Bò Lúc Lắc Sốt Tiêu', category: 'Cơm Phần & Cơm Đĩa DNU', basePrice: 45000, costPrice: 24000, status: 'ACTIVE', isFeatured: false, isBestSeller: false },
    { id: 5, code: 'FOOD-COM-THIT-KHO', name: 'Cơm Thịt Kho Trứng Cút', category: 'Cơm Phần & Cơm Đĩa DNU', basePrice: 30000, costPrice: 14000, status: 'ACTIVE', isFeatured: false, isBestSeller: true },
    { id: 6, code: 'FOOD-COM-CA', name: 'Cơm Cá Hú Kho Tộ', category: 'Cơm Phần & Cơm Đĩa DNU', basePrice: 30000, costPrice: 13500, status: 'ACTIVE', isFeatured: false, isBestSeller: false },
    { id: 25, code: 'FOOD-COM-DUONG-CHAU', name: 'Cơm Chiên Dương Châu', category: 'Cơm Phần & Cơm Đĩa DNU', basePrice: 30000, costPrice: 13000, status: 'ACTIVE', isFeatured: false, isBestSeller: true },
    { id: 30, code: 'FOOD-COM-CHAY', name: 'Cơm Chay Nấm Đậu Phụ', category: 'Cơm Phần & Cơm Đĩa DNU', basePrice: 25000, costPrice: 9500, status: 'ACTIVE', isFeatured: false, isBestSeller: false },

    // Bún - Phở - Mì Hà Nội
    { id: 32, code: 'FOOD-BUN-CHA', name: 'Bún Chả Hà Nội Nướng Than', category: 'Bún - Phở - Mì Hà Nội', basePrice: 35000, costPrice: 17500, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 33, code: 'FOOD-PHO-TAI-LAN', name: 'Phở Bò Tái Lăn DNU', category: 'Bún - Phở - Mì Hà Nội', basePrice: 40000, costPrice: 20000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 7, code: 'FOOD-PHO-TAI', name: 'Phở Bò Tái Hà Nội', category: 'Bún - Phở - Mì Hà Nội', basePrice: 35000, costPrice: 17000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 34, code: 'FOOD-PHO-GA', name: 'Phở Gà Ta Lá Chanh', category: 'Bún - Phở - Mì Hà Nội', basePrice: 35000, costPrice: 17000, status: 'ACTIVE', isFeatured: true, isBestSeller: false },
    { id: 35, code: 'FOOD-BUN-DAU', name: 'Bún Đậu Mắm Tôm Thập Cẩm', category: 'Bún - Phở - Mì Hà Nội', basePrice: 40000, costPrice: 19000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 9, code: 'FOOD-BUN-BO-HUE', name: 'Bún Bò Huế Đặc Biệt', category: 'Bún - Phở - Mì Hà Nội', basePrice: 40000, costPrice: 21000, status: 'ACTIVE', isFeatured: true, isBestSeller: false },
    { id: 11, code: 'FOOD-BUN-RIEU', name: 'Bún Riêu Cua Bắp Bò', category: 'Bún - Phở - Mì Hà Nội', basePrice: 35000, costPrice: 14000, status: 'ACTIVE', isFeatured: false, isBestSeller: false },
    { id: 10, code: 'FOOD-BUN-TRON', name: 'Bún Trộn Thịt Nướng DNU', category: 'Bún - Phở - Mì Hà Nội', basePrice: 32000, costPrice: 15000, status: 'ACTIVE', isFeatured: false, isBestSeller: true },
    { id: 12, code: 'FOOD-MI-QUANG', name: 'Mì Quảng Gà Trứng Cút', category: 'Bún - Phở - Mì Hà Nội', basePrice: 35000, costPrice: 16500, status: 'ACTIVE', isFeatured: false, isBestSeller: false },

    // Bánh Mì & Đồ Ăn Vặt
    { id: 39, code: 'FOOD-BANH-MI-CHAO', name: 'Bánh Mì Chảo Đặc Biệt DNU', category: 'Bánh Mì & Đồ Ăn Vặt', basePrice: 30000, costPrice: 14000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 21, code: 'FOOD-BANH-MI-THIT', name: 'Bánh Mì Pate Chả Lụa Hà Nội', category: 'Bánh Mì & Đồ Ăn Vặt', basePrice: 20000, costPrice: 9500, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 22, code: 'FOOD-BANH-MI-OP-LA', name: 'Bánh Mì Xíu Mại Ốp La', category: 'Bánh Mì & Đồ Ăn Vặt', basePrice: 22000, costPrice: 10500, status: 'ACTIVE', isFeatured: false, isBestSeller: true },
    { id: 40, code: 'FOOD-NEM-CHUA-RAN', name: 'Nem Chua Rán Phố Cổ (5c)', category: 'Bánh Mì & Đồ Ăn Vặt', basePrice: 25000, costPrice: 11000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 23, code: 'FOOD-BANH-BAO', name: 'Bánh Bao Nhân Thịt Trứng Cút', category: 'Bánh Mì & Đồ Ăn Vặt', basePrice: 15000, costPrice: 7000, status: 'ACTIVE', isFeatured: false, isBestSeller: false },
    { id: 24, code: 'FOOD-XOI-GA', name: 'Xôi Gà Xé Nấm Hương', category: 'Bánh Mì & Đồ Ăn Vặt', basePrice: 25000, costPrice: 11000, status: 'ACTIVE', isFeatured: false, isBestSeller: true },

    // Đồ Uống & Trà Sữa DNU
    { id: 13, code: 'FOOD-TRA-DAO', name: 'Trà Đào Cam Sả Hà Đông', category: 'Đồ Uống & Trà Sữa DNU', basePrice: 25000, costPrice: 9000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 36, code: 'FOOD-CAFE-COT-DUA', name: 'Cà Phê Cốt Dừa Hà Nội', category: 'Đồ Uống & Trà Sữa DNU', basePrice: 25000, costPrice: 10000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 37, code: 'FOOD-CAFE-MUOI', name: 'Cà Phê Muối Béo Ngậy', category: 'Đồ Uống & Trà Sữa DNU', basePrice: 22000, costPrice: 8500, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 38, code: 'FOOD-TRA-CHANH', name: 'Trà Chanh Giã Tay DNU', category: 'Đồ Uống & Trà Sữa DNU', basePrice: 18000, costPrice: 6000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 15, code: 'FOOD-TRA-SUA', name: 'Trà Sữa Trân Châu Hoàng Kim', category: 'Đồ Uống & Trà Sữa DNU', basePrice: 25000, costPrice: 10000, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 14, code: 'FOOD-TRA-QUAT', name: 'Trà Quất Mật Ong Hoa Nhài', category: 'Đồ Uống & Trà Sữa DNU', basePrice: 15000, costPrice: 4500, status: 'ACTIVE', isFeatured: false, isBestSeller: true },
    { id: 17, code: 'FOOD-CAFE-SUA', name: 'Cà Phê Sữa Đá Phin', category: 'Đồ Uống & Trà Sữa DNU', basePrice: 18000, costPrice: 5500, status: 'ACTIVE', isFeatured: true, isBestSeller: true },
    { id: 18, code: 'FOOD-COCA', name: 'Coca Cola Lon 320ml', category: 'Đồ Uống & Trà Sữa DNU', basePrice: 12000, costPrice: 8500, status: 'ACTIVE', isFeatured: false, isBestSeller: true },
    { id: 20, code: 'FOOD-AQUAFINA', name: 'Nước Suối Aquafina 500ml', category: 'Đồ Uống & Trà Sữa DNU', basePrice: 8000, costPrice: 4500, status: 'ACTIVE', isFeatured: false, isBestSeller: true },
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
          <h2 className="text-xl font-bold text-foreground tracking-tight">Quản Lý Thực Đơn Món Ăn</h2>
          <p className="text-xs text-muted-foreground">Thêm mới, điều chỉnh giá bán, giá vốn và định lượng món ăn</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Thêm Món Ăn Mới
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm món ăn theo tên hoặc mã..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/60 border border-input rounded-lg text-xs text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'Cơm Phần & Cơm Đĩa DNU', label: 'Cơm Phần DNU' },
              { id: 'Bún - Phở - Mì Hà Nội', label: 'Bún - Phở Hà Nội' },
              { id: 'Bánh Mì & Đồ Ăn Vặt', label: 'Bánh Mì & Ăn Vặt' },
              { id: 'Đồ Uống & Trà Sữa DNU', label: 'Đồ Uống DNU' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat.label}
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
              <tr className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">Món Ăn</th>
                <th className="py-3.5 px-4">Danh Mục</th>
                <th className="py-3.5 px-4">Giá Bán</th>
                <th className="py-3.5 px-4">Giá Vốn</th>
                <th className="py-3.5 px-4">Biên Lợi Nhuận</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs text-foreground">
              {filteredFoods.map((food) => {
                const margin = Math.round(((food.basePrice - food.costPrice) / food.basePrice) * 100);
                return (
                  <tr key={food.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          <UtensilsCrossed className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground flex items-center gap-1.5">
                            {food.name}
                            {food.isBestSeller && (
                              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded font-bold">
                                HOT
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">{food.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline">{food.category}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">{formatCurrency(food.basePrice)}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{formatCurrency(food.costPrice)}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-primary">~{margin}%</span>
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
                        className="text-destructive hover:bg-destructive/10"
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

      {/* Add Food Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Thêm Món Ăn Mới</DialogTitle>
            <DialogClose onClick={() => setShowAddModal(false)} />
          </div>
          <DialogDescription>Điền thông tin và định giá cho món ăn mới trên thực đơn</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddFood} className="space-y-3 py-2">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Tên Món Ăn</label>
            <input
              type="text"
              required
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              placeholder="Ví dụ: Cơm Gà Xối Mỡ..."
              className="w-full px-3 py-2 border border-input rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Danh Mục</label>
            <select
              value={newFood.category}
              onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Cơm Phần">Cơm Phần</option>
              <option value="Bún - Phở">Bún - Phở</option>
              <option value="Bánh Mì">Bánh Mì</option>
              <option value="Đồ Uống">Đồ Uống</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Giá Bán (VNĐ)</label>
              <input
                type="number"
                required
                value={newFood.basePrice}
                onChange={(e) => setNewFood({ ...newFood, basePrice: e.target.value })}
                placeholder="35000"
                className="w-full px-3 py-2 border border-input rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Giá Vốn (Ước tính)</label>
              <input
                type="number"
                value={newFood.costPrice}
                onChange={(e) => setNewFood({ ...newFood, costPrice: e.target.value })}
                placeholder="18000"
                className="w-full px-3 py-2 border border-input rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowAddModal(false)} type="button" variant="outline" size="sm">
              Hủy
            </Button>
            <Button type="submit" variant="default" size="sm">
              Lưu Món Ăn
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};
