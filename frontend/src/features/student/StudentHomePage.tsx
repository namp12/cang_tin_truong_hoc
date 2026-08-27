import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { OrderTrackingModal } from '../../components/common/OrderTrackingModal.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { dnuStore, StudentCartItem } from '../../services/dnuStore.js';
import { formatCurrency } from '../../utils/format.js';
import { useSocket } from '../../contexts/SocketContext.js';
import { orderStorage } from '../../services/orderStorage.js';
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
  const { user, hasRole } = useAuth();
  const { latestStatusUpdate } = useSocket();
  const isStudent = hasRole('STUDENT') || user?.roles?.includes('STUDENT') || user?.userType === 'STUDENT';
  const studentCohort = isStudent ? getStudentCohort(user?.username) : 'DNU';

  // Determine promo details based on cohort
  const promoTitle = isStudent
    ? studentCohort === 'K18'
      ? '🎁 CHÀO TÂN SINH VIÊN K18 DNU'
      : `🎁 ƯU ĐÃI SINH VIÊN DNU (${studentCohort})`
    : '🎁 HỆ THỐNG ĐẶT MÓN DNU SMART CANTEEN';

  const promoOffer = isStudent
    ? studentCohort === 'K18'
      ? 'Giảm 20% Cho Đơn Đầu Tiên'
      : 'Giảm 10.000đ Combo Trưa'
    : 'Thực Đơn Tươi Ngon • Phục Vụ Nhanh Chóng';

  const promoCode = isStudent && studentCohort === 'K18' ? 'DNUCHAO2026' : 'DNUFOOD';
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<StudentCartItem[]>(() => dnuStore.getStudentCart());
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedFoodToReview, setSelectedFoodToReview] = useState('');
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [foods, setFoods] = useState(() => dnuStore.getFoods());
  const [categories, setCategories] = useState(() => dnuStore.getCategories());

  const handleSubmitReview = () => {
    if (!reviewComment.trim()) return;

    dnuStore.addReview({
      studentName: user?.fullName || 'Nguyễn Thành Nam',
      studentClass: isStudent ? (user?.username || 'K16 Khoa CNTT DNU') : 'Sinh Viên DNU',
      foodName: selectedFoodToReview || foods[0]?.name || 'Cơm Gà Xối Mỡ Giòn Da',
      rating: reviewStars,
      comment: reviewComment,
      sentiment: reviewStars >= 4 ? 'POSITIVE' : reviewStars === 3 ? 'NEUTRAL' : 'CRITICAL',
      canteenName: 'Căng tin Tòa G (Hà Đông)',
    });

    setShowReviewModal(false);
    setReviewComment('');
    setReviewStars(5);
    alert(`Cảm ơn bạn! Đánh giá món "${selectedFoodToReview}" đã được gửi thành công!`);
  };

  const getLatestStudentOrder = () => {
    const allOrders = orderStorage.getOrders();
    const studentName = user?.fullName || 'Nguyễn Thành Nam';
    const studentOrders = allOrders.filter((o) => o.customerName.includes(studentName));
    
    let active = studentOrders
      .filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED')
      .sort((a, b) => b.id - a.id)[0];
      
    if (!active) {
      active = studentOrders.sort((a, b) => b.id - a.id)[0];
    }
    
    if (active) {
      return {
        id: active.id,
        orderNumber: active.code,
        status: active.status as any,
        canteenName: active.canteenName,
        tableNumber: active.tableNumber,
        items: active.itemsDetail.map((it) => ({ name: it.name, qty: it.qty })),
        totalAmount: active.finalAmount,
        orderedAt: active.orderedAt.includes(' ') ? active.orderedAt.split(' ')[1].slice(0, 5) : '11:45',
      };
    }
    
    // Fallback Mock order if student has no orders at all
    return {
      id: 1029,
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
  };

  const [activeOrder, setActiveOrder] = useState(() => getLatestStudentOrder());

  React.useEffect(() => {
    const syncData = () => {
      setFoods(dnuStore.getFoods());
      setCategories(dnuStore.getCategories());
      setCartItems(dnuStore.getStudentCart());

      // Sync active order status dynamically from storage
      setActiveOrder(getLatestStudentOrder());
    };
    syncData();
    window.addEventListener('dnu_store_updated', syncData);
    window.addEventListener('storage', syncData);
    return () => {
      window.removeEventListener('dnu_store_updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  React.useEffect(() => {
    if (latestStatusUpdate) {
      const updatedNum = latestStatusUpdate.orderNumber;
      const activeNum = activeOrder.orderNumber;
      const cleanUpdated = updatedNum.replace(/[^0-9]/g, '');
      const cleanActive = activeNum.replace(/[^0-9]/g, '');
      if (cleanUpdated === cleanActive && cleanUpdated.length > 0) {
        setActiveOrder((prev) => ({
          ...prev,
          status: latestStatusUpdate.status as any,
        }));
      }
    }
  }, [latestStatusUpdate, activeOrder.orderNumber]);

  const filteredFoods = foods.filter((f) => {
    const matchCat =
      selectedCat === 'ALL' ||
      f.category === selectedCat ||
      f.categoryId.toString() === selectedCat ||
      (selectedCat === 'Cơm Phần & Cơm Đĩa DNU' && (f.category.includes('Cơm') || f.categoryId === 1)) ||
      (selectedCat === 'Bún & Phở Hà Nội' && (f.category.includes('Bún') || f.category.includes('Phở') || f.categoryId === 2)) ||
      (selectedCat === 'Bánh Mì & Đồ Ăn Vặt' && (f.category.includes('Bánh Mì') || f.category.includes('Vặt') || f.categoryId === 3)) ||
      (selectedCat === 'Đồ Uống & Trà Sữa' && (f.category.includes('Uống') || f.category.includes('Trà') || f.categoryId === 4)) ||
      (selectedCat === 'Combo Tiết Kiệm Học Đường' && (f.category.includes('Combo') || f.categoryId === 5 || f.categoryId === 10));
    const matchSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.desc?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Bạn muốn ăn gì trưa nay? (Cơm gà, phở, trà đào...)"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCat('ALL')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCat === 'ALL'
              ? 'bg-orange-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span>🍽️</span>
          <span>Tất Cả ({foods.length})</span>
        </button>
        {categories.map((c) => {
          const count = foods.filter(
            (f) =>
              f.category === c.name ||
              f.categoryId === c.id ||
              (c.id === 1 && f.category.includes('Cơm')) ||
              (c.id === 2 && (f.category.includes('Bún') || f.category.includes('Phở'))) ||
              (c.id === 3 && (f.category.includes('Bánh Mì') || f.category.includes('Vặt'))) ||
              (c.id === 4 && (f.category.includes('Uống') || f.category.includes('Trà'))) ||
              (c.id === 5 && (f.category.includes('Combo') || f.categoryId === 10))
          ).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCat === c.name
                  ? 'bg-orange-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Món Ăn Thực Đơn DNU ({filteredFoods.length})</h3>
        </div>
        <span onClick={() => setSelectedCat('ALL')} className="text-xs font-semibold text-orange-600 cursor-pointer">
          Xem tất cả
        </span>
      </div>

      {/* Food List Cards with Image */}
      <div className="space-y-3">
        {filteredFoods.map((food) => {
          const soldOutInfo = dnuStore.checkFoodSoldOutStatus(food.name);
          const isSoldOut = soldOutInfo.isSoldOut;

          return (
            <div
              key={food.id}
              className={`p-3 bg-white rounded-2xl border transition-all cursor-pointer group flex items-start gap-3 ${
                isSoldOut
                  ? 'opacity-65 border-red-200 bg-red-50/20'
                  : 'border-slate-200/70 shadow-sm hover:border-orange-500'
              }`}
              onClick={() => navigate('/student/menu')}
            >
              <div className="relative w-20 h-20 shrink-0">
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-full rounded-xl object-cover border border-slate-100 shadow-xs group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {isSoldOut && (
                  <span className="absolute inset-x-1 bottom-1 text-[8px] text-center py-0.5 rounded bg-red-600/90 text-white font-bold backdrop-blur-xs">
                    Hết Đồ Nấu
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSoldOut ? 'text-red-700 bg-red-100' : 'text-orange-700 bg-orange-50'
                  }`}>
                    {isSoldOut ? `Tạm hết (${soldOutInfo.missingIngredient})` : food.isBest ? 'Bán chạy số 1' : 'Đặc sản DNU'}
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
                  {isSoldOut ? (
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-400 text-[11px] font-bold">
                      Tạm Hết
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dnuStore.addToStudentCart(food);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:scale-105 transition-transform"
                      title="Thêm vào giỏ"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Mini Cart Banner */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-16 left-3 right-3 max-w-md mx-auto sm:max-w-2xl z-30 animate-in slide-in-from-bottom-3">
          <div
            onClick={() => navigate('/student/cart')}
            className="p-3 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer border border-slate-700/60 hover:bg-slate-950 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)} món trong giỏ hàng
                </p>
                <p className="text-xs font-black text-orange-400 font-mono">
                  {formatCurrency(cartItems.reduce((s, i) => s + i.price * i.quantity, 0))}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-orange-600 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs hover:bg-orange-700 transition-colors">
              <span>Xem Giỏ</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Review Dialog for Student */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Đánh Giá Món Ăn</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">{selectedFoodToReview}</p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mức độ hài lòng của bạn:</label>
                <div className="flex items-center justify-center gap-2 py-2 bg-slate-50 rounded-xl">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewStars(s)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${s <= reviewStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cảm nhận về hương vị / phục vụ:</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Món ăn vừa miệng, nóng hổi, thịt mềm, phục vụ nhanh chóng..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                variant="default"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                Gửi Đánh Giá Ngay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal open={showTrackingModal} onOpenChange={setShowTrackingModal} order={activeOrder} />
    </div>
  );
};
