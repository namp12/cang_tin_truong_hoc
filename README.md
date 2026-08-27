# 🎓 DNU SMART CANTEEN — HỆ THỐNG QUẢN LÝ CĂNG TIN ĐẠI HỌC ĐẠI NAM THÔNG MINH

> **Đồ án / Dự án Phần mềm Quản lý Căng tin Trường Đại học Toàn diện (Smart Canteen Ecosystem)**  
> **Đơn vị ứng dụng thực tế:** Hệ thống Căng tin Trường Đại Học Đại Nam (DNU) — Số 1 Phố Xốm, Phú Lãm, Hà Đông, Hà Nội.  
> **Kiến trúc:** All-in-One Cloud & Local SaaS Web App (Admin ERP + POS Touch + KDS Bếp + Student Mobile Portal).

---

## 🌟 GIỚI THIỆU TỔNG QUAN

**DNU Smart Canteen** là giải pháp chuyển đổi số toàn diện cho chuỗi nhà ăn và căng tin trường học. Hệ thống giải quyết triệt để các vấn đề tắc nghẽn giờ cao điểm, thất thoát tồn kho thực phẩm, quản lý dòng tiền thu chi phức tạp, và nâng cao trải nghiệm ăn uống văn minh cho sinh viên thông qua các công nghệ thanh toán không tiền mặt và điều phối chế biến thông minh.

```
       ┌───────────────────────────────────────────────────────────┐
       │                👑 CĂNG TIN ĐẠI NAM (ADMIN ERP)            │
       │  • Dashboard KPI 7 Ngày  • Sổ Quỹ Thu Chi & Chi Phí Donut │
       │  • Quản Lý Kho FEFO & BOM • Phê Duyệt & Trả Lời Đánh Giá  │
       └──────────────┬─────────────────────────────┬──────────────┘
                      │                             │
    ┌─────────────────┴─────────────┐ ┌─────────────┴─────────────────┐
    │     💳 QUẦY THU NGÂN (POS)    │ │       👨‍🍳 BẾP NẤU (KDS)        │
    │ • Bán hàng cảm ứng Touch POS  │ │ • Kanban 3 Cột Điều Phối      │
    │ • In hóa đơn nhiệt 80mm/58mm  │ │ • Tự động trừ kho theo BOM    │
    │ • Quét VietQR / Ví DNU Pay    │ │ • Rung chuông gọi nhận món    │
    └─────────────────┬─────────────┘ └─────────────┬─────────────────┘
                      │                             │
       ┌──────────────┴─────────────────────────────┴──────────────┐
       │              👨‍🎓 CỔNG SINH VIÊN (MOBILE WEB APP)           │
       │  • Đặt món trước online   • Ví điện tử DNU Pay nạp rút   │
       │  • Theo dõi đơn Live      • Đánh giá & Review món đã ăn  │
       └───────────────────────────────────────────────────────────┘
```

---

## 🚀 CÁC PHÂN HỆ NGHIỆP VỤ NỔI BẬT

### 1. 👨‍🎓 Cổng Sinh Viên Mobile-First (`/student/home`)
- **Đặt món trực tuyến:** Duyệt thực đơn theo danh mục (Cơm phần, Bún phở, Đồ ăn vặt, Nước ép & Trà sữa), chọn vị trí nhận món (Tòa G, Tòa A-B, Khu Thể Thao).
- **Ví Điện Tử DNU Pay:** Tích hợp thẻ sinh viên số, nạp tiền nhanh (+20k, +50k, +100k, +200k) qua VietQR MoMo/Ngân hàng, thanh toán 1-chạm không cần tiền mặt.
- **Theo dõi tiến độ đơn hàng Live (Order Tracking):** Hiển thị trạng thái đơn trực quan theo thời gian thực (Chờ tiếp nhận $\rightarrow$ Bếp đang nấu $\rightarrow$ Mời nhận món $\rightarrow$ Hoàn tất).
- **Cộng đồng Đánh giá Món ăn (Verified Social Reviews):**
  - **Chỉ sinh viên đã mua & hoàn thành đơn** mới được đánh giá món ăn (`⭐ Đánh Giá Món`).
  - Sinh viên trong trường có thể like và viết bình luận thảo luận chéo.
  - Nhận phản hồi chính thức trực tiếp từ **`Căng tin Đại Nam`**.

---

