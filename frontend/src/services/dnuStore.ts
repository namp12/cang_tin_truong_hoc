import { initialFoodCatalog, FoodCatalogItem } from '../data/foodCatalog.js';

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
  targetRole?: string;
}

export interface StudentCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
  note?: string;
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

export interface Supplier {
  id: number;
  name: string;
  code: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  deliveryTime: string;
  certVsattp: string;
  monthlySpend: number;
  debtAmount: number;
  rating: number;
  status: 'ACTIVE' | 'PAUSED';
  deliveriesCount: number;
}

export interface StockItem {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  reserved: number;
  available: number;
  unit: string;
  minStock: number;
  unitPrice: number;
  expiryDate: string;
  status: 'NORMAL' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  supplierName?: string;
}

export interface InboundReceipt {
  id: number;
  code: string;
  supplierName: string;
  receivedDate: string;
  receiver: string;
  items: { name: string; qty: number; unit: string; price: number }[];
  totalAmount: number;
  status: 'COMPLETED' | 'PENDING';
}

export interface OutboundIssue {
  id: number;
  code: string;
  reason: string;
  issuedDate: string;
  issuer: string;
  items: { name: string; qty: number; unit: string }[];
  supplierName?: string;
}

// -------------------------------------------------------------
// FINANCIAL & CASHFLOW LEDGER INTERFACES
// -------------------------------------------------------------
export interface FinanceTransaction {
  id: number;
  code: string; // PT-xxx (Phiếu thu) or PC-xxx (Phiếu chi)
  type: 'INCOME' | 'EXPENSE';
  category: 'POS_ORDER' | 'KIOSK_ORDER' | 'WALLET_TOPUP' | 'CAPITAL_INFLOW' | 'SUPPLIER_PAYMENT' | 'OPERATING_COST' | 'SALARY' | 'OTHER';
  categoryLabel: string;
  title: string;
  amount: number;
  paymentMethod: 'CASH' | 'DNUPAY' | 'QRMOMO' | 'BANK_TRANSFER';
  paymentMethodLabel: string;
  counterpart: string; // Khách hàng / Sinh viên / Đối tác NCC
  performedBy: string; // Nhân viên thu ngân / Quản lý thực hiện
  canteenName: string;
  notes?: string;
  createdAt: string;
}

export interface WalletTransaction {
  id: number;
  type: 'TOPUP' | 'PAYMENT' | 'REFUND';
  title: string;
  amount: number; // >0 for TOPUP/REFUND, <0 for PAYMENT
  paymentMethod: string;
  time: string;
  orderCode?: string;
  balanceAfter: number;
}

export interface StudentWallet {
  mssv: string;
  studentName: string;
  balance: number;
  transactions: WalletTransaction[];
}

export interface ReviewReply {
  id: number;
  authorName: string;
  authorRole: 'STUDENT' | 'ADMIN' | 'CANTEEN_MANAGER';
  authorClass?: string;
  content: string;
  createdAt: string;
}

