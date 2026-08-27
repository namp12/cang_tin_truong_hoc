import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog.js';
import { formatDateTime } from '../../utils/format.js';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Key, 
  Store, 
  Mail, 
  Phone,
  CheckCircle2,
  Lock,
  Unlock,
  Building
} from 'lucide-react';

interface StaffUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'CANTEEN_MANAGER' | 'CASHIER' | 'KITCHEN_STAFF' | 'WAREHOUSE_MANAGER' | 'STUDENT';
  canteenName: string;
  status: 'ACTIVE' | 'LOCKED';
  createdAt: string;
}

export const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [users, setUsers] = useState<StaffUser[]>([
    {
      id: 1,
      username: 'admin_super',
      fullName: 'Nguyễn Hoàng Long',
      email: 'admin@dainam.edu.vn',
      phone: '0901000001',
      role: 'SUPER_ADMIN',
      canteenName: 'Toàn Hệ Thống DNU',
      status: 'ACTIVE',
      createdAt: '2026-01-15 08:00:00',
    },
    {
      id: 2,
      username: 'manager_canteen1',
      fullName: 'Trần Thị Thu Thảo',
      email: 'manager_toag@dainam.edu.vn',
      phone: '0901000002',
      role: 'CANTEEN_MANAGER',
      canteenName: 'Căng tin Tòa G (Hà Đông)',
      status: 'ACTIVE',
      createdAt: '2026-02-01 09:30:00',
    },
    {
      id: 4,
      username: 'cashier_01',
      fullName: 'Phạm Quỳnh Như',
      email: 'cashier1@dainam.edu.vn',
      phone: '0901000004',
      role: 'CASHIER',
      canteenName: 'Căng tin Tòa G (Hà Đông)',
      status: 'ACTIVE',
      createdAt: '2026-03-10 14:15:00',
    },
    {
      id: 5,
      username: 'chef_01',
      fullName: 'Võ Hoàng Hải',
      email: 'chef1@dainam.edu.vn',
      phone: '0901000005',
      role: 'KITCHEN_STAFF',
      canteenName: 'Căng tin Tòa G (Hà Đông)',
      status: 'ACTIVE',
      createdAt: '2026-03-12 10:00:00',
    },
    {
      id: 6,
      username: 'warehouse_01',
      fullName: 'Đặng Minh Quân',
      email: 'warehouse1@dainam.edu.vn',
      phone: '0901000006',
      role: 'WAREHOUSE_MANAGER',
      canteenName: 'Kho Tiếp Liệu Tòa AB',
      status: 'ACTIVE',
      createdAt: '2026-03-15 11:20:00',
    },
    {
      id: 10,
      username: 'student_2110001',
      fullName: 'Nguyễn Thành Nam (K16 CNTT)',
      email: 'nam.nguyen16@dainam.edu.vn',
      phone: '0901000010',
      role: 'STUDENT',
      canteenName: 'Sinh viên DNU',
      status: 'ACTIVE',
      createdAt: '2026-04-01 16:45:00',
    },
  ]);

  const [newUser, setNewUser] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    role: 'CASHIER' as StaffUser['role'],
    canteenName: 'Căng tin Tòa G (Hà Đông)',
    password: 'Password@123',
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.username) return;

    const created: StaffUser = {
      id: Date.now(),
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email || `${newUser.username}@dainam.edu.vn`,
      phone: newUser.phone || '0901000099',
      role: newUser.role,
      canteenName: newUser.canteenName,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setUsers([created, ...users]);
    setShowAddModal(false);
    setNewUser({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      role: 'CASHIER',
      canteenName: 'Căng tin Tòa G (Hà Đông)',
      password: 'Password@123',
    });
  };

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE' } : u))
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const matchSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  const getRoleBadge = (role: StaffUser['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="primary" className="bg-purple-600 text-white">Super Admin</Badge>;
      case 'CANTEEN_MANAGER':
        return <Badge variant="primary" className="bg-indigo-600 text-white">Quản lý Căng tin</Badge>;
      case 'CASHIER':
        return <Badge variant="warning" className="bg-amber-500/20 text-amber-600 dark:text-amber-400">Thu Ngân (POS)</Badge>;
      case 'KITCHEN_STAFF':
        return <Badge variant="destructive" className="bg-rose-500/20 text-rose-600 dark:text-rose-400">Đầu Bếp (KDS)</Badge>;
      case 'WAREHOUSE_MANAGER':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 dark:text-blue-400">Thủ Kho</Badge>;
      case 'STUDENT':
        return <Badge variant="success" className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">Sinh Viên DNU</Badge>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Quản Lý & Cấp Tài Khoản Người Dùng</h2>
          <p className="text-xs text-muted-foreground">Phân quyền, cấp tài khoản nhân viên (Thu ngân, Đầu bếp, Thủ kho) và sinh viên DNU</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
          Cấp Tài Khoản Mới
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo họ tên, username hoặc email..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/60 border border-input rounded-lg text-xs text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'CASHIER', label: 'Thu Ngân' },
              { id: 'KITCHEN_STAFF', label: 'Đầu Bếp' },
              { id: 'CANTEEN_MANAGER', label: 'Quản Lý' },
              { id: 'STUDENT', label: 'Sinh Viên' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setFilterRole(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterRole === r.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground">
            <thead className="bg-muted/50 text-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Họ & Tên / Username</th>
                <th className="py-3 px-4">Vai Trò (Role)</th>
                <th className="py-3 px-4">Căng Tin Trực Thuộc</th>
                <th className="py-3 px-4">Liên Hệ (Email / SĐT)</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{u.fullName}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">@{u.username}</div>
                  </td>
                  <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Store className="w-3.5 h-3.5 text-primary" />
                      <span>{u.canteenName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>{u.email}</div>
                    <div className="text-[11px] text-muted-foreground">{u.phone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {u.status === 'ACTIVE' ? (
                      <Badge variant="success" hasDot>Hoạt động</Badge>
                    ) : (
                      <Badge variant="destructive" hasDot>Bị khóa</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        u.status === 'ACTIVE'
                          ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                          : 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={u.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                    >
                      {u.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Provision Staff Modal Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cấp Tài Khoản Nhân Viên Mới</DialogTitle>
            <DialogDescription>
              Tạo tài khoản và phân quyền cho nhân viên làm việc tại Căng tin Đại Học Đại Nam
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-3.5 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Họ và tên nhân viên *</label>
              <input
                type="text"
                required
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                placeholder="VD: Nguyễn Văn An"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Tên đăng nhập (Username) *</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value.toLowerCase() })}
                  placeholder="VD: cashier_toag_02"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Mật khẩu khởi tạo</label>
                <input
                  type="text"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs font-mono focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Vai trò công việc (Role) *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as StaffUser['role'] })}
                  aria-label="Chọn vai trò nhân viên"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs focus:ring-2 focus:ring-ring"
                >
                  <option value="CASHIER">Thu Ngân (Quầy POS)</option>
                  <option value="KITCHEN_STAFF">Đầu Bếp (Màn hình KDS)</option>
                  <option value="WAREHOUSE_MANAGER">Thủ Kho (Nhập/Xuất kho)</option>
                  <option value="CANTEEN_MANAGER">Quản Lý Căng Tin Chi Nhánh</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Căng tin làm việc *</label>
                <select
                  value={newUser.canteenName}
                  onChange={(e) => setNewUser({ ...newUser, canteenName: e.target.value })}
                  aria-label="Chọn chi nhánh căng tin"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs focus:ring-2 focus:ring-ring"
                >
                  <option value="Căng tin Tòa G (Hà Đông)">Căng tin Tòa G (Hà Đông)</option>
                  <option value="Căng tin Tòa A-B DNU">Căng tin Tòa A-B DNU</option>
                  <option value="DNU Garden Coffee">DNU Garden Coffee</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" variant="default" className="w-full">
                Hoàn Tất & Cấp Tài Khoản
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
