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

  const foods = [
    // 1. Cơm Phần & Cơm Đĩa
    { id: 31, categoryId: 1, name: 'Cơm Rang Dưa Bò Hà Nội', price: 35000, isBest: true, desc: 'Bò xào mềm, dưa chua giòn rụm' },
    { id: 1, categoryId: 1, name: 'Cơm Gà Xối Mỡ Giòn Da', price: 35000, isBest: true, desc: 'Đùi gà góc tư da giòn rụm' },
    { id: 2, categoryId: 1, name: 'Cơm Sườn Nướng Mật Ong', price: 35000, isBest: true, desc: 'Sườn non ướp mật ong than hoa' },
    { id: 4, categoryId: 1, name: 'Cơm Bò Lúc Lắc Sốt Tiêu', price: 45000, desc: 'Thịt bò xào ớt chuông đậm đà' },
    { id: 3, categoryId: 1, name: 'Cơm Tấm Sườn Bì Chả DNU', price: 40000, isBest: true, desc: 'Đầy đủ sườn bì chả ốp la' },
    { id: 5, categoryId: 1, name: 'Cơm Thịt Kho Trứng Cút', price: 30000, desc: 'Thịt ba chỉ mềm thơm béo ngậy' },
    { id: 6, categoryId: 1, name: 'Cơm Cá Hú Kho Tộ', price: 30000, desc: 'Cá kho tộ đậm vị ăn kèm rau luộc' },
    { id: 25, categoryId: 1, name: 'Cơm Chiên Dương Châu', price: 30000, desc: 'Lạp xưởng, đậu Hà Lan, trứng' },
    { id: 30, categoryId: 1, name: 'Cơm Chay Nấm Đậu Phụ', price: 25000, desc: 'Thanh đạm, bổ dưỡng' },

    // 2. Bún - Phở - Mì Hà Nội
    { id: 32, categoryId: 2, name: 'Bún Chả Hà Nội Nướng Than', price: 35000, isBest: true, desc: 'Chả nướng than hoa, bún tươi, rau sống' },
    { id: 33, categoryId: 2, name: 'Phở Bò Tái Lăn DNU', price: 40000, isBest: true, desc: 'Bò xào tỏi thơm phức, nước ninh xương' },
    { id: 7, categoryId: 2, name: 'Phở Bò Tái Hà Nội', price: 35000, isBest: true, desc: 'Thịt bò tươi mềm, nước dùng ngọt thanh' },
    { id: 34, categoryId: 2, name: 'Phở Gà Ta Lá Chanh', price: 35000, desc: 'Gà ta da giòn, lá chanh thơm ngát' },
    { id: 35, categoryId: 2, name: 'Bún Đậu Mắm Tôm Thập Cẩm', price: 40000, isBest: true, desc: 'Đậu mơ rán, chả cốm, nem rán, chân giò' },
    { id: 9, categoryId: 2, name: 'Bún Bò Huế Đặc Biệt', price: 40000, desc: 'Sa tế cay nồng kèm chả cua' },
    { id: 11, categoryId: 2, name: 'Bún Riêu Cua Bắp Bò', price: 35000, desc: 'Riêu cua đồng, bắp bò tươi' },
    { id: 10, categoryId: 2, name: 'Bún Trộn Thịt Nướng DNU', price: 32000, desc: 'Thịt nướng mè rang, đậu phộng giòn' },
    { id: 12, categoryId: 2, name: 'Mì Quảng Gà Trứng Cút', price: 35000, desc: 'Mì vàng óng, bánh tráng giòn rụm' },

    // 3. Bánh Mì & Đồ Ăn Vặt
    { id: 39, categoryId: 3, name: 'Bánh Mì Chảo Đặc Biệt DNU', price: 30000, isBest: true, desc: 'Pate, 2 trứng ốp la, xúc xích, sốt cà' },
    { id: 21, categoryId: 3, name: 'Bánh Mì Pate Chả Lụa Hà Nội', price: 20000, isBest: true, desc: 'Bánh mì giòn rụm, pate béo' },
    { id: 22, categoryId: 3, name: 'Bánh Mì Xíu Mại Ốp La', price: 22000, desc: 'Trứng ốp la lòng đào kèm xíu mại' },
    { id: 40, categoryId: 3, name: 'Nem Chua Rán Phố Cổ (5c)', price: 25000, isBest: true, desc: 'Chiên xù nóng giòn chấm tương ớt' },
    { id: 23, categoryId: 3, name: 'Bánh Bao Trứng Cút Nóng Hổi', price: 15000, desc: 'Nhân thịt mộc nhĩ trứng cút' },
    { id: 24, categoryId: 3, name: 'Xôi Gà Xé Nấm Hương', price: 25000, desc: 'Nếp dẻo thơm, gà xé xào nấm' },

    // 4. Đồ Uống & Trà Sữa DNU
    { id: 13, categoryId: 4, name: 'Trà Đào Cam Sả Hà Đông', price: 25000, isBest: true, desc: 'Đào miếng giòn ngọt, sả thơm ngát' },
    { id: 36, categoryId: 4, name: 'Cà Phê Cốt Dừa Hà Nội', price: 25000, isBest: true, desc: 'Cốt dừa béo ngậy xay tuyết mát lạnh' },
    { id: 37, categoryId: 4, name: 'Cà Phê Muối Béo Ngậy', price: 22000, isBest: true, desc: 'Kem muối mặn mà, cà phê đậm đà' },
    { id: 38, categoryId: 4, name: 'Trà Chanh Giã Tay DNU', price: 18000, desc: 'Chanh thơm nồng, thanh mát' },
    { id: 15, categoryId: 4, name: 'Trà Sữa Trân Châu Hoàng Kim', price: 25000, isBest: true, desc: 'Trà sữa đậm vị kèm trân châu hoàng kim' },
    { id: 14, categoryId: 4, name: 'Trà Quất Mật Ong Hoa Nhài', price: 15000, desc: 'Giải khát thanh lọc cổ họng mùa thi' },
    { id: 17, categoryId: 4, name: 'Cà Phê Sữa Đá Phin', price: 18000, desc: 'Robusta đậm đà pha phin truyền thống' },
    { id: 16, categoryId: 4, name: 'Cà Phê Đen Đá', price: 15000, desc: 'Nguyên chất không đường/ít đường' },
    { id: 18, categoryId: 4, name: 'Coca Cola Lon 320ml', price: 12000, desc: 'Ướp lạnh' },
    { id: 20, categoryId: 4, name: 'Nước Suối Aquafina 500ml', price: 8000, desc: 'Ướp lạnh' },

    // 5. Tráng Miệng & Chè
    { id: 28, categoryId: 5, name: 'Chè Thái Sầu Riêng', price: 25000, desc: 'Trái cây sữa tươi thơm lừng' },
    { id: 27, categoryId: 5, name: 'Chè Dưỡng Nhan Tuyết Yến', price: 20000, desc: 'Thanh mát bổ dưỡng' },
    { id: 29, categoryId: 5, name: 'Sữa Chua Trái Cây Tươi DNU', price: 18000, desc: 'Sữa chua nhà làm mix dưa hấu' },

    // 6. Combo Tiết Kiệm DNU
    { id: 101, categoryId: 10, name: 'Combo Cơm Gà + Trà Đào Cam Sả', price: 50000, isBest: true, desc: 'Tiết kiệm 10.000đ cho sinh viên' },
    { id: 102, categoryId: 10, name: 'Combo Bún Chả + Trà Quất Mật Ong', price: 42000, isBest: true, desc: 'Tiết kiệm 8.000đ cho sinh viên' },
    { id: 103, categoryId: 10, name: 'Combo Bánh Mì Chảo + Cafe Sữa', price: 40000, isBest: true, desc: 'Bữa sáng đầy năng lượng DNU' },
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

  const handlePay = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowCheckoutModal(false);
      setCart([]);
    }, 1800);
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
                className="group relative bg-card border border-border hover:border-primary/50 hover:shadow-card-hover rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {food.name}
                    </h4>
                    {food.isBest && (
                      <Badge variant="warning" className="text-[9px] px-1 py-0 shrink-0">
                        HOT
                      </Badge>
                    )}
                  </div>
                  {food.desc && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2">
                      {food.desc}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                  <span className="font-extrabold text-xs text-primary">
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
    </div>
  );
};
