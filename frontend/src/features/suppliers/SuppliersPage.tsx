import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
import { formatCurrency } from '../../utils/format.js';
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
  AlertTriangle
} from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  code: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  deliveryTime: string;
  certVsattp: string;
  monthlySpend: number;
  debtAmount: number;
  status: 'ACTIVE' | 'PENDING_CONTRACT';
}

export const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const suppliers: Supplier[] = [
    {
      id: 1,
      name: 'Công Ty CP Chế Biến Thực Phẩm Hà Nội',
      code: 'NCC-HANOIFOOD',
      category: 'Thịt bò tươi & Thịt heo VietGAP',
      contactPerson: 'Nguyễn Văn Hùng',
      phone: '0912 345 678',
      email: 'sales@hanoifood.vn',
      address: 'KCN Quang Minh, Mê Linh, Hà Nội',
      deliveryTime: '05:30 Sáng hàng ngày',
      certVsattp: 'ISO 22000:2018 / VietGAP #0812-HN',
      monthlySpend: 48500000,
      debtAmount: 0,
      status: 'ACTIVE',
    },
    {
      id: 2,
      name: 'Hợp Tác Xã Nông Sản Sạch Chương Mỹ',
      code: 'NCC-CHUONGMY',
      category: 'Rau củ quả tươi, Dưa cải muối, Gạo ST25',
      contactPerson: 'Lê Thị Mai',
      phone: '0988 765 432',
      email: 'mai.nongsan@chuongmy.vn',
      address: 'Thị trấn Chúc Sơn, Chương Mỹ, Hà Nội (Gần DNU)',
      deliveryTime: '05:00 Sáng hàng ngày',
      certVsattp: 'Chứng nhận An Toàn Thực Phẩm Hà Nội #124/2025',
      monthlySpend: 32000000,
      debtAmount: 5200000,
      status: 'ACTIVE',
    },
    {
      id: 3,
      name: 'Công Ty Cổ Phần Chăn Nuôi C.P. Việt Nam',
      code: 'NCC-CPFOOD',
      category: 'Thịt gà tươi phi lê & Trứng gà công nghiệp',
      contactPerson: 'Trần Đình Trọng',
      phone: '0903 112 233',
      email: 'orders.hn@cp.com.vn',
      address: 'KCN Phú Nghĩa, Chương Mỹ, Hà Nội',
      deliveryTime: '06:00 Sáng hàng ngày',
      certVsattp: 'HACCP Codex Alimentarius #CP-2026',
      monthlySpend: 28000000,
      debtAmount: 0,
      status: 'ACTIVE',
    },
    {
      id: 4,
      name: 'Nhà Phân Phối Nước Giải Khát & Sữa Hà Đông',
      code: 'NCC-BEVERAGE-HD',
      category: 'Trà đào, Trà chanh, Sữa tươi Vinamilk, Cà phê phin',
      contactPerson: 'Vũ Minh Tuấn',
      phone: '0977 889 900',
      email: 'beverage.hadong@gmail.com',
      address: 'Phường Vạn Phúc, Hà Đông, Hà Nội',
      deliveryTime: 'Thứ 2 & Thứ 5 hàng tuần',
      certVsattp: 'Đầy đủ CO/CQ từ Coca-Cola, Vinamilk',
      monthlySpend: 21500000,
      debtAmount: 1800000,
      status: 'ACTIVE',
    },
  ];

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Nhà Cung Cấp & Nguồn Nguyên Liệu DNU</h2>
          <p className="text-xs text-muted-foreground">Quản lý đối tác cung ứng thực phẩm tươi sạch, chứng nhận VSATTP và lịch tiếp liệu căng tin</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
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
              <p className="text-xs font-semibold text-muted-foreground">100% Nguồn Thực Phẩm Sạch</p>
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
              <p className="text-xs font-semibold text-muted-foreground">Tổng Chi Nhập Tháng</p>
              <p className="text-lg font-bold text-foreground">130.000.000 đ</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên nhà cung cấp, loại nguyên liệu..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/50 border border-input rounded-lg text-xs focus:ring-2 focus:ring-ring"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuppliers.map((s) => (
          <Card key={s.id} className="hover:border-primary/40 transition-all shadow-xs">
            <CardContent className="p-5 space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-foreground leading-snug">{s.name}</h3>
                  <p className="text-xs font-semibold text-primary mt-0.5">{s.category}</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">Mã: {s.code}</p>
                </div>
                <Badge variant="success" className="text-[10px] shrink-0">Đối tác chiến lược</Badge>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg border border-border/60 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-medium text-foreground">{s.certVsattp}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Tiếp liệu: {s.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{s.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border">
                <div>
                  <p className="text-muted-foreground text-[11px]">Người đại diện:</p>
                  <p className="font-bold text-foreground">{s.contactPerson}</p>
                  <p className="text-primary text-[11px] font-semibold">{s.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Chi tiêu tháng:</p>
                  <p className="font-extrabold text-foreground">{formatCurrency(s.monthlySpend)}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Công nợ: {formatCurrency(s.debtAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Add Supplier */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm Nhà Cung Cấp Mới</DialogTitle>
            <DialogDescription>
              Đăng ký đối tác cung cấp nguyên vật liệu cho Căng tin Đại Học Đại Nam
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Tên nhà cung cấp *</label>
              <input
                type="text"
                placeholder="VD: Công ty TNHH Thực Phẩm Sạch Phú Lãm"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Nhóm thực phẩm</label>
                <input
                  type="text"
                  placeholder="VD: Thịt gà tươi, Trứng"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Số điện thoại</label>
                <input
                  type="text"
                  placeholder="0988xxxxxx"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAddModal(false)} variant="default" className="w-full">
              Lưu Thông Tin Nhà Cung Cấp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
