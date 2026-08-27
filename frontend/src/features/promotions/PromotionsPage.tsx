import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
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
  Sparkles
} from 'lucide-react';

interface PromotionVoucher {
  id: number;
  code: string;
  title: string;
  discountType: 'PERCENT' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usedCount: number;
  maxUsage: number;
  validFrom: string;
  validTo: string;
  targetStudents: string;
  status: 'ACTIVE' | 'EXPIRED' | 'UPCOMING';
}

export const PromotionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [vouchers, setVouchers] = useState<PromotionVoucher[]>([
    {
      id: 1,
      code: 'DNUCHAO2026',
      title: 'Chào đón Tân Sinh Viên Khóa K18 DNU',
      discountType: 'PERCENT',
      discountValue: 20,
      minOrderValue: 30000,
      maxDiscount: 15000,
      usedCount: 245,
      maxUsage: 500,
      validFrom: '2026-08-01',
      validTo: '2026-10-31',
      targetStudents: 'Tất cả sinh viên DNU K18',
      status: 'ACTIVE',
    },
    {
      id: 2,
      code: 'DNUK18',
      title: 'Voucher Giảm 20.000đ Đơn Ăn Trưa Tòa G',
      discountType: 'FIXED_AMOUNT',
      discountValue: 20000,
      minOrderValue: 50000,
      usedCount: 180,
      maxUsage: 300,
      validFrom: '2026-08-15',
      validTo: '2026-09-30',
      targetStudents: 'Sinh viên CNTT, Dược, Y Khoa',
      status: 'ACTIVE',
    },
    {
      id: 3,
      code: 'DNUFOOD',
      title: 'Ưu đãi Giảm 10.000đ Combo Trưa',
      discountType: 'FIXED_AMOUNT',
      discountValue: 10000,
      minOrderValue: 35000,
      usedCount: 412,
      maxUsage: 1000,
      validFrom: '2026-08-01',
      validTo: '2026-12-31',
      targetStudents: 'Toàn trường Đại Học Đại Nam',
      status: 'ACTIVE',
    },
    {
      id: 4,
      code: 'DNUGARDEN',
      title: 'Giảm 15% Đồ Uống Căng Tin Garden & Coffee',
      discountType: 'PERCENT',
      discountValue: 15,
      minOrderValue: 20000,
      usedCount: 88,
      maxUsage: 200,
      validFrom: '2026-08-20',
      validTo: '2026-09-20',
      targetStudents: 'Khách hàng khu Thể Thao DNU',
      status: 'ACTIVE',
    },
  ]);

  const copyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Khuyến Mãi & Voucher Sinh Viên DNU</h2>
          <p className="text-xs text-muted-foreground">Thiết lập mã giảm giá, chương trình chào đón Tân sinh viên và voucher kích cầu căng tin</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Tạo Voucher Mới
        </Button>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vouchers.map((v) => (
          <Card key={v.id} className="relative overflow-hidden hover:border-orange-500/50 transition-all shadow-xs border-dashed border-2">
            <div className="absolute top-0 right-0">
              <Badge variant={v.status === 'ACTIVE' ? 'success' : 'outline'} className="rounded-none rounded-bl-lg text-[10px]">
                {v.status === 'ACTIVE' ? 'Đang hiệu lực' : 'Hết hạn'}
              </Badge>
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-base text-foreground tracking-wider bg-muted/60 px-2 py-0.5 rounded border border-border">
                      {v.code}
                    </span>
                    <button
                      onClick={() => copyVoucher(v.code)}
                      className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                      title="Sao chép mã"
                    >
                      {copiedCode === v.code ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h3 className="font-bold text-xs text-foreground mt-1">{v.title}</h3>
                </div>
              </div>

              <div className="bg-muted/40 p-3 rounded-lg border border-border/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Mức giảm giá:</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {v.discountType === 'PERCENT' ? `Giảm ${v.discountValue}%` : `Giảm ${formatCurrency(v.discountValue)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Đơn tối thiểu:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(v.minOrderValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Đối tượng áp dụng:</span>
                  <span className="font-medium text-foreground">{v.targetStudents}</span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Lượt sử dụng:</span>
                  <span className="font-bold text-foreground">{v.usedCount} / {v.maxUsage}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full" 
                    style={{ width: `${(v.usedCount / v.maxUsage) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border">
                <span>Hạn dùng: {v.validFrom} ➔ {v.validTo}</span>
                <span className="font-semibold text-primary">Áp dụng quầy & app</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Add Voucher */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo Mã Khuyến Mãi / Voucher Mới</DialogTitle>
            <DialogDescription>
              Cấu hình mã giảm giá áp dụng trên Quầy POS và Cổng Đặt Món Sinh Viên DNU
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Mã Voucher (In hoa) *</label>
              <input
                type="text"
                placeholder="VD: DNU2026"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono font-bold uppercase focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block font-semibold text-foreground mb-1">Tiêu đề chương trình *</label>
              <input
                type="text"
                placeholder="VD: Giảm 15% Đơn Đầu Tiên"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Loại giảm giá</label>
                <select className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring">
                  <option value="PERCENT">Giảm theo %</option>
                  <option value="FIXED">Giảm số tiền cố định (VNĐ)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Giá trị giảm</label>
                <input
                  type="number"
                  placeholder="VD: 20 hoặc 15000"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAddModal(false)} variant="default" className="w-full">
              Kích Hoạt & Phát Hành Voucher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
