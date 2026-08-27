import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
import { Sheet, SheetHeader, SheetTitle, SheetClose } from '../../components/ui/sheet.js';
import { formatCurrency, formatDateTime } from '../../utils/format.js';
import { dnuStore, Supplier } from '../../services/dnuStore.js';
import { 
  Truck, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  FileText,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  Receipt,
  Star,
  Edit3,
  Trash2,
  CreditCard,
  History,
  Send
} from 'lucide-react';

export const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Purchase Order (PO) Modal State
  const [poSupplier, setPoSupplier] = useState<Supplier | null>(null);
  const [poItems, setPoItems] = useState<{ name: string; qty: number; unit: string; price: number }[]>([
    { name: 'Thịt bò tươi thái mỏng', qty: 15, unit: 'kg', price: 210000 },
    { name: 'Dưa cải muối giòn', qty: 10, unit: 'kg', price: 25000 },
  ]);
  const [poSuccess, setPoSuccess] = useState(false);

  // Debt Payment Modal State
  const [debtSupplier, setDebtSupplier] = useState<Supplier | null>(null);
  const [payAmount, setPayAmount] = useState<string>('');
  const [paySuccess, setPaySuccess] = useState(false);

  // Supplier History Sheet State
  const [historySupplier, setHistorySupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => dnuStore.getSuppliers());

  useEffect(() => {
    const handleSync = () => {
      setSuppliers(dnuStore.getSuppliers());
    };
    window.addEventListener('dnu_store_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dnu_store_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Thực Phẩm Tươi Sống',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    deliveryTime: '05:30 Sáng hàng ngày',
    certVsattp: 'Chứng nhận ATTP & VietGAP',
  });

  const handleOpenAddModal = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      category: 'Thực Phẩm Tươi Sống',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      deliveryTime: '05:30 Sáng hàng ngày',
      certVsattp: 'Chứng nhận ATTP & VietGAP',
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (s: Supplier) => {
    setEditingSupplier(s);
    setFormData({
      name: s.name,
      category: s.category,
      contactPerson: s.contactPerson,
      phone: s.phone,
      email: s.email,
      address: s.address,
      deliveryTime: s.deliveryTime,
      certVsattp: s.certVsattp,
    });
    setShowAddModal(true);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    let updated: Supplier[];
    if (editingSupplier) {
      // Update existing
      updated = suppliers.map((s) =>
        s.id === editingSupplier.id
          ? {
              ...s,
              name: formData.name,
              category: formData.category,
              contactPerson: formData.contactPerson || 'Đại diện kinh doanh',
              phone: formData.phone,
              email: formData.email || `contact@${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.vn`,
              address: formData.address || 'Hà Đông, Hà Nội',
              deliveryTime: formData.deliveryTime,
              certVsattp: formData.certVsattp,
            }
          : s
      );
    } else {
      // Create new
      const codeSuffix = formData.name
        .split(' ')
        .slice(-2)
        .join('')
        .toUpperCase()
        .replace(/[^A-Z]/g, '');

      const newSupplier: Supplier = {
        id: Date.now(),
        name: formData.name,
        code: `NCC-${codeSuffix || Date.now().toString().slice(-4)}`,
        category: formData.category,
        contactPerson: formData.contactPerson || 'Đại diện kinh doanh',
        phone: formData.phone,
        email: formData.email || `sales@${codeSuffix.toLowerCase()}.vn`,
        address: formData.address || 'Hà Đông, Hà Nội',
        deliveryTime: formData.deliveryTime,
        certVsattp: formData.certVsattp,
        monthlySpend: 0,
        debtAmount: 0,
        rating: 5.0,
        status: 'ACTIVE',
        deliveriesCount: 0,
      };
      updated = [newSupplier, ...suppliers];
    }
    setSuppliers(updated);
    dnuStore.saveSuppliers(updated);
    setShowAddModal(false);
  };

  const handleDeleteSupplier = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa đối tác nhà cung cấp này?')) {
      const updated = suppliers.filter((s) => s.id !== id);
      setSuppliers(updated);
      dnuStore.saveSuppliers(updated);
    }
  };

  // Handle Create PO (Nhập hàng)
  const handleSendPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poSupplier) return;

    const poTotal = poItems.reduce((sum, it) => sum + it.qty * it.price, 0);

    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === poSupplier.id
          ? {
              ...s,
              monthlySpend: s.monthlySpend + poTotal,
              debtAmount: s.debtAmount + poTotal,
              deliveriesCount: s.deliveriesCount + 1,
            }
          : s
      )
    );

    setPoSuccess(true);
    setTimeout(() => {
      setPoSuccess(false);
      setPoSupplier(null);
    }, 1800);
  };

  // Handle Pay Debt (Thanh toán công nợ)
  const handlePayDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtSupplier) return;

    const amount = Number(payAmount);
    if (!amount || amount <= 0) return;

    const updated = suppliers.map((s) =>
      s.id === debtSupplier.id
        ? {
            ...s,
            debtAmount: Math.max(0, s.debtAmount - amount),
          }
        : s
    );

    setSuppliers(updated);
    dnuStore.saveSuppliers(updated);

    // Record Outflow to Canteen Financial Treasury
    dnuStore.addFinanceTransaction({
      code: `PC-NCC-${Date.now().toString().slice(-4)}`,
      type: 'EXPENSE',
      category: 'SUPPLIER_PAYMENT',
      categoryLabel: 'Chi trả nhà cung cấp',
      title: `Thanh toán công nợ tiền nguyên liệu cho ${debtSupplier.name}`,
      amount: amount,
      paymentMethod: 'BANK_TRANSFER',
      paymentMethodLabel: 'Chuyển khoản Ngân hàng',
      counterpart: debtSupplier.name,
      performedBy: 'Kế toán / Quản lý Căng tin',
      canteenName: 'Căng tin Tòa G',
      notes: `Quyết toán nợ đối tác ${debtSupplier.code}`,
    });

    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setDebtSupplier(null);
      setPayAmount('');
    }, 1800);
  };

  // Metrics
  const totalMonthlySpend = suppliers.reduce((s, i) => s + i.monthlySpend, 0);
  const totalDebt = suppliers.reduce((s, i) => s + i.debtAmount, 0);

  const filteredSuppliers = suppliers.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      filterCategory === 'ALL' ||
      (filterCategory === 'DEBT' && s.debtAmount > 0) ||
      s.category === filterCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Nhà Cung Cấp & Nguồn Nguyên Liệu DNU</span>
            <Badge variant="primary" className="text-xs font-mono">
              {suppliers.length} đối tác
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Quản lý đối tác thực phẩm sạch, tạo đơn đặt hàng nhập kho, thanh toán công nợ và lịch tiếp liệu
          </p>
        </div>
        <Button onClick={handleOpenAddModal} variant="default" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Thêm Nhà Cung Cấp
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">100% Thực Phẩm Sạch</p>
              <p className="text-lg font-bold text-foreground">Đạt chuẩn VietGAP / ISO</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Khung Giờ Giao Hàng</p>
              <p className="text-lg font-bold text-foreground">05:00 - 06:00 Sáng</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-orange-500/10 border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Tổng Chi Nhập / Công Nợ</p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(totalMonthlySpend)}
                {totalDebt > 0 && <span className="text-xs font-normal text-rose-500 ml-1.5">(Nợ: {formatCurrency(totalDebt)})</span>}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên đối tác, mã NCC, loại thực phẩm..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/60 border border-input rounded-lg text-xs text-foreground focus:bg-background focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'Tất cả đối tác' },
              { id: 'Thực Phẩm Tươi Sống', label: 'Thực phẩm tươi' },
              { id: 'Nông Sản Rau Củ', label: 'Rau củ quả' },
              { id: 'Đồ Uống & Sữa', label: 'Đồ uống & Sữa' },
              { id: 'DEBT', label: `Đang có công nợ (${suppliers.filter((s) => s.debtAmount > 0).length})` },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuppliers.map((s) => (
          <Card key={s.id} className="hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between group">
            <CardContent className="p-5 space-y-4">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
                      {s.name}
                    </h3>
                    <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{s.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-primary mt-0.5">{s.category}</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">Mã: {s.code}</p>
                </div>
                <Badge variant={s.status === 'ACTIVE' ? 'success' : 'secondary'} className="text-[10px] shrink-0">
                  {s.status === 'ACTIVE' ? 'Đối tác chiến lược' : 'Tạm ngưng'}
                </Badge>
              </div>

              {/* Badges & Safety Details */}
              <div className="p-3 bg-muted/40 rounded-xl border border-border/60 text-xs space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{s.certVsattp}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Lịch giao: <strong>{s.deliveryTime}</strong> ({s.deliveriesCount} đợt trong tháng)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="truncate">{s.address}</span>
                </div>
              </div>

              {/* Financial Summary & Contact */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <div>
                  <p className="text-muted-foreground">Đại diện liên hệ:</p>
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    {s.contactPerson} • <span className="text-primary font-mono">{s.phone}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Chi tiêu tháng:</p>
                  <p className="font-extrabold text-foreground font-mono">{formatCurrency(s.monthlySpend)}</p>
                  {s.debtAmount > 0 ? (
                    <p className="text-[11px] font-bold text-rose-500 font-mono">Công nợ: {formatCurrency(s.debtAmount)}</p>
                  ) : (
                    <p className="text-[10px] font-semibold text-emerald-600">Đã quyết toán xong</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Button
                    onClick={() => setPoSupplier(s)}
                    variant="default"
                    size="sm"
                    className="text-xs bg-orange-600 hover:bg-orange-700 font-bold"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                    Đặt Hàng
                  </Button>

                  {s.debtAmount > 0 && (
                    <Button
                      onClick={() => {
                        setDebtSupplier(s);
                        setPayAmount(s.debtAmount.toString());
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                      Trả Nợ
                    </Button>
                  )}

                  <Button
                    onClick={() => setHistorySupplier(s)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    title="Xem lịch sử nhập hàng"
                  >
                    <History className="w-3.5 h-3.5 mr-1" />
                    Lịch Sử
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(s)}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                    title="Chỉnh sửa thông tin"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(s.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Xóa đối tác"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL 1: Add / Edit Supplier */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              <span>{editingSupplier ? 'Chỉnh Sửa Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp Mới'}</span>
            </DialogTitle>
            <DialogDescription>
              Đăng ký đối tác cung cấp nguyên vật liệu cho Căng tin Đại Học Đại Nam
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSupplier} className="space-y-3.5 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Tên nhà cung cấp *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Công ty CP Thực Phẩm Sạch Phú Lãm"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Nhóm thực phẩm *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  aria-label="Chọn nhóm thực phẩm"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="Thực Phẩm Tươi Sống">Thực Phẩm Tươi Sống</option>
                  <option value="Nông Sản Rau Củ">Nông Sản Rau Củ</option>
                  <option value="Đồ Uống & Sữa">Đồ Uống & Sữa</option>
                  <option value="Gia Vị & Đồ Khô">Gia Vị & Đồ Khô</option>
                  <option value="Bao Bì & Khay Cơm">Bao Bì & Khay Cơm</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Số điện thoại hotline *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="VD: 0988 123 456"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Người đại diện liên hệ</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="VD: Nguyễn Văn Nam"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Email đặt hàng</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sales@phulamfood.vn"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Địa chỉ kho hàng / cơ sở</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="VD: Số 12 Phú Lãm, Hà Đông, Hà Nội"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Khung giờ giao hàng</label>
                <input
                  type="text"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  placeholder="05:30 Sáng hàng ngày"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Chứng chỉ VSATTP</label>
                <input
                  type="text"
                  value={formData.certVsattp}
                  onChange={(e) => setFormData({ ...formData, certVsattp: e.target.value })}
                  placeholder="VietGAP #0812-HN"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" variant="default" className="w-full font-bold">
                {editingSupplier ? 'Lưu Thay Đổi Thông Tin' : 'Hoàn Tất & Lưu Đối Tác'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Create Purchase Order (Đặt Hàng Nhập Kho) */}
      <Dialog open={!!poSupplier} onOpenChange={() => setPoSupplier(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              <span>Tạo Đơn Đặt Hàng Nhập Kho (Purchase Order)</span>
            </DialogTitle>
            <DialogDescription>
              Gửi yêu cầu tiếp liệu nguyên vật liệu tới: <strong>{poSupplier?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          {poSuccess ? (
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-bold text-sm text-foreground">Đã Gửi Đơn Đặt Hàng Thành Công!</h3>
              <p className="text-xs text-muted-foreground">
                Đơn hàng đã được chuyển tới đối tác. Lịch giao hàng dự kiến: <strong>{poSupplier?.deliveryTime}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendPO} className="space-y-4 py-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-2">
                <p className="font-bold text-foreground">Danh sách nguyên liệu cần nhập:</p>
                <div className="space-y-2">
                  {poItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                      <div>
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">Đơn giá: {formatCurrency(item.price)} / {item.unit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{item.qty} {item.unit}</span>
                        <span className="font-mono font-bold text-orange-600">{formatCurrency(item.qty * item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-between text-xs font-bold text-orange-600 dark:text-orange-400">
                <span>Tổng giá trị đơn nhập:</span>
                <span className="text-base font-mono">
                  {formatCurrency(poItems.reduce((sum, it) => sum + it.qty * it.price, 0))}
                </span>
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" variant="default" className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-white">
                  <Send className="w-4 h-4 mr-1.5" />
                  Xác Nhận & Gửi Đơn Đặt Hàng
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Pay Supplier Debt (Thanh Toán Công Nợ) */}
      <Dialog open={!!debtSupplier} onOpenChange={() => setDebtSupplier(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Thanh Toán Công Nợ Nhà Cung Cấp</span>
            </DialogTitle>
            <DialogDescription>
              Quyết toán hóa đơn nhập hàng cho đối tác: <strong>{debtSupplier?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          {paySuccess ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-bold text-sm text-foreground">Thanh Toán Công Nợ Thành Công!</h3>
              <p className="text-xs text-muted-foreground">
                Đã ghi nhận phiếu chi <strong>{formatCurrency(Number(payAmount))}</strong> vào sổ quỹ căng tin.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePayDebt} className="space-y-3.5 py-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng công nợ hiện tại:</span>
                  <span className="font-mono font-bold text-rose-600">{formatCurrency(debtSupplier?.debtAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Tài khoản thụ hưởng:</span>
                  <span className="font-semibold text-foreground">BIDV - 12400998877</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Số tiền thanh toán (VNĐ) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Nhập số tiền muốn trả..."
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono font-bold text-sm focus:ring-2 focus:ring-ring"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" variant="default" className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                  Xác Nhận Thanh Toán & Xuất Phiếu Chi
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DRAWER: Supplier Delivery History Sheet */}
      <Sheet open={!!historySupplier} onOpenChange={() => setHistorySupplier(null)}>
        {historySupplier && (
          <div className="space-y-5 text-xs">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="text-sm font-bold">Lịch Sử Nhập Hàng: {historySupplier.name}</SheetTitle>
                  <p className="text-xs text-muted-foreground">Mã đối tác: {historySupplier.code}</p>
                </div>
                <SheetClose onClick={() => setHistorySupplier(null)} />
              </div>
            </SheetHeader>

            <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1">
              {dnuStore.getInboundReceipts()
                .filter((rec) => rec.supplierName === historySupplier.name)
                .map((rec) => (
                  <div key={rec.id} className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">{rec.code}</span>
                      <Badge variant="success">Đã nhập kho</Badge>
                    </div>
                    <div className="text-muted-foreground space-y-0.5">
                      {rec.items.map((it, idx) => (
                        <div key={idx}>
                          • {it.qty} {it.unit} × {it.name} ({formatCurrency(it.price)}/{it.unit})
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground font-mono text-[10px] pt-1 border-t border-border/40">
                      Thời gian: {rec.receivedDate} • Tổng: {formatCurrency(rec.totalAmount)}
                    </p>
                  </div>
                ))}
              {dnuStore.getInboundReceipts().filter((rec) => rec.supplierName === historySupplier.name).length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  Chưa ghi nhận lịch sử đơn nhập hàng nào cho nhà cung cấp này.
                </div>
              )}
            </div>

            <Button onClick={() => setHistorySupplier(null)} variant="outline" className="w-full">
              Đóng Lịch Sử
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
};