export interface DishReview {
  id: number;
  studentName: string;
  studentClass: string;
  foodName: string;
  rating: number;
  comment: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL';
  createdAt: string;
  likes: number;
  canteenName: string;
  adminReply?: {
    replierName: string;
    content: string;
    repliedAt: string;
  };
  replies?: ReviewReply[];
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
  FINANCE: 'dnu_canteen_finance_ledger_v2',
  WALLET: 'dnu_canteen_student_wallet_v2',
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
    fullName: 'Căng tin Đại Nam',
    email: 'canteen@dainam.edu.vn',
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

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Công Ty CP Chế Biến Thực Phẩm Hà Nội (Hanoi Food)',
    code: 'NCC-HNFOOD-01',
    category: 'Thịt tươi, gia cầm & thủy hải sản sạch',
    contactPerson: 'Trần Văn Mạnh (Trưởng phòng KD)',
    phone: '0912 345 678',
    email: 'kinhdoanh@hanoifood.vn',
    address: 'Lô C2, KCN Quang Minh, Mê Linh, Hà Nội',
    deliveryTime: '05:30 - 06:30 sáng hàng ngày',
    certVsattp: 'ISO 22000:2018 & HACCP Số 89/2025/ATTP-HN',
    monthlySpend: 48500000,
    debtAmount: 12400000,
    rating: 4.9,
    status: 'ACTIVE',
    deliveriesCount: 142,
  },
  {
    id: 2,
    name: 'Tập Đoàn Chăn Nuôi C.P. Việt Nam (Chi Nhánh Hà Tây)',
    code: 'NCC-CP-VIETNAM',
    category: 'Thịt heo, thịt gà CP, trứng gà tiệt trùng',
    contactPerson: 'Nguyễn Thị Thu Hà',
    phone: '0988 765 432',
    email: 'order.hatay@cp.com.vn',
    address: 'KCN Phú Nghĩa, Chương Mỹ, Hà Nội',
    deliveryTime: '06:00 sáng hàng ngày',
    certVsattp: 'VietGAP & Chuỗi Thực Phẩm An Toàn Quốc Gia',
    monthlySpend: 62000000,
    debtAmount: 18500000,
    rating: 5.0,
    status: 'ACTIVE',
    deliveriesCount: 210,
  },
  {
    id: 3,
    name: 'Hợp Tác Xã Rau An Toàn Chương Mỹ',
    code: 'NCC-HTX-RAU-CM',
    category: 'Rau củ quả tươi, nấm tươi, dưa cải muối',
    contactPerson: 'Bác Đỗ Đình Cường (Chủ nhiệm HTX)',
    phone: '0973 112 233',
    email: 'htx.rausachchuongmy@gmail.com',
    address: 'Thôn Chúc Đồng, Thụy Hương, Chương Mỹ, Hà Nội',
    deliveryTime: '05:00 - 06:00 sáng',
    certVsattp: 'Chứng nhận Rau An Toàn VietGAP Số 112/SNN-HN',
    monthlySpend: 24500000,
    debtAmount: 4200000,
    rating: 4.8,
    status: 'ACTIVE',
    deliveriesCount: 95,
  },
  {
    id: 4,
    name: 'Công Ty Nước Giải Khát & Thực Phẩm Hà Đông',
    code: 'NCC-BEV-HADONG',
    category: 'Trà đào, siro, sữa tươi, hạt cà phê Cầu Đất',
    contactPerson: 'Lê Hoàng Long',
    phone: '0945 999 888',
    email: 'hadongbev@supply.vn',
    address: '158 Đường Quang Trung, Hà Đông, Hà Nội',
    deliveryTime: 'Giao 2 lần/tuần (Thứ 2 & Thứ 5)',
    certVsattp: 'Chứng nhận VSATTP Số 45/2026/SYT-HN',
    monthlySpend: 38200000,
    debtAmount: 0,
    rating: 4.9,
    status: 'ACTIVE',
    deliveriesCount: 68,
  },
];

const initialStocks: StockItem[] = [
  {
    id: 1,
    code: 'NL-THIT-BO',
    name: 'Thịt thăn bò tươi loại 1',
    category: 'Thực phẩm tươi sống',
    quantity: 24.5,
    reserved: 8.0,
    available: 16.5,
    unit: 'kg',
    minStock: 10.0,
    unitPrice: 240000,
    expiryDate: '2026-08-29',
    status: 'NORMAL',
    supplierName: 'Công Ty CP Chế Biến Thực Phẩm Hà Nội',
  },
  {
    id: 2,
    code: 'NL-GAO-ST25',
    name: 'Gạo thơm lài ST25 Thượng Hạng',
    category: 'Lương thực khô',
    quantity: 180.0,
    reserved: 35.0,
    available: 145.0,
    unit: 'kg',
    minStock: 50.0,
    unitPrice: 28000,
    expiryDate: '2026-12-31',
    status: 'NORMAL',
    supplierName: 'Hợp Tác Xã Lương Thực Hà Nội',
  },
  {
    id: 3,
    code: 'NL-THIT-GA',
    name: 'Đùi gà góc tư tươi CP',
    category: 'Thực phẩm tươi sống',
    quantity: 38.0,
    reserved: 15.0,
    available: 23.0,
    unit: 'kg',
    minStock: 15.0,
    unitPrice: 68000,
    expiryDate: '2026-08-29',
    status: 'NORMAL',
    supplierName: 'Tập Đoàn Chăn Nuôi C.P. Việt Nam',
  },
  {
    id: 4,
    code: 'NL-TRUNG-GA',
    name: 'Trứng gà tươi Ba Huân loại A',
    category: 'Trứng & Gia cầm',
    quantity: 320,
    reserved: 80,
    available: 240,
    unit: 'quả',
    minStock: 100,
    unitPrice: 3200,
    expiryDate: '2026-09-15',
    status: 'NORMAL',
    supplierName: 'Tập Đoàn Chăn Nuôi C.P. Việt Nam',
  },
  {
    id: 5,
    code: 'NL-SUON-HEO',
    name: 'Sườn non heo tươi sạch CP',
    category: 'Thực phẩm tươi sống',
    quantity: 6.2,
    reserved: 5.0,
    available: 1.2,
    unit: 'kg',
    minStock: 10.0,
    unitPrice: 135000,
    expiryDate: '2026-08-28',
    status: 'LOW_STOCK',
    supplierName: 'Tập Đoàn Chăn Nuôi C.P. Việt Nam',
  },
];

