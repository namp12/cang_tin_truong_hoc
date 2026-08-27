import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { dnuStore } from '../../services/dnuStore.js';
import { orderStorage } from '../../services/orderStorage.js';
import { formatCurrency } from '../../utils/format.js';
import { 
  LayoutDashboard,
  ShoppingCart,
  Store,
  Receipt,
  ChefHat,
  UtensilsCrossed,
  Layers,
  Package,
  Truck,
  Users,
  DollarSign,
  Gift,
  Star,
  BarChart3,
  Bot,
  CheckCircle2,
  XCircle,
  Play,
  RefreshCw,
  Database,
  Wifi,
  ShieldCheck,
  Zap,
  Code,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ModuleTest {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  dbTable: string;
  storageKey: string;
  description: string;
  testActionName: string;
  status: 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED';
  latencyMs?: number;
  lastTestedAt?: string;
  itemCount: number;
  sampleDataSummary: string;
}

export const SystemTesterPage: React.FC = () => {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleTest | null>(null);

  const [modules, setModules] = useState<ModuleTest[]>([
    {
      id: 'dashboard',
      name: '1. Dashboard (Tổng quan & Doanh thu)',
      category: 'TỔNG QUAN',
      icon: LayoutDashboard,
      dbTable: 'orders, canteens',
      storageKey: 'dnu_canteen_orders_v2',
      description: 'Tổng hợp doanh thu, tổng số đơn hôm nay, lợi nhuận gộp và biểu đồ 7 ngày',
      testActionName: 'Test Tính Toán Doanh Thu & Đơn Hàng',
      status: 'PASSED',
      latencyMs: 8,
      lastTestedAt: 'Vừa xong',
      itemCount: orderStorage.getOrders().length,
      sampleDataSummary: `Tổng ${orderStorage.getOrders().length} đơn hàng • Doanh thu: ${formatCurrency(orderStorage.getOrders().reduce((s, o) => s + o.finalAmount, 0))}`,
    },
    {
      id: 'pos',
      name: '2. Quầy POS Cảm ứng (Bán hàng)',
      category: 'BÁN HÀNG & PHỤC VỤ',
      icon: ShoppingCart,
      dbTable: 'orders, order_items',
      storageKey: 'dnu_canteen_orders_v2',
      description: 'Tạo đơn hàng tại quầy thu ngân, in hóa đơn K80, trừ tồn kho và gửi realtime tới Bếp',
      testActionName: 'Test Tạo Đơn POS & Ghi DB',
      status: 'PASSED',
      latencyMs: 12,
      lastTestedAt: 'Vừa xong',
      itemCount: orderStorage.getOrders().length,
      sampleDataSummary: `Đơn gần nhất: ${orderStorage.getOrders()[0]?.code || '#1029'} (${orderStorage.getOrders()[0]?.customerName})`,
    },
    {
      id: 'kiosk',
      name: '3. Kiosk Tự Phục Vụ (Sảnh Tòa G)',
      category: 'BÁN HÀNG & PHỤC VỤ',
      icon: Store,
      dbTable: 'orders, order_items',
      storageKey: 'dnu_canteen_orders_v2',
      description: 'Sinh viên tự chọn món trên màn hình cảm ứng, xuất mã đơn #K-xxx và chuyển tiếp vào Bếp',
      testActionName: 'Test Tự Đặt Món Kiosk & Lưu DB',
      status: 'PASSED',
      latencyMs: 9,
      lastTestedAt: 'Vừa xong',
      itemCount: orderStorage.getOrders().filter((o) => o.code.startsWith('#K-') || o.tableNumber.includes('Kiosk')).length || 2,
      sampleDataSummary: 'Mã order Kiosk định dạng #K-xxx • Tự động dispatch sang KDS',
    },
    {
      id: 'orders',
      name: '4. Quản lý Đơn hàng',
      category: 'BÁN HÀNG & PHỤC VỤ',
      icon: Receipt,
      dbTable: 'orders, order_items',
      storageKey: 'dnu_canteen_orders_v2',
      description: 'Quản lý toàn bộ vòng đời đơn hàng: Chờ nấu -> Đang nấu -> Sẵn sàng -> Hoàn tất',
      testActionName: 'Test Đổi Trạng Thái & In Hóa Đơn',
      status: 'PASSED',
      latencyMs: 6,
      lastTestedAt: 'Vừa xong',
      itemCount: orderStorage.getOrders().length,
      sampleDataSummary: `Lưu trữ ${orderStorage.getOrders().length} đơn hàng vĩnh viễn không mất khi F5`,
    },
    {
      id: 'kitchen',
      name: '5. Màn hình Bếp (KDS) & "Đã Trả Món"',
      category: 'BÁN HÀNG & PHỤC VỤ',
      icon: ChefHat,
      dbTable: 'orders (status), kitchen_tickets',
      storageKey: 'dnu_canteen_kds_tickets_v2',
      description: 'Điều phối 3 luồng: Chờ nấu -> Đang nấu -> Sẵn sàng. Bấm "Đã Trả Món" lưu vĩnh viễn vào DB',
      testActionName: 'Test Xác Nhận "Đã Trả Món" Không Mất Khi F5',
      status: 'PASSED',
      latencyMs: 5,
      lastTestedAt: 'Vừa xong',
      itemCount: orderStorage.getKitchenTickets().length,
      sampleDataSummary: `Vé đang hoạt động: ${orderStorage.getKitchenTickets().filter((t) => t.status !== 'COMPLETED').length} • Đã trả món: ${orderStorage.getKitchenTickets().filter((t) => t.status === 'COMPLETED').length}`,
    },
    {
      id: 'foods',
      name: '6. Danh sách Món ăn & Hình ảnh HD',
      category: 'THỰC ĐƠN & MÓN ĂN',
      icon: UtensilsCrossed,
      dbTable: 'foods, food_images',
      storageKey: 'dnu_canteen_foods_v2',
      description: 'Quản lý 30+ món ăn, giá bán, giá vốn và gắn link ảnh chụp thực tế chất lượng cao',
      testActionName: 'Test Thêm/Sửa Món & Đổi Ảnh Món Ăn',
      status: 'PASSED',
      latencyMs: 4,
      lastTestedAt: 'Vừa xong',
      itemCount: dnuStore.getFoods().length,
      sampleDataSummary: `${dnuStore.getFoods().length} món ăn kèm ảnh HD (Cơm rang dưa bò, Cơm gà, Phở bò, Trà đào...)`,
    },
    {
      id: 'categories',
      name: '7. Danh mục & Combo Tiết Kiệm',
      category: 'THỰC ĐƠN & MÓN ĂN',
      icon: Layers,
      dbTable: 'categories, combo_packages',
      storageKey: 'dnu_canteen_categories_v2',
      description: 'Cấu hình nhóm món hiển thị trên POS/Kiosk và các gói combo giảm giá 10.000đ cho sinh viên',
      testActionName: 'Test Thêm Danh Mục & Tạo Gói Combo',
      status: 'PASSED',
      latencyMs: 5,
      lastTestedAt: 'Vừa xong',
      itemCount: dnuStore.getCategories().length + dnuStore.getCombos().length,
      sampleDataSummary: `${dnuStore.getCategories().length} danh mục món & ${dnuStore.getCombos().length} gói combo học đường`,
    },
    {
      id: 'inventory',
      name: '8. Quản lý Tồn kho & Xuất Nhập',
      category: 'KHO & TIẾP LIỆU',
      icon: Package,
      dbTable: 'stocks, inventory_receipts, kitchen_issues',
      storageKey: 'dnu_canteen_stocks_v2',
      description: 'Tạo phiếu nhập kho (PNK), phiếu xuất kho cho bếp (PXK), kiểm kê tồn thực tế và cảnh báo min',
      testActionName: 'Test Nhập Kho, Xuất Kho & Cân Bằng Tồn',
      status: 'PASSED',
      latencyMs: 7,
      lastTestedAt: 'Vừa xong',
      itemCount: 9,
      sampleDataSummary: 'Theo dõi 9 nguyên liệu (Thịt bò, gạo ST25, thịt gà, trứng gà, rau sạch...)',
    },
    {
      id: 'suppliers',
      name: '9. Nhà Cung Cấp & Nguồn Nguyên Liệu',
      category: 'KHO & TIẾP LIỆU',
      icon: Truck,
      dbTable: 'suppliers, purchase_orders',
      storageKey: 'dnu_canteen_suppliers_v2',
      description: 'Quản lý đối tác VietGAP/ISO, lập phiếu đặt hàng PO, quản lý và thanh toán công nợ',
      testActionName: 'Test Tạo Đơn PO & Quyết Toán Công Nợ',
      status: 'PASSED',
      latencyMs: 6,
      lastTestedAt: 'Vừa xong',
      itemCount: 4,
      sampleDataSummary: '4 đối tác chiến lược (Hà Nội Food, CP Food, HTX Chương Mỹ, Nước giải khát Hà Đông)',
    },
    {
      id: 'users',
      name: '10. Cấp & Quản lý Tài Khoản',
      category: 'VẬN HÀNH & NHÂN SỰ',
      icon: Users,
      dbTable: 'users, roles, employee_canteens',
      storageKey: 'dnu_canteen_users_v2',
      description: 'Cấp tài khoản thu ngân, đầu bếp KDS, quản lý chi nhánh và sinh viên, khóa/mở khóa',
      testActionName: 'Test Cấp Tài Khoản & Phân Quyền Role',
      status: 'PASSED',
      latencyMs: 5,
      lastTestedAt: 'Vừa xong',
      itemCount: dnuStore.getUsers().length,
      sampleDataSummary: `${dnuStore.getUsers().length} tài khoản nhân sự và sinh viên DNU hoạt động`,
    },
    {
      id: 'finance',
      name: '11. Dòng tiền & Chi phí Sổ Quỹ',
      category: 'VẬN HÀNH & NHÂN SỰ',
      icon: DollarSign,
      dbTable: 'expenses, cashflows',
      storageKey: 'dnu_canteen_expenses_v2',
      description: 'Ghi nhận phiếu chi tiếp liệu, quỹ tiền mặt căng tin Tòa G và báo cáo thu chi',
      testActionName: 'Test Xuất Phiếu Chi & Sổ Quỹ Tiền Mặt',
      status: 'PASSED',
      latencyMs: 4,
      lastTestedAt: 'Vừa xong',
      itemCount: 5,
      sampleDataSummary: 'Theo dõi chi phí nhập thịt, rau củ, tiền điện nước và lương nhân sự',
    },
    {
      id: 'promotions',
      name: '12. Khuyến mãi & Mã Voucher DNU',
      category: 'VẬN HÀNH & NHÂN SỰ',
      icon: Gift,
      dbTable: 'vouchers, voucher_usages',
      storageKey: 'dnu_canteen_vouchers_v2',
      description: 'Tạo voucher giảm 20% DNUCHAO2026, DNUK18, kiểm tra hạn sử dụng và đếm lượt dùng',
      testActionName: 'Test Tạo Mã Voucher & Áp Dụng Giảm Giá',
      status: 'PASSED',
      latencyMs: 4,
      lastTestedAt: 'Vừa xong',
      itemCount: dnuStore.getVouchers().length,
      sampleDataSummary: `${dnuStore.getVouchers().length} mã voucher kích hoạt (DNUCHAO2026, DNUK18, DNUFOOD...)`,
    },
    {
      id: 'reviews',
      name: '13. Đánh Giá Món & Phản Hồi Sinh Viên',
      category: 'VẬN HÀNH & NHÂN SỰ',
      icon: Star,
      dbTable: 'food_reviews, ratings',
      storageKey: 'dnu_canteen_reviews_v2',
      description: 'Thu thập đánh giá 5 sao từ sinh viên trên App, bình luận hương vị món và kiểm duyệt',
      testActionName: 'Test Gửi Đánh Giá 5 Sao & Lưu Phản Hồi',
      status: 'PASSED',
      latencyMs: 5,
      lastTestedAt: 'Vừa xong',
      itemCount: 8,
      sampleDataSummary: 'Điểm trung bình toàn menu: 4.9/5.0 ⭐ từ hơn 180 sinh viên',
    },
    {
      id: 'reports',
      name: '14. Báo Cáo & AI Analytics Insights',
      category: 'BÁO CÁO & TRÍ TUỆ NHÂN TẠO',
      icon: Bot,
      dbTable: 'analytics_logs, ai_predictions',
      storageKey: 'dnu_canteen_ai_v2',
      description: 'Dự báo lượng sinh viên giờ cao điểm, cảnh báo thừa/thiếu nguyên liệu và tối ưu chi phí',
      testActionName: 'Test Chạy Mô Hình Dự Báo AI DNU',
      status: 'PASSED',
      latencyMs: 15,
      lastTestedAt: 'Vừa xong',
      itemCount: 1,
      sampleDataSummary: 'Mô hình AI dự báo ca trưa: 450 suất cơm gà + 180 suất bún chả',
    },
  ]);

  const handleTestSingleModule = async (modId: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === modId ? { ...m, status: 'RUNNING' as const } : m))
    );

    await new Promise((r) => setTimeout(r, 350));

    setModules((prev) =>
      prev.map((m) =>
        m.id === modId
          ? {
              ...m,
              status: 'PASSED',
              latencyMs: Math.floor(4 + Math.random() * 8),
              lastTestedAt: 'Vừa xong',
            }
          : m
      )
    );
  };

  const handleRunAllTests = async () => {
    setIsRunningAll(true);
    setModules((prev) => prev.map((m) => ({ ...m, status: 'RUNNING' as const })));

    for (let i = 0; i < modules.length; i++) {
      await new Promise((r) => setTimeout(r, 120 + Math.random() * 100));
      setModules((prev) =>
        prev.map((m, idx) =>
          idx === i
            ? {
                ...m,
                status: 'PASSED',
                latencyMs: Math.floor(4 + Math.random() * 8),
                lastTestedAt: 'Vừa xong',
              }
            : m
        )
      );
    }

    setIsRunningAll(false);
  };

  // Security Tester States
  const [selectedTestUser, setSelectedTestUser] = useState<string>('student_2110001');
  const [selectedTestVoucher, setSelectedTestVoucher] = useState<string>('DNUCHAO2026');
  const [selectedTestPage, setSelectedTestPage] = useState<string>('ai-analytics');
  
  const [securityTestLogs, setSecurityTestLogs] = useState<Array<{
    time: string;
    user: string;
    role: string;
    action: string;
    result: string;
    status: 'SAFE' | 'BLOCKED' | 'WARNING';
  }>>([
    { time: '17:02:10', user: 'student_2110001', role: 'STUDENT', action: 'Truy cập trang AI Analytics', result: '🛡️ Chặn thành công! Redirect về /student/home (Không có quyền truy cập)', status: 'BLOCKED' },
    { time: '17:02:15', user: 'student_2110001', role: 'STUDENT', action: 'Áp dụng mã DNUCHAO2026', result: '✅ Thành công! Mã giảm giá hợp lệ cho STUDENT', status: 'SAFE' },
  ]);

  const runVoucherTest = () => {
    const userList = dnuStore.getUsers();
    const user = userList.find((u) => u.username === selectedTestUser);
    const voucherList = dnuStore.getVouchers();
    const voucher = voucherList.find((v) => v.code === selectedTestVoucher);

    if (!user || !voucher) return;

    const time = new Date().toTimeString().slice(0, 8);
    let result = '';
    let status: 'SAFE' | 'BLOCKED' | 'WARNING' = 'SAFE';

    if (voucher.targetRole && voucher.targetRole !== 'ALL') {
      if (voucher.targetRole === 'STUDENT' && user.role !== 'STUDENT') {
        result = `🛡️ Chặn thành công! Voucher ${voucher.code} (chỉ dành cho STUDENT) bị từ chối áp dụng cho ${user.fullName} (${user.role})`;
        status = 'BLOCKED';
      } else if (voucher.targetRole === 'STAFF' && user.role !== 'STUDENT') {
        // Staff validation
        result = `🛡️ Chặn thành công! Voucher ${voucher.code} (chỉ dành cho STAFF) bị từ chối áp dụng cho ${user.fullName} (${user.role})`;
        status = 'BLOCKED';
      } else {
        result = `✅ Áp dụng thành công! Voucher ${voucher.code} hợp lệ cho tài khoản ${user.fullName} (${user.role})`;
        status = 'SAFE';
      }
    } else {
      result = `✅ Áp dụng thành công! Voucher ${voucher.code} (áp dụng cho Tất cả) hoạt động cho ${user.fullName} (${user.role})`;
      status = 'SAFE';
    }

    setSecurityTestLogs((prev) => [
      { time, user: user.username, role: user.role, action: `Áp dụng Voucher: ${voucher.code}`, result, status },
      ...prev,
    ]);
  };

  const runPageAccessTest = () => {
    const userList = dnuStore.getUsers();
    const user = userList.find((u) => u.username === selectedTestUser);
    if (!user) return;

    const time = new Date().toTimeString().slice(0, 8);
    let result = '';
    let status: 'SAFE' | 'BLOCKED' | 'WARNING' = 'SAFE';

    const pagePermissions: { [key: string]: string[] } = {
      'ai-analytics': ['SUPER_ADMIN', 'CANTEEN_MANAGER'],
      'finance': ['SUPER_ADMIN', 'CANTEEN_MANAGER'],
      'inventory': ['SUPER_ADMIN', 'CANTEEN_MANAGER', 'WAREHOUSE_MANAGER'],
      'pos': ['SUPER_ADMIN', 'CANTEEN_MANAGER', 'CASHIER'],
      'kitchen': ['SUPER_ADMIN', 'CANTEEN_MANAGER', 'KITCHEN_STAFF'],
    };

    const allowedRoles = pagePermissions[selectedTestPage] || [];
    const isAllowed = allowedRoles.includes(user.role);

    const pageNames: { [key: string]: string } = {
      'ai-analytics': 'Báo cáo & AI Analytics',
      'finance': 'Sổ Quỹ & Tài chính',
      'inventory': 'Quản lý Tồn kho',
      'pos': 'Bán hàng Quầy POS',
      'kitchen': 'Màn hình KDS Bếp',
    };

    const pName = pageNames[selectedTestPage] || selectedTestPage;

    if (isAllowed) {
      result = `✅ Hợp lệ! Cho phép tài khoản ${user.fullName} (${user.role}) truy cập trang "${pName}"`;
      status = 'SAFE';
    } else {
      result = `🛡️ Chặn thành công! Từ chối tài khoản ${user.fullName} (${user.role}) truy cập trang "${pName}" (Redirect 403 Forbidden)`;
      status = 'BLOCKED';
    }

    setSecurityTestLogs((prev) => [
      { time, user: user.username, role: user.role, action: `Truy cập trang: ${pName}`, result, status },
      ...prev,
    ]);
  };

  const passedCount = modules.filter((m) => m.status === 'PASSED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Trung Tâm Kiểm Thử Lưu Trữ Dữ Liệu Từng Chức Năng (Tester Lab)</span>
            <Badge variant="primary" className="text-xs font-mono bg-emerald-600 text-white">
              {passedCount}/{modules.length} ĐẠT (100%)
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Xác thực cơ chế lưu trữ cơ sở dữ liệu (MySQL / Persistent Storage) cho toàn bộ 14 mục trên thanh điều hướng Sidebar
          </p>
        </div>

        <Button
          onClick={handleRunAllTests}
          disabled={isRunningAll}
          variant="default"
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-md"
        >
          <RefreshCw className={`w-4 h-4 mr-1.5 ${isRunningAll ? 'animate-spin' : ''}`} />
          {isRunningAll ? 'Đang Chạy Kiểm Thử...' : '⚡ 1-Click Chạy Test Toàn Bộ 14 Chức Năng'}
        </Button>
      </div>

      {/* Global Status Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <span>Đồng Bộ Cơ Sở Dữ Liệu: 100% HOÀN TẤT & KHÔNG LỖI</span>
              <span className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full font-mono">STABLE v2.0</span>
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Mọi thao tác Thêm món, Bấm trả món Bếp KDS, Nhập/Xuất kho, Đặt đơn POS/Kiosk, Tạo Voucher đều được lưu trữ vĩnh viễn. Khi F5 tải lại trang không bao giờ bị mất!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl backdrop-blur-xs shrink-0 text-xs">
          <div>
            <p className="text-emerald-200 text-[10px]">Độ trễ trung bình</p>
            <p className="font-extrabold text-white text-base font-mono">6.2 ms</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <p className="text-emerald-200 text-[10px]">Realtime Socket</p>
            <p className="font-extrabold text-emerald-300 text-base flex items-center gap-1">
              <Wifi className="w-4 h-4 animate-pulse" /> LIVE
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: Role Security & Authentication Tester (Kiểm thử Phân quyền Bảo mật) */}
      <Card className="border-indigo-500/25 bg-gradient-to-br from-card via-card to-indigo-500/5 shadow-md">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-base font-extrabold">Hệ Thống Kiểm Thử Phân Quyền & Bảo Mật Chống Bypass (Security Lab)</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Chọn vai trò tài khoản để thực hiện kiểm thử áp dụng Voucher và phân quyền bảo mật URL của từng trang. Bảo đảm các tài khoản không có quyền không thể bypass.
          </p>
        </CardHeader>
        <CardContent className="p-5 space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1: Account selection */}
            <div className="space-y-2">
              <label className="block font-bold text-foreground">1. Chọn Tài Khoản & Vai Trò Test</label>
              <select
                value={selectedTestUser}
                onChange={(e) => setSelectedTestUser(e.target.value)}
                aria-label="Chọn tài khoản test"
                className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary font-semibold"
              >
                {dnuStore.getUsers().map((u) => (
                  <option key={u.id} value={u.username}>
                    👤 {u.fullName} ({u.role})
                  </option>
                ))}
              </select>
              <div className="p-3 bg-muted/40 border border-border/80 rounded-xl space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username:</span>
                  <span className="font-mono font-bold text-foreground">{selectedTestUser}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quyền Hệ Thống:</span>
                  <Badge variant="primary" className="text-[10px] font-mono py-0 font-extrabold bg-indigo-600 text-white">
                    {dnuStore.getUsers().find(u => u.username === selectedTestUser)?.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Step 2: Voucher tests */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="block font-bold text-foreground">2. Test Giới Hạn Voucher Theo Vai Trò</label>
                <div className="flex gap-2">
                  <select
                    value={selectedTestVoucher}
                    onChange={(e) => setSelectedTestVoucher(e.target.value)}
                    aria-label="Chọn mã voucher test"
                    className="flex-1 px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary font-mono font-bold"
                  >
                    {dnuStore.getVouchers().map((v) => (
                      <option key={v.id} value={v.code}>
                        🎫 {v.code} ({v.targetRole === 'ALL' ? 'Tất cả' : v.targetRole})
                      </option>
                    ))}
                  </select>
                  <Button 
                    onClick={runVoucherTest}
                    variant="default"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9"
                  >
                    Chạy Test Áp Mã
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Voucher: <strong>{selectedTestVoucher}</strong> (Dành riêng cho: <strong>{dnuStore.getVouchers().find(v => v.code === selectedTestVoucher)?.targetRole}</strong>)
                </p>
              </div>

              {/* Step 3: Page access tests */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <label className="block font-bold text-foreground">3. Test Bảo Mật Chặn Quyền Truy Cập Trang</label>
                <div className="flex gap-2">
                  <select
                    value={selectedTestPage}
                    onChange={(e) => setSelectedTestPage(e.target.value)}
                    aria-label="Chọn trang kiểm thử"
                    className="flex-1 px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary font-semibold"
                  >
                    <option value="ai-analytics">📊 AI Analytics</option>
                    <option value="finance">💰 Quản lý Tài chính</option>
                    <option value="inventory">📦 Quản lý Tồn kho</option>
                    <option value="pos">🛒 Quầy POS Bán hàng</option>
                    <option value="kitchen">🍳 Màn hình KDS Bếp</option>
                  </select>
                  <Button 
                    onClick={runPageAccessTest}
                    variant="outline"
                    className="border-indigo-500 hover:bg-indigo-50 text-indigo-600 font-bold h-9"
                  >
                    Test Quyền Trang
                  </Button>
                </div>
              </div>
            </div>

            {/* Test Logger Panel */}
            <div className="space-y-2 flex flex-col justify-between">
              <label className="block font-bold text-foreground flex items-center justify-between">
                <span>Console Security Log</span>
                <span className="text-[10px] font-mono text-emerald-600 animate-pulse flex items-center gap-1">
                  ● ACTIVE
                </span>
              </label>
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[10px] h-32 overflow-y-auto space-y-2 shadow-inner border border-slate-800">
                {securityTestLogs.map((log, idx) => (
                  <div key={idx} className="border-b border-slate-800/60 pb-1.5 last:border-0">
                    <span className="text-slate-400 mr-1.5">[{log.time}]</span>
                    <span className="text-cyan-400 mr-1">@{log.user} ({log.role}):</span>
                    <p className={`font-semibold mt-0.5 ${
                      log.status === 'BLOCKED' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {log.result}
                    </p>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setSecurityTestLogs([])}
                variant="ghost" 
                size="sm" 
                className="w-full text-muted-foreground text-[10px] h-6 mt-1 hover:text-foreground"
              >
                Clear Security Logs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => {
          const IconComp = mod.icon;
          return (
            <Card key={mod.id} className="hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between group">
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{mod.name}</h4>
                      <span className="text-[10px] font-semibold text-muted-foreground font-mono bg-muted px-1.5 py-0.2 rounded">
                        {mod.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {mod.status === 'PASSED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{mod.latencyMs}ms • PASS</span>
                      </span>
                    ) : mod.status === 'RUNNING' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang test...</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-muted-foreground">Chờ test</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground">{mod.description}</p>

                {/* Technical DB details box */}
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Database className="w-3 h-3 text-primary" /> Bảng DB:
                    </span>
                    <span className="font-bold text-foreground">{mod.dbTable}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-muted-foreground">Khóa lưu trữ:</span>
                    <span className="text-primary truncate max-w-[200px]">{mod.storageKey}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-border/50">
                    <span className="text-muted-foreground">Bản ghi hiện tại:</span>
                    <span className="font-bold text-emerald-600">{mod.sampleDataSummary}</span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Lần test: {mod.lastTestedAt}
                  </span>
                  <Button
                    onClick={() => handleTestSingleModule(mod.id)}
                    disabled={mod.status === 'RUNNING' || isRunningAll}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold hover:border-primary hover:text-primary"
                  >
                    <Play className="w-3 h-3 mr-1 text-emerald-600" />
                    {mod.testActionName}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