### 2. 💳 Màn Hình Bán Hàng Thu Ngân POS (`/admin/pos`)
- **Giao diện Touch POS tối ưu:** Thao tác cảm ứng siêu tốc, tìm kiếm nhanh theo mã món hoặc tên món, lọc theo danh mục.
- **Áp dụng Mã Giảm Giá & Voucher:** Tự động kiểm tra điều kiện áp dụng voucher sinh viên (ví dụ: `DNUCHAO2026`, `DNUFOOD`).
- **In Hóa Đơn Nhiệt Tiêu Chuẩn:**
  - Hỗ trợ xem trước và in trực tiếp ra máy in nhiệt **Khổ 80mm (K80)** và **Khổ 58mm (K58)**.
  - Đầy đủ thông tin: Logo DNU, Chi nhánh Tòa G, Bàn, Tên thu ngân, QR tra cứu đơn và Lời cảm ơn.
- **Thanh toán đa kênh:** Tiền mặt (tính tiền thối tự động), Ví DNU Pay, VietQR Động MoMo/Ngân hàng.

---

### 3. 👨‍🍳 Màn Hình Điều Phối Bếp KDS (`/admin/kitchen`)
- **Bảng Kanban 3 Cột Trực Quan:**
  - `ĐANG CHỜ TIẾP NHẬN` $\rightarrow$ `BẾP ĐANG NẤU (COOKING)` $\rightarrow$ `ĐÃ SẴN SÀNG (READY)`.
- **Bộ đếm thời gian chế biến:** Cảnh báo đổi màu thẻ nếu đơn hàng chờ quá 15 phút.
- **Rung chuông mời nhận món:** Tự động phát âm thanh chuông báo và bắn thông báo tới điện thoại sinh viên khi bếp bấm hoàn thành món.

---

### 4. 📦 Định Lượng Món Ăn & Tự Động Trừ Tồn Kho (BOM ERP) (`/admin/inventory`)
- **Định lượng công thức chuẩn (Bill of Materials - BOM):**
  - 🍗 *Cơm Gà Xối Mỡ:* 0.3kg Đùi gà tươi CP + 0.15kg Gạo ST25 + 1 quả Trứng Ba Huân.
  - 🥩 *Phở Bò Tái Lăn DNU:* 0.15kg Thịt thăn bò tươi + 0.1kg Bánh phở.
  - 🍚 *Cơm Rang Dưa Bò:* 0.12kg Thịt bò + 0.18kg Gạo ST25 + 1 quả Trứng gà.
  - 🥓 *Bún Chả Hà Nội:* 0.2kg Sườn non heo tươi CP.
  - 🍳 *Bánh Mì Chảo:* 2 quả Trứng gà + 0.1kg Sườn non/pate.
- **Cơ chế Tự Động Trừ Tồn Kho:**
  - Khi đơn hàng được tạo, hệ thống **tự động nhân số lượng suất ăn với định lượng và trừ trực tiếp vào tồn kho thực tế**.
  - Tự động sinh **Phiếu Xuất Kho Tự Động (`PXK-AUTO-xxx`)** lưu vết trong tab *Phiếu Xuất Cho Bếp*.
  - Tự động bật cảnh báo vàng/đỏ **`LOW_STOCK`** khi nguyên liệu giảm xuống dưới ngưỡng an toàn tối thiểu (`minStock`).

---

### 5. 💰 Quản Lý Tài Chính & Sổ Quỹ Thu Chi Căng Tin (`/admin/finance`)
- **4 Thẻ Chỉ Số KPI Sức Khỏe Tài Chính:**
  - 🟢 **Tổng Thu Thực Tế (Inflow):** Doanh thu bán lẻ POS + Cổng sinh viên + Tiền nạp quỹ.
  - 🔴 **Tổng Chi Hoạt Động (Outflow):** Tiền mua nguyên liệu NCC + Điện nước + Lương nhân sự.
  - 🔵 **Số Dư Quỹ Khả Dụng (Net Cash):** Lượng tiền mặt và ngân hàng thực tế đang có.
  - 🟣 **Ví DNU Pay Lưu Thông:** Tổng tiền sinh viên đang ký gửi trong ví.
- **Biểu Đồ Trực Quan Dễ Hiểu:**
  - **Donut Chart Cơ Cấu Chi Phí:** Phân tách rõ ràng (Thực phẩm & NCC 55%, Lương nhân viên 20%, Điện nước mặt bằng 18%, Tiêu hao 7%).
  - **Bar Chart 7 Ngày:** So sánh đối ứng Thu - Chi từng ngày trong tuần.
- **Sổ Quỹ Tiền Mặt & Ngân Hàng:** Tìm kiếm, lọc theo ngày/loại thu chi, tạo Phiếu Thu / Phiếu Chi tức thời.

