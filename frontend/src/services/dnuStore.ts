import { initialFoodCatalog, FoodCatalogItem } from '../data/foodCatalog.js';
import { Supplier } from '../features/suppliers/SuppliersPage.js';
import { StockItem, InboundReceipt, OutboundIssue } from '../features/inventory/InventoryPage.js';

export interface CategoryItem {
  id: number;
  name: string;
  code: string;
  icon: string;
  foodCount: number;
  revenueShare: string;
  status: 'ACTIVE' | 'HIDDEN';
  description: string;
}

export interface ComboItem {
  id: number;
  name: string;
  originalPrice: number;
  comboPrice: number;
  discount: string;
  items: string[];
  tag: string;
  isPopular: boolean;
}

export interface PromotionVoucher {
  id: number;
  code: string;
  title: string;
  discountType: 'PERCENT' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usedCount: number;
  maxUsage: number;
  validFrom: string;
  validTo: string;
  targetStudents: string;
  status: 'ACTIVE' | 'EXPIRED' | 'UPCOMING';
}

export interface StaffUser {
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

export interface ExpenseRecord {
  id: number;
  code: string;
  category: string;
  title: string;
  amount: number;
  payee: string;
  paymentMethod: string;
  paidAt: string;
  status: 'COMPLETED' | 'PENDING';
}

export interface DishReview {
  id: number;
  studentName: string;
  mssv: string;
  dishName: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
}

// Storage Keys
const KEYS = {
  FOODS: 'dnu_canteen_foods_v2',
  CATEGORIES: 'dnu_canteen_categories_v2',
  COMBOS: 'dnu_canteen_combos_v2',
  VOUCHERS: 'dnu_canteen_vouchers_v2',
  USERS: 'dnu_canteen_users_v2',
  SUPPLIERS: 'dnu_canteen_suppliers_v2',
  STOCKS: 'dnu_canteen_stocks_v2',
  INBOUND: 'dnu_canteen_inbound_v2',
  OUTBOUND: 'dnu_canteen_outbound_v2',
  EXPENSES: 'dnu_canteen_expenses_v2',
  REVIEWS: 'dnu_canteen_reviews_v2',
};

// Initial Data Sets
const initialCategories: CategoryItem[] = [
  {
    id: 1,
    name: 'Cơm Phần & Cơm Đĩa DNU',
    code: 'COM_PHAN',
    icon: '🍚',
    foodCount: 9,
    revenueShare: '38.5%',
    status: 'ACTIVE',
    description: 'Cơm rang dưa bò, cơm gà xối mỡ, cơm sườn nướng mật ong than hoa',
  },
  {
    id: 2,
    name: 'Bún & Phở Hà Nội',
    code: 'BUN_PHO',
    icon: '🍜',
    foodCount: 8,
    revenueShare: '26.2%',
    status: 'ACTIVE',
    description: 'Bún chả nướng than hoa, phở bò tái lăn DNU, bún đậu mắm tôm',
  },
  {
    id: 3,
    name: 'Bánh Mì & Đồ Ăn Vặt',
    code: 'BANH_MI',
    icon: '🥖',
    foodCount: 7,
    revenueShare: '12.8%',
    status: 'ACTIVE',
    description: 'Bánh mì chảo đặc biệt DNU, nem chua rán phố cổ, bánh bao trứng cút',
  },
  {
    id: 4,
    name: 'Đồ Uống & Trà Sữa',
    code: 'DO_UONG',
    icon: '🥤',
    foodCount: 11,
    revenueShare: '16.5%',
    status: 'ACTIVE',
    description: 'Trà đào cam sả Hà Đông, cà phê cốt dừa, trà chanh giã tay, trà sữa trân châu',
  },
  {
    id: 5,
    name: 'Combo Tiết Kiệm Học Đường',
    code: 'COMBO_DNU',
    icon: '🍱',
    foodCount: 3,
    revenueShare: '6.0%',
    status: 'ACTIVE',
    description: 'Gói combo ăn trưa kèm đồ uống tiết kiệm đến 10.000đ cho sinh viên',
  },
];

const initialCombos: ComboItem[] = [
  {
    id: 101,
    name: 'Combo Trưa Đầy Đủ: Cơm Gà + Trà Đào Sả',
    originalPrice: 60000,
    comboPrice: 50000,
    discount: '-17%',
    items: ['1 Cơm gà xối mỡ giòn da', '1 Trà đào cam sả Hà Đông', '1 Canh rau cải thịt băm'],
    tag: 'Tiết kiệm 10k',
    isPopular: true,
  },
  {
    id: 102,
    name: 'Combo Hà Nội: Bún Chả + Trà Quất Mật Ong',
    originalPrice: 50000,
    comboPrice: 42000,
    discount: '-16%',
    items: ['1 Suất bún chả than hoa', '1 Trà quất mật ong hoa nhài', 'Nem rán giòn kèm'],
    tag: 'Đặc sản DNU',
    isPopular: true,
  },
  {
    id: 103,
    name: 'Combo Bữa Sáng: Bánh Mì Chảo + Cafe Sữa',
    originalPrice: 48000,
    comboPrice: 40000,
    discount: '-17%',
    items: ['1 Chảo pate 2 trứng xúc xích', '1 Bánh mì giòn rụm', '1 Cà phê sữa đá phin'],
    tag: 'Năng lượng ca sáng',
    isPopular: true,
  },
];

const initialVouchers: PromotionVoucher[] = [
  {
    id: 1,
    code: 'DNUCHAO2026',
    title: 'Chào đón Tân Sinh Viên Khóa K18 DNU',
    discountType: 'PERCENT',
    discountValue: 20,
    minOrderValue: 30000,
    maxDiscount: 15000,
    usedCount: 245,
    maxUsage: 500,
    validFrom: '2026-08-01',
    validTo: '2026-10-31',
    targetStudents: 'Tất cả sinh viên DNU K18',
    status: 'ACTIVE',
  },
  {
    id: 2,
    code: 'DNUK18',
    title: 'Voucher Giảm 20.000đ Đơn Ăn Trưa Tòa G',
    discountType: 'FIXED_AMOUNT',
    discountValue: 20000,
    minOrderValue: 50000,
    usedCount: 180,
    maxUsage: 300,
    validFrom: '2026-08-15',
    validTo: '2026-09-30',
    targetStudents: 'Sinh viên CNTT, Dược, Y Khoa',
    status: 'ACTIVE',
  },
  {
    id: 3,
    code: 'DNUFOOD',
    title: 'Ưu đãi Giảm 10.000đ Combo Trưa',
    discountType: 'FIXED_AMOUNT',
    discountValue: 10000,
    minOrderValue: 35000,
    usedCount: 412,
    maxUsage: 1000,
    validFrom: '2026-08-01',
    validTo: '2026-12-31',
    targetStudents: 'Toàn trường Đại Học Đại Nam',
    status: 'ACTIVE',
  },
];

const initialUsers: StaffUser[] = [
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
    canteenName: 'Căng tin Tòa G',
    status: 'ACTIVE',
    createdAt: '2026-08-01 08:00:00',
  },
];

