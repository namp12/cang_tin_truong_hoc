import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from '../../contexts/ThemeContext.js';
import { 
  Menu, 
  Search, 
  Bell, 
  Store, 
  LogOut, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck,
  Sun,
  Moon,
  Laptop,
  Command
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const { user, logout, login } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedCanteen, setSelectedCanteen] = useState('1');

  const notifications = [
    { id: 1, title: 'Đơn mới #1029', desc: '2 Cơm gà xối mỡ cần nấu', time: '1 phút trước', isNew: true },
    { id: 2, title: 'Kho thịt gà sắp hết', desc: 'Chỉ còn 5.2kg trong kho A1', time: '10 phút trước', isNew: true },
    { id: 3, title: 'Thanh toán thành công', desc: 'Đơn #1028 đã thanh toán QR 70.000đ', time: '25 phút trước', isNew: false },
  ];

  return (
    <header className="h-16 bg-card border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors duration-200">
      {/* Left Area: Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Canteen Selector */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold">
          <Store className="w-3.5 h-3.5" />
          <select 
            value={selectedCanteen}
            onChange={(e) => setSelectedCanteen(e.target.value)}
            aria-label="Chọn chi nhánh căng tin DNU"
            className="bg-transparent font-semibold focus:outline-none cursor-pointer pr-1 text-foreground"
          >
            <option value="1" className="bg-card text-foreground">Căng tin Trung Tâm (Tòa nhà G - Hà Đông)</option>
            <option value="2" className="bg-card text-foreground">Căng tin Khu Giảng Đường & KTX (Tòa A-B DNU)</option>
            <option value="3" className="bg-card text-foreground">Căng tin DNU Garden & Coffee (Khu Thể Thao)</option>
          </select>
        </div>

        {/* Global Search Box */}
        <div className="relative max-w-xs sm:max-w-md w-full hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm đơn hàng, món ăn, hóa đơn..."
            className="w-full pl-9 pr-12 py-2 bg-muted/60 border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-card border border-border text-[10px] text-muted-foreground font-mono">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Area: Actions, Theme, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark/Light Theme Switcher Button */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground relative transition-colors"
            title="Thông báo"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-card" />
          </button>

          {/* Notification Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                <span className="font-semibold text-xs text-foreground">Thông Báo Hệ Thống</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">2 Mới</span>
              </div>
              <div className="divide-y divide-border max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-muted/50 transition-colors flex items-start gap-2.5">
                    {item.id === 2 ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-foreground leading-tight">{user?.fullName || 'Admin User'}</p>
              <p className="text-[11px] text-muted-foreground leading-tight">{user?.roles?.[0] || 'SUPER_ADMIN'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden lg:block" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-xs font-bold text-foreground">{user?.fullName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
              </div>

              {/* User Menu Items */}
              <div className="py-1 text-xs">
                <div className="px-4 py-2 hover:bg-muted/60 cursor-pointer flex items-center gap-2.5 text-foreground transition-colors">
                  <UserCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Hồ sơ & Tài khoản DNU</span>
                </div>
                <div className="px-4 py-2 hover:bg-muted/60 cursor-pointer flex items-center gap-2.5 text-foreground transition-colors">
                  <Store className="w-3.5 h-3.5 text-orange-500" />
                  <span>Căng tin: Tòa G Hà Đông</span>
                </div>
              </div>

              <div className="pt-1 border-t border-border">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất khỏi hệ thống</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
