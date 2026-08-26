import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import { 
  Menu, 
  Search, 
  Bell, 
  Store, 
  LogOut, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const { user, logout, login } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedCanteen, setSelectedCanteen] = useState('1');

  const notifications = [
    { id: 1, title: 'Đơn mới #1029', desc: '2 Cơm gà xối mỡ cần nấu', time: '1 phút trước', isNew: true },
    { id: 2, title: 'Kho thịt gà sắp hết', desc: 'Chỉ còn 5.2kg trong kho A1', time: '10 phút trước', isNew: true },
    { id: 3, title: 'Thanh toán thành công', desc: 'Đơn #1028 đã thanh toán QR 70.000đ', time: '25 phút trước', isNew: false },
  ];

  const quickRoles = [
    { label: 'Admin', user: 'admin_super' },
    { label: 'Thu Ngân (POS)', user: 'cashier_01' },
    { label: 'Đầu Bếp (KDS)', user: 'chef_01' },
    { label: 'Sinh Viên', user: 'student_2110001' },
  ];

  const handleQuickSwitch = async (username: string) => {
    await login(username, 'Password@123');
    setShowUserMenu(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left Area: Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Canteen Selector */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/50 text-xs font-semibold">
          <Store className="w-3.5 h-3.5 text-emerald-600" />
          <select 
            value={selectedCanteen}
            onChange={(e) => setSelectedCanteen(e.target.value)}
            aria-label="Chọn chi nhánh căng tin"
            className="bg-transparent text-emerald-900 font-semibold focus:outline-none cursor-pointer pr-1"
          >
            <option value="1">Căng tin Khu A (Nhà H1 - Q.10)</option>
            <option value="2">Căng tin Khu B (Nhà B4 - Q.10)</option>
            <option value="3">Căng tin Trung Tâm (Khu Dĩ An)</option>
          </select>
        </div>

        {/* Global Search Box */}
        <div className="relative max-w-xs sm:max-w-md w-full hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm đơn hàng, món ăn, hóa đơn (Ctrl + K)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Right Area: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 relative transition-colors"
            title="Thông báo"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Notification Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800">Thông Báo Hệ Thống</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">2 Mới</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    {item.id === 2 ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
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
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.fullName || 'Admin User'}</p>
              <p className="text-[11px] text-slate-400 leading-tight">{user?.roles?.[0] || 'SUPER_ADMIN'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{user?.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              {/* Demo Quick Role Switcher */}
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  Đổi nhanh Role Demo:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {quickRoles.map((r) => (
                    <button
                      key={r.user}
                      onClick={() => handleQuickSwitch(r.user)}
                      className="text-[11px] font-medium py-1 px-2 rounded bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 text-slate-600 transition-colors text-left truncate"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
