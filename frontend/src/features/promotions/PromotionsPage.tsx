import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
import { dnuStore, PromotionVoucher } from '../../services/dnuStore.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  Gift, 
  Plus, 
  Search, 
  Tag, 
  Percent, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Copy, 
  AlertCircle,
  Sparkles,
  Trash2
} from 'lucide-react';

export const PromotionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [vouchers, setVouchers] = useState<PromotionVoucher[]>(() => dnuStore.getVouchers());

  const [voucherForm, setVoucherForm] = useState({
    code: '',
    title: '',
    discountType: 'PERCENT' as PromotionVoucher['discountType'],
    discountValue: '20',
    minOrderValue: '30000',
    maxDiscount: '15000',
    maxUsage: '500',
    validTo: '2026-10-31',
    targetStudents: 'Tất cả sinh viên DNU',
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherForm.code || !voucherForm.title) return;

    const newVoucher: PromotionVoucher = {
      id: Date.now(),
      code: voucherForm.code.toUpperCase(),
      title: voucherForm.title,
      discountType: voucherForm.discountType,
      discountValue: Number(voucherForm.discountValue) || 10,
      minOrderValue: Number(voucherForm.minOrderValue) || 30000,
      maxDiscount: Number(voucherForm.maxDiscount) || 15000,
      usedCount: 0,
      maxUsage: Number(voucherForm.maxUsage) || 500,
      validFrom: new Date().toISOString().slice(0, 10),
      validTo: voucherForm.validTo || '2026-12-31',
      targetStudents: voucherForm.targetStudents,
      status: 'ACTIVE',
    };

    const updated = [newVoucher, ...vouchers];
    setVouchers(updated);
    dnuStore.saveVouchers(updated);
    setShowAddModal(false);
  };

  const handleDeleteVoucher = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa mã voucher này?')) {
      const updated = vouchers.filter((v) => v.id !== id);
      setVouchers(updated);
      dnuStore.saveVouchers(updated);
    }
  };

  const filteredVouchers = vouchers.filter(
    (v) =>
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Khuyến Mãi & Mã Voucher DNU</span>
            <Badge variant="primary" className="text-xs font-mono">{vouchers.length} mã</Badge>
          </h2>
          <p className="text-xs text-muted-foreground">Tạo mã giảm giá, voucher sinh viên và theo dõi số lượt sử dụng thực tế</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Tạo Voucher Mới
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã voucher hoặc tên chương trình..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/60 border border-input rounded-lg text-xs text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVouchers.map((voucher) => (
          <Card key={voucher.id} className="hover:border-primary/50 transition-colors shadow-xs flex flex-col justify-between group">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 tracking-wider">
                      {voucher.code}
                    </span>
                    <button
                      onClick={() => handleCopy(voucher.code)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors"
                      title="Copy mã"
                    >
                      {copiedCode === voucher.code ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <h3 className="font-bold text-xs text-foreground leading-snug">{voucher.title}</h3>
                </div>
                <Badge variant={voucher.status === 'ACTIVE' ? 'success' : 'secondary'} className="text-[10px] shrink-0">
                  {voucher.status === 'ACTIVE' ? 'Đang chạy' : 'Hết hạn'}
                </Badge>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl border border-border/60 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Mức giảm:</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400 font-mono">
                    {voucher.discountType === 'PERCENT' ? `Giảm ${voucher.discountValue}%` : `Giảm ${formatCurrency(voucher.discountValue)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Đơn tối thiểu:</span>
                  <span className="font-semibold text-foreground font-mono">{formatCurrency(voucher.minOrderValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Đã sử dụng:</span>
                  <span className="font-bold text-primary font-mono">{voucher.usedCount} / {voucher.maxUsage} lượt</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">Hạn đến: {voucher.validTo}</span>
                <button
                  onClick={() => handleDeleteVoucher(voucher.id)}
                  className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                  title="Xóa voucher"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Add Voucher */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              <span>Tạo Mã Khuyến Mãi / Voucher Mới</span>
            </DialogTitle>
            <DialogDescription>
              Cấu hình mã giảm giá áp dụng trên Quầy POS, Kiosk và Cổng Đặt Món Sinh Viên DNU
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveVoucher} className="space-y-3 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Mã Voucher (In hoa) *</label>
              <input
                type="text"
                required
                value={voucherForm.code}
                onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                placeholder="VD: DNU2026"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono font-bold uppercase focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Tiêu đề chương trình *</label>
              <input
                type="text"
                required
                value={voucherForm.title}
                onChange={(e) => setVoucherForm({ ...voucherForm, title: e.target.value })}
                placeholder="VD: Giảm 20% Cho Đơn Ăn Trưa"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Loại giảm giá</label>
                <select
                  value={voucherForm.discountType}
                  onChange={(e) => setVoucherForm({ ...voucherForm, discountType: e.target.value as any })}
                  aria-label="Chọn loại giảm giá"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="PERCENT">Giảm theo % (Phần trăm)</option>
                  <option value="FIXED_AMOUNT">Giảm số tiền cố định (VNĐ)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Giá trị giảm *</label>
                <input
                  type="number"
                  required
                  value={voucherForm.discountValue}
                  onChange={(e) => setVoucherForm({ ...voucherForm, discountValue: e.target.value })}
                  placeholder="20 hoặc 15000"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono font-bold focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Đơn tối thiểu (VNĐ)</label>
                <input
                  type="number"
                  value={voucherForm.minOrderValue}
                  onChange={(e) => setVoucherForm({ ...voucherForm, minOrderValue: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Hạn áp dụng</label>
                <input
                  type="date"
                  value={voucherForm.validTo}
                  onChange={(e) => setVoucherForm({ ...voucherForm, validTo: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" variant="default" className="w-full font-bold">
                Kích Hoạt & Phát Hành Voucher
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
