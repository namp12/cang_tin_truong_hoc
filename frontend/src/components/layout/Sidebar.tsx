import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { cn } from '../../utils/cn.js';
import { Tooltip } from '../ui/tooltip.js';
import { Badge } from '../ui/Badge.js';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  UtensilsCrossed,
  ChefHat,
  Package,
  Truck,
  Users,
  DollarSign,
  Gift,
  Star,
  BarChart3,
  Bot,
  Settings,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Store,
} from 'lucide-react';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isAi?: boolean;
  exact?: boolean;
}

interface MenuSection {
  title: string;
  roles: string[];
  items: MenuItem[];
}

interface SidebarProps {
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { user, hasRole } = useAuth();

  const menuSections: MenuSection[] = [
    {
      title: 'TỔNG QUAN',
      roles: ['SUPER_ADMIN', 'ADMIN', 'CANTEEN_MANAGER'],
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, exact: true },
      ],
    },
    {
      title: 'BÁN HÀNG & PHỤC VỤ',
      roles: ['SUPER_ADMIN', 'ADMIN', 'CANTEEN_MANAGER', 'CASHIER', 'KITCHEN_STAFF'],
      items: [
        { label: 'Quầy POS Cảm ứng', path: '/admin/pos', icon: ShoppingCart, badge: 'HOT' },
        { label: 'Kiosk Tự Phục Vụ', path: '/kiosk', icon: Store, badge: 'KIOSK' },
        { label: 'Quản lý Đơn hàng', path: '/admin/orders', icon: Receipt },
        { label: 'Màn hình Bếp (KDS)', path: '/admin/kitchen', icon: ChefHat, badge: 'LIVE' },
      ].filter((item) => {
        if (user?.roles?.includes('CASHIER') && !user?.roles?.includes('SUPER_ADMIN')) {
          return item.path === '/admin/pos' || item.path === '/admin/orders' || item.path === '/kiosk';
        }
        if (user?.roles?.includes('KITCHEN_STAFF') && !user?.roles?.includes('SUPER_ADMIN')) {
          return item.path === '/admin/kitchen';
        }
        return true;
      }),
    },
    {
      title: 'THỰC ĐƠN & MÓN ĂN',
      roles: ['SUPER_ADMIN', 'ADMIN', 'CANTEEN_MANAGER'],
      items: [
        { label: 'Danh sách Món ăn', path: '/admin/foods', icon: UtensilsCrossed },
        { label: 'Danh mục & Combo', path: '/admin/categories', icon: Layers },
      ],
    },
    {
      title: 'KHO & TIẾP LIỆU',
      roles: ['SUPER_ADMIN', 'ADMIN', 'CANTEEN_MANAGER', 'WAREHOUSE_MANAGER'],
      items: [
        { label: 'Quản lý Tồn kho', path: '/admin/inventory', icon: Package },
        { label: 'Nhà cung cấp', path: '/admin/suppliers', icon: Truck },
      ],
    },
    {
      title: 'VẬN HÀNH & NHÂN SỰ',
      roles: ['SUPER_ADMIN', 'ADMIN', 'CANTEEN_MANAGER'],
      items: [
        { label: 'Cấp & Quản lý Tài khoản', path: '/admin/users', icon: Users },
        { label: 'Dòng tiền & Chi phí', path: '/admin/finance', icon: DollarSign },
        { label: 'Khuyến mãi & Voucher', path: '/admin/promotions', icon: Gift },
        { label: 'Đánh giá món', path: '/admin/reviews', icon: Star },
      ],
    },
    {
      title: 'BÁO CÁO & TRÍ TUỆ NHÂN TẠO',
      roles: ['SUPER_ADMIN', 'ADMIN', 'CANTEEN_MANAGER'],
      items: [
        { label: 'Báo cáo Kinh doanh', path: '/admin/reports', icon: BarChart3 },
        { label: 'AI Analytics Insights', path: '/admin/ai-analytics', icon: Bot, isAi: true },
      ],
    },
    {
      title: 'HỆ THỐNG',
      roles: ['SUPER_ADMIN', 'ADMIN'],
      items: [
        { label: 'Cài đặt hệ thống', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'bg-card text-card-foreground flex flex-col h-full border-r border-border select-none transition-all duration-300 relative',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/80">
        <Link to="/admin/dashboard" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-foreground truncate">
                  DNU CANTEEN
                </span>
                <Badge variant="primary" className="text-[9px] px-1 py-0 bg-orange-600 text-white">
                  DNU
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground truncate">
                Đại Học Đại Nam (Hà Đông)
              </span>
            </div>
          )}
        </Link>

        {/* Collapse Toggle Button (Desktop) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuSections.map((section, idx) => {
          const isAllowed = section.roles.some((role: any) => hasRole(role));
          if (!isAllowed) return null;

          return (
            <div key={idx} className="space-y-1">
              {!isCollapsed ? (
                <p className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  {section.title}
                </p>
              ) : (
                <div className="h-px bg-border/60 mx-2 my-2" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const navContent = (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center rounded-lg text-xs font-medium transition-all duration-150 group',
                          isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2',
                          isActive
                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 transition-transform group-hover:scale-110 shrink-0" />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                          {item.badge}
                        </span>
                      )}
                      {!isCollapsed && item.isAi && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-500 border border-blue-500/30">
                          <Sparkles className="w-2.5 h-2.5" /> AI
                        </span>
                      )}
                    </NavLink>
                  );

                  return isCollapsed ? (
                    <Tooltip key={item.path} content={item.label} side="right">
                      {navContent}
                    </Tooltip>
                  ) : (
                    navContent
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Quick Info Footer */}
      <div className="p-3 border-t border-border bg-card/50">
        <div
          className={cn(
            'flex items-center rounded-lg bg-muted/60 border border-border/80 p-2',
            isCollapsed ? 'justify-center' : 'gap-3'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user?.fullName || 'Admin User'}</p>
              <p className="text-[10px] text-primary font-medium truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {user?.roles?.[0] || 'SUPER_ADMIN'}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
