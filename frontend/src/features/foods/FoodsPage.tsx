import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog.js';
import { initialFoodCatalog, FoodCatalogItem } from '../../data/foodCatalog.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  UtensilsCrossed, 
  Flame, 
  Layers,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const FoodsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodCatalogItem | null>(null);

  const [foods, setFoods] = useState<FoodCatalogItem[]>(initialFoodCatalog);

  const [formState, setFormState] = useState({
    name: '',
    category: 'Cơm Phần & Cơm Đĩa DNU',
    basePrice: '',
    costPrice: '',
    desc: '',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80',
  });

  const sampleImagePresets = [
    { label: 'Cơm Gà / Sườn', url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80' },
    { label: 'Cơm Rang Dưa Bò', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=80' },
    { label: 'Bún Chả / Bún Bò', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=500&q=80' },
    { label: 'Phở Bò Tái', url: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=500&q=80' },
    { label: 'Bánh Mì Chảo', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80' },
    { label: 'Trà Đào / Trà Sữa', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80' },
    { label: 'Cà Phê Cốt Dừa', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=500&q=80' },
  ];

  const handleOpenAddModal = () => {
    setEditingFood(null);
    setFormState({
      name: '',
      category: 'Cơm Phần & Cơm Đĩa DNU',
      basePrice: '',
      costPrice: '',
      desc: '',
      imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80',
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (food: FoodCatalogItem) => {
    setEditingFood(food);
    setFormState({
      name: food.name,
      category: food.category,
      basePrice: food.price.toString(),
      costPrice: food.costPrice.toString(),
      desc: food.desc,
      imageUrl: food.imageUrl,
    });
    setShowAddModal(true);
  };

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.basePrice) return;

    if (editingFood) {
      // Edit existing
      setFoods((prev) =>
        prev.map((f) =>
          f.id === editingFood.id
            ? {
                ...f,
                name: formState.name,
                category: formState.category,
                price: Number(formState.basePrice),
                costPrice: Number(formState.costPrice) || Number(formState.basePrice) * 0.5,
                desc: formState.desc,
                imageUrl: formState.imageUrl,
              }
            : f
        )
      );
    } else {
      // Create new
      const created: FoodCatalogItem = {
        id: Date.now(),
        code: `FOOD-${Date.now().toString().slice(-4)}`,
        name: formState.name,
        category: formState.category,
        categoryId: 1,
        price: Number(formState.basePrice),
        costPrice: Number(formState.costPrice) || Number(formState.basePrice) * 0.5,
        desc: formState.desc,
        imageUrl: formState.imageUrl,
        status: 'ACTIVE',
        isBest: false,
      };
      setFoods([created, ...foods]);
    }

    setShowAddModal(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món ăn này khỏi thực đơn?')) {
      setFoods((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const filteredFoods = foods.filter((f) => {
    const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Quản Lý Thực Đơn & Hình Ảnh Món Ăn</span>
            <Badge variant="primary" className="text-xs font-mono">
              {foods.length} món
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Cập nhật hình ảnh, giá bán, giá vốn và mô tả món ăn hiển thị trên Quầy POS & Kiosk DNU
          </p>
        </div>
        <Button onClick={handleOpenAddModal} variant="default" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
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
              { id: 'Combo Tiết Kiệm DNU', label: 'Combo Tiết Kiệm' },
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
                <th className="py-3.5 px-4">Ảnh & Món Ăn</th>
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
                const margin = Math.round(((food.price - food.costPrice) / food.price) * 100);
                return (
                  <tr key={food.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-12 h-12 rounded-xl object-cover border border-border shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <p className="font-bold text-foreground flex items-center gap-1.5">
                            {food.name}
                            {food.isBest && (
                              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded font-bold">
                                HOT
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">{food.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">{food.category}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground">{formatCurrency(food.price)}</td>
                    <td className="py-3 px-4 text-muted-foreground">{formatCurrency(food.costPrice)}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{margin}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success" hasDot>
                        Đang bán
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(food)}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                          title="Chỉnh sửa & Đổi ảnh"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(food.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Xóa món"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Food Modal with Image Selector & Live Preview */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              <span>{editingFood ? 'Chỉnh Sửa Món Ăn & Ảnh' : 'Thêm Món Ăn Mới Vào Thực Đơn'}</span>
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết và liên kết hình ảnh trực quan cho món ăn
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveFood} className="space-y-4 py-2 text-xs">
            {/* Live Image Preview & Presets */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-3">
              <label className="block font-bold text-foreground">Hình Ảnh Món Ăn (Live Preview):</label>
              
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/40 shrink-0 bg-background shadow-md">
                  <img
                    src={formState.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="url"
                    value={formState.imageUrl}
                    onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                    placeholder="Dán link ảnh trực tuyến (https://...)"
                    className="w-full px-3 py-1.5 bg-background border border-input rounded-lg text-xs focus:ring-2 focus:ring-ring font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Dán URL ảnh hoặc chọn nhanh từ bộ sưu tập mẫu bên dưới:
                  </p>
                </div>
              </div>

              {/* Sample Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sampleImagePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormState({ ...formState, imageUrl: preset.url })}
                    className="px-2.5 py-1 rounded-lg bg-card border border-border text-[10px] text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                  >
                    📷 {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Tên món ăn / đồ uống *</label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="VD: Cơm Rang Dưa Bò Hà Nội"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Danh mục *</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  aria-label="Chọn danh mục món"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="Cơm Phần & Cơm Đĩa DNU">Cơm Phần & Cơm Đĩa DNU</option>
                  <option value="Bún - Phở - Mì Hà Nội">Bún - Phở - Mì Hà Nội</option>
                  <option value="Bánh Mì & Đồ Ăn Vặt">Bánh Mì & Đồ Ăn Vặt</option>
                  <option value="Đồ Uống & Trà Sữa DNU">Đồ Uống & Trà Sữa DNU</option>
                  <option value="Combo Tiết Kiệm DNU">Combo Tiết Kiệm DNU</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Giá bán (VNĐ) *</label>
                <input
                  type="number"
                  required
                  value={formState.basePrice}
                  onChange={(e) => setFormState({ ...formState, basePrice: e.target.value })}
                  placeholder="VD: 35000"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Mô tả món ăn & Thành phần</label>
              <textarea
                rows={2}
                value={formState.desc}
                onChange={(e) => setFormState({ ...formState, desc: e.target.value })}
                placeholder="Mô tả nguyên liệu, hương vị đặc trưng của món..."
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" variant="default" className="w-full">
                {editingFood ? 'Lưu Thay Đổi Món Ăn' : 'Hoàn Tất & Thêm Món Vào Menu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