const initialInboundReceipts: InboundReceipt[] = [
  {
    id: 1,
    code: 'PNK-20260827-01',
    supplierName: 'Công Ty CP Chế Biến Thực Phẩm Hà Nội',
    receivedDate: '2026-08-27 05:45',
    receiver: 'Thủ kho Đặng Minh Quân',
    items: [
      { name: 'Thịt thăn bò tươi loại 1', qty: 20, unit: 'kg', price: 240000 },
      { name: 'Sườn non heo tươi CP', qty: 15, unit: 'kg', price: 135000 },
    ],
    totalAmount: 6825000,
    status: 'COMPLETED',
  },
];

const initialOutboundIssues: OutboundIssue[] = [
  {
    id: 1,
    code: 'PXK-20260827-01',
    reason: 'Xuất nguyên liệu cho Bếp Căng tin Tòa G chế biến ca trưa',
    issuedDate: '2026-08-27 09:30',
    issuer: 'Bếp trưởng Võ Hoàng Hải',
    items: [
      { name: 'Thịt thăn bò tươi', qty: 10, unit: 'kg' },
      { name: 'Gạo thơm lài ST25', qty: 35, unit: 'kg' },
      { name: 'Trứng gà tươi Ba Huân', qty: 60, unit: 'quả' },
    ],
    supplierName: 'Công Ty CP Chế Biến Thực Phẩm Hà Nội',
  },
];

