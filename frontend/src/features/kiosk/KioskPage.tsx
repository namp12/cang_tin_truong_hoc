import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { ReceiptModal, ReceiptData } from '../../components/common/ReceiptModal.js';
import { FoodCatalogItem } from '../../data/foodCatalog.js';
import { orderStorage } from '../../services/orderStorage.js';
import { dnuStore } from '../../services/dnuStore.js';
import { useSocket } from '../../contexts/SocketContext.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Plus, 
  Minus, 
  QrCode, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  ArrowLeft,
  Store,
  Layers,
  Wallet,
  X
} from 'lucide-react';

export const KioskPage: React.FC = () => {
  const navigate = useNavigate();
  const { emitNewOrder } = useSocket();

  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [foods, setFoods] = useState<FoodCatalogItem[]>(() => dnuStore.getFoods());
  const [categories, setCategories] = useState(() => dnuStore.getCategories());

  useEffect(() => {
    const handleSync = () => {
      setFoods(dnuStore.getFoods());
      setCategories(dnuStore.getCategories());
    };
    window.addEventListener('dnu_store_updated', handleSync);
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('dnu_store_updated', handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const filteredFoods = selectedCat === 'ALL' ? foods : foods.filter((f) => f.category === selectedCat || f.categoryId.toString() === selectedCat);

  const addToCart = (food: FoodCatalogItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) {
        return prev.map((item) => (item.id === food.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { id: food.id, name: food.name, price: food.price, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const next = item.qty + delta;
            return next > 0 ? { ...item, qty: next } : null;
          }
          return item;
        })
        .filter(Boolean) as typeof cart
    );
  };

  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleKioskCheckout = () => {
    const orderNum = `#K-${Math.floor(100 + Math.random() * 900)}`;
    const newOrderId = Date.now();

    const orderData = {
      id: newOrderId,
      code: orderNum,
      customerName: 'Sinh Viên DNU (Kiosk Tòa G)',
      canteenName: 'Căng tin Tòa G (Hà Đông)',
      tableNumber: 'Nhận tại Quầy 1',
      itemsSummary: cart.map((i) => `${i.qty}× ${i.name}`).join(', '),
      itemsDetail: cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      finalAmount: totalAmount,
      status: 'PREPARING' as const,
      paymentStatus: 'PAID' as const,
      paymentMethod: 'Ví DNU Pay / QR Kiosk',
      orderedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    // Save to orderStorage
    orderStorage.addOrder(orderData);

    // Increment soldToday for foods in catalog
    const allFoods = dnuStore.getFoods();
    const updatedFoods = allFoods.map((f) => {
      const inCart = cart.find((c) => c.id === f.id || c.name === f.name);
      if (inCart) {
        return {
          ...f,
          soldToday: (f.soldToday || 0) + inCart.qty,
        };
      }
      return f;
    });
    dnuStore.saveFoods(updatedFoods);
    setFoods(updatedFoods);

    // Dispatch WebSocket order to Kitchen
    emitNewOrder({
      orderId: newOrderId,
      orderNumber: orderNum,
      tableNumber: 'Kiosk Sảnh Tòa G',
      canteenId: 1,
      customerName: 'Khách Đặt Tại Kiosk Tự Phục Vụ',
      items: cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      totalAmount: totalAmount,
      status: 'PREPARING',
      orderedAt: new Date().toLocaleTimeString().slice(0, 5),
    });

    const receipt: ReceiptData = {
      orderNumber: orderNum,
      orderTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      cashierName: 'Smart Kiosk Tòa G',
      canteenName: 'Căng tin Trung Tâm (Tòa nhà G - Hà Đông)',
      tableNumber: 'Nhận tại Quầy 1',
      customerName: 'Sinh Viên DNU (Tự phục vụ)',
      items: cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      subtotal: totalAmount,
      discount: 0,
      finalTotal: totalAmount,
      paymentMethod: 'Ví Sinh Viên DNU Pay / QR',
    };

    setReceiptData(receipt);
    setShowPaymentSuccess(true);

    setTimeout(() => {
      setShowPaymentSuccess(false);
      setShowReceipt(true);
      setCart([]);
      setIsCartOpen(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Kiosk Top Header */}
      <header className="h-20 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>DNU SMART KIOSK</span>
              <Badge variant="primary" className="bg-orange-600 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5">TÒA G</Badge>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">Chạm màn hình để đặt món & thanh toán tự động trong 30 giây</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] sm:text-xs font-bold text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Thoát Kiosk</span>
          <span className="xs:hidden">Thoát</span>
        </button>
      </header>

      {/* Main Kiosk Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Categories Bar (Responsive: scrollable row on mobile/tablet, vertical sidebar on desktop) */}
        <div className="w-full lg:w-48 bg-slate-900/90 border-b lg:border-b-0 lg:border-r border-slate-800 p-2.5 sm:p-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto gap-2 lg:space-y-2 shrink-0 scrollbar-thin">
          <button
            onClick={() => setSelectedCat('ALL')}
            className={`px-4 py-2 lg:p-4 rounded-full lg:rounded-2xl flex flex-row lg:flex-col items-center justify-center gap-2 text-center transition-all shrink-0 ${
              selectedCat === 'ALL'
                ? 'bg-gradient-to-tr from-orange-600 to-amber-600 text-white shadow-xl shadow-orange-600/30 scale-105 font-black'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white font-semibold'
            }`}
          >
            <span className="text-xl lg:text-3xl">🍽️</span>
            <span className="text-xs font-bold lg:font-semibold leading-tight whitespace-nowrap">TẤT CẢ MÓN ({foods.length})</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.name)}
              className={`px-4 py-2 lg:p-4 rounded-full lg:rounded-2xl flex flex-row lg:flex-col items-center justify-center gap-2 text-center transition-all shrink-0 ${
                selectedCat === c.name
                  ? 'bg-gradient-to-tr from-orange-600 to-amber-600 text-white shadow-xl shadow-orange-600/30 scale-105 font-black'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white font-semibold'
              }`}
            >
              <span className="text-xl lg:text-3xl">{c.icon}</span>
              <span className="text-xs font-bold lg:font-semibold leading-tight whitespace-nowrap">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Middle Dishes Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto pb-24 lg:pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredFoods.map((f) => (
              <div
                key={f.id}
                onClick={() => addToCart(f)}
                className="bg-slate-900 border border-slate-800 hover:border-orange-500/60 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] shadow-md group relative"
              >
                <div>
                  <div className="relative w-full h-28 sm:h-36 rounded-xl overflow-hidden mb-2.5 sm:mb-3 bg-slate-800">
                    <img
                      src={f.imageUrl}
                      alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                    {f.isBest && (
                      <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md">
                        🔥 BÁN CHẠY
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {f.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-2 mt-1">{f.desc}</p>
                </div>

                <div className="mt-2.5 sm:mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-extrabold text-orange-400 text-sm sm:text-base font-mono">
                    {formatCurrency(f.price)}
                  </span>
                  <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95">
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backdrop for Mobile Cart Drawer */}
        {isCartOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden" 
            onClick={() => setIsCartOpen(false)} 
          />
        )}

        {/* Right Cart Sidebar / Mobile Slide-over Drawer */}
        <div 
          className={`fixed lg:relative inset-y-0 right-0 z-40 w-full sm:w-[400px] lg:w-96 bg-slate-900 border-l border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform lg:transform-none ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          } lg:translate-x-0 lg:flex`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <h2 className="font-extrabold text-sm sm:text-base text-white">Khay Món Đã Chọn</h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="primary" className="bg-orange-600 text-white font-mono text-[10px] sm:text-xs">
                  {cart.reduce((s, i) => s + i.qty, 0)} món
                </Badge>
                {/* Close Button for Mobile Drawer */}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="lg:hidden p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="py-3 space-y-2 max-h-[calc(100vh-18rem)] sm:max-h-[calc(100vh-22rem)] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto opacity-30" />
                  <p className="text-xs">Chưa có món nào được chọn</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-600">Chạm vào món ăn trên màn hình để thêm</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 sm:p-3 bg-slate-800/70 border border-slate-700/60 rounded-xl flex items-center justify-between gap-2 shadow-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-white truncate">{item.name}</p>
                      <p className="text-[10px] sm:text-[11px] text-orange-400 font-mono font-bold mt-0.5">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
                      >
                        <Minus className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      </button>
                      <span className="font-mono font-extrabold text-xs sm:text-sm text-white w-4 sm:w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center"
                      >
                        <Plus className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart Bottom Checkout */}
          <div className="pt-3 sm:pt-4 border-t border-slate-800 space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tạm tính:</span>
                <span className="font-mono font-bold text-slate-200">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Giảm giá sinh viên:</span>
                <span className="font-mono font-bold text-emerald-400">0 đ</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-white pt-1 border-t border-slate-800">
                <span>Tổng thanh toán:</span>
                <span className="font-mono text-base sm:text-xl text-orange-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Button
              onClick={handleKioskCheckout}
              disabled={cart.length === 0}
              variant="default"
              size="lg"
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs sm:text-base rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Chạm Để Thanh Toán & Nhận Số</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Cart Bar for Mobile/Tablet */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-gradient-to-r from-orange-600 to-amber-600 p-4 rounded-2xl flex items-center justify-between shadow-xl shadow-orange-600/30 z-20 cursor-pointer active:scale-[0.98] transition-transform animate-in slide-in-from-bottom duration-300"
          onClick={() => setIsCartOpen(true)}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white relative">
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-orange-500">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-orange-100 uppercase tracking-wider font-extrabold">Khay của bạn</p>
              <p className="text-sm font-black text-white font-mono">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black text-white">
            <span>Xem khay & Thanh toán</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </div>
        </div>
      )}

      {/* Payment Success Animation Overlay */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in-0 duration-200">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-black text-white">Đặt Món Thành Công!</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Đơn hàng đã được chuyển ngay tới Nhà Bếp KDS. Vui lòng lấy hóa đơn và đợi số gọi món.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl font-mono text-xs text-emerald-400 font-bold">
              Đã đồng bộ cơ sở dữ liệu & Bếp
            </div>
          </div>
        </div>
      )}

      {/* Thermal Receipt Modal */}
      {receiptData && (
        <ReceiptModal open={showReceipt} onOpenChange={setShowReceipt} data={receiptData} />
      )}
    </div>
  );
};