---

### 6. 🔔 Hệ Thống Thông Báo Thông Suốt Đa Kênh (Omnichannel Realtime Notifications)
- **Đồng bộ sự kiện thời gian thực** giữa Admin $\leftrightarrow$ Thu Ngân $\leftrightarrow$ Đầu Bếp $\leftrightarrow$ Sinh Viên:
  - Sinh viên đặt món $\rightarrow$ Bắn thông báo tới Bếp & Thu ngân.
  - Bếp nấu xong $\rightarrow$ Bắn thông báo mời nhận món tới Sinh viên.
  - Kho sắp hết nguyên liệu $\rightarrow$ Bắn cảnh báo tới Admin & Bếp trưởng.
  - Sinh viên đánh giá món $\rightarrow$ Bắn thông báo tới Ban Quản Lý để phản hồi.
- Nhấp vào thông báo để tự động chuyển hướng chính xác đến trang xử lý nghiệp vụ tương ứng.

---

## 🛠️ TECH STACK CHI TIẾT

### Frontend
- **Core:** React 18 + TypeScript + Vite (Hot Module Replacement)
- **Styling:** Tailwind CSS + Lucide Icons + Custom CSS Glassmorphism
- **Charts & Visualization:** Recharts (Area, Bar, Pie / Donut Charts)
- **State & Data Bridge:** Custom Singleton Store (`dnuStore`) với cơ chế lắng nghe sự kiện đa tab (`storage` & `dnu_store_updated`).
- **Routing:** React Router v7 với RBAC Protected Route Guards.

### Backend
- **Runtime:** Node.js + Express + TypeScript
- **Database Connector:** MySQL2 (Connection Pool Promise-based)
- **Security:** JWT Authentication (Access Token + Refresh Token), Bcrypt Hashing, Helmet HTTP Headers, CORS.
- **API Architecture:** Modular MVC (Controllers, Services, Routes, Middlewares).

### Database
- **DBMS:** MySQL 8.x (InnoDB, Chống Race Condition, Stored Procedures, Views).
- **Bộ Dữ Liệu:** Chuẩn hóa toàn bộ thực đơn, danh mục, kho nguyên liệu và phân quyền tài khoản cho Trường Đại Học Đại Nam.

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN

```text
d:/btl/
├── canteen_management.sql                 # File Database SQL hoàn chỉnh (Schema & Seed Data)
├── start_all.bat                          # File Batch script khởi động 1-click toàn bộ hệ thống
│
├── backend/                               # Backend REST API Server (Node.js + TypeScript)
│   ├── src/
│   │   ├── config/                        # Cấu hình MySQL Pool & Biến môi trường
│   │   ├── middlewares/                   # JWT Auth, Role Guard, Error Handler
│   │   ├── modules/                       # Auth, Dashboard, Foods, Orders, Inventory, Finance...
│   │   ├── utils/                         # ApiError, ApiResponse
│   │   └── server.ts                      # Entry Point API Server
│   ├── .env.example
│   └── package.json
│
└── frontend/                              # Frontend Web Application (React + TypeScript + Vite)
    ├── src/
    │   ├── components/
    │   │   ├── common/                    # UserProfileModal, SystemDiagnosticsModal, AiAssistant...
    │   │   ├── layout/                    # Header, Sidebar, AdminLayout, StudentLayout...
    │   │   └── ui/                        # Button, Card, Badge, Dialog, Modal...
    │   ├── contexts/                      # AuthContext, ThemeContext
    │   ├── features/
    │   │   ├── auth/                      # LoginPage, RegisterPage
    │   │   ├── dashboard/                 # DashboardPage, RevenueChart, StatCards
    │   │   ├── pos/                       # PosPage (Bán hàng cảm ứng & In hóa đơn nhiệt)
    │   │   ├── orders/                    # OrdersPage (Danh sách & Lịch sử đơn hàng)
    │   │   ├── kitchen/                   # KitchenPage (KDS Bếp Kanban)
    │   │   ├── foods/                     # FoodsPage (Quản lý món ăn & Thực đơn)
    │   │   ├── inventory/                 # InventoryPage (Kho, Nhập xuất, Định lượng BOM)
    │   │   ├── finance/                   # FinancePage (Sổ quỹ thu chi & Donut Chart chi phí)
    │   │   ├── reviews/                   # ReviewsPage (Đánh giá sinh viên & BQL phản hồi)
    │   │   └── student/                   # StudentHomePage, StudentCartPage, StudentProfilePage
    │   ├── services/                      # dnuStore.ts, orderStorage.ts, auth.service.ts
    │   ├── types/                         # TypeScript Type Interfaces
    │   └── routes/                        # AppRoutes.tsx
    ├── vite.config.ts
    └── package.json
```