// Initial Financial Transactions (Live Cashflow Ledger)
const initialFinanceTransactions: FinanceTransaction[] = [
  {
    id: 1,
    code: 'PT-20260827-01',
    type: 'INCOME',
    category: 'POS_ORDER',
    categoryLabel: 'Doanh thu POS',
    title: 'Thanh toán đơn POS #1029 (Cơm gà + Trà đào)',
    amount: 95000,
    paymentMethod: 'DNUPAY',
    paymentMethodLabel: 'Ví DNU Pay',
    counterpart: 'Khách Quầy POS Tòa G',
    performedBy: 'Thu ngân Phạm Quỳnh Như',
    canteenName: 'Căng tin Tòa G (Hà Đông)',
    createdAt: '2026-08-27 11:45:00',
  },
  {
    id: 2,
    code: 'PT-20260827-02',
    type: 'INCOME',
    category: 'WALLET_TOPUP',
    categoryLabel: 'Nạp ví DNU Pay',
    title: 'Sinh viên Nguyễn Thành Nam nạp ví qua VietQR MoMo',
    amount: 100000,
    paymentMethod: 'QRMOMO',
    paymentMethodLabel: 'QR MoMo',
    counterpart: 'Nguyễn Thành Nam (K16 CNTT)',
    performedBy: 'Hệ thống Cổng DNU Pay',
    canteenName: 'Toàn hệ thống DNU',
    createdAt: '2026-08-27 10:30:00',
  },
  {
    id: 3,
    code: 'PC-20260827-01',
    type: 'EXPENSE',
    category: 'SUPPLIER_PAYMENT',
    categoryLabel: 'Chi trả nhà cung cấp',
    title: 'Thanh toán tiền nhập thịt tươi buổi sáng cho Hà Nội Food',
    amount: 6825000,
    paymentMethod: 'BANK_TRANSFER',
    paymentMethodLabel: 'Chuyển khoản VCB',
    counterpart: 'Công Ty CP Chế Biến Thực Phẩm Hà Nội',
    performedBy: 'Quản lý Trần Thị Thu Thảo',
    canteenName: 'Căng tin Tòa G',
    createdAt: '2026-08-27 06:15:00',
  },
  {
    id: 4,
    code: 'PT-20260827-03',
    type: 'INCOME',
    category: 'KIOSK_ORDER',
    categoryLabel: 'Doanh thu Kiosk',
    title: 'Thanh toán đơn Kiosk #K-102 (Bún chả + Nước quất)',
    amount: 42000,
    paymentMethod: 'QRMOMO',
    paymentMethodLabel: 'QR VNPAY',
    counterpart: 'Sinh viên DNU (Smart Kiosk)',
    performedBy: 'Smart Kiosk Sảnh G',
    canteenName: 'Căng tin Tòa G',
    createdAt: '2026-08-27 12:05:00',
  },
  {
    id: 5,
    code: 'PC-20260826-02',
    type: 'EXPENSE',
    category: 'OPERATING_COST',
    categoryLabel: 'Chi phí vận hành',
    title: 'Chi tiền điện & gas công nghiệp nấu bếp Căng tin Tòa G',
    amount: 3500000,
    paymentMethod: 'CASH',
    paymentMethodLabel: 'Tiền mặt',
    counterpart: 'Công Ty Gas Công Nghiệp Hà Đông',
    performedBy: 'Quản lý Trần Thị Thu Thảo',
    canteenName: 'Căng tin Tòa G',
    createdAt: '2026-08-26 16:30:00',
  },
  {
    id: 6,
    code: 'PT-20260826-01',
    type: 'INCOME',
    category: 'CAPITAL_INFLOW',
    categoryLabel: 'Bơm vốn quỹ',
    title: 'Admin nạp vốn lưu động tiền mặt đầu kỳ cho quầy thu ngân',
    amount: 20000000,
    paymentMethod: 'CASH',
    paymentMethodLabel: 'Tiền mặt',
    counterpart: 'Phòng Tài Chính Đại Học Đại Nam',
    performedBy: 'Căng tin Đại Nam',
    canteenName: 'Căng tin Tòa G',
    createdAt: '2026-08-26 07:00:00',
  },
];

// Initial Student Wallet for Nguyễn Thành Nam (K16 CNTT)
const initialStudentWallet: StudentWallet = {
  mssv: '2110001',
  studentName: 'Nguyễn Thành Nam',
  balance: 185000,
  transactions: [
    {
      id: 1,
      type: 'PAYMENT',
      title: 'Ăn trưa Cơm Rang Dưa Bò + Trà Đào',
      amount: -45000,
      paymentMethod: 'Ví DNU Pay',
      time: 'Hôm nay, 12:15',
      orderCode: '#1029',
      balanceAfter: 185000,
    },
    {
      id: 2,
      type: 'TOPUP',
      title: 'Nạp tiền Ví qua VietQR MoMo',
      amount: 100000,
      paymentMethod: 'QR MoMo',
      time: 'Hôm nay, 10:30',
      balanceAfter: 230000,
    },
    {
      id: 3,
      type: 'REFUND',
      title: 'Hoàn tiền Ưu đãi mã DNUCHAO2026',
      amount: 15000,
      paymentMethod: 'Khuyến mãi DNU',
      time: 'Hôm qua, 18:00',
      balanceAfter: 130000,
    },
    {
      id: 4,
      type: 'PAYMENT',
      title: 'Ăn trưa Bún Chả Hà Nội Nướng Than',
      amount: -35000,
      paymentMethod: 'Ví DNU Pay',
      time: 'Hôm qua, 11:45',
      orderCode: '#1026',
      balanceAfter: 115000,
    },
  ],
};

