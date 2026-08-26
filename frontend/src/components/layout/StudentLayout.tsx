import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingBag, 
  Receipt, 
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn.js';

export const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Trang chủ', path: '/student/home', icon: Home },
    { label: 'Thực đơn', path: '/student/menu', icon: UtensilsCrossed },
    { label: 'Giỏ hàng', path: '/student/cart', icon: ShoppingBag, badge: '2' },
    { label: 'Đơn hàng', path: '/student/orders', icon: Receipt },
    { label: 'Cá nhân', path: '/student/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 sm:pb-0 font-sans max-w-md mx-auto sm:max-w-2xl shadow-xl border-x border-slate-200/60">
      {/* Student App Top Header */}
      <header className="h-14 bg-white border-b border-slate-100 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/student/home')}>
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-800 leading-tight">BK CANTEEN</h1>
            <p className="text-[10px] text-emerald-600 font-semibold">Cơ sở 1 - Lý Thường Kiệt</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">{user.fullName}</span>
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
      </nav>
    </div>
  );
};
