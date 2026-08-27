import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
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

interface CategoryItem {
  id: number;
  name: string;
  code: string;
  icon: string;
  foodCount: number;
  revenueShare: string;
  status: 'ACTIVE' | 'HIDDEN';
  description: string;
}

interface ComboItem {
  id: number;
  name: string;
  originalPrice: number;
  comboPrice: number;
  discount: string;
  items: string[];
  tag: string;
  isPopular: boolean;
}

export const CategoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CATEGORIES' | 'COMBOS'>('CATEGORIES');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: 1,
      name: 'Cơm Phần & Cơm Đĩa DNU',
      code: 'COM_PHAN',
      icon: '🍚',
      foodCount: 9,
      revenueShare: '38.5%',
      status: 'ACTIVE',
      description: 'Cơm rang dưa bò, cơm gà xối mỡ, cơm sườn nướng mật ong than hoa',
    },
    {
      id: 2,
      name: 'Bún & Phở Hà Nội',
      code: 'BUN_PHO',
      icon: '🍜',
      foodCount: 8,
      revenueShare: '26.2%',
      status: 'ACTIVE',
      description: 'Bún chả nướng than hoa, phở bò tái lăn DNU, bún đậu mắm tôm',
    },
    {
      id: 3,
      name: 'Bánh Mì & Đồ Ăn Vặt',
      code: 'BANH_MI',
      icon: '🥖',
      foodCount: 7,
      revenueShare: '12.8%',
      status: 'ACTIVE',
      description: 'Bánh mì chảo đặc biệt DNU, nem chua rán phố cổ, bánh bao trứng cút',
    },
    {
      id: 4,
      name: 'Đồ Uống & Trà Sữa',
      code: 'DO_UONG',
      icon: '🥤',
      foodCount: 11,
      revenueShare: '16.5%',
      status: 'ACTIVE',
      description: 'Trà đào cam sả Hà Đông, cà phê cốt dừa, trà chanh giã tay, trà sữa trân châu',
    },
    {
      id: 5,
      name: 'Combo Tiết Kiệm Học Đường',
      code: 'COMBO_DNU',
      icon: '🍱',
      foodCount: 5,
      revenueShare: '6.0%',
      status: 'ACTIVE',
      description: 'Gói combo ăn trưa kèm đồ uống tiết kiệm đến 10.000đ cho sinh viên',
    },
  ]);

  const [combos, setCombos] = useState<ComboItem[]>([
    {
      id: 101,
      name: 'Combo Cơm Gà + Trà Đào Cam Sả',
      originalPrice: 60000,
      comboPrice: 50000,
      discount: '-17%',
      items: ['Cơm Gà Xối Mỡ Giòn Da', 'Trà Đào Cam Sả Size M', 'Canh súp gà nóng'],
      tag: 'Bán chạy nhất',
      isPopular: true,
    },
    {
      id: 102,
      name: 'Combo Bún Chả + Trà Quất Mật Ong',
      originalPrice: 50000,
      comboPrice: 42000,
      discount: '-16%',
      items: ['Bún Chả Hà Nội Nướng Than', 'Trà Quất Mật Ong Hoa Nhài', 'Nem rán phố cổ (1c)'],
      tag: 'Đặc sản Hà Nội',
      isPopular: true,
    },
    {
      id: 103,
      name: 'Combo Bánh Mì Chảo + Cafe Sữa',
      originalPrice: 48000,
      comboPrice: 40000,
      discount: '-17%',
      items: ['Bánh Mì Chảo Đặc Biệt DNU', 'Cà Phê Sữa Đá Phin', 'Bánh mì nóng giòn'],
      tag: 'Năng lượng sáng',
      isPopular: false,
    },
    {
      id: 104,
      name: 'Combo Phở Bò Tái Lăn + Trà Chanh',
      originalPrice: 58000,
      comboPrice: 48000,
      discount: '-17%',
      items: ['Phở Bò Tái Lăn DNU', 'Trà Chanh Giã Tay DNU', 'Quẩy giòn (2c)'],
      tag: 'Ăn sáng DNU',
      isPopular: true,
    },
  ]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Danh Mục & Combo Món Ăn DNU</h2>
          <p className="text-xs text-muted-foreground">Phân nhóm thực đơn, định cấu trúc danh mục và tạo các gói Combo ưu đãi cho sinh viên</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowAddModal(true)} variant="default" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            {activeTab === 'CATEGORIES' ? 'Thêm Danh Mục' : 'Tạo Combo Mới'}
          </Button>
        </div>
      </div>

      {/* Tabs Switcher & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('CATEGORIES')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'CATEGORIES'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Danh Mục Thực Đơn ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('COMBOS')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'COMBOS'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Combo Tiết Kiệm ({combos.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm danh mục, món combo..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-muted/40 border border-input rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Tab 1: Categories Cards Grid */}
      {activeTab === 'CATEGORIES' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Card key={c.id} className="hover:border-primary/50 transition-all shadow-xs group">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-2.5 rounded-2xl bg-muted/60 border border-border group-hover:scale-110 transition-transform">
                      {c.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{c.name}</h3>
                      <p className="text-[11px] font-mono text-muted-foreground">Mã: {c.code}</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px]">Hoạt động</Badge>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted-foreground">Số lượng món: </span>
                    <span className="font-bold text-foreground">{c.foodCount} món</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Đóng góp: </span>
                    <span className="font-bold text-primary">{c.revenueShare}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Tab 2: Combos Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {combos.map((combo) => (
            <Card key={combo.id} className="hover:border-orange-500/50 transition-all shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0">
                <div className="bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-xs">
                  {combo.discount}
                </div>
              </div>
              <CardContent className="p-5 space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">{combo.name}</h3>
                    {combo.isPopular && (
                      <Badge variant="warning" className="text-[10px] flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                        <span>Hot</span>
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-extrabold text-orange-600 dark:text-orange-400">
                      {formatCurrency(combo.comboPrice)}
                    </span>
                    <span className="text-xs line-through text-muted-foreground">
                      {formatCurrency(combo.originalPrice)}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/40 p-3 rounded-lg border border-border/60 space-y-1">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Thành phần combo:</p>
                  <ul className="text-xs text-foreground space-y-1">
                    {combo.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Add Category / Combo */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogHeader>
          <DialogTitle>{activeTab === 'CATEGORIES' ? 'Thêm Danh Mục Món Mới' : 'Tạo Gói Combo Tiết Kiệm'}</DialogTitle>
          <DialogDescription>
            Cấu hình danh mục hiển thị trên Quầy POS và Cổng Đặt Món Sinh Viên DNU
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2 text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1">Tên {activeTab === 'CATEGORIES' ? 'danh mục' : 'combo'} *</label>
            <input
              type="text"
              placeholder={activeTab === 'CATEGORIES' ? 'VD: Món Tráng Miệng & Chè' : 'VD: Combo Cơm Sườn + Trà Sữa'}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">Mã danh mục</label>
              <input
                type="text"
                placeholder="VD: DESSERT"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block font-semibold text-foreground mb-1">Icon Emoji</label>
              <input
                type="text"
                defaultValue="🍨"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-center focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setShowAddModal(false)} variant="default" className="w-full">
            Hoàn Tất & Lưu
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