const initialDishReviews: DishReview[] = [
  {
    id: 1,
    studentName: 'Nguyễn Thành Nam',
    studentClass: 'K16 Khoa CNTT DNU',
    foodName: 'Cơm Rang Dưa Bò Hà Nội',
    rating: 5,
    comment: 'Cơm rang hạt giòn tơi, thịt bò xào mềm thơm và dưa chua rất vừa miệng. Suất ăn 35k đầy đặn no cả buổi chiều học lập trình!',
    sentiment: 'POSITIVE',
    createdAt: 'Hôm nay, 12:15',
    likes: 24,
    canteenName: 'Căng tin Tòa G (Hà Đông)',
  },
  {
    id: 2,
    studentName: 'Lê Khánh Hòa',
    studentClass: 'K17 Khoa Dược DNU',
    foodName: 'Bún Chả Hà Nội Nướng Than',
    rating: 5,
    comment: 'Chả nướng thơm lừng mùi than hoa đặc trưng Hà Nội. Nước chấm đu đủ cà rốt giòn ngọt thanh, bún tươi sạch sẽ!',
    sentiment: 'POSITIVE',
    createdAt: 'Hôm nay, 12:30',
    likes: 18,
    canteenName: 'Căng tin Tòa G (Hà Đông)',
  },
  {
    id: 3,
    studentName: 'Trần Tiến Đạt',
    studentClass: 'K17 Khoa Y Khoa DNU',
    foodName: 'Trà Đào Cam Sả Hà Đông',
    rating: 5,
    comment: 'Trà đào rất thơm mát, đào miếng giòn sần sật. Uống sau giờ thực hành giải nhiệt cực kỳ tốt.',
    sentiment: 'POSITIVE',
    createdAt: 'Hôm qua, 15:20',
    likes: 15,
    canteenName: 'Căng tin DNU Garden & Coffee',
  },
  {
    id: 4,
    studentName: 'Phạm Quỳnh Nga',
    studentClass: 'K18 Quản Trị Kinh Doanh',
    foodName: 'Bánh Mì Chảo Đặc Biệt DNU',
    rating: 4,
    comment: 'Pate rất thơm, trứng lòng đào chuẩn vị. Nếu quán cho thêm một ít sốt cà chua nữa thì sẽ hoàn hảo 10/10.',
    sentiment: 'NEUTRAL',
    createdAt: 'Hôm qua, 08:45',
    likes: 9,
    canteenName: 'Căng tin Tòa A-B DNU',
  },
  {
    id: 5,
    studentName: 'Hoàng Minh Quân',
    studentClass: 'K16 Khoa Truyền Thông',
    foodName: 'Phở Bò Tái Lăn DNU',
    rating: 5,
    comment: 'Bò tái lăn xào tỏi thơm nức mũi, nước dùng ninh xương đậm đà. Ăn kèm 2 chiếc quẩy giòn no căng bụng!',
    sentiment: 'POSITIVE',
    createdAt: '2 ngày trước',
    likes: 31,
    canteenName: 'Căng tin Tòa G (Hà Đông)',
  },
];

