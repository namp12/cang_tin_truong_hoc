import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  ShieldCheck, 
  Key, 
  Store, 
  Calendar, 
  CheckCircle2, 
  Laptop, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff,
  LogOut,
  AlertCircle
} from 'lucide-react';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ open, onOpenChange }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'INFO' | 'PASSWORD' | 'SESSIONS'>('INFO');

  // Edit profile state
  const [fullName, setFullName] = useState(user?.fullName || 'Căng tin Đại Nam');
  const [phone, setPhone] = useState(user?.phone || '0901 234 567');
  const [isSaved, setIsSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const getRoleTitle = (roles?: string[]) => {
    const role = roles?.[0] || 'SUPER_ADMIN';
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'Quản Trị Viên Cấp Cao', badge: 'bg-purple-600 text-white' };
      case 'CANTEEN_MANAGER':
        return { label: 'Quản Lý Căng Tin Chi Nhánh', badge: 'bg-indigo-600 text-white' };
      case 'CASHIER':
        return { label: 'Nhân Viên Thu Ngân (POS)', badge: 'bg-amber-600 text-white' };
      case 'KITCHEN_STAFF':
        return { label: 'Đầu Bếp Trưởng (KDS)', badge: 'bg-rose-600 text-white' };
      case 'STUDENT':
        return { label: 'Sinh Viên Đại Học Đại Nam', badge: 'bg-emerald-600 text-white' };
      default:
        return { label: role, badge: 'bg-primary text-white' };
    }
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ thông tin mật khẩu');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2500);
  };

  const roleInfo = getRoleTitle(user?.roles);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>Hồ Sơ Tài Khoản Cán Bộ / Sinh Viên DNU</span>
          </DialogTitle>
          <DialogDescription>
            Thông tin định danh người dùng trong hệ thống Căng tin Đại Học Đại Nam
          </DialogDescription>
        </DialogHeader>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border/50 text-xs font-semibold my-1">
        <button
          type="button"
          onClick={() => setActiveTab('INFO')}
          className={`flex-1 py-1.5 rounded-md transition-all ${
            activeTab === 'INFO' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Thông Tin Cá Nhân
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PASSWORD')}
          className={`flex-1 py-1.5 rounded-md transition-all ${
            activeTab === 'PASSWORD' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Đổi Mật Khẩu
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('SESSIONS')}
          className={`flex-1 py-1.5 rounded-md transition-all ${
            activeTab === 'SESSIONS' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Phiên Đăng Nhập
        </button>
      </div>

      {/* TAB 1: Profile Info */}
      {activeTab === 'INFO' && (
        <form onSubmit={handleSaveInfo} className="space-y-4 py-2 text-xs">
          {isSaved && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Đã cập nhật thông tin hồ sơ thành công!</span>
            </div>
          )}

          {/* User Hero Avatar Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 border border-border/80 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {user?.fullName?.charAt(0) || 'D'}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground leading-tight">{user?.fullName}</h3>
              <p className="text-xs font-mono text-muted-foreground">@{user?.username || 'admin_super'}</p>
              <div className="mt-1">
                <Badge className={`text-[10px] font-bold ${roleInfo.badge}`}>
                  {roleInfo.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">Mã Định Danh / MSSV</label>
              <input
                type="text"
                disabled
                value={user?.username?.includes('student') ? 'SV-2110001 (K16 CNTT)' : 'CB-DNU-0891'}
                className="w-full px-3 py-2 bg-muted/60 border border-input rounded-lg text-foreground font-mono cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-foreground mb-1">Email Chính Chủ DNU</label>
              <input
                type="email"
                disabled
                value={user?.email || 'admin@dainam.edu.vn'}
                className="w-full px-3 py-2 bg-muted/60 border border-input rounded-lg text-foreground cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block font-semibold text-foreground mb-1">Số điện thoại liên hệ</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded-lg border border-border/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-primary" />
                Đơn vị / Khoa trực thuộc:
              </span>
              <strong className="text-foreground">Khoa CNTT / Ban Quản Lý DNU</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-orange-500" />
                Cơ sở làm việc chính:
              </span>
              <strong className="text-foreground">Căng tin Tòa G (Hà Đông)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                Ngày kích hoạt tài khoản:
              </span>
              <strong className="text-foreground">15/01/2026 (Hoạt động 🟢)</strong>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" variant="default" className="w-full">
              Lưu Thay Đổi Thông Tin
            </Button>
          </DialogFooter>
        </form>
      )}

      {/* TAB 2: Change Password */}
      {activeTab === 'PASSWORD' && (
        <form onSubmit={handleChangePassword} className="space-y-3.5 py-2 text-xs">
          {passwordSuccess && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Mật khẩu của bạn đã được cập nhật thành công!</span>
            </div>
          )}

          {passwordError && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-500 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-foreground mb-1">Mật khẩu hiện tại *</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ (VD: Password@123)"
                className="w-full pl-9 pr-9 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Mật khẩu mới *</label>
            <div className="relative">
              <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Xác nhận mật khẩu mới *</label>
            <div className="relative">
              <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" variant="default" className="w-full">
              Cập Nhật Mật Khẩu Mới
            </Button>
          </DialogFooter>
        </form>
      )}

      {/* TAB 3: Active Sessions */}
      {activeTab === 'SESSIONS' && (
        <div className="space-y-3 py-2 text-xs">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <span>Trình Duyệt Chrome trên Windows 11</span>
                  <Badge variant="success" className="text-[9px]">Thiết bị này</Badge>
                </p>
                <p className="text-[11px] text-muted-foreground">IP: 127.0.0.1 (Hà Đông, Hà Nội) • Đang hoạt động</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-bold text-foreground">iPhone 15 Pro • Safari Mobile</p>
                <p className="text-[11px] text-muted-foreground">Đăng nhập lần cuối: Hôm nay, 07:30</p>
              </div>
            </div>
            <button className="text-[11px] font-semibold text-rose-500 hover:underline">
              Đăng xuất
            </button>
          </div>

          <div className="pt-2">
            <Button onClick={logout} variant="outline" className="w-full text-rose-600 hover:bg-rose-50 border-rose-200">
              <LogOut className="w-4 h-4 mr-1.5" />
              Đăng Xuất Khỏi Tất Cả Các Thiết Bị
            </Button>
          </div>
        </div>
      )}
      </DialogContent>
    </Dialog>
  );
};
