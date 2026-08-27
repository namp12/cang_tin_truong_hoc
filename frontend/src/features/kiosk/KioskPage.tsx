import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { ReceiptModal, ReceiptData } from '../../components/common/ReceiptModal.js';
import { initialFoodCatalog, FoodCatalogItem } from '../../data/foodCatalog.js';
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

  const [selectedCat, setSelectedCat] = useState<number>(0);
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const categories = [
    { id: 0, name: 'TẤT CẢ MÓN (40+)', icon: '🍽️' },
    { id: 1, name: 'CƠM TRƯA DNU', icon: '🍚' },
    { id: 2, name: 'BÚN & PHỞ', icon: '🍜' },
    { id: 3, name: 'BÁNH MÌ ĂN VẶT', icon: '🥖' },
    { id: 4, name: 'ĐỒ UỐNG & TRÀ SỮA', icon: '🥤' },
    { id: 10, name: 'COMBO TIẾT KIỆM', icon: '🍱' },
  ];

  const foods = initialFoodCatalog;

  const filteredFoods = selectedCat === 0 ? foods : foods.filter((f) => f.categoryId === selectedCat);

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

    // Dispatch WebSocket order to Kitchen
    emitNewOrder({
      orderId: Date.now(),
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
    }, 1800);
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
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`w-full p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
                selectedCat === c.id
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
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/60 hover:bg-slate-850 cursor-pointer transition-all shadow-lg hover:scale-102 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2.5 bg-slate-800">
                    <img
                      src={f.imageUrl}
                      alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {f.isBest && (
                      <Badge variant="warning" className="absolute top-2 right-2 bg-orange-500 text-white font-bold text-[10px] shadow-md">
                        HOT
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-start justify-between">
                    <h3 className="font-extrabold text-sm text-white leading-snug group-hover:text-orange-400 transition-colors">
                      {f.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{f.desc}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-base font-black text-orange-400 font-mono">
                    {formatCurrency(f.price)}
                  </span>
                  <button className="p-2 rounded-xl bg-orange-600 group-hover:bg-orange-500 text-white font-bold transition-colors shadow-xs">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Cart Sidebar */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-sm text-white">Khay Món Đã Chọn</h3>
              </div>
              <span className="text-xs text-slate-400 font-bold">{cart.length} món</span>
            </div>

            {/* Cart Items List */}
            <div className="py-3 space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <UtensilsCrossed className="w-12 h-12 mx-auto opacity-30" />
                  <p className="text-xs">Chạm vào các món ăn trên màn hình để đặt món</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-xs text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-orange-400 font-mono">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-xs font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-black">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-orange-600 hover:bg-orange-500 flex items-center justify-center text-xs font-bold text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Checkout Area */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Tổng thanh toán:</span>
              <span className="text-xl font-black text-orange-400 font-mono">{formatCurrency(totalAmount)}</span>
            </div>

            <Button
              disabled={cart.length === 0}
              onClick={handleKioskCheckout}
              className="w-full py-4 text-base font-black bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl shadow-xl shadow-orange-600/30"
            >
              Chạm Để Thanh Toán & In Số Thứ Tự
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Success Overlay */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center animate-in fade-in">
          <div className="text-center space-y-3 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-white">THANH TOÁN THÀNH CÔNG!</h2>
            <p className="text-xs text-slate-300">Đơn hàng của bạn đã được chuyển vào Bếp Căng tin Tòa G.</p>
            <p className="text-xs text-orange-400 font-bold">Đang in phiếu thứ tự lấy món...</p>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal open={showReceipt} onOpenChange={setShowReceipt} data={receiptData} />
    </div>
  );
};
