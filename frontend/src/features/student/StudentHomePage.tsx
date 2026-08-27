import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { OrderTrackingModal } from '../../components/common/OrderTrackingModal.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { initialFoodCatalog } from '../../data/foodCatalog.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  Search, 
  Sparkles, 
  Star, 
  Plus, 
  ShoppingBag, 
  Flame, 
  UtensilsCrossed,
  ChefHat,
  ChevronRight,
  Clock
} from 'lucide-react';

const getStudentCohort = (username?: string) => {
  if (!username) return 'K18';
  const match = username.match(/\d+/);
  if (match) {
    const numStr = match[0];
    if (numStr.length >= 2) {
      const yearPrefix = Number(numStr.slice(0, 2));
      if (yearPrefix >= 10 && yearPrefix <= 30) {
        const enrollmentYear = 2000 + yearPrefix;
        return `K${enrollmentYear - 2006}`;
      }
    }
  }
  return 'K18';
};

export const StudentHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const studentCohort = getStudentCohort(user?.username || 'student_2110001');

  // Determine promo details based on cohort
  const promoTitle = studentCohort === 'K18' ? '🎁 CHÀO TÂN SINH VIÊN K18 DNU' : `🎁 ƯU ĐÃI SINH VIÊN DNU (${studentCohort})`;
  const promoOffer = studentCohort === 'K18' ? 'Giảm 20% Cho Đơn Đầu Tiên' : 'Giảm 10.000đ Combo Trưa';
  const promoCode = studentCohort === 'K18' ? 'DNUCHAO2026' : 'DNUFOOD';
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [cartCount, setCartCount] = useState(2);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const activeOrder = {
    orderNumber: '#1029',
    status: 'PREPARING' as const,
    canteenName: 'Căng tin Tòa G (Hà Đông)',
    tableNumber: 'Bàn G1-02',
    items: [
      { name: 'Cơm Gà Xối Mỡ Giòn Da', qty: 2 },
      { name: 'Trà Đào Cam Sả Hà Đông', qty: 1 },
    ],
    totalAmount: 95000,
    orderedAt: '11:45',
  };

  const categories = [
    { id: 'ALL', name: 'Tất Cả', icon: '🍽️' },
    { id: 'COM', name: 'Cơm Trưa', icon: '🍚' },
    { id: 'PHO', name: 'Bún & Phở', icon: '🍜' },
    { id: 'DRINK', name: 'Đồ Uống', icon: '🥤' },
    { id: 'FAST', name: 'Bánh Mì', icon: '🥖' },
  ];

  const popularFoods = initialFoodCatalog.slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Live Active Order Tracking Banner */}
      <div
        onClick={() => setShowTrackingModal(true)}
        className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 border border-orange-500/30 flex items-center justify-between cursor-pointer hover:border-orange-500/60 shadow-xs transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-600 text-white shadow-xs animate-pulse">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800">Đơn #{activeOrder.orderNumber}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-700">
                🍳 Bếp đang nấu (5p)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-[200px]">2 Cơm gà xối mỡ • Quầy 1</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
          <span>Xem</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Promo Banner Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full inline-block backdrop-blur-xs">
            {promoTitle}
          </span>
          <h2 className="text-base font-extrabold leading-tight">{promoOffer}</h2>
          <p className="text-[11px] text-orange-100">
            Nhập mã voucher <span className="font-bold underline bg-white/20 px-1 py-0.5 rounded">{promoCode}</span> khi thanh toán
          </p>
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
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCat === c.id
                ? 'bg-orange-600 text-white shadow-xs font-bold'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Món Ăn Nổi Bật DNU</h3>
        </div>
        <span className="text-xs font-semibold text-orange-600 cursor-pointer">Xem tất cả</span>
      </div>

      {/* Food List Cards with Image */}
      <div className="space-y-3">
        {popularFoods.map((food) => (
          <div
            key={food.id}
            className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-sm flex items-start gap-3 hover:border-orange-500 transition-all cursor-pointer group"
            onClick={() => navigate('/student/menu')}
          >
            <img
              src={food.imageUrl}
              alt={food.name}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100 shadow-xs group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                  {food.isBest ? 'Bán chạy số 1' : 'Đặc sản DNU'}
                </span>
                <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>4.9</span>
                  <span className="text-slate-400 font-normal">(180)</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mt-1 truncate group-hover:text-orange-600 transition-colors">{food.name}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{food.desc}</p>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                <span className="text-xs font-extrabold text-orange-600 font-mono">{formatCurrency(food.price)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCartCount(cartCount + 1);
                  }}
                  className="w-7 h-7 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-sm"
                  title="Thêm vào giỏ"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal open={showTrackingModal} onOpenChange={setShowTrackingModal} order={activeOrder} />
    </div>
  );
};
