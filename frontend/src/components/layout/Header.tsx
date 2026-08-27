import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from '../../contexts/ThemeContext.js';
import { UserProfileModal } from '../common/UserProfileModal.js';
import { SystemDiagnosticsModal } from '../common/SystemDiagnosticsModal.js';
import { dnuStore, SystemNotification } from '../../services/dnuStore.js';
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
  Activity,
  ShoppingBag,
  ChefHat,
  Star,
  Wallet
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [selectedCanteen, setSelectedCanteen] = useState('1');

  const [notifications, setNotifications] = useState<SystemNotification[]>(() =>
    dnuStore.getNotifications(user?.roles?.[0], user?.username)
  );

  useEffect(() => {
    const handleSync = () => {
      setNotifications(dnuStore.getNotifications(user?.roles?.[0], user?.username));
    };
    window.addEventListener('dnu_store_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dnu_store_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    dnuStore.markAllNotificationsAsRead();
    setNotifications(dnuStore.getNotifications(user?.roles?.[0], user?.username));
  };

  const handleClickNotif = (notif: SystemNotification) => {
    dnuStore.markNotificationAsRead(notif.id);
    setShowNotifications(false);
    if (notif.linkUrl) {
      navigate(notif.linkUrl);
    }
  };

  return (
    <>
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
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        </div>

        {/* Right Area: Dark Mode Toggle, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* System Diagnostics Trigger */}
          <button
            onClick={() => setShowDiagnosticsModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all shadow-2xs"
            title="Kiểm thử và chuẩn đoán kết nối hệ thống"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[11px]">Test Sync DB</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground relative transition-colors"
              title="Thông báo hệ thống"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 px-1 min-w-[16px] h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-card animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-foreground">Thông Báo Hệ Thống</p>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-600 font-bold text-[10px]">
                        {unreadCount} mới
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-primary font-semibold hover:underline"
                  >
                    Đánh dấu đã đọc
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-border">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      Không có thông báo mới
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleClickNotif(item)}
                        className={`p-3 hover:bg-muted/60 transition-colors flex items-start gap-3 cursor-pointer ${
                          !item.isRead ? 'bg-orange-500/5' : ''
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {item.type === 'ORDER_NEW' && (
                            <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-600 flex items-center justify-center">
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {item.type === 'ORDER_READY' && (
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                              <ChefHat className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {item.type === 'STOCK_LOW' && (
                            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {item.type === 'REVIEW_NEW' && (
                            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-600 flex items-center justify-center">
                              <Star className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {item.type === 'PAYMENT_SUCCESS' && (
                            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-600 flex items-center justify-center">
                              <Wallet className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {item.type === 'ADMIN_REPLY' && (
                            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-xs ${!item.isRead ? 'font-bold text-foreground' : 'font-semibold text-foreground/80'}`}>
                              {item.title}
                            </p>
                            {!item.isRead && (
                              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{item.desc}</p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1 font-mono">{item.time}</p>
                        </div>
                      </div>
                    ))
                  )}
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
                {(user?.username === 'admin_super' || user?.roles?.includes('SUPER_ADMIN') || user?.fullName?.includes('Long') ? 'C' : (user?.fullName?.charAt(0) || 'C'))}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-foreground leading-tight">
                  {user?.username === 'admin_super' || user?.roles?.includes('SUPER_ADMIN') || user?.fullName?.includes('Long')
                    ? 'Căng tin Đại Nam'
                    : (user?.fullName || 'Căng tin Đại Nam')}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">{user?.roles?.[0] || 'SUPER_ADMIN'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden lg:block" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-xs font-bold text-foreground">
                    {user?.username === 'admin_super' || user?.roles?.includes('SUPER_ADMIN') || user?.fullName?.includes('Long')
                      ? 'Căng tin Đại Nam'
                      : (user?.fullName || 'Căng tin Đại Nam')}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{user?.email || 'canteen@dainam.edu.vn'}</p>
                </div>

                {/* User Menu Items */}
                <div className="py-1 text-xs">
                  <div 
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowUserMenu(false);
                    }}
                    className="px-4 py-2 hover:bg-muted/60 cursor-pointer flex items-center gap-2.5 text-foreground transition-colors font-medium"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-primary" />
                    <span>Hồ sơ & Tài khoản DNU</span>
                  </div>
                  <div 
                    onClick={() => {
                      setShowDiagnosticsModal(true);
                      setShowUserMenu(false);
                    }}
                    className="px-4 py-2 hover:bg-muted/60 cursor-pointer flex items-center gap-2.5 text-emerald-600 font-medium transition-colors"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Kiểm thử & Chuẩn đoán DB</span>
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

      {/* Interactive User Profile Modal Dialog */}
      <UserProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />

      {/* Interactive System Diagnostics & Test Suite Modal */}
      <SystemDiagnosticsModal open={showDiagnosticsModal} onOpenChange={setShowDiagnosticsModal} />
    </>
  );
};
