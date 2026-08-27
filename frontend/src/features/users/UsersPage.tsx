import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
import { dnuStore, StaffUser } from '../../services/dnuStore.js';
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
  Building,
  Trash2
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [users, setUsers] = useState<StaffUser[]>(() => dnuStore.getUsers());

  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'CASHIER' as StaffUser['role'],
    canteenName: 'Căng tin Tòa G (Hà Đông)',
    password: 'Password@123',
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.fullName) return;

    const created: StaffUser = {
      id: Date.now(),
      username: newUser.username.toLowerCase().trim(),
      fullName: newUser.fullName,
      email: newUser.email || `${newUser.username}@dainam.edu.vn`,
      phone: newUser.phone || '0901000999',
      role: newUser.role,
      canteenName: newUser.canteenName,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    const updated = [created, ...users];
    setUsers(updated);
    dnuStore.saveUsers(updated);
    setNewUser({
      username: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'CASHIER',
      canteenName: 'Căng tin Tòa G (Hà Đông)',
      password: 'Password@123',
    });
    setShowAddModal(false);
  };

  const handleToggleLock = (id: number) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'ACTIVE' ? ('LOCKED' as const) : ('ACTIVE' as const) } : u
    );
    setUsers(updated);
    dnuStore.saveUsers(updated);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này khỏi hệ thống?')) {
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      dnuStore.saveUsers(updated);
    }
  };

  const getRoleBadge = (role: StaffUser['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="primary" hasDot>Tổng Quản Trị Hệ Thống</Badge>;
      case 'CANTEEN_MANAGER':
        return <Badge variant="info" hasDot>Quản Lý Căng Tin</Badge>;
      case 'CASHIER':
        return <Badge variant="success" hasDot>Thu Ngân Quầy POS</Badge>;
      case 'KITCHEN_STAFF':
        return <Badge variant="warning" hasDot>Đầu Bếp (KDS)</Badge>;
      case 'WAREHOUSE_MANAGER':
        return <Badge variant="neutral" hasDot>Thủ Kho</Badge>;
      case 'STUDENT':
        return <Badge variant="outline" hasDot>Sinh Viên DNU</Badge>;
      default:
        return <Badge variant="neutral">{role}</Badge>;
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const matchSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Cấp & Quản Lý Tài Khoản Căng Tin DNU</span>
            <Badge variant="primary" className="text-xs font-mono">{users.length} tài khoản</Badge>
          </h2>
          <p className="text-xs text-muted-foreground">Phân quyền nhân sự: Thu ngân quầy POS, Đầu bếp KDS, Quản lý và Sinh viên</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
          Cấp Tài Khoản Mới
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo họ tên, username, SĐT..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/60 border border-input rounded-lg text-xs text-foreground focus:bg-background focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'CASHIER', label: 'Thu Ngân' },
              { id: 'KITCHEN_STAFF', label: 'Đầu Bếp' },
              { id: 'WAREHOUSE_MANAGER', label: 'Thủ Kho' },
              { id: 'CANTEEN_MANAGER', label: 'Quản Lý' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setFilterRole(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterRole === r.id
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">Nhân Viên</th>
                <th className="py-3.5 px-4">Tài Khoản (Username)</th>
                <th className="py-3.5 px-4">Vai Trò & Chức Danh</th>
                <th className="py-3.5 px-4">Cơ Sở Làm Việc</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs text-foreground">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user.fullName}</p>
                        <p className="text-[11px] text-muted-foreground">{user.phone} • {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{user.username}</td>
                  <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{user.canteenName}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleLock(user.id)}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          user.status === 'ACTIVE'
                            ? 'text-amber-600 hover:bg-amber-500/10'
                            : 'text-emerald-600 hover:bg-emerald-500/10'
                        }`}
                        title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                        {user.status === 'ACTIVE' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Add User */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <span>Cấp Tài Khoản Nhân Viên Căng Tin Mới</span>
            </DialogTitle>
            <DialogDescription>
              Tạo tài khoản và phân quyền truy cập hệ thống quản lý Căng tin Đại Học Đại Nam
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-3.5 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Họ và tên nhân viên *</label>
              <input
                type="text"
                required
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                placeholder="VD: Nguyễn Văn An"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Tên đăng nhập (Username) *</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value.toLowerCase() })}
                  placeholder="cashier_toag_02"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Mật khẩu khởi tạo</label>
                <input
                  type="text"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Vai trò (Role) *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as StaffUser['role'] })}
                  aria-label="Chọn vai trò nhân viên"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="CASHIER">Thu Ngân (Quầy POS)</option>
                  <option value="KITCHEN_STAFF">Đầu Bếp (Màn hình KDS)</option>
                  <option value="WAREHOUSE_MANAGER">Thủ Kho (Nhập/Xuất kho)</option>
                  <option value="CANTEEN_MANAGER">Quản Lý Căng Tin</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Căng tin làm việc</label>
                <select
                  value={newUser.canteenName}
                  onChange={(e) => setNewUser({ ...newUser, canteenName: e.target.value })}
                  aria-label="Chọn chi nhánh căng tin"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="Căng tin Tòa G (Hà Đông)">Căng tin Tòa G (Hà Đông)</option>
                  <option value="Căng tin Tòa A-B DNU">Căng tin Tòa A-B DNU</option>
                  <option value="DNU Garden Coffee">DNU Garden Coffee</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="0988xxxxxx"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="an.nguyen@dainam.edu.vn"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" variant="default" className="w-full font-bold">
                Hoàn Tất & Cấp Tài Khoản
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
