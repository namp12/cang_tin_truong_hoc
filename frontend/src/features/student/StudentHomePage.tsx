import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  Search, 
  Sparkles, 
  Star, 
  Plus, 
  ShoppingBag, 
  Flame, 
  UtensilsCrossed 
} from 'lucide-react';

export const StudentHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [cartCount, setCartCount] = useState(2);

  const categories = [
    { id: 'ALL', name: 'Tất Cả', icon: '🍽️' },
    { id: 'COM', name: 'Cơm Trưa', icon: '🍚' },
    { id: 'PHO', name: 'Bún & Phở', icon: '🍜' },
    { id: 'DRINK', name: 'Đồ Uống', icon: '🥤' },
    { id: 'FAST', name: 'Bánh Mì', icon: '🥖' },
  ];

  const popularFoods = [
    {
      id: 31,
      name: 'Cơm Rang Dưa Bò Hà Nội',
      category: 'COM',
      price: 35000,
      rating: 4.9,
      reviews: 185,
      tag: 'Bán chạy số 1',
      desc: 'Hạt cơm chiên vàng giòn, bò xào mềm thơm đậm đà, dưa cải chua muối giòn rụm.',
    },
    {
      id: 32,
      name: 'Bún Chả Hà Nội Nướng Than Hoa',
      category: 'PHO',
      price: 35000,
      rating: 4.9,
      reviews: 160,
      tag: 'Đặc sản',
      desc: 'Chả miếng chả băm nướng than hoa thơm lừng, bún tươi và nước chấm đu đủ cà rốt.',
    },
    {
      id: 33,
      name: 'Phở Bò Tái Lăn DNU',
      category: 'PHO',
      price: 40000,
      rating: 4.8,
      reviews: 120,
      tag: 'Món nước',
      desc: 'Bò tái lăn xào tỏi thơm lừng, nước dùng hầm xương 12h đậm đà kèm quẩy giòn.',
    },
    {
      id: 13,
      name: 'Trà Đào Cam Sả Hà Đông',
      category: 'DRINK',
      price: 25000,
      rating: 4.9,
      reviews: 240,
      tag: 'Giải nhiệt',
      desc: 'Trà đen thanh mát kết hợp đào miếng giòn ngọt và sả tươi thơm nức mũi.',
    },
    {
      id: 36,
      name: 'Cà Phê Cốt Dừa Hà Nội',
      category: 'DRINK',
      price: 25000,
      rating: 4.8,
      reviews: 110,
      tag: 'Best Seller',
      desc: 'Cà phê phin đậm đà kết hợp cốt dừa béo ngậy xay đá tuyết mát lạnh.',
    },
    {
      id: 39,
      name: 'Bánh Mì Chảo Đặc Biệt DNU',
      category: 'FAST',
      price: 30000,
      rating: 4.9,
      reviews: 95,
      tag: 'Năng lượng',
      desc: 'Pate cột đèn, 2 trứng ốp la lòng đào, xúc xích Đức và sốt cà chua sánh mịn.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Promo Banner Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full inline-block backdrop-blur-xs">
            🎁 CHÀO TÂN SINH VIÊN K18 DNU
          </span>
          <h2 className="text-base font-extrabold leading-tight">Giảm 20% Cho Đơn Đầu Tiên</h2>
          <p className="text-[11px] text-orange-100">Nhập mã voucher <span className="font-bold underline bg-white/20 px-1 py-0.5 rounded">DNUCHAO2026</span> khi thanh toán</p>
        </div>
        <Sparkles className="w-16 h-16 absolute -right-2 -bottom-2 text-white/20" />
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Bạn muốn ăn gì trưa nay? (Cơm gà, phở, trà đào...)"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-xs ${
              selectedCat === c.id
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Food Section Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Món Ăn Nổi Bật</h3>
        </div>
        <span className="text-xs font-semibold text-emerald-600 cursor-pointer">Xem tất cả</span>
      </div>

      {/* Food List Cards */}
      <div className="space-y-3">
        {popularFoods.map((food) => (
          <div
            key={food.id}
            className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-sm flex items-start gap-3 hover:border-emerald-500 transition-all cursor-pointer"
            onClick={() => navigate('/student/menu')}
          >
            <div className="w-20 h-20 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <UtensilsCrossed className="w-8 h-8" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {food.tag}
                </span>
                <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{food.rating}</span>
                  <span className="text-slate-400 font-normal">({food.reviews})</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{food.name}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{food.desc}</p>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                <span className="text-xs font-extrabold text-emerald-700">{formatCurrency(food.price)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCartCount(cartCount + 1);
                  }}
                  className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm"
                  title="Thêm vào giỏ"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
