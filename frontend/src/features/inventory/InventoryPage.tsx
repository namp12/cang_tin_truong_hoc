import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog.js';
import { formatCurrency, formatNumber } from '../../utils/format.js';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Plus, 
  Truck, 
  Calendar, 
  ArrowDownUp, 
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  ClipboardList,
  CheckCircle2,
  ChefHat,
  History,
  FileSpreadsheet,
  AlertCircle,
  Sliders,
  DollarSign,
  Edit3,
  Trash2
} from 'lucide-react';

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
}

export const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'STOCKS' | 'INBOUND_LOGS' | 'OUTBOUND_LOGS'>('STOCKS');

  // Modals state
  const [showInboundModal, setShowInboundModal] = useState(false);
  const [showOutboundModal, setShowOutboundModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [adjustItem, setAdjustItem] = useState<StockItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<string>('');

  // Stock Items State
  const [stocks, setStocks] = useState<StockItem[]>([
    { id: 1, code: 'ING-GAO', name: 'Gạo thơm lài ST25', category: 'Ngũ Cốc & Tinh Bột', quantity: 450, reserved: 20, available: 430, unit: 'kg', minStock: 50, unitPrice: 22000, expiryDate: '15/12/2026', status: 'NORMAL' },
    { id: 2, code: 'ING-THIT-GA', name: 'Thịt đùi gà phi lê', category: 'Thịt Tươi Sống', quantity: 8.5, reserved: 2, available: 6.5, unit: 'kg', minStock: 20, unitPrice: 75000, expiryDate: '29/08/2026', status: 'LOW_STOCK' },
    { id: 3, code: 'ING-SUON-HEO', name: 'Sườn non heo tươi', category: 'Thịt Tươi Sống', quantity: 60, reserved: 10, available: 50, unit: 'kg', minStock: 15, unitPrice: 125000, expiryDate: '30/08/2026', status: 'NORMAL' },
    { id: 4, code: 'ING-THIT-BO', name: 'Thịt thăn bò tươi', category: 'Thịt Tươi Sống', quantity: 40, reserved: 5, available: 35, unit: 'kg', minStock: 10, unitPrice: 210000, expiryDate: '28/08/2026', status: 'NORMAL' },
    { id: 5, code: 'ING-TRUNG-GA', name: 'Trứng gà tươi Ba Huân', category: 'Gia Cầm & Trứng', quantity: 800, reserved: 50, available: 750, unit: 'quả', minStock: 100, unitPrice: 2800, expiryDate: '10/09/2026', status: 'NORMAL' },
    { id: 6, code: 'ING-RAU-XA-LACH', name: 'Xà lách & Dưa chuột', category: 'Rau Củ Tươi', quantity: 4, reserved: 1, available: 3, unit: 'kg', minStock: 5, unitPrice: 18000, expiryDate: '28/08/2026', status: 'LOW_STOCK' },
    { id: 13, code: 'ING-SIRO-DAO', name: 'Đào ngâm & Sả tươi', category: 'Pha Chế Đồ Uống', quantity: 25, reserved: 2, available: 23, unit: 'hộp', minStock: 8, unitPrice: 42000, expiryDate: '30/11/2026', status: 'NORMAL' },
    { id: 18, code: 'ING-COCA', name: 'Coca Cola Lon 320ml', category: 'Đồ Uống Đóng Lon', quantity: 350, reserved: 20, available: 330, unit: 'lon', minStock: 50, unitPrice: 8500, expiryDate: '20/01/2027', status: 'NORMAL' },
    { id: 20, code: 'ING-AQUAFINA', name: 'Nước Suối Aquafina 500ml', category: 'Đồ Uống Đóng Chai', quantity: 500, reserved: 30, available: 470, unit: 'chai', minStock: 100, unitPrice: 4500, expiryDate: '15/06/2027', status: 'NORMAL' },
  ]);

  // Inbound Receipts History
  const [inboundReceipts, setInboundReceipts] = useState<InboundReceipt[]>([
    {
      id: 1,
      code: 'PNK-20260827-01',
      supplierName: 'Công Ty CP Chế Biến Thực Phẩm Hà Nội',
      receivedDate: '27/08/2026 05:30',
      receiver: 'Thủ kho Bùi Văn Quân',
      items: [
        { name: 'Thịt thăn bò tươi', qty: 20, unit: 'kg', price: 210000 },
        { name: 'Sườn non heo tươi', qty: 30, unit: 'kg', price: 125000 },
      ],
      totalAmount: 7950000,
      status: 'COMPLETED',
    },
    {
      id: 2,
      code: 'PNK-20260826-02',
      supplierName: 'Hợp Tác Xã Nông Sản Sạch Chương Mỹ',
      receivedDate: '26/08/2026 05:00',
      receiver: 'Thủ kho Bùi Văn Quân',
      items: [
        { name: 'Gạo thơm lài ST25', qty: 200, unit: 'kg', price: 22000 },
        { name: 'Rau củ xà lách sạch', qty: 25, unit: 'kg', price: 18000 },
      ],
      totalAmount: 4850000,
      status: 'COMPLETED',
    },
  ]);

  // Outbound Issues History
  const [outboundIssues, setOutboundIssues] = useState<OutboundIssue[]>([
    {
      id: 1,
      code: 'PXK-20260827-01',
      reason: 'Xuất nguyên liệu cho Bếp Căng tin Tòa G chế biến ca trưa',
      issuedDate: '27/08/2026 09:30',
      issuer: 'Bếp trưởng Nguyễn Văn Bếp',
      items: [
        { name: 'Thịt thăn bò tươi', qty: 10, unit: 'kg' },
        { name: 'Gạo thơm lài ST25', qty: 35, unit: 'kg' },
        { name: 'Trứng gà tươi Ba Huân', qty: 60, unit: 'quả' },
      ],
    },
  ]);

  // Forms State
  const [inboundForm, setInboundForm] = useState({
    supplierName: 'Công Ty CP Chế Biến Thực Phẩm Hà Nội',
    ingredientName: 'Thịt đùi gà phi lê',
    qty: 25,
    unit: 'kg',
    unitPrice: 75000,
    expiryDate: '05/09/2026',
  });

  const [outboundForm, setOutboundForm] = useState({
    reason: 'Xuất nguyên liệu cho Bếp chế biến ca trưa',
    ingredientName: 'Thịt đùi gà phi lê',
    qty: 5,
    unit: 'kg',
  });

  const [newItemForm, setNewItemForm] = useState({
    name: '',
    category: 'Thịt Tươi Sống',
    unit: 'kg',
    minStock: '10',
    unitPrice: '50000',
    quantity: '20',
  });

  // Handle Create Inbound Receipt (Nhập kho)
  const handleCreateInbound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inboundForm.qty || inboundForm.qty <= 0) return;

    const receiptTotal = inboundForm.qty * inboundForm.unitPrice;
    const newReceiptCode = `PNK-${Date.now().toString().slice(-6)}`;

    // 1. Add inbound log
    const newReceipt: InboundReceipt = {
      id: Date.now(),
      code: newReceiptCode,
      supplierName: inboundForm.supplierName,
      receivedDate: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString().slice(0, 5),
      receiver: 'Thủ kho Căng tin Tòa G',
      items: [{ name: inboundForm.ingredientName, qty: Number(inboundForm.qty), unit: inboundForm.unit, price: Number(inboundForm.unitPrice) }],
      totalAmount: receiptTotal,
      status: 'COMPLETED',
    };
    setInboundReceipts([newReceipt, ...inboundReceipts]);

    // 2. Increase stock
    setStocks((prev) =>
      prev.map((s) => {
        if (s.name.toLowerCase().includes(inboundForm.ingredientName.toLowerCase())) {
          const newQty = s.quantity + Number(inboundForm.qty);
          const newAvail = s.available + Number(inboundForm.qty);
          return {
            ...s,
            quantity: newQty,
            available: newAvail,
            status: newAvail <= s.minStock ? 'LOW_STOCK' : 'NORMAL',
            expiryDate: inboundForm.expiryDate || s.expiryDate,
          };
        }
        return s;
      })
    );

    setShowInboundModal(false);
  };

  // Handle Create Outbound Issue (Xuất kho)
  const handleCreateOutbound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outboundForm.qty || outboundForm.qty <= 0) return;

    const newIssueCode = `PXK-${Date.now().toString().slice(-6)}`;

    // 1. Add outbound log
    const newIssue: OutboundIssue = {
      id: Date.now(),
      code: newIssueCode,
      reason: outboundForm.reason,
      issuedDate: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString().slice(0, 5),
      issuer: 'Bếp Căng tin Tòa G',
      items: [{ name: outboundForm.ingredientName, qty: Number(outboundForm.qty), unit: outboundForm.unit }],
    };
    setOutboundIssues([newIssue, ...outboundIssues]);

    // 2. Decrease stock
    setStocks((prev) =>
      prev.map((s) => {
        if (s.name.toLowerCase().includes(outboundForm.ingredientName.toLowerCase())) {
          const newQty = Math.max(0, s.quantity - Number(outboundForm.qty));
          const newAvail = Math.max(0, s.available - Number(outboundForm.qty));
          return {
            ...s,
            quantity: newQty,
            available: newAvail,
            status: newAvail === 0 ? 'OUT_OF_STOCK' : newAvail <= s.minStock ? 'LOW_STOCK' : 'NORMAL',
          };
        }
        return s;
      })
    );

    setShowOutboundModal(false);
  };

  // Handle Add New Item
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemForm.name) return;

    const initialQty = Number(newItemForm.quantity) || 0;
    const minS = Number(newItemForm.minStock) || 5;

    const created: StockItem = {
      id: Date.now(),
      code: `ING-${Date.now().toString().slice(-4)}`,
      name: newItemForm.name,
      category: newItemForm.category,
      quantity: initialQty,
      reserved: 0,
      available: initialQty,
      unit: newItemForm.unit,
      minStock: minS,
      unitPrice: Number(newItemForm.unitPrice) || 20000,
      expiryDate: '30/12/2026',
      status: initialQty <= minS ? 'LOW_STOCK' : 'NORMAL',
    };

    setStocks([created, ...stocks]);
    setShowAddItemModal(false);
  };

  // Handle Adjust Stock (Kiểm kê)
  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem || !adjustQty) return;

    const targetQty = Number(adjustQty);
    setStocks((prev) =>
      prev.map((s) =>
        s.id === adjustItem.id
          ? {
              ...s,
              quantity: targetQty,
              available: Math.max(0, targetQty - s.reserved),
              status: targetQty <= s.minStock ? 'LOW_STOCK' : 'NORMAL',
            }
          : s
      )
    );
    setAdjustItem(null);
  };

  // Metrics
  const lowStockCount = stocks.filter((s) => s.status === 'LOW_STOCK').length;
  const totalInventoryValue = stocks.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

  const filteredStocks = stocks.filter((s) => {
    const matchFilter = filterType === 'ALL' || (filterType === 'LOW' && s.status === 'LOW_STOCK');
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Quản Lý Tồn Kho & Xuất Nhập Nguyên Liệu</span>
            <Badge variant="primary" className="text-xs font-mono">
              {stocks.length} mặt hàng
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Kiểm soát tồn kho thời gian thực, nhập kho từ nhà cung cấp, xuất kho cho bếp và kiểm kê FEFO
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowInboundModal(true)}
            variant="default"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 font-bold"
            leftIcon={<ArrowDownRight className="w-4 h-4" />}
          >
            Tạo Phiếu Nhập Kho
          </Button>

          <Button
            onClick={() => setShowOutboundModal(true)}
            variant="outline"
            size="sm"
            className="border-orange-500/30 text-orange-600 hover:bg-orange-500/10 font-bold"
            leftIcon={<ArrowUpRight className="w-4 h-4" />}
          >
            Xuất Kho Cho Bếp
          </Button>

          <Button onClick={() => setShowAddItemModal(true)} variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Mặt Hàng Mới
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Tổng Nguyên Liệu Trong Kho</p>
              <h3 className="text-lg font-bold text-foreground">{stocks.length} Mặt hàng</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-amber-500/10 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Cảnh Báo Dưới Ngưỡng Min</p>
              <h3 className="text-lg font-bold text-foreground">
                {lowStockCount > 0 ? (
                  <span className="text-amber-600 dark:text-amber-400">{lowStockCount} Mặt hàng cần nhập</span>
                ) : (
                  <span className="text-emerald-600">Đầy đủ 100%</span>
                )}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Tổng Giá Trị Tồn Kho</p>
              <h3 className="text-lg font-bold text-foreground font-mono">{formatCurrency(totalInventoryValue)}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Switcher & Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã hoặc tên nguyên liệu..."
              className="w-full pl-9 pr-3.5 py-2 bg-muted/60 border border-input rounded-lg text-xs text-foreground focus:bg-background focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('STOCKS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'STOCKS'
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              📦 Tồn Kho Thực Tế ({stocks.length})
            </button>
            <button
              onClick={() => setActiveTab('INBOUND_LOGS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'INBOUND_LOGS'
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              📥 Phiếu Nhập Kho ({inboundReceipts.length})
            </button>
            <button
              onClick={() => setActiveTab('OUTBOUND_LOGS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'OUTBOUND_LOGS'
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              📤 Phiếu Xuất Cho Bếp ({outboundIssues.length})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* TAB 1: Real-time Stocks Table */}
      {activeTab === 'STOCKS' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mã</th>
                  <th className="py-3.5 px-4">Tên Nguyên Liệu</th>
                  <th className="py-3.5 px-4">Nhóm Hàng</th>
                  <th className="py-3.5 px-4">Tồn Thực Tế</th>
                  <th className="py-3.5 px-4">Khả Dụng</th>
                  <th className="py-3.5 px-4">Ngưỡng Min</th>
                  <th className="py-3.5 px-4">Đơn Giá Vốn</th>
                  <th className="py-3.5 px-4">Hạn Dùng (FEFO)</th>
                  <th className="py-3.5 px-4">Tình Trạng</th>
                  <th className="py-3.5 px-4 text-right">Kiểm Kê</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs text-foreground">
                {filteredStocks.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold">{item.code}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground">{item.name}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{item.category}</td>
                    <td className="py-3.5 px-4 font-bold font-mono">
                      {formatNumber(item.quantity)} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                      {formatNumber(item.available)} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-mono">
                      {formatNumber(item.minStock)} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3.5 px-4 text-muted-foreground font-mono">{item.expiryDate}</td>
                    <td className="py-3.5 px-4">
                      {item.status === 'LOW_STOCK' ? (
                        <Badge variant="warning" hasDot>
                          Sắp hết
                        </Badge>
                      ) : item.status === 'OUT_OF_STOCK' ? (
                        <Badge variant="destructive" hasDot>
                          Hết hàng
                        </Badge>
                      ) : (
                        <Badge variant="success" hasDot>
                          Đầy đủ
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustItem(item);
                          setAdjustQty(item.quantity.toString());
                        }}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        title="Kiểm kê & Điều chỉnh tồn kho"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 2: Inbound Goods Receipts Log Table */}
      {activeTab === 'INBOUND_LOGS' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mã Phiếu Nhập</th>
                  <th className="py-3.5 px-4">Nhà Cung Cấp Đối Tác</th>
                  <th className="py-3.5 px-4">Chi Tiết Nguyên Liệu Nhập</th>
                  <th className="py-3.5 px-4">Tổng Tiền Nhập</th>
                  <th className="py-3.5 px-4">Người Tiếp Nhận</th>
                  <th className="py-3.5 px-4">Thời Gian Nhập</th>
                  <th className="py-3.5 px-4 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs text-foreground">
                {inboundReceipts.map((rec) => (
                  <tr key={rec.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{rec.code}</td>
                    <td className="py-3.5 px-4 font-semibold">{rec.supplierName}</td>
                    <td className="py-3.5 px-4">
                      {rec.items.map((i, idx) => (
                        <div key={idx} className="text-muted-foreground">
                          {i.qty} {i.unit} × {i.name} ({formatCurrency(i.price)}/{i.unit})
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold font-mono text-foreground">
                      {formatCurrency(rec.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{rec.receiver}</td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">{rec.receivedDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge variant="success">Đã nhập kho</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: Outbound Kitchen Issues Log Table */}
      {activeTab === 'OUTBOUND_LOGS' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mã Phiếu Xuất</th>
                  <th className="py-3.5 px-4">Mục Đích Xuất Kho</th>
                  <th className="py-3.5 px-4">Nguyên Liệu Xuất Cho Bếp</th>
                  <th className="py-3.5 px-4">Người Đề Xuất</th>
                  <th className="py-3.5 px-4 text-right">Thời Gian Xuất</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs text-foreground">
                {outboundIssues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-600">{iss.code}</td>
                    <td className="py-3.5 px-4 font-semibold">{iss.reason}</td>
                    <td className="py-3.5 px-4">
                      {iss.items.map((i, idx) => (
                        <div key={idx} className="font-bold text-foreground">
                          {i.qty} {i.unit} × {i.name}
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{iss.issuer}</td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground text-right">{iss.issuedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODAL 1: Create Inbound Receipt (Tạo Phiếu Nhập Kho) */}
      <Dialog open={showInboundModal} onOpenChange={setShowInboundModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-emerald-600" />
              <span>Tạo Phiếu Nhập Kho Nguyên Liệu Mới</span>
            </DialogTitle>
            <DialogDescription>
              Nhập thực phẩm từ đối tác nhà cung cấp và cộng tồn kho tức thì
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateInbound} className="space-y-3.5 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Nhà cung cấp đối tác *</label>
              <select
                value={inboundForm.supplierName}
                onChange={(e) => setInboundForm({ ...inboundForm, supplierName: e.target.value })}
                aria-label="Chọn nhà cung cấp"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              >
                <option value="Công Ty CP Chế Biến Thực Phẩm Hà Nội">Công Ty CP Chế Biến Thực Phẩm Hà Nội</option>
                <option value="Hợp Tác Xã Nông Sản Sạch Chương Mỹ">Hợp Tác Xã Nông Sản Sạch Chương Mỹ</option>
                <option value="Công Ty Cổ Phần Chăn Nuôi C.P. Việt Nam">Công Ty Cổ Phần Chăn Nuôi C.P. Việt Nam</option>
                <option value="Nhà Phân Phối Nước Giải Khát & Sữa Hà Đông">Nhà Phân Phối Nước Giải Khát & Sữa Hà Đông</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Mặt hàng nhập kho *</label>
              <select
                value={inboundForm.ingredientName}
                onChange={(e) => {
                  const selected = stocks.find((s) => s.name === e.target.value);
                  setInboundForm({
                    ...inboundForm,
                    ingredientName: e.target.value,
                    unit: selected?.unit || 'kg',
                    unitPrice: selected?.unitPrice || 50000,
                  });
                }}
                aria-label="Chọn nguyên liệu nhập kho"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              >
                {stocks.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} (Tồn hiện tại: {s.quantity} {s.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Số lượng nhập *</label>
                <input
                  type="number"
                  required
                  value={inboundForm.qty}
                  onChange={(e) => setInboundForm({ ...inboundForm, qty: Number(e.target.value) })}
                  placeholder="25"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono font-bold focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Đơn vị tính</label>
                <input
                  type="text"
                  disabled
                  value={inboundForm.unit}
                  className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Đơn giá nhập (VNĐ)</label>
                <input
                  type="number"
                  value={inboundForm.unitPrice}
                  onChange={(e) => setInboundForm({ ...inboundForm, unitPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Hạn sử dụng (FEFO)</label>
                <input
                  type="text"
                  value={inboundForm.expiryDate}
                  onChange={(e) => setInboundForm({ ...inboundForm, expiryDate: e.target.value })}
                  placeholder="15/12/2026"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
              <span>Tổng tiền thanh toán lô nhập:</span>
              <span className="text-base font-mono">
                {formatCurrency(inboundForm.qty * inboundForm.unitPrice)}
              </span>
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold text-white">
                Xác Nhận & Lưu Phiếu Nhập Kho
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Create Outbound Issue (Xuất Kho Cho Bếp) */}
      <Dialog open={showOutboundModal} onOpenChange={setShowOutboundModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-600" />
              <span>Tạo Phiếu Xuất Kho Cho Bếp</span>
            </DialogTitle>
            <DialogDescription>
              Rút nguyên liệu từ kho chuyển cho đầu bếp chế biến các món ăn
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateOutbound} className="space-y-3.5 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Mục đích xuất kho *</label>
              <input
                type="text"
                required
                value={outboundForm.reason}
                onChange={(e) => setOutboundForm({ ...outboundForm, reason: e.target.value })}
                placeholder="VD: Xuất cho Bếp nấu cơm trưa"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Chọn nguyên liệu xuất *</label>
              <select
                value={outboundForm.ingredientName}
                onChange={(e) => {
                  const selected = stocks.find((s) => s.name === e.target.value);
                  setOutboundForm({
                    ...outboundForm,
                    ingredientName: e.target.value,
                    unit: selected?.unit || 'kg',
                  });
                }}
                aria-label="Chọn nguyên liệu xuất kho"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              >
                {stocks.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} (Khả dụng: {s.available} {s.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Số lượng xuất *</label>
                <input
                  type="number"
                  required
                  value={outboundForm.qty}
                  onChange={(e) => setOutboundForm({ ...outboundForm, qty: Number(e.target.value) })}
                  placeholder="5"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono font-bold focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Đơn vị</label>
                <input
                  type="text"
                  disabled
                  value={outboundForm.unit}
                  className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-muted-foreground"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" variant="default" className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-white">
                Xác Nhận Xuất Kho & Trừ Tồn
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Stock Audit & Adjustment (Kiểm Kê Kho) */}
      <Dialog open={!!adjustItem} onOpenChange={() => setAdjustItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              <span>Kiểm Kê & Điều Chỉnh Tồn Kho</span>
            </DialogTitle>
            <DialogDescription>
              Cập nhật số lượng kiểm đếm thực tế cho: <strong>{adjustItem?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAdjustment} className="space-y-3.5 py-2 text-xs">
            <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tồn trên hệ thống:</span>
                <span className="font-mono font-bold text-foreground">{adjustItem?.quantity} {adjustItem?.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đang giữ chỗ (Orders):</span>
                <span className="font-mono text-muted-foreground">{adjustItem?.reserved} {adjustItem?.unit}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Số lượng thực tế sau kiểm đếm ({adjustItem?.unit}) *</label>
              <input
                type="number"
                required
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                placeholder="Nhập số lượng đếm được..."
                className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono font-bold text-sm focus:ring-2 focus:ring-ring"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" variant="default" className="w-full font-bold">
                Lưu Kết Quả Kiểm Kê
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Add New Item */}
      <Dialog open={showAddItemModal} onOpenChange={setShowAddItemModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Đăng Ký Mặt Hàng Mới Vào Kho</span>
            </DialogTitle>
            <DialogDescription>
              Thêm nguyên vật liệu mới vào danh mục theo dõi tồn kho Căng tin DNU
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddNewItem} className="space-y-3.5 py-2 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Tên nguyên vật liệu *</label>
              <input
                type="text"
                required
                value={newItemForm.name}
                onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                placeholder="VD: Cốt dừa đóng lon Bến Tre"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Nhóm hàng</label>
                <select
                  value={newItemForm.category}
                  onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                  aria-label="Chọn nhóm hàng nguyên liệu"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="Thịt Tươi Sống">Thịt Tươi Sống</option>
                  <option value="Ngũ Cốc & Tinh Bột">Ngũ Cốc & Tinh Bột</option>
                  <option value="Rau Củ Tươi">Rau Củ Tươi</option>
                  <option value="Gia Cầm & Trứng">Gia Cầm & Trứng</option>
                  <option value="Pha Chế Đồ Uống">Pha Chế Đồ Uống</option>
                  <option value="Gia Vị & Đồ Khô">Gia Vị & Đồ Khô</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Đơn vị tính *</label>
                <input
                  type="text"
                  required
                  value={newItemForm.unit}
                  onChange={(e) => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                  placeholder="kg, lon, hộp, quả..."
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Số lượng ban đầu</label>
                <input
                  type="number"
                  value={newItemForm.quantity}
                  onChange={(e) => setNewItemForm({ ...newItemForm, quantity: e.target.value })}
                  placeholder="20"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Ngưỡng tối thiểu (Min)</label>
                <input
                  type="number"
                  value={newItemForm.minStock}
                  onChange={(e) => setNewItemForm({ ...newItemForm, minStock: e.target.value })}
                  placeholder="10"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg font-mono focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" variant="default" className="w-full font-bold">
                Thêm Vào Danh Mục Kho
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