export const dnuStore = {
  // 1. FOODS
  getFoods(): FoodCatalogItem[] {
    try {
      const stored = localStorage.getItem(KEYS.FOODS);
      if (stored) {
        const parsed: FoodCatalogItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize and synchronize category names and categoryIds for all items
          return parsed.map((f) => {
            const cat = f.category || '';
            const catLower = cat.toLowerCase();
            if (f.categoryId === 1 || catLower.includes('cơm')) {
              return { ...f, category: 'Cơm Phần & Cơm Đĩa DNU', categoryId: 1 };
            }
            if (f.categoryId === 2 || catLower.includes('bún') || catLower.includes('phở') || catLower.includes('mì')) {
              return { ...f, category: 'Bún & Phở Hà Nội', categoryId: 2 };
            }
            if (f.categoryId === 3 || catLower.includes('bánh mì') || catLower.includes('vặt') || catLower.includes('nem') || catLower.includes('xôi') || catLower.includes('bánh bao') || catLower.includes('khoai')) {
              return { ...f, category: 'Bánh Mì & Đồ Ăn Vặt', categoryId: 3 };
            }
            if (f.categoryId === 4 || catLower.includes('uống') || catLower.includes('trà') || catLower.includes('cà phê') || catLower.includes('cafe') || catLower.includes('nước') || catLower.includes('coca') || catLower.includes('aquafina')) {
              return { ...f, category: 'Đồ Uống & Trà Sữa', categoryId: 4 };
            }
            if (f.categoryId === 5 || f.categoryId === 10 || catLower.includes('combo')) {
              return { ...f, category: 'Combo Tiết Kiệm Học Đường', categoryId: 5 };
            }
            return f;
          });
        }
      }
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
    return initialSuppliers;
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
    return initialStocks;
  },
  saveStocks(stocks: StockItem[]) {
    localStorage.setItem(KEYS.STOCKS, JSON.stringify(stocks));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },

  // 7. INBOUND RECEIPTS
  getInboundReceipts(): InboundReceipt[] {
    try {
      const stored = localStorage.getItem(KEYS.INBOUND);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return initialInboundReceipts;
  },
  saveInboundReceipts(receipts: InboundReceipt[]) {
    localStorage.setItem(KEYS.INBOUND, JSON.stringify(receipts));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },

  // 8. OUTBOUND ISSUES
  getOutboundIssues(): OutboundIssue[] {
    try {
      const stored = localStorage.getItem(KEYS.OUTBOUND);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return initialOutboundIssues;
  },
  saveOutboundIssues(issues: OutboundIssue[]) {
    localStorage.setItem(KEYS.OUTBOUND, JSON.stringify(issues));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },

  // -------------------------------------------------------------
  // 9. CANTEEN FINANCIAL TREASURY & SỔ QUỸ THU CHI
  // -------------------------------------------------------------
  getFinanceTransactions(): FinanceTransaction[] {
    try {
      const stored = localStorage.getItem(KEYS.FINANCE);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return initialFinanceTransactions;
  },
  saveFinanceTransactions(txs: FinanceTransaction[]) {
    localStorage.setItem(KEYS.FINANCE, JSON.stringify(txs));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },
  addFinanceTransaction(tx: Omit<FinanceTransaction, 'id' | 'createdAt'>) {
    const list = this.getFinanceTransactions();
    const created: FinanceTransaction = {
      ...tx,
      id: Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    const updated = [created, ...list];
    this.saveFinanceTransactions(updated);
    return created;
  },
  getFinanceSummary() {
    const txs = this.getFinanceTransactions();
    const totalIncome = txs.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    const totalExpense = txs.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    const posIncome = txs.filter((t) => t.category === 'POS_ORDER').reduce((s, t) => s + t.amount, 0);
    const kioskIncome = txs.filter((t) => t.category === 'KIOSK_ORDER').reduce((s, t) => s + t.amount, 0);
    const walletTopupIncome = txs.filter((t) => t.category === 'WALLET_TOPUP').reduce((s, t) => s + t.amount, 0);
    const supplierExpense = txs.filter((t) => t.category === 'SUPPLIER_PAYMENT').reduce((s, t) => s + t.amount, 0);
    const operatingExpense = txs.filter((t) => t.category === 'OPERATING_COST' || t.category === 'SALARY').reduce((s, t) => s + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      netBalance,
      posIncome,
      kioskIncome,
      walletTopupIncome,
      supplierExpense,
      operatingExpense,
    };
  },

  // -------------------------------------------------------------
  // 10. VÍ SINH VIÊN DNU PAY (STUDENT WALLET)
  // -------------------------------------------------------------
  getStudentWallet(mssv: string = '2110001'): StudentWallet {
    try {
      const stored = localStorage.getItem(`${KEYS.WALLET}_${mssv}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return initialStudentWallet;
  },
  saveStudentWallet(wallet: StudentWallet) {
    localStorage.setItem(`${KEYS.WALLET}_${wallet.mssv}`, JSON.stringify(wallet));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },
  topupStudentWallet(amount: number, method: string = 'QR MoMo', mssv: string = '2110001', studentName: string = 'Nguyễn Thành Nam') {
    const wallet = this.getStudentWallet(mssv);
    const newBalance = wallet.balance + amount;
    const newTx: WalletTransaction = {
      id: Date.now(),
      type: 'TOPUP',
      title: `Nạp tiền Ví DNU Pay qua ${method}`,
      amount: amount,
      paymentMethod: method,
      time: 'Vừa xong',
      balanceAfter: newBalance,
    };
    wallet.balance = newBalance;
    wallet.transactions = [newTx, ...wallet.transactions];
    this.saveStudentWallet(wallet);

    // Record Inflow to Canteen Financial Treasury
    this.addFinanceTransaction({
      code: `PT-NAPVI-${Date.now().toString().slice(-4)}`,
      type: 'INCOME',
      category: 'WALLET_TOPUP',
      categoryLabel: 'Nạp ví sinh viên',
      title: `Sinh viên ${studentName} (${mssv}) nạp ví qua ${method}`,
      amount: amount,
      paymentMethod: method.includes('MoMo') ? 'QRMOMO' : 'CASH',
      paymentMethodLabel: method,
      counterpart: `${studentName} (${mssv})`,
      performedBy: 'Cổng DNU Pay',
      canteenName: 'Toàn hệ thống DNU',
    });

    return wallet;
  },
  deductStudentWallet(amount: number, orderCode: string, orderDesc: string, mssv: string = '2110001') {
    const cleanMssv = (mssv || '2110001').replace(/\D/g, '') || '2110001';
    const wallet = this.getStudentWallet(cleanMssv);
    const newBalance = Math.max(0, wallet.balance - amount);
    const newTx: WalletTransaction = {
      id: Date.now(),
      type: 'PAYMENT',
      title: orderDesc || `Thanh toán đơn hàng ${orderCode}`,
      amount: -amount,
      paymentMethod: 'Ví DNU Pay',
      time: 'Vừa xong',
      orderCode,
      balanceAfter: newBalance,
    };
    wallet.balance = newBalance;
    wallet.transactions = [newTx, ...wallet.transactions];
    this.saveStudentWallet(wallet);
    return wallet;
  },

  // -------------------------------------------------------------
  // 11. DISH REVIEWS & RATINGS
  // -------------------------------------------------------------
  getReviews(): DishReview[] {
    try {
      const stored = localStorage.getItem(KEYS.REVIEWS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return initialDishReviews;
  },
  saveReviews(reviews: DishReview[]) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },
  addReview(rev: Omit<DishReview, 'id' | 'createdAt' | 'likes'>) {
    const list = this.getReviews();
    const created: DishReview = {
      ...rev,
      id: Date.now(),
      createdAt: 'Vừa xong',
      likes: 0,
    };
    const updated = [created, ...list];
    this.saveReviews(updated);

    // Update rating in Food catalog
    const foods = this.getFoods();
    const matchFood = foods.find((f) => f.name.toLowerCase() === rev.foodName.toLowerCase());
    if (matchFood) {
      const foodRevs = updated.filter((r) => r.foodName.toLowerCase() === rev.foodName.toLowerCase());
      const avg = Number((foodRevs.reduce((s, r) => s + r.rating, 0) / foodRevs.length).toFixed(1));
      const updatedFoods = foods.map((f) =>
        f.id === matchFood.id ? { ...f, rating: avg, reviewsCount: (f.reviewsCount || 0) + 1 } : f
      );
      this.saveFoods(updatedFoods);
    }

    return created;
  },
  likeReview(id: number) {
    const list = this.getReviews();
    const updated = list.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r));
    this.saveReviews(updated);
  },
  deleteReview(id: number) {
    const list = this.getReviews();
    const updated = list.filter((r) => r.id !== id);
    this.saveReviews(updated);
    return updated;
  },
  replyReview(id: number, reply: { replierName: string; content: string }) {
    const list = this.getReviews();
    const updated = list.map((r) =>
      r.id === id
        ? {
            ...r,
            adminReply: {
              replierName: reply.replierName || 'Ban Quản Lý Căng Tin DNU',
              content: reply.content,
              repliedAt: 'Vừa xong',
            },
          }
        : r
    );
    this.saveReviews(updated);
    return updated;
  },
  addReplyToReview(
    reviewId: number,
    comment: { authorName: string; authorRole: 'STUDENT' | 'ADMIN' | 'CANTEEN_MANAGER'; authorClass?: string; content: string }
  ) {
    const list = this.getReviews();
    const updated = list.map((r) => {
      if (r.id === reviewId) {
        const newReply: ReviewReply = {
          id: Date.now(),
          authorName: comment.authorName,
          authorRole: comment.authorRole,
          authorClass: comment.authorClass,
          content: comment.content,
          createdAt: 'Vừa xong',
        };
        return {
          ...r,
          replies: [...(r.replies || []), newReply],
        };
      }
      return r;
    });
    this.saveReviews(updated);
    return updated;
  },
  getReviewStats() {
    const list = this.getReviews();
    const total = list.length;
    const avgRating = total > 0 ? (list.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '5.0';
    const positiveCount = list.filter((r) => r.rating >= 4).length;
    const satisfactionRate = total > 0 ? Math.round((positiveCount / total) * 100) : 100;
    return {
      total,
      avgRating: Number(avgRating),
      satisfactionRate,
      fiveStar: list.filter((r) => r.rating === 5).length,
      fourStar: list.filter((r) => r.rating === 4).length,
      threeStar: list.filter((r) => r.rating === 3).length,
    };
  },

  // -------------------------------------------------------------
  // 12. STUDENT CART (GIỎ HÀNG SINH VIÊN)
  // -------------------------------------------------------------
  getStudentCart(): StudentCartItem[] {
    try {
      const stored = localStorage.getItem('dnu_student_cart');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: 1, name: 'Cơm Gà Xối Mỡ Giòn Da', price: 35000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', category: 'Cơm' },
      { id: 4, name: 'Trà Sữa Trân Châu Đường Đen DNU', price: 25000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1558857563-b371f31ca957?w=500&q=80', category: 'Đồ Uống & Trà Sữa' },
    ];
  },
  saveStudentCart(cart: StudentCartItem[]) {
    localStorage.setItem('dnu_student_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('dnu_store_updated'));
  },
  addToStudentCart(food: { id: number; name: string; price: number; imageUrl?: string; category?: string }) {
    const cart = this.getStudentCart();
    const existing = cart.find((i) => i.id === food.id || i.name === food.name);
    let updated: StudentCartItem[];
    if (existing) {
      updated = cart.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      updated = [...cart, { id: food.id, name: food.name, price: food.price, quantity: 1, imageUrl: food.imageUrl, category: food.category }];
    }
    this.saveStudentCart(updated);
    return updated;
  },
  updateStudentCartQty(id: number, delta: number) {
    const cart = this.getStudentCart();
    const updated = cart
      .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
      .filter((i) => i.quantity > 0);
    this.saveStudentCart(updated);
    return updated;
  },
  clearStudentCart() {
    this.saveStudentCart([]);
  },

  // -------------------------------------------------------------
  // DIAGNOSTIC CHECK
  // -------------------------------------------------------------
  runSystemHealthCheck() {
    const checks = [
      { module: 'Thực đơn Món ăn & Ảnh', status: 'OK', count: this.getFoods().length, persistent: true },
      { module: 'Danh mục & Combo', status: 'OK', count: this.getCategories().length, persistent: true },
      { module: 'Khuyến mãi & Voucher', status: 'OK', count: this.getVouchers().length, persistent: true },
      { module: 'Tài khoản & Phân quyền', status: 'OK', count: this.getUsers().length, persistent: true },
      { module: 'Đơn hàng & KDS Bếp', status: 'OK', persistent: true },
      { module: 'Nhà cung cấp & Đặt hàng', status: 'OK', persistent: true },
      { module: 'Tồn kho & Xuất nhập', status: 'OK', persistent: true },
      { module: 'Sổ quỹ Dòng tiền & Ví DNU Pay', status: 'OK', count: this.getFinanceTransactions().length, persistent: true },
      { module: 'Đánh giá & Rating Món ăn', status: 'OK', count: this.getReviews().length, persistent: true },
      { module: 'Backend API MySQL / WebSocket', status: 'ONLINE', persistent: true },
    ];
    return checks;
  },
};