---

## ⚡ HƯỚNG DẪN CÀI ĐẶT & CHẠY HỆ THỐNG

### Cách 1: Chạy 1-Click Nhanh Nhất (Khuyên Dùng Trên Windows)
Chỉ cần nhấp đúp vào file `start_all.bat` tại thư mục gốc:
```bat
.\start_all.bat
```
Script sẽ tự động khởi động đồng thời cả Backend API (`http://localhost:5000`) và Frontend App (`http://localhost:5173`).

---

### Cách 2: Chạy Thủ Công Từng Phần

#### 1. Khởi tạo Cơ Sở Dữ Liệu MySQL
Import file SQL vào MySQL Server 8.x:
```bash
mysql -u root -p < canteen_management.sql
```

#### 2. Cài đặt & Chạy Backend
```bash
cd backend
npm install
npm run dev
```
- API Server: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/v1/health`

#### 3. Cài đặt & Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🔑 DANH SÁCH TÀI KHOẢN TRẢI NGHIỆM DEMO

> **Mật khẩu chung cho tất cả tài khoản:** `Password@123` (hoặc `123456` / `admin`)

| Vai trò (Role) | Tên tài khoản (Username) | Tên hiển thị thực tế | Quyền hạn & Màn hình chính |
| :--- | :--- | :--- | :--- |
| **Quản Trị Viên Cấp Cao** | `admin_super` | **Căng tin Đại Nam** | Toàn quyền quản trị ERP, Dashboard KPI, Sổ quỹ, Kho BOM, Trả lời review sinh viên (`/admin/dashboard`). |
| **Quản Lý Căng Tin Chi Nhánh** | `manager_canteen1` | **Trần Thị Thu Thảo** | Quản lý bán hàng, nhập kho, duyệt đơn chi nhánh Tòa G (`/admin/dashboard`). |
| **Nhân Viên Thu Ngân** | `cashier_01` | **Phạm Quỳnh Như** | Bán hàng Touch POS, In hóa đơn nhiệt K80/K58, Thanh toán đơn (`/admin/pos`). |
| **Bếp Trưởng Căng Tin** | `chef_01` | **Võ Hoàng Hải** | Điều phối nấu ăn trên KDS, Rung chuông gọi sinh viên nhận món (`/admin/kitchen`). |
| **Sinh Viên DNU** | `student_2110001` | **Nguyễn Thành Nam** | Đặt món online, Ví DNU Pay, Theo dõi đơn, Đánh giá món (`/student/home`). |

---

## 🛡️ MA TRẬN PHÂN QUYỀN RBAC (ROLE-BASED ACCESS CONTROL)

| Chức Năng Nghiệp Vụ | Sinh Viên (`STUDENT`) | Đầu Bếp (`KITCHEN`) | Thu Ngân (`CASHIER`) | Admin / BQL (`Căng tin Đại Nam`) |
| :--- | :---: | :---: | :---: | :---: |
| Đặt món online & Nạp ví DNU Pay | ✅ | ❌ | ❌ | ✅ |
| Bán hàng Touch POS & Áp Voucher | ❌ | ❌ | ✅ | ✅ |
| In hóa đơn nhiệt K80 / K58 | ❌ | ❌ | ✅ | ✅ |
| Chuyển trạng thái nấu ăn trên KDS | ❌ | ✅ | ❌ | ✅ |
| Đánh giá & Chấm sao món ăn đã mua | ✅ | ❌ | ❌ | ❌ |
| Trả lời chính thức & Xóa đánh giá | ❌ | ❌ | ❌ | ✅ |
| Quản lý Kho, Nhập xuất & Định lượng BOM | ❌ | ❌ | ❌ | ✅ |
| Xem Sổ quỹ tài chính & Phân bổ chi phí | ❌ | ❌ | ❌ | ✅ |

---

## 🏆 ĐÓNG GÓP & BẢN QUYỀN
- **Dự án:** Hệ thống Quản Lý Căng Tin Trường Đại Học Đại Nam Thông Minh (DNU Smart Canteen).
- **Phát triển bởi:** Nhóm sinh viên Công Nghệ Thông Tin — Trường Đại Học Đại Nam.
- **Mã nguồn:** Lưu trữ tại GitHub [`https://github.com/namp12/cang_tin_truong_hoc.git`](https://github.com/namp12/cang_tin_truong_hoc.git).
