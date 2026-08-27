import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { UserProfileModal } from '../common/UserProfileModal.js';
import { StudentWalletModal } from '../common/StudentWalletModal.js';
import { AiFoodAssistant } from '../common/AiFoodAssistant.js';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingBag, 
  Receipt, 
  User as UserIcon,
  LogOut,
  Wallet,
  LayoutDashboard,
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChefHat,
  Star
} from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';
import { dnuStore, SystemNotification } from '../../services/dnuStore.js';
import { cn } from '../../utils/cn.js';
import { useSocket } from '../../contexts/SocketContext.js';
import { orderStorage } from '../../services/orderStorage.js';

export const StudentLayout: React.FC = () => {
  const { user, logout, isStudent } = useAuth();
  const navigate = useNavigate();
  const { latestStatusUpdate } = useSocket();
  const isAdminOrStaff = user && !isStudent;
  const studentMssv = isStudent && user?.username ? user.username.replace(/\D/g, '') || '2110001' : '2110001';

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [walletBalance, setWalletBalance] = useState(() => dnuStore.getStudentWallet(studentMssv).balance);
  const [cartItemsCount, setCartItemsCount] = useState(() =>
    dnuStore.getStudentCart().reduce((s, i) => s + i.quantity, 0)
  );
  const [notifications, setNotifications] = useState<SystemNotification[]>(() =>
    dnuStore.getNotifications('STUDENT', user?.username)
  );

  React.useEffect(() => {
    // Prevent non-students (Admins, Cashiers, Kitchen staff) from visiting the Student layout pages
    if (user && !isStudent) {
      if (user.roles?.includes('CASHIER')) {
        navigate('/admin/pos', { replace: true });
      } else if (user.roles?.includes('KITCHEN_STAFF')) {
        navigate('/admin/kitchen', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, isStudent, navigate]);

  React.useEffect(() => {
    if (latestStatusUpdate) {
      const { orderId, orderNumber, status } = latestStatusUpdate;
      
      const allOrders = orderStorage.getOrders();
      const matchOrder = allOrders.find(
        (o) => o.code === orderNumber || o.id === orderId || o.code.includes(String(orderId))
      );
      
      const cleanName = (name: string) => name.split('(')[0].trim().toLowerCase();
      const studentName = user?.fullName || 'Nguyễn Thành Nam';
      const isMyOrder = matchOrder ? (
        (matchOrder.customerUsername && user?.username && matchOrder.customerUsername.toLowerCase() === user.username.toLowerCase()) ||
        (cleanName(matchOrder.customerName) === cleanName(studentName))
      ) : false;
      
      if (isMyOrder) {
        const orderCode = orderNumber || `#${orderId}`;
        const existingNotifs = dnuStore.getNotifications('STUDENT', user?.username);
        
        const isDuplicate = existingNotifs.some(
          (n) => n.orderCode === orderCode && (
            (status === 'READY' && n.type === 'ORDER_READY') ||
            (status === 'COMPLETED' && n.type === 'ORDER_COMPLETED')
          )
        );
        
        if (!isDuplicate) {
          if (status === 'READY') {
            dnuStore.addNotification({
              title: `🔔 Món đã nấu xong ${orderCode}`,
              desc: `Bếp Tòa G đã nấu xong món ăn. Mời bạn đến nhận món tại quầy!`,
              type: 'ORDER_READY',
              targetRole: 'STUDENT',
              targetUser: user?.username || 'student_2110001',
              linkUrl: '/student/orders',
              orderCode: orderCode,
            });
          } else if (status === 'COMPLETED') {
            dnuStore.addNotification({
              title: `✅ Đơn hàng hoàn tất ${orderCode}`,
              desc: `Đơn hàng đã được trả món thành công. Chúc bạn dùng bữa ngon miệng!`,
              type: 'ORDER_COMPLETED',
              targetRole: 'STUDENT',
              targetUser: user?.username || 'student_2110001',
              linkUrl: '/student/orders',
              orderCode: orderCode,
            });
          }
        }
      }
    }
  }, [latestStatusUpdate, user]);

  React.useEffect(() => {
    const handleSync = () => {
      setWalletBalance(dnuStore.getStudentWallet(studentMssv).balance);
      setCartItemsCount(dnuStore.getStudentCart().reduce((s, i) => s + i.quantity, 0));
      setNotifications(dnuStore.getNotifications('STUDENT', user?.username));
    };
    window.addEventListener('dnu_store_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dnu_store_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [studentMssv, user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    dnuStore.markAllNotificationsAsRead();
    setNotifications(dnuStore.getNotifications('STUDENT', user?.username));
  };

  const handleClickNotif = (notif: SystemNotification) => {
    dnuStore.markNotificationAsRead(notif.id);
    setShowNotifications(false);
    if (notif.linkUrl) {
      navigate(notif.linkUrl);
    }
  };

  const navItems = [
    { label: 'Trang chủ', path: '/student/home', icon: Home },
    { label: 'Thực đơn', path: '/student/menu', icon: UtensilsCrossed },
    { label: 'Giỏ hàng', path: '/student/cart', icon: ShoppingBag, badge: cartItemsCount > 0 ? String(cartItemsCount) : undefined },
    { label: 'Đơn hàng', path: '/student/orders', icon: Receipt },
    { label: 'Tài khoản', path: '/student/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 sm:pb-0 font-sans max-w-md mx-auto sm:max-w-2xl shadow-xl border-x border-slate-200/60">
      {/* Student App Top Header */}
      <header className="h-14 bg-white border-b border-slate-100 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/student/home')}>
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold shadow-xs">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-800 leading-tight">DNU SMART CANTEEN</h1>
            <p className="text-[10px] text-orange-600 font-semibold">Tòa G - Đại Học Đại Nam (Hà Đông)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Back to Admin Dashboard Button for Admins / Staff */}
          {isAdminOrStaff && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-colors"
              title="Quay lại Trang Quản Trị"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Quản Trị</span>
            </button>
          )}

          {/* DNU Pay Wallet Quick Button */}
          <button
            type="button"
            onClick={() => navigate('/student/profile')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/20 text-xs font-bold hover:scale-105 transition-transform"
            title="Ví DNU Pay"
          >
            <Wallet className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">Ví:</span>
            <span className="font-mono">{formatCurrency(walletBalance)}</span>
          </button>

          {/* Student Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition-colors"
              title="Thông báo"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1 min-w-[15px] h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-800">Thông Báo Của Bạn</p>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-600 font-bold text-[9px]">
                        {unreadCount} mới
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-orange-600 font-semibold hover:underline"
                  >
                    Đã đọc tất cả
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-5 text-center text-xs text-slate-400">
                      Chưa có thông báo nào
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleClickNotif(item)}
                        className={`p-3 hover:bg-orange-50/50 transition-colors flex items-start gap-2.5 cursor-pointer ${
                          !item.isRead ? 'bg-orange-50/30' : ''
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {item.type === 'ORDER_READY' ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <ChefHat className="w-3.5 h-3.5" />
                            </div>
                          ) : item.type === 'ADMIN_REPLY' ? (
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${!item.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.desc}</p>
                          <p className="text-[9px] text-slate-400 mt-1 font-mono">{item.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigate('/student/profile')}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline truncate max-w-[100px]">{user.fullName}</span>
              </button>
              <button 
                onClick={logout} 
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth/login')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      {/* Floating AI Nutri-Food Assistant */}
      <AiFoodAssistant />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto sm:max-w-2xl bg-white border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around z-40 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all relative',
                  isActive ? 'text-orange-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                )
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 min-w-[15px] h-3.5 px-1 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Profile & Wallet Modals */}
      <UserProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
      <StudentWalletModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </div>
  );
};