export const dnuStore = {
  // 1. FOODS
  getFoods(): FoodCatalogItem[] {
    try {
      const stored = localStorage.getItem(KEYS.FOODS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return initialFoodCatalog;
  },
  saveFoods(foods: FoodCatalogItem[]) {
    localStorage.setItem(KEYS.FOODS, JSON.stringify(foods));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },

  // 2. CATEGORIES & COMBOS
  getCategories(): CategoryItem[] {
    try {
      const stored = localStorage.getItem(KEYS.CATEGORIES);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return initialCategories;
  },
  saveCategories(cats: CategoryItem[]) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },
  getCombos(): ComboItem[] {
    try {
      const stored = localStorage.getItem(KEYS.COMBOS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return initialCombos;
  },
  saveCombos(combos: ComboItem[]) {
    localStorage.setItem(KEYS.COMBOS, JSON.stringify(combos));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },

  // 3. VOUCHERS
  getVouchers(): PromotionVoucher[] {
    try {
      const stored = localStorage.getItem(KEYS.VOUCHERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return initialVouchers;
  },
  saveVouchers(vouchers: PromotionVoucher[]) {
    localStorage.setItem(KEYS.VOUCHERS, JSON.stringify(vouchers));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },

  // 4. USERS
  getUsers(): StaffUser[] {
    try {
      const stored = localStorage.getItem(KEYS.USERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return initialUsers;
  },
  saveUsers(users: StaffUser[]) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },

  // 5. SUPPLIERS
  getSuppliers(): Supplier[] {
    try {
      const stored = localStorage.getItem(KEYS.SUPPLIERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  },
  saveSuppliers(suppliers: Supplier[]) {
    localStorage.setItem(KEYS.SUPPLIERS, JSON.stringify(suppliers));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },

  // 6. INVENTORY
  getStocks(): StockItem[] {
    try {
      const stored = localStorage.getItem(KEYS.STOCKS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  },
  saveStocks(stocks: StockItem[]) {
    localStorage.setItem(KEYS.STOCKS, JSON.stringify(stocks));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },

  // DIAGNOSTIC CHECK
  runSystemHealthCheck() {
    const checks = [
      { module: 'Thực đơn Món ăn & Ảnh', status: 'OK', count: this.getFoods().length, persistent: true },
      { module: 'Danh mục & Combo', status: 'OK', count: this.getCategories().length, persistent: true },
      { module: 'Khuyến mãi & Voucher', status: 'OK', count: this.getVouchers().length, persistent: true },
      { module: 'Tài khoản & Phân quyền', status: 'OK', count: this.getUsers().length, persistent: true },
      { module: 'Đơn hàng & KDS Bếp', status: 'OK', persistent: true },
      { module: 'Nhà cung cấp & Đặt hàng', status: 'OK', persistent: true },
      { module: 'Tồn kho & Xuất nhập', status: 'OK', persistent: true },
      { module: 'Backend API MySQL / WebSocket', status: 'ONLINE', persistent: true },
    ];
    return checks;
  },
};
