import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { useSocket } from '../../contexts/SocketContext.js';
import { dnuStore, StudentCartItem } from '../../services/dnuStore.js';
import { orderStorage } from '../../services/orderStorage.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  TicketPercent, 
  MapPin, 
  CreditCard, 
  QrCode, 
  Banknote, 
  CheckCircle2, 
  Sparkles,
  UtensilsCrossed,
  Clock
} from 'lucide-react';

export const StudentCartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { emitNewOrder } = useSocket();

  const [cart, setCart] = useState<StudentCartItem[]>(() => dnuStore.getStudentCart());
  const [tableNumber, setTableNumber] = useState('Bàn G1-02');
  const [pickupTime, setPickupTime] = useState<string>('Ăn ngay');
  const [paymentMethod, setPaymentMethod] = useState<'DNUPAY' | 'VIETQR' | 'QRMOMO' | 'CASH'>('VIETQR');
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  const studentMssv = user?.username ? user.username.replace(/\D/g, '') || '2110001' : '2110001';
  const wallet = dnuStore.getStudentWallet(studentMssv);

  // Sync cart from dnuStore
  useEffect(() => {
    const handleSync = () => {
      setCart(dnuStore.getStudentCart());
    };
    window.addEventListener('dnu_store_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dnu_store_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleUpdateQty = (id: number, delta: number) => {
    const updated = dnuStore.updateStudentCartQty(id, delta);
    setCart(updated);
  };

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) return;
    const clean = voucherCode.trim().toUpperCase();
    const sub = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    if (clean === 'DNUCHAO2026' || clean === 'DNUFOOD' || clean === 'K18DNU' || clean === 'SVCNTT') {
      const disc = Math.min(20000, Math.round(sub * 0.2));
      setDiscount(disc);
      setVoucherMsg({ type: 'success', text: `Áp dụng thành công mã ưu đãi sinh viên (-${formatCurrency(disc)})!` });
    } else {
      setDiscount(0);
      setVoucherMsg({ type: 'error', text: 'Mã khuyến mãi không hợp lệ hoặc đã hết lượt.' });
    }
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discount);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsOrdering(true);

    const orderNum = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = Date.now();
    const customerName = user?.fullName ? `${user.fullName} (Sinh viên DNU)` : 'Nguyễn Thành Nam (SV CNTT K16)';

    const payLabel =
      paymentMethod === 'DNUPAY'
        ? 'Ví DNU Pay'
        : paymentMethod === 'VIETQR'
        ? 'VietQR MB Bank'
        : paymentMethod === 'QRMOMO'
        ? 'QR MoMo'
        : 'Tiền mặt';

    // 1. Save to Order Storage
    const { order } = orderStorage.addOrder({
      id: newOrderId,
      code: orderNum,
      customerName: customerName,
      canteenName: 'Căng tin Tòa G (Hà Đông)',
      tableNumber: pickupTime !== 'Ăn ngay' ? `${tableNumber} (Hẹn: ${pickupTime})` : tableNumber,
      itemsSummary: cart.map((i) => `${i.quantity}× ${i.name}`).join(', '),
      itemsDetail: cart.map((i) => ({ name: i.name, qty: i.quantity, price: i.price })),
      finalAmount: finalTotal,
      status: 'PREPARING',
      paymentStatus: 'PAID',
      paymentMethod: payLabel,
      orderedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      pickupTime: pickupTime,
      customerUsername: user?.username || 'student_2110001',
    });

    // 2. If DNUPAY -> Deduct Student Wallet
    if (paymentMethod === 'DNUPAY') {
      dnuStore.deductStudentWallet(
        finalTotal,
        orderNum,
        `Đặt món Cổng Sinh Viên: ${cart.map((i) => `${i.quantity}x ${i.name}`).join(', ')}`,
        studentMssv
      );
    }

    // 3. Record Inflow to Canteen Financial Ledger
    dnuStore.addFinanceTransaction({
      code: `PT-APP-${Date.now().toString().slice(-4)}`,
      type: 'INCOME',
      category: 'POS_ORDER',
      categoryLabel: 'Doanh thu Cổng Sinh Viên',
      title: `Thu tiền đơn App ${orderNum} (${cart.map((i) => `${i.quantity}x ${i.name}`).join(', ')})`,
      amount: finalTotal,
      paymentMethod: paymentMethod === 'VIETQR' ? 'BANK_TRANSFER' : paymentMethod,
      paymentMethodLabel: payLabel,
      counterpart: customerName,
      performedBy: 'Cổng Sinh Viên DNU App',
      canteenName: 'Căng tin Tòa G',
      notes: pickupTime !== 'Ăn ngay' ? `Sinh viên hẹn nhận lúc ${pickupTime}` : undefined,
    });

    // 4. Send realtime WebSocket notification to Kitchen KDS
    emitNewOrder({
      orderId: newOrderId,
      orderNumber: orderNum,
      tableNumber: pickupTime !== 'Ăn ngay' ? `⏰ Hẹn ${pickupTime} (${tableNumber})` : tableNumber,
      canteenId: 1,
      customerName: customerName,
      items: cart.map((i) => ({ name: i.name, qty: i.quantity, price: i.price })),
      totalAmount: finalTotal,
      status: 'PREPARING',
      orderedAt: new Date().toLocaleTimeString().slice(0, 5),
    });

    // 5. Clear cart
    dnuStore.clearStudentCart();

    setTimeout(() => {
      setIsOrdering(false);
      setOrderSuccess(true);
      setTimeout(() => {
        navigate('/student/orders');
      }, 1500);
    }, 600);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/home')}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tiếp tục chọn món</span>
        </button>
        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
          {cart.reduce((s, i) => s + i.quantity, 0)} món trong giỏ
        </span>
      </div>

      {orderSuccess ? (
        <Card className="p-8 text-center bg-emerald-50 border-emerald-200 space-y-3 animate-in zoom-in-95">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
          <h3 className="text-base font-bold text-emerald-900">Đặt Món Thành Công!</h3>
          <p className="text-xs text-emerald-700">
            Đơn hàng đã được chuyển tự động tới Bếp Căng Tin Tòa G. Đang chuyển tới trang theo dõi đơn...
          </p>
        </Card>
      ) : cart.length === 0 ? (
        <Card className="p-10 text-center space-y-4 border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Giỏ Hàng Đang Trống</h3>
            <p className="text-xs text-slate-500 mt-1">Hãy chọn những món ăn tươi ngon trong thực đơn Căng tin DNU nhé!</p>
          </div>
          <Button
            onClick={() => navigate('/student/home')}
            variant="default"
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
          >
            Khám Phá Thực Đơn
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Cart Item Cards */}
          <div className="space-y-2.5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-xs font-extrabold text-orange-600 font-mono mt-0.5">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
                  <button
                    onClick={() => handleUpdateQty(item.id, -1)}
                    className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQty(item.id, 1)}
                    className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table / Pickup Location */}
          <Card className="p-3.5 bg-white border-slate-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Vị trí nhận đồ tại Căng tin:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
              {['Bàn G1-01', 'Bàn G1-02', 'Bàn G1-03', 'Mang Về (Hộp)', 'Quầy Số 1', 'Sảnh Tòa G'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setTableNumber(loc)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${
                    tableNumber === loc
                      ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </Card>

          {/* Scheduled Pickup Time (Hẹn Giờ Tan Học) */}
          <Card className="p-3.5 bg-white border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Khung giờ nhận món (Tránh xếp hàng):</span>
              </div>
              <Badge variant="neutral" className="text-[10px] bg-purple-50 text-purple-700 font-bold">
                Bếp Nấu Đúng Giờ
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-semibold">
              {[
                { label: '🍽️ Ăn ngay', val: 'Ăn ngay' },
                { label: '⏰ 11:45 (Tiết 4)', val: '11:45 (Tan tiết 4)' },
                { label: '⏰ 12:15 (Tiết 5)', val: '12:15 (Tan tiết 5)' },
                { label: '⏰ 17:30 (Chiều)', val: '17:30 (Tan ca chiều)' },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setPickupTime(p.val)}
                  className={`py-2 px-1.5 rounded-xl border text-center text-[11px] transition-all ${
                    pickupTime === p.val
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Student Voucher Input */}
          <Card className="p-3.5 bg-white border-slate-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <TicketPercent className="w-4 h-4 text-emerald-600" />
              <span>Mã giảm giá sinh viên DNU:</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Nhập DNUCHAO2026 / DNUFOOD..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button onClick={handleApplyVoucher} variant="outline" size="sm" className="font-bold text-xs">
                Áp Dụng
              </Button>
            </div>
            {voucherMsg && (
              <p
                className={`text-[11px] font-semibold ${
                  voucherMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {voucherMsg.text}
              </p>
            )}
          </Card>

          {/* Payment Method Selector */}
          <Card className="p-3.5 bg-white border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <CreditCard className="w-4 h-4 text-orange-600" />
                <span>Phương thức thanh toán:</span>
              </div>
              <span className="text-[11px] font-bold text-orange-600">Ví DNU: {formatCurrency(wallet.balance)}</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('VIETQR')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                  paymentMethod === 'VIETQR'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-500/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>VietQR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('DNUPAY')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                  paymentMethod === 'DNUPAY'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs ring-1 ring-orange-500/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-orange-600" />
                <span>Ví DNU</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('QRMOMO')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                  paymentMethod === 'QRMOMO'
                    ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-xs ring-1 ring-pink-500/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-pink-600" />
                <span>MoMo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs ring-1 ring-emerald-500/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Tại Quầy</span>
              </button>
            </div>

            {/* VIETQR MB BANK DETAILS BOX */}
            {paymentMethod === 'VIETQR' && (
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2 text-center mt-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                  <span className="text-blue-700 font-mono">MB Bank (Napas 247)</span>
                  <span>STK: 0987654321</span>
                </div>

                <div className="w-32 h-32 mx-auto bg-white p-1 rounded-lg border border-slate-200 shadow-xs flex items-center justify-center">
                  <img
                    src={`https://api.vietqr.io/image/970422-0987654321-compact.png?amount=${finalTotal}&addInfo=DNU%20APP`}
                    alt="VietQR MB Bank"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="text-[10px] space-y-0.5">
                  <p className="font-bold text-slate-800">CAN TIN DAI HOC DAI NAM</p>
                  <p className="text-slate-500 font-mono">Quét mã bằng bất kỳ App Ngân Hàng nào</p>
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    setSimulatingPayment(true);
                    setTimeout(() => {
                      setSimulatingPayment(false);
                      handleCheckout();
                    }, 800);
                  }}
                  disabled={simulatingPayment || isOrdering}
                  variant="outline"
                  size="sm"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-xs"
                >
                  {simulatingPayment ? '⏳ Đang xác thực thanh toán...' : '⚡ Giả Lập Quét Mã & Thanh Toán Xong'}
                </Button>
              </div>
            )}
          </Card>

          {/* Pricing Summary */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} món):</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Ưu đãi sinh viên:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-dashed border-slate-200">
              <span>Tổng thanh toán:</span>
              <span className="text-base text-orange-600 font-mono">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={isOrdering || cart.length === 0}
            variant="default"
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-500/20"
          >
            {isOrdering ? 'Đang gửi đơn tới Bếp...' : `Xác Nhận Đặt Món (${formatCurrency(finalTotal)})`}
          </Button>
        </div>
      )}
    </div>
  );
};
