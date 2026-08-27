import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
import { dnuStore, CategoryItem, ComboItem } from '../../services/dnuStore.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  Layers, 
  Plus, 
  Search, 
  UtensilsCrossed, 
  Coffee, 
  Sparkles, 
  Tag, 
  Percent, 
  CheckCircle2, 
  Edit3, 
  Trash2,
  Flame
} from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CATEGORIES' | 'COMBOS'>('CATEGORIES');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [categories, setCategories] = useState<CategoryItem[]>(() => dnuStore.getCategories());
  const [combos, setCombos] = useState<ComboItem[]>(() => dnuStore.getCombos());

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    code: '',
    icon: '🍽️',
    description: '',
  });

  const [comboForm, setComboForm] = useState({
    name: '',
    originalPrice: '50000',
    comboPrice: '42000',
    tag: 'Tiết kiệm',
    items: '1 Món chính, 1 Đồ uống',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'CATEGORIES') {
      if (!categoryForm.name) return;
      const newCat: CategoryItem = {
        id: Date.now(),
        name: categoryForm.name,
        code: categoryForm.code || `CAT_${Date.now().toString().slice(-4)}`,
        icon: categoryForm.icon || '🍲',
        foodCount: 0,
        revenueShare: '5.0%',
        status: 'ACTIVE',
        description: categoryForm.description || 'Danh mục món ăn DNU',
      };
      const updated = [newCat, ...categories];
      setCategories(updated);
      dnuStore.saveCategories(updated);
    } else {
      if (!comboForm.name) return;
      const orig = Number(comboForm.originalPrice);
      const comb = Number(comboForm.comboPrice);
      const discPercent = Math.round(((orig - comb) / orig) * 100);

      const newCombo: ComboItem = {
        id: Date.now(),
        name: comboForm.name,
        originalPrice: orig,
        comboPrice: comb,
        discount: `-${discPercent}%`,
        items: comboForm.items.split(',').map((s) => s.trim()),
        tag: comboForm.tag,
        isPopular: true,
      };
      const updated = [newCombo, ...combos];
      setCombos(updated);
      dnuStore.saveCombos(updated);
    }

    setShowAddModal(false);
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      dnuStore.saveCategories(updated);
    }
  };

  const handleDeleteCombo = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa gói combo này?')) {
      const updated = combos.filter((c) => c.id !== id);
      setCombos(updated);
      dnuStore.saveCombos(updated);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCombos = combos.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Danh Mục Món & Gói Combo DNU</h2>
          <p className="text-xs text-muted-foreground">Phân loại món ăn, cấu hình hiển thị trên POS và tạo combo tiết kiệm cho sinh viên</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          {activeTab === 'CATEGORIES' ? 'Thêm Danh Mục Mới' : 'Tạo Gói Combo Mới'}
        </Button>
      </div>

      {/* Tabs & Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm danh mục, combo..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/60 border border-input rounded-lg text-xs text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('CATEGORIES')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'CATEGORIES'
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              📂 Danh Mục Món ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('COMBOS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'COMBOS'
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              🍱 Gói Combo Tiết Kiệm ({combos.length})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* TAB 1: Categories List */}
      {activeTab === 'CATEGORIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <Card key={cat.id} className="hover:border-primary/50 transition-colors shadow-xs flex flex-col justify-between">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-muted shrink-0">{cat.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{cat.name}</h3>
                      <p className="text-[11px] text-muted-foreground font-mono">{cat.code}</p>
                    </div>
                  </div>
                  <Badge variant={cat.status === 'ACTIVE' ? 'success' : 'secondary'} className="text-[10px]">
                    {cat.status === 'ACTIVE' ? 'Đang hiển thị' : 'Ẩn'}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">{cat.description}</p>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{cat.foodCount} món ăn</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                      title="Xóa danh mục"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: Combos Grid */}
      {activeTab === 'COMBOS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCombos.map((combo) => (
            <Card key={combo.id} className="hover:border-primary/50 transition-colors shadow-xs flex flex-col justify-between">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-foreground">{combo.name}</h3>
                  <Badge variant="warning" className="text-[10px] shrink-0 font-bold">{combo.tag}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-orange-600 dark:text-orange-400 font-mono">
                    {formatCurrency(combo.comboPrice)}
                  </span>
                  <span className="text-xs line-through text-muted-foreground font-mono">
                    {formatCurrency(combo.originalPrice)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {combo.discount}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1">
                  {combo.items.map((i, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{i}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border flex justify-end">
                  <button
                    onClick={() => handleDeleteCombo(combo.id)}
                    className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                    title="Xóa combo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Add Category / Combo */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{activeTab === 'CATEGORIES' ? 'Thêm Danh Mục Món Mới' : 'Tạo Gói Combo Tiết Kiệm'}</DialogTitle>
            <DialogDescription>
              Cấu hình danh mục hiển thị trên Quầy POS và Cổng Đặt Món Sinh Viên DNU
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3 py-2 text-xs">
            {activeTab === 'CATEGORIES' ? (
              <>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Tên danh mục *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="VD: Món Tráng Miệng & Chè"
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Mã danh mục</label>
                    <input
                      type="text"
                      value={categoryForm.code}
                      onChange={(e) => setCategoryForm({ ...categoryForm, code: e.target.value.toUpperCase() })}
                      placeholder="VD: DESSERT"
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Icon Emoji</label>
                    <input
                      type="text"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                      placeholder="🍨"
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg text-center text-lg focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Mô tả danh mục</label>
                  <textarea
                    rows={2}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Mô tả các món thuộc nhóm này..."
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Tên gói Combo *</label>
                  <input
                    type="text"
                    required
                    value={comboForm.name}
                    onChange={(e) => setComboForm({ ...comboForm, name: e.target.value })}
                    placeholder="VD: Combo Cơm Sườn + Trà Sữa"
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Giá gốc (VNĐ)</label>
                    <input
                      type="number"
                      value={comboForm.originalPrice}
                      onChange={(e) => setComboForm({ ...comboForm, originalPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Giá combo (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      value={comboForm.comboPrice}
                      onChange={(e) => setComboForm({ ...comboForm, comboPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono font-bold focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Món trong combo (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={comboForm.items}
                    onChange={(e) => setComboForm({ ...comboForm, items: e.target.value })}
                    placeholder="1 Cơm sườn nướng, 1 Trà đào cam sả"
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}

            <DialogFooter className="pt-2">
              <Button type="submit" variant="default" className="w-full font-bold">
                Hoàn Tất & Lưu Vào Hệ Thống
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
