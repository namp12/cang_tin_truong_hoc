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
  Wallet
} from 'lucide-react';

export const KioskPage: React.FC = () => {
  const navigate = useNavigate();
  const { emitNewOrder } = useSocket();

  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

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
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Kiosk Top Header */}
      <header className="h-20 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>DNU SMART KIOSK</span>
              <Badge variant="primary" className="bg-orange-600 text-white text-[10px]">TÒA G</Badge>
            </h1>
            <p className="text-xs text-slate-400">Chạm màn hình để đặt món & thanh toán tự động trong 30 giây</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát Kiosk</span>
        </button>
      </header>

      {/* Main Kiosk Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Vertical Categories Bar */}
        <div className="w-48 bg-slate-900/90 border-r border-slate-800 p-3 space-y-2 overflow-y-auto">
          <button
            onClick={() => setSelectedCat('ALL')}
            className={`w-full p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
              selectedCat === 'ALL'
                ? 'bg-gradient-to-tr from-orange-600 to-amber-600 text-white shadow-xl shadow-orange-600/30 scale-105 font-black'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white font-semibold'
            }`}
          >
            <span className="text-3xl">🍽️</span>
            <span className="text-xs leading-tight">TẤT CẢ MÓN ({foods.length})</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.name)}
              className={`w-full p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
                selectedCat === c.name
                  ? 'bg-gradient-to-tr from-orange-600 to-amber-600 text-white shadow-xl shadow-orange-600/30 scale-105 font-black'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white font-semibold'
              }`}
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-xs leading-tight">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Middle Dishes Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFoods.map((f) => (
              <div
                key={f.id}
                onClick={() => addToCart(f)}
                className="bg-slate-900 border border-slate-800 hover:border-orange-500/60 rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] shadow-md group relative"
              >
                <div>
                  <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-800">
                    <img
                      src={f.imageUrl}
                      alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                    {f.isBest && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                        🔥 BÁN CHẠY
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {f.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{f.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-extrabold text-orange-400 text-base font-mono">
                    {formatCurrency(f.price)}
                  </span>
                  <button className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Cart Sidebar (Touch Optimized) */}
        <div className="w-96 bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                <h2 className="font-extrabold text-base text-white">Khay Món Đã Chọn</h2>
              </div>
              <Badge variant="primary" className="bg-orange-600 text-white font-mono text-xs">
                {cart.reduce((s, i) => s + i.qty, 0)} món
              </Badge>
            </div>

            {/* Cart Items List */}
            <div className="py-3 space-y-2.5 max-h-[calc(100vh-22rem)] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <ShoppingCart className="w-12 h-12 mx-auto opacity-30" />
                  <p className="text-xs">Chưa có món nào được chọn</p>
                  <p className="text-[11px] text-slate-600">Chạm vào món ăn trên màn hình để thêm</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-800/70 border border-slate-700/60 rounded-xl flex items-center justify-between gap-2 shadow-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-orange-400 font-mono font-bold mt-0.5">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-extrabold text-sm text-white w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart Bottom Checkout */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tạm tính:</span>
                <span className="font-mono font-bold text-slate-200">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Giảm giá sinh viên:</span>
                <span className="font-mono font-bold text-emerald-400">0 đ</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-1 border-t border-slate-800">
                <span>Tổng thanh toán:</span>
                <span className="font-mono text-xl text-orange-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Button
              onClick={handleKioskCheckout}
              disabled={cart.length === 0}
              variant="default"
              size="lg"
              className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              <span>Chạm Để Thanh Toán & Nhận Số</span>
            </Button>
          </div>
        </div>
      </div>

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
