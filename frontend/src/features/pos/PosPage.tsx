import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Printer, 
  CreditCard, 
  QrCode, 
  Banknote,
  CheckCircle2,
  Utensils
} from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  toppings?: string[];
}

export const PosPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, name: 'Cơm Gà Xối Mỡ Giòn Da', price: 35000, quantity: 2, toppings: ['Trứng ốp la (+6k)'] },
    { id: 13, name: 'Trà Đào Cam Sả Size M', price: 25000, quantity: 1 },
  ]);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(10000);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const categories = [
    { id: 0, name: 'Tất cả món' },
    { id: 1, name: 'Cơm Phần' },
    { id: 2, name: 'Bún - Phở' },
    { id: 3, name: 'Bánh Mì' },
    { id: 4, name: 'Đồ Uống' },
    { id: 10, name: 'Combo Hot' },
  ];

  const foods = [
    { id: 1, categoryId: 1, name: 'Cơm Gà Xối Mỡ Giòn Da', price: 35000, isBest: true },
    { id: 2, categoryId: 1, name: 'Cơm Sườn Nướng Mật Ong', price: 35000, isBest: true },
    { id: 3, categoryId: 1, name: 'Cơm Tấm Sườn Bì Chả', price: 40000 },
    { id: 4, categoryId: 1, name: 'Cơm Bò Lúc Lắc', price: 45000 },
    { id: 7, categoryId: 2, name: 'Phở Bò Tái Hà Nội', price: 35000, isBest: true },
    { id: 9, categoryId: 2, name: 'Bún Bò Huế Đặc Biệt', price: 40000 },
    { id: 13, categoryId: 4, name: 'Trà Đào Cam Sả Size M', price: 25000, isBest: true },
    { id: 15, categoryId: 4, name: 'Trà Sữa Trân Châu Size M', price: 25000 },
    { id: 17, categoryId: 4, name: 'Cà Phê Sữa Đá', price: 18000 },
    { id: 18, categoryId: 4, name: 'Coca Cola Lon 320ml', price: 12000 },
    { id: 21, categoryId: 3, name: 'Bánh Mì Thịt Chả', price: 20000 },
    { id: 22, categoryId: 3, name: 'Bánh Mì Ốp La Xíu Mại', price: 22000 },
  ];

  const filteredFoods = foods.filter((f) => {
    const matchCategory = selectedCategory === 0 || f.categoryId === selectedCategory;
    const matchSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addToCart = (food: (typeof foods)[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: food.id, name: food.name, price: food.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discount);

  const handlePay = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowCheckoutModal(false);
      setCart([]);
    }, 1800);
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col lg:flex-row gap-5">
      {/* Left Area: Food Selection Grid */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-100 shadow-sm p-4 overflow-hidden">
        {/* Search & Categories Bar */}
        <div className="space-y-3 pb-3 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm nhanh món ăn theo tên hoặc mã..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Cards */}
        <div className="flex-1 overflow-y-auto pt-3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              onClick={() => addToCart(food)}
              className="group p-3 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none active:scale-[0.98]"
            >
              <div>
                <div className="w-full h-20 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2.5 group-hover:bg-emerald-100 transition-colors">
                  <Utensils className="w-7 h-7" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{food.name}</h4>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700">{formatCurrency(food.price)}</span>
                <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors">
                  +
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Area: POS Order Cart & Checkout Panel */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">Hóa Đơn Hiện Tại</h3>
          </div>
          <Badge variant="success" size="sm">
            Bàn A1-02
          </Badge>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingCart className="w-8 h-8 mb-2 stroke-[1.5]" />
              <p className="text-xs">Chưa có món nào được chọn</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-start justify-between">
                  <h5 className="text-xs font-bold text-slate-800 leading-tight">{item.name}</h5>
                  <span className="text-xs font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
                {item.toppings && (
                  <p className="text-[10px] text-slate-500">{item.toppings.join(', ')}</p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">{formatCurrency(item.price)} / suất</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation & Checkout */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Tạm tính:</span>
            <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-emerald-600">
            <span>Voucher sinh viên (BKCHAO2026):</span>
            <span className="font-semibold">-{formatCurrency(discount)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-dashed border-slate-200">
            <span>Tổng thanh toán:</span>
            <span className="text-base text-emerald-600">{formatCurrency(finalTotal)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              onClick={() => setShowCheckoutModal(true)}
              disabled={cart.length === 0}
              variant="primary"
              className="w-full py-2.5 font-bold"
            >
              Thanh Toán
            </Button>
            <Button
              onClick={() => setCart([])}
              disabled={cart.length === 0}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              Hủy Đơn
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            {paymentSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-slate-800">Thanh Toán Thành Công!</h4>
                <p className="text-xs text-slate-500">Đơn hàng đã được tự động đẩy sang Màn hình Bếp (KDS).</p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <h4 className="text-base font-bold text-slate-900">Xác Nhận Thanh Toán POS</h4>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1">{formatCurrency(finalTotal)}</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600">Chọn phương thức:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="p-3 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-700 flex flex-col items-center gap-1.5 text-xs font-bold">
                      <QrCode className="w-5 h-5" />
                      <span>QR MoMo</span>
                    </button>
                    <button className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center gap-1.5 text-xs font-bold">
                      <Banknote className="w-5 h-5" />
                      <span>Tiền Mặt</span>
                    </button>
                    <button className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center gap-1.5 text-xs font-bold">
                      <CreditCard className="w-5 h-5" />
                      <span>Ví SV</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handlePay} variant="primary" className="flex-1 py-2.5">
                    Hoàn Tất & In Hóa Đơn
                  </Button>
                  <Button onClick={() => setShowCheckoutModal(false)} variant="outline">
                    Đóng
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
