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
  Wallet
} from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';
import { dnuStore } from '../../services/dnuStore.js';
import { cn } from '../../utils/cn.js';

export const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const studentMssv = user?.username ? user.username.replace(/\D/g, '') || '2110001' : '2110001';

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(() => dnuStore.getStudentWallet(studentMssv).balance);

  React.useEffect(() => {
    const handleSync = () => {
      setWalletBalance(dnuStore.getStudentWallet(studentMssv).balance);
    };
    window.addEventListener('dnu_store_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dnu_store_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [studentMssv]);

  const navItems = [
    { label: 'Trang chủ', path: '/student/home', icon: Home },
    { label: 'Thực đơn', path: '/student/menu', icon: UtensilsCrossed },
    { label: 'Giỏ hàng', path: '/student/cart', icon: ShoppingBag, badge: '2' },
    { label: 'Đơn hàng', path: '/student/orders', icon: Receipt },
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
          {/* DNU Pay Wallet Quick Button */}
          <button
            type="button"
            onClick={() => setShowWalletModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/20 text-xs font-bold hover:scale-105 transition-transform"
            title="Ví DNU Pay"
          >
            <Wallet className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">Ví:</span>
            <span className="font-mono">{formatCurrency(walletBalance)}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {user.fullName?.charAt(0) || 'S'}
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
                  isActive ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                )
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Wallet Bottom Nav Item */}
        <button
          type="button"
          onClick={() => setShowWalletModal(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-all"
        >
          <Wallet className="w-5 h-5 mb-0.5" />
          <span>Ví DNU</span>
        </button>

        {/* Profile Bottom Nav Item */}
        <button
          type="button"
          onClick={() => setShowProfileModal(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-all"
        >
          <UserIcon className="w-5 h-5 mb-0.5" />
          <span>Cá nhân</span>
        </button>
      </nav>

      {/* Interactive Modals */}
      <UserProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
      <StudentWalletModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </div>
  );
};
