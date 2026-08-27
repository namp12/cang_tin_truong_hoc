import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { 
  Settings, 
  Store, 
  Printer, 
  CreditCard, 
  Clock, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Building, 
  Phone, 
  Mail, 
  Globe 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);

  const [generalConfig, setGeneralConfig] = useState({
    schoolName: 'Trường Đại Học Đại Nam',
    schoolCode: 'DNU',
    address: 'Số 1 Phố Xốm, Phú Lãm, Hà Đông, Hà Nội',
    website: 'https://dainam.edu.vn',
    hotline: '024 3557 7799',
    canteenName: 'Hệ Thống Căng Tin DNU Smart Canteen',
  });

  const [posConfig, setPosConfig] = useState({
    printerPaperSize: 'K80 (80mm)',
    autoPrintBill: true,
    allowTableOrdering: true,
    vatTaxRate: 0, // 0% cho ẩm thực học đường
  });

  const [paymentConfig, setPaymentConfig] = useState({
    enableDnuPay: true,
    enableMomo: true,
    enableVnpay: true,
    enableCash: true,
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Cài Đặt & Cấu Hình Hệ Thống DNU</h2>
          <p className="text-xs text-muted-foreground">Thiết lập thông tin nhà trường, cấu hình máy in quầy POS, cổng thanh toán và giờ hoạt động</p>
        </div>
        <Button onClick={handleSaveSettings} variant="default" size="sm" leftIcon={<Save className="w-4 h-4" />}>
          Lưu Cấu Hình
        </Button>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Đã lưu toàn bộ cấu hình hệ thống thành công!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-4">
        {/* Section 1: General University Info */}
        <Card>
          <CardHeader className="p-4 pb-2 border-b border-border">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              <span>Thông Tin Trường Đại Học & Căng Tin</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Tên trường đại học</label>
                <input
                  type="text"
                  value={generalConfig.schoolName}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, schoolName: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Mã trường</label>
                <input
                  type="text"
                  value={generalConfig.schoolCode}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, schoolCode: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Địa chỉ trụ sở chính</label>
              <input
                type="text"
                value={generalConfig.address}
                onChange={(e) => setGeneralConfig({ ...generalConfig, address: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Hotline / Ban Quản Lý Căng Tin</label>
                <input
                  type="text"
                  value={generalConfig.hotline}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, hotline: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Website chính thức</label>
                <input
                  type="text"
                  value={generalConfig.website}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, website: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: POS & Thermal Printer Config */}
        <Card>
          <CardHeader className="p-4 pb-2 border-b border-border">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Printer className="w-4 h-4 text-primary" />
              <span>Cấu Hình Quầy POS & Máy In Hóa Đơn</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Khổ giấy in bill nhiệt</label>
                <select
                  value={posConfig.printerPaperSize}
                  onChange={(e) => setPosConfig({ ...posConfig, printerPaperSize: e.target.value })}
                  aria-label="Chọn khổ giấy in hóa đơn"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="K80 (80mm)">K80 (Khổ tiêu chuẩn 80mm)</option>
                  <option value="K58 (58mm)">K58 (Khổ nhỏ 58mm)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Thuế suất VAT (%)</label>
                <input
                  type="number"
                  value={posConfig.vatTaxRate}
                  onChange={(e) => setPosConfig({ ...posConfig, vatTaxRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
              <div>
                <p className="font-bold text-foreground">Tự động in hóa đơn sau khi hoàn tất thanh toán</p>
                <p className="text-[11px] text-muted-foreground">Máy in tại quầy thu ngân sẽ tự động cắt giấy và in bill cho sinh viên</p>
              </div>
              <input
                type="checkbox"
                checked={posConfig.autoPrintBill}
                onChange={(e) => setPosConfig({ ...posConfig, autoPrintBill: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Payment Gateways */}
        <Card>
          <CardHeader className="p-4 pb-2 border-b border-border">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Cổng Thanh Toán & Ví Sinh Viên</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 text-xs">
            {[
              { key: 'enableDnuPay', title: 'Ví Sinh Viên DNU Pay', desc: 'Thanh toán trực tiếp từ tài khoản sinh viên trường Đại Học Đại Nam', active: paymentConfig.enableDnuPay },
              { key: 'enableMomo', title: 'Cổng MoMo QR Code', desc: 'Sinh viên quét mã QR thanh toán qua ví điện tử MoMo', active: paymentConfig.enableMomo },
              { key: 'enableVnpay', title: 'Cổng VNPAY-QR', desc: 'Hỗ trợ tất cả ứng dụng Mobile Banking của các ngân hàng', active: paymentConfig.enableVnpay },
              { key: 'enableCash', title: 'Tiền Mặt Tại Quầy Thu Ngân', desc: 'Nhận tiền mặt truyền thống tại quầy POS Tòa G và Tòa AB', active: paymentConfig.enableCash },
            ].map((g) => (
              <div key={g.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                <div>
                  <p className="font-bold text-foreground">{g.title}</p>
                  <p className="text-[11px] text-muted-foreground">{g.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={g.active}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, [g.key]: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
