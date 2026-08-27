import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { ReceiptModal, ReceiptData } from '../../components/common/ReceiptModal.js';
import { initialFoodCatalog, FoodCatalogItem } from '../../data/foodCatalog.js';
import { orderStorage } from '../../services/orderStorage.js';
import { useSocket } from '../../contexts/SocketContext.js';
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
  Utensils,
  Sparkles,
  TicketPercent
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
    { id: 31, name: 'Cơm Rang Dưa Bò Hà Nội', price: 35000, quantity: 2, toppings: ['Trứng ốp la (+6k)'] },
    { id: 13, name: 'Trà Đào Cam Sả Hà Đông', price: 25000, quantity: 1 },
  ]);
  const [voucherCode, setVoucherCode] = useState('DNUCHAO2026');
  const [discount, setDiscount] = useState(15000);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'QRMOMO' | 'CASH' | 'DNUPAY'>('DNUPAY');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const categories = [
    { id: 0, name: 'Tất cả món (40+)' },
    { id: 1, name: 'Cơm Phần & Cơm Đĩa DNU' },
    { id: 2, name: 'Bún - Phở - Mì Hà Nội' },
    { id: 3, name: 'Bánh Mì & Đồ Ăn Vặt' },
    { id: 4, name: 'Đồ Uống & Trà Sữa DNU' },
    { id: 5, name: 'Tráng Miệng & Chè' },
    { id: 10, name: 'Combo Tiết Kiệm DNU' },
  ];

  const foods = initialFoodCatalog;

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
      return [
        ...prev,
        {
          id: food.id,
          name: food.name,
          price: food.price,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === 'DNUCHAO2026') {
      setDiscount(15000);
    } else if (voucherCode.toUpperCase() === 'DNUK18') {
      setDiscount(20000);
    } else if (voucherCode.toUpperCase() === 'DNUFOOD') {
      setDiscount(10000);
    } else {
      setDiscount(0);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discount);

  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const { emitNewOrder } = useSocket();

  const handlePay = () => {
    setPaymentSuccess(true);
    
    // Broadcast order to Kitchen (KDS) realtime via WebSocket & Save to DB/Storage
    const orderNum = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = Date.now();

    orderStorage.addOrder({
      id: newOrderId,
      code: orderNum,
      customerName: 'Khách Quầy POS Tòa G',
      canteenName: 'Căng tin Tòa G (Hà Đông)',
      tableNumber: 'Bàn G1-02',
      itemsSummary: cart.map((i) => `${i.quantity}× ${i.name}`).join(', '),
      itemsDetail: cart.map((i) => ({ name: i.name, qty: i.quantity, price: i.price, note: i.toppings?.join(', ') })),
      finalAmount: finalTotal,
      status: 'PREPARING',
      paymentStatus: 'PAID',
      paymentMethod: selectedPaymentMethod === 'CASH' ? 'Tiền mặt' : selectedPaymentMethod === 'DNUPAY' ? 'Ví DNU Pay' : 'QR MoMo/VNPAY',
      orderedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    });

    emitNewOrder({
      orderId: newOrderId,
      orderNumber: orderNum,
      tableNumber: 'Bàn G1-02',
      canteenId: 1,
      customerName: 'Khách Quầy POS Tòa G',
      items: cart.map((i) => ({
        name: i.name,
        qty: i.quantity,
        price: i.price,
        note: i.toppings?.join(', '),
      })),
      totalAmount: finalTotal,
      status: 'PREPARING',
      orderedAt: new Date().toLocaleTimeString().slice(0, 5),
    });

    const receipt: ReceiptData = {
      orderNumber: orderNum,
      orderTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      cashierName: 'Phạm Quỳnh Như (Quầy POS Tòa G)',
      canteenName: 'Căng tin Trung Tâm (Tòa nhà G - Hà Đông)',
      tableNumber: 'Bàn G1-02',
      items: cart.map((i) => ({ name: i.name, qty: i.quantity, price: i.price })),
      subtotal,
      discount,
      voucherCode,
      finalTotal,
      paymentMethod: selectedPaymentMethod === 'CASH' ? 'Tiền mặt' : selectedPaymentMethod === 'DNUPAY' ? 'Ví DNU Pay' : 'QR MoMo/VNPAY',
    };

    setReceiptData(receipt);

    setTimeout(() => {
      setPaymentSuccess(false);
      setShowCheckoutModal(false);
      setShowReceipt(true);
      setCart([]);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6.5rem)]">
      {/* Left Menu Area (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
        {/* Search & Category Pills */}
        <div className="space-y-3 bg-card p-4 rounded-xl border border-border">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Tìm nhanh trong 40+ món ăn, bún chả, phở bò, trà đào DNU..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => addToCart(food)}
                className="group relative bg-card border border-border hover:border-primary/50 hover:shadow-card-hover rounded-xl p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-[0.98]"
              >
                <div>
                  <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2 bg-muted">
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {food.isBest && (
                      <Badge variant="warning" className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0 shadow-sm font-bold">
                        HOT
                      </Badge>
                    )}
                  </div>

                  <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {food.name}
                  </h4>
                  {food.desc && (
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                      {food.desc}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                  <span className="font-extrabold text-xs text-primary font-mono">
                    {formatCurrency(food.price)}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Order Bill Area (4 Cols) */}
      <div className="lg:col-span-4 bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-card overflow-hidden">
        {/* Bill Header */}
        <div className="pb-3 border-b border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Hóa Đơn Quầy Thu Ngân</h3>
            </div>
            <Badge variant="primary" className="text-[10px] bg-orange-600 text-white">
              Tòa G Hà Đông
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">Bàn G1-02 • Thu ngân: Phạm Quỳnh Như</p>
        </div>

        {/* Bill Items List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-12">
              <Utensils className="w-10 h-10 stroke-1 mb-2 text-muted-foreground/40" />
              <p className="text-xs">Chưa có món nào được chọn.</p>
              <p className="text-[10px] text-muted-foreground/60">Bấm (+) trên món ăn để thêm vào đơn</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/40 border border-border/60 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-primary font-medium">{formatCurrency(item.price)}</p>
                  {item.toppings && (
                    <p className="text-[10px] text-muted-foreground truncate">{item.toppings.join(', ')}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-muted"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-muted"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Voucher & Calculations */}
        <div className="pt-3 border-t border-border space-y-2.5">
          {/* Voucher Input */}
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <TicketPercent className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Mã voucher DNU (DNUCHAO2026)"
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-muted/50 border border-input rounded-lg uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button onClick={handleApplyVoucher} variant="secondary" size="sm" className="text-xs">
              Áp Dụng
            </Button>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} món):</span>
              <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Ưu đãi sinh viên DNU:</span>
                <span className="font-semibold">-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-dashed border-border">
              <span>Tổng thanh toán:</span>
              <span className="text-base text-primary font-black">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              onClick={() => setShowCheckoutModal(true)}
              disabled={cart.length === 0}
              variant="primary"
              className="w-full font-bold bg-emerald-600 hover:bg-emerald-700"
            >
              Thanh Toán
            </Button>
            <Button
              onClick={() => setCart([])}
              disabled={cart.length === 0}
              variant="outline"
              className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              Hủy Đơn
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            {paymentSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-foreground">Thanh Toán Thành Công!</h4>
                <p className="text-xs text-muted-foreground">Đơn hàng đã được tự động đẩy sang KDS Bếp Tòa G.</p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <Badge variant="primary" className="mb-2 bg-orange-600 text-white">
                    DNU SMART CANTEEN
                  </Badge>
                  <h4 className="text-base font-bold text-foreground">Xác Nhận Thanh Toán POS</h4>
                  <p className="text-2xl font-black text-primary mt-1">{formatCurrency(finalTotal)}</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-muted-foreground">Chọn phương thức thanh toán:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedPaymentMethod('DNUPAY')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                        selectedPaymentMethod === 'DNUPAY'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                          : 'border-border hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Ví DNU Pay</span>
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('QRMOMO')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                        selectedPaymentMethod === 'QRMOMO'
                          ? 'border-pink-500 bg-pink-500/10 text-pink-600'
                          : 'border-border hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <QrCode className="w-5 h-5" />
                      <span>QR MoMo</span>
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('CASH')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                        selectedPaymentMethod === 'CASH'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                          : 'border-border hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <Banknote className="w-5 h-5" />
                      <span>Tiền Mặt</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handlePay} variant="primary" className="flex-1 py-2.5 font-bold">
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

      {/* 80mm Thermal Receipt Modal */}
      <ReceiptModal open={showReceipt} onOpenChange={setShowReceipt} data={receiptData} />
    </div>
  );
};
