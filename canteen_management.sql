-- ==============================================================================
-- CƠ SỞ DỮ LIỆU QUẢN LÝ CĂNG TIN TRƯỜNG HỌC (SCHOOL CANTEEN MANAGEMENT SYSTEM)
-- Phiên bản: 1.0 Production-Ready (MySQL 8.x)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==============================================================================

DROP DATABASE IF EXISTS canteen_management;
CREATE DATABASE canteen_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE canteen_management;

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES';

-- ==============================================================================
-- PHẦN 1: QUẢN LÝ TRƯỜNG & TỔ CHỨC (SCHOOLS & ORGANIZATIONAL STRUCTURE)
-- ==============================================================================

-- 1. Trường học (Schools)
CREATE TABLE schools (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NULL,
    tax_code VARCHAR(50) NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    website VARCHAR(255) NULL,
    address TEXT NULL,
    logo_url VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    INDEX idx_schools_code (code),
    INDEX idx_schools_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Cơ sở / Chi nhánh (Campuses)
CREATE TABLE campuses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    address TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT uk_campuses_school_code UNIQUE (school_id, code),
    CONSTRAINT fk_campuses_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_campuses_school_id (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Khoa / Viện / Ban (Faculties)
CREATE TABLE faculties (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    campus_id BIGINT UNSIGNED NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT uk_faculties_school_code UNIQUE (school_id, code),
    CONSTRAINT fk_faculties_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_faculties_campus FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_faculties_school_id (school_id),
    INDEX idx_faculties_campus_id (campus_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Lớp học (Classes)
CREATE TABLE classes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    faculty_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(50) NOT NULL COMMENT 'Ví dụ: 2022-2026, K65',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT uk_classes_faculty_code UNIQUE (faculty_id, code),
    CONSTRAINT fk_classes_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_classes_faculty_id (faculty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 2: USER, AUTHENTICATION & PHÂN QUYỀN RBAC
-- ==============================================================================

-- 5. Vai trò hệ thống (Roles)
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'SUPER_ADMIN, CANTEEN_MANAGER, CASHIER, KITCHEN_STAFF, WAREHOUSE_MANAGER, ACCOUNTANT, STUDENT, TEACHER, STAFF',
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    is_system BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'TRUE: không được xóa role cốt lõi',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_roles_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Danh mục quyền hạn (Permissions)
CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    module VARCHAR(50) NOT NULL COMMENT 'USERS, FOODS, ORDERS, INVENTORY, FINANCE, REPORTS, KITCHEN...',
    code VARCHAR(100) NOT NULL UNIQUE COMMENT 'food:create, order:view, inventory:export...',
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_permissions_module (module),
    INDEX idx_permissions_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Quyền của vai trò (Role Permissions)
CREATE TABLE role_permissions (
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Người dùng hệ thống (Users)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('STUDENT', 'TEACHER', 'EMPLOYEE', 'ADMIN', 'EXTERNAL') NOT NULL DEFAULT 'STUDENT',
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    avatar_url VARCHAR(500) NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'OTHER',
    birth_date DATE NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    INDEX idx_users_username (username),
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone),
    INDEX idx_users_type (user_type),
    INDEX idx_users_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Gán nhiều vai trò cho người dùng (User Roles)
CREATE TABLE user_roles (
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Phiên đăng nhập & Refresh Token (Refresh Tokens)
CREATE TABLE refresh_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    user_agent VARCHAR(500) NULL,
    ip_address VARCHAR(45) NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_rt_user_id (user_id),
    INDEX idx_rt_token (token),
    INDEX idx_rt_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Lịch sử đăng nhập (Login Histories)
CREATE TABLE login_histories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    username_attempted VARCHAR(100) NOT NULL,
    status ENUM('SUCCESS', 'FAILED_PASSWORD', 'ACCOUNT_LOCKED', 'USER_NOT_FOUND') NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    device_type VARCHAR(50) NULL,
    attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_lh_user_id (user_id),
    INDEX idx_lh_attempted_at (attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Quên mật khẩu / Đặt lại mật khẩu (Password Resets)
CREATE TABLE password_resets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_pr_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 3: THÔNG TIN CHI TIẾT SINH VIÊN, GIẢNG VIÊN, NHÂN VIÊN
-- ==============================================================================

-- 13. Sinh viên (Students)
CREATE TABLE students (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    school_id BIGINT UNSIGNED NOT NULL,
    campus_id BIGINT UNSIGNED NOT NULL,
    faculty_id BIGINT UNSIGNED NOT NULL,
    class_id BIGINT UNSIGNED NOT NULL,
    student_code VARCHAR(50) NOT NULL UNIQUE,
    id_card_number VARCHAR(30) NULL,
    enrollment_year YEAR NOT NULL,
    graduation_year YEAR NULL,
    status ENUM('STUDYING', 'RESERVED', 'GRADUATED', 'DROPPED') NOT NULL DEFAULT 'STUDYING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_students_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_students_campus FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_students_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_students_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_students_student_code (student_code),
    INDEX idx_students_class_id (class_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Giảng viên (Teachers)
CREATE TABLE teachers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    school_id BIGINT UNSIGNED NOT NULL,
    campus_id BIGINT UNSIGNED NOT NULL,
    faculty_id BIGINT UNSIGNED NOT NULL,
    teacher_code VARCHAR(50) NOT NULL UNIQUE,
    academic_rank VARCHAR(50) NULL COMMENT 'Thạc sĩ, Tiến sĩ, PGS, GS',
    status ENUM('ACTIVE', 'ON_LEAVE', 'RETIRED', 'RESIGNED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_teachers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_teachers_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_teachers_campus FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_teachers_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_teachers_code (teacher_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Phòng ban nhân sự trường / căng tin (Employee Departments)
CREATE TABLE employee_departments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Chức vụ nhân viên (Employee Positions)
CREATE TABLE employee_positions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    base_salary DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Nhân viên vận hành & nhà trường (Employees)
CREATE TABLE employees (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    school_id BIGINT UNSIGNED NOT NULL,
    campus_id BIGINT UNSIGNED NOT NULL,
    department_id BIGINT UNSIGNED NULL,
    position_id BIGINT UNSIGNED NULL,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    hire_date DATE NOT NULL,
    contract_type ENUM('FULL_TIME', 'PART_TIME', 'PROBATION', 'INTERNSHIP') NOT NULL DEFAULT 'FULL_TIME',
    status ENUM('ACTIVE', 'ON_LEAVE', 'TERMINATED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_employees_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_employees_campus FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_employees_dept FOREIGN KEY (department_id) REFERENCES employee_departments(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_employees_pos FOREIGN KEY (position_id) REFERENCES employee_positions(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_employees_code (employee_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 4: CĂNG TIN, QUẦY PHỤC VỤ, KHU ĂN & BÀN (CANTEENS & INFRASTRUCTURE)
-- ==============================================================================

-- 18. Căng tin (Canteens)
CREATE TABLE canteens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    campus_id BIGINT UNSIGNED NOT NULL,
    manager_employee_id BIGINT UNSIGNED NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    location_description TEXT NULL COMMENT 'Tòa nhà A, Tầng 1...',
    opening_time TIME NOT NULL DEFAULT '06:30:00',
    closing_time TIME NOT NULL DEFAULT '20:00:00',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT uk_canteens_campus_code UNIQUE (campus_id, code),
    CONSTRAINT fk_canteens_campus FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_canteens_manager FOREIGN KEY (manager_employee_id) REFERENCES employees(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_canteens_campus_id (campus_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Phân bổ nhân viên làm việc tại các Căng tin (Employee Canteens)
CREATE TABLE employee_canteens (
    employee_id BIGINT UNSIGNED NOT NULL,
    canteen_id BIGINT UNSIGNED NOT NULL,
    role_at_canteen VARCHAR(100) NOT NULL COMMENT 'Trưởng quầy, Đầu bếp chính, Thu ngân...',
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, canteen_id),
    CONSTRAINT fk_ec_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ec_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Quầy phục vụ / Quầy thu ngân trong Căng tin (Counters)
CREATE TABLE counters (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL COMMENT 'Quầy Cơm, Quầy Nước & Tráng Miệng, Quầy Bún Phở...',
    counter_type ENUM('FOOD', 'DRINK', 'SNACK', 'FAST_FOOD', 'ALL_IN_ONE') NOT NULL DEFAULT 'FOOD',
    pos_terminal_code VARCHAR(100) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_counters_canteen_code UNIQUE (canteen_id, code),
    CONSTRAINT fk_counters_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_counters_canteen_id (canteen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Khu vực ăn uống (Dining Areas)
CREATE TABLE dining_areas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL COMMENT 'Khu trong nhà máy lạnh, Khu sân vườn ngoài trời, Tầng lửng VIP...',
    floor_number INT NOT NULL DEFAULT 1,
    capacity INT NOT NULL DEFAULT 50,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_dining_areas_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_dining_areas_canteen_id (canteen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. Bàn ăn (Dining Tables)
CREATE TABLE dining_tables (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dining_area_id BIGINT UNSIGNED NOT NULL,
    canteen_id BIGINT UNSIGNED NOT NULL,
    table_number VARCHAR(50) NOT NULL,
    seats INT NOT NULL DEFAULT 4,
    qr_code_token VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'OUT_OF_SERVICE') NOT NULL DEFAULT 'AVAILABLE',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_dining_tables_area_table UNIQUE (dining_area_id, table_number),
    CONSTRAINT fk_dining_tables_area FOREIGN KEY (dining_area_id) REFERENCES dining_areas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_dining_tables_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_dining_tables_status (status),
    INDEX idx_dining_tables_qr (qr_code_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. Phiên sử dụng bàn (Table Sessions)
CREATE TABLE table_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    table_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    session_code VARCHAR(100) NOT NULL UNIQUE,
    start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME NULL,
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_table_sessions_table FOREIGN KEY (table_id) REFERENCES dining_tables(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_table_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_table_sessions_active (table_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 5: ĐƠN VỊ TÍNH, NGUYÊN LIỆU & CÔNG THỨC MÓN (RECIPES & INGREDIENTS)
-- ==============================================================================

-- 24. Đơn vị tính (Units)
CREATE TABLE units (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE COMMENT 'g, kg, ml, l, piece, pack, can, bottle, portion...',
    name VARCHAR(100) NOT NULL,
    unit_type ENUM('WEIGHT', 'VOLUME', 'COUNT', 'PACKAGE') NOT NULL DEFAULT 'COUNT',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 25. Bảng quy đổi đơn vị tính (Unit Conversions)
CREATE TABLE unit_conversions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    from_unit_id BIGINT UNSIGNED NOT NULL,
    to_unit_id BIGINT UNSIGNED NOT NULL,
    conversion_rate DECIMAL(15,6) NOT NULL COMMENT 'Ví dụ: 1 kg = 1000 g -> rate = 1000',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_unit_conversions UNIQUE (from_unit_id, to_unit_id),
    CONSTRAINT fk_uc_from_unit FOREIGN KEY (from_unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_uc_to_unit FOREIGN KEY (to_unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_unit_conversion_rate CHECK (conversion_rate > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 26. Danh mục nguyên liệu (Ingredient Categories)
CREATE TABLE ingredient_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE COMMENT 'Thịt tươi, Rau củ, Gia vị, Đồ uống đóng chai, Khô...',
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 27. Nguyên liệu thô / Bán thành phẩm (Ingredients)
CREATE TABLE ingredients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    base_unit_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    average_cost_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    min_stock_level DECIMAL(12,3) NOT NULL DEFAULT 5.000 COMMENT 'Cảnh báo sắp hết',
    max_stock_level DECIMAL(12,3) NOT NULL DEFAULT 500.000 COMMENT 'Cảnh báo đầy kho',
    storage_type ENUM('ROOM_TEMP', 'CHILLED', 'FROZEN', 'DRY') NOT NULL DEFAULT 'ROOM_TEMP',
    shelf_life_days INT NOT NULL DEFAULT 30 COMMENT 'Số ngày bảo quản trung bình',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_ingredients_category FOREIGN KEY (category_id) REFERENCES ingredient_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ingredients_unit FOREIGN KEY (base_unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_ingredients_cost CHECK (average_cost_price >= 0),
    INDEX idx_ingredients_code (code),
    INDEX idx_ingredients_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 6: DANH MỤC MÓN ĂN, PHÂN LOẠI, BIẾN THỂ, TOPPING & COMBO
-- ==============================================================================

-- 28. Danh mục món ăn (Categories)
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NULL COMMENT 'NULL = Dùng chung toàn trường',
    parent_id BIGINT UNSIGNED NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    icon_url VARCHAR(500) NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_categories_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_categories_canteen (canteen_id),
    INDEX idx_categories_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 29. Danh mục phụ (Subcategories)
CREATE TABLE subcategories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_subcategories_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 30. Món ăn / Đồ uống (Foods)
CREATE TABLE foods (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    counter_id BIGINT UNSIGNED NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    subcategory_id BIGINT UNSIGNED NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    base_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    cost_price DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá vốn ước tính',
    thumbnail_url VARCHAR(500) NULL,
    sales_start_time TIME NULL,
    sales_end_time TIME NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    status ENUM('ACTIVE', 'SOLD_OUT', 'DISCONTINUED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT uk_foods_canteen_code UNIQUE (canteen_id, code),
    CONSTRAINT fk_foods_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_foods_counter FOREIGN KEY (counter_id) REFERENCES counters(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_foods_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_foods_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_foods_price CHECK (base_price >= 0 AND cost_price >= 0),
    INDEX idx_foods_name (name),
    INDEX idx_foods_category (category_id),
    INDEX idx_foods_canteen_avail (canteen_id, is_available, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 31. Hình ảnh chi tiết món ăn (Food Images)
CREATE TABLE food_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    food_id BIGINT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255) NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_food_images_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_food_images_food_id (food_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 32. Biến thể món ăn (Food Variants - Size S, M, L, Lựa chọn ít cay/nhiều cơm...)
CREATE TABLE food_variants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    food_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL COMMENT 'Size S, Size M, Size L, Thêm sườn, Tô đặc biệt...',
    price_adjustment DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá chênh lệch so với base_price (hoặc cộng thêm)',
    final_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_food_variants_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_variant_price CHECK (final_price >= 0),
    INDEX idx_food_variants_food_id (food_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 33. Món ăn kèm / Topping (Toppings)
CREATE TABLE toppings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL COMMENT 'Trứng ốp la, Xúc xích, Phô mai, Trân châu đen, Thạch...',
    price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    cost_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT uk_toppings_canteen_code UNIQUE (canteen_id, code),
    CONSTRAINT fk_toppings_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_toppings_price CHECK (price >= 0),
    INDEX idx_toppings_canteen_id (canteen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 34. Quan hệ N-N giữa Món ăn và Topping được phép áp dụng (Food Toppings)
CREATE TABLE food_toppings (
    food_id BIGINT UNSIGNED NOT NULL,
    topping_id BIGINT UNSIGNED NOT NULL,
    max_quantity INT NOT NULL DEFAULT 5,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (food_id, topping_id),
    CONSTRAINT fk_ft_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ft_topping FOREIGN KEY (topping_id) REFERENCES toppings(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 35. Gói Combo tiết kiệm (Combos)
CREATE TABLE combos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL COMMENT 'Combo cơm trưa + nước ngọt, Combo ăn sáng sinh viên...',
    description TEXT NULL,
    price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    original_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    thumbnail_url VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATE NULL,
    end_date DATE NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT uk_combos_canteen_code UNIQUE (canteen_id, code),
    CONSTRAINT fk_combos_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_combos_price CHECK (price >= 0),
    INDEX idx_combos_canteen (canteen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 36. Chi tiết món trong Combo (Combo Items)
CREATE TABLE combo_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    combo_id BIGINT UNSIGNED NOT NULL,
    food_id BIGINT UNSIGNED NOT NULL,
    food_variant_id BIGINT UNSIGNED NULL,
    quantity INT NOT NULL DEFAULT 1,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ci_combo FOREIGN KEY (combo_id) REFERENCES combos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ci_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ci_variant FOREIGN KEY (food_variant_id) REFERENCES food_variants(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_ci_quantity CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 37. Công thức định lượng món ăn (Recipes)
CREATE TABLE recipes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    food_id BIGINT UNSIGNED NOT NULL,
    food_variant_id BIGINT UNSIGNED NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    yield_quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00 COMMENT 'Định lượng tính cho bao nhiêu suất (ví dụ: 1 suất)',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_recipes_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_recipes_variant FOREIGN KEY (food_variant_id) REFERENCES food_variants(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_recipes_food_id (food_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 38. Chi tiết nguyên liệu định mức cho món ăn (Recipe Items)
CREATE TABLE recipe_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT UNSIGNED NOT NULL,
    ingredient_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(12,4) NOT NULL COMMENT 'Lượng nguyên liệu tiêu hao (ví dụ: 0.200 kg gà, 0.010 l dầu)',
    unit_id BIGINT UNSIGNED NOT NULL,
    notes VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_recipe_items UNIQUE (recipe_id, ingredient_id),
    CONSTRAINT fk_ri_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ri_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ri_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_ri_quantity CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 7: NHÀ CUNG CẤP & MUA HÀNG (SUPPLIERS & PROCUREMENT)
-- ==============================================================================

-- 39. Nhà cung cấp (Suppliers)
CREATE TABLE suppliers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NULL COMMENT 'Nhóm hàng cung cấp',
    tax_code VARCHAR(50) NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NULL,
    address TEXT NOT NULL,
    contact_person VARCHAR(100) NULL,
    payment_terms_days INT NOT NULL DEFAULT 30 COMMENT 'Hạn công nợ',
    rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    INDEX idx_suppliers_code (code),
    INDEX idx_suppliers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 40. Người liên hệ nhà cung cấp (Supplier Contacts)
CREATE TABLE supplier_contacts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sc_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 41. Danh mục nguyên liệu do Nhà cung cấp phân phối (Supplier Ingredients)
CREATE TABLE supplier_ingredients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT UNSIGNED NOT NULL,
    ingredient_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    supplier_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    lead_time_days INT NOT NULL DEFAULT 1 COMMENT 'Thời gian giao hàng tính bằng ngày',
    is_preferred BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_supplier_ingredient UNIQUE (supplier_id, ingredient_id),
    CONSTRAINT fk_si_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_si_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_si_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_si_price CHECK (supplier_price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 42. Đơn đặt hàng nhập kho (Purchase Orders)
CREATE TABLE purchase_orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    supplier_id BIGINT UNSIGNED NOT NULL,
    created_by_user_id BIGINT UNSIGNED NOT NULL,
    approved_by_user_id BIGINT UNSIGNED NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    order_date DATE NOT NULL,
    expected_delivery_date DATE NULL,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    final_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    notes TEXT NULL,
    status ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'PARTIALLY_RECEIVED', 'COMPLETED', 'CANCELLED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_po_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_po_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_po_approved_by FOREIGN KEY (approved_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_po_code (code),
    INDEX idx_po_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 43. Chi tiết đơn đặt hàng nhập kho (Purchase Order Items)
CREATE TABLE purchase_order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    purchase_order_id BIGINT UNSIGNED NOT NULL,
    ingredient_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    quantity_ordered DECIMAL(12,3) NOT NULL,
    quantity_received DECIMAL(12,3) NOT NULL DEFAULT 0.000,
    unit_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    notes VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_poi_po FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_poi_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_poi_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_poi_qty CHECK (quantity_ordered > 0 AND quantity_received >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 8: QUẢN LÝ KHO, LÔ HÀNG, FIFO/FEFO & BIẾN ĐỘNG KHO (INVENTORY & WAREHOUSES)
-- ==============================================================================

-- 44. Kho hàng (Warehouses)
CREATE TABLE warehouses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    manager_employee_id BIGINT UNSIGNED NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    warehouse_type ENUM('CENTRAL_STORAGE', 'CANTEEN_KITCHEN_STORAGE', 'COLD_STORAGE', 'DRY_STORAGE') NOT NULL DEFAULT 'CANTEEN_KITCHEN_STORAGE',
    address TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT uk_warehouses_canteen_code UNIQUE (canteen_id, code),
    CONSTRAINT fk_warehouses_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_warehouses_manager FOREIGN KEY (manager_employee_id) REFERENCES employees(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_warehouses_canteen_id (canteen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 45. Vị trí / Kệ / Ô chứa trong Kho (Warehouse Locations)
CREATE TABLE warehouse_locations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT 'Kệ A1, Tủ đông 02, Ngăn mát 01...',
    temperature_zone ENUM('AMBIENT', 'COOL', 'FROZEN') NOT NULL DEFAULT 'AMBIENT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_wh_locations_code UNIQUE (warehouse_id, code),
    CONSTRAINT fk_wh_locations_wh FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 46. Tổng hợp tồn kho tức thời (Inventory Stocks)
CREATE TABLE inventory_stocks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    ingredient_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(15,3) NOT NULL DEFAULT 0.000,
    reserved_quantity DECIMAL(15,3) NOT NULL DEFAULT 0.000 COMMENT 'Lượng đã được đặt nhưng chưa xuất bếp',
    available_quantity DECIMAL(15,3) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    last_counted_at DATETIME NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_inventory_stocks UNIQUE (warehouse_id, ingredient_id),
    CONSTRAINT fk_is_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_is_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_is_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_is_quantity CHECK (quantity >= 0),
    INDEX idx_is_wh_ing (warehouse_id, ingredient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 47. Lô hàng tồn kho (Inventory Batches - Hỗ trợ FIFO / FEFO)
CREATE TABLE inventory_batches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    location_id BIGINT UNSIGNED NULL,
    ingredient_id BIGINT UNSIGNED NOT NULL,
    supplier_id BIGINT UNSIGNED NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    initial_quantity DECIMAL(15,3) NOT NULL,
    remaining_quantity DECIMAL(15,3) NOT NULL,
    unit_cost_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    manufacturing_date DATE NULL,
    expiry_date DATE NOT NULL,
    status ENUM('IN_STOCK', 'DEPLETED', 'EXPIRED', 'DISCARDED') NOT NULL DEFAULT 'IN_STOCK',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_inventory_batches UNIQUE (warehouse_id, ingredient_id, batch_number),
    CONSTRAINT fk_ib_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ib_location FOREIGN KEY (location_id) REFERENCES warehouse_locations(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_ib_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ib_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_ib_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_ib_remaining_qty CHECK (remaining_quantity >= 0),
    INDEX idx_ib_expiry (expiry_date),
    INDEX idx_ib_status (status),
    INDEX idx_ib_fifo (ingredient_id, expiry_date, remaining_quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 48. Phiếu nhập kho thực tế (Goods Receipts)
CREATE TABLE goods_receipts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    purchase_order_id BIGINT UNSIGNED NULL,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    supplier_id BIGINT UNSIGNED NOT NULL,
    received_by_user_id BIGINT UNSIGNED NOT NULL,
    receipt_code VARCHAR(50) NOT NULL UNIQUE,
    receipt_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    invoice_number VARCHAR(100) NULL,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status ENUM('PENDING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gr_po FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_gr_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_gr_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_gr_receiver FOREIGN KEY (received_by_user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_gr_code (receipt_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 49. Chi tiết mặt hàng nhập kho (Goods Receipt Items)
CREATE TABLE goods_receipt_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    goods_receipt_id BIGINT UNSIGNED NOT NULL,
    batch_id BIGINT UNSIGNED NOT NULL,
    ingredient_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(12,3) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    expiry_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gri_receipt FOREIGN KEY (goods_receipt_id) REFERENCES goods_receipts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_gri_batch FOREIGN KEY (batch_id) REFERENCES inventory_batches(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_gri_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_gri_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_gri_qty CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 50. Lịch sử giao dịch biến động kho (Inventory Transactions)
CREATE TABLE inventory_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    batch_id BIGINT UNSIGNED NULL,
    ingredient_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    transaction_type ENUM('PURCHASE_RECEIPT', 'KITCHEN_USAGE', 'ADJUSTMENT_ADD', 'ADJUSTMENT_SUB', 'WASTE_DISCARD', 'TRANSFER_IN', 'TRANSFER_OUT', 'RETURN_SUPPLIER') NOT NULL,
    reference_type VARCHAR(50) NULL COMMENT 'ORDERS, GOODS_RECEIPTS, ADJUSTMENTS, RECIPES',
    reference_id BIGINT UNSIGNED NULL,
    quantity DECIMAL(15,3) NOT NULL COMMENT 'Dương (+) là nhập vào, Âm (-) là xuất ra',
    balance_after DECIMAL(15,3) NOT NULL COMMENT 'Số tồn kho ngay sau giao dịch',
    unit_cost DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    user_id BIGINT UNSIGNED NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_it_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_it_batch FOREIGN KEY (batch_id) REFERENCES inventory_batches(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_it_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_it_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_it_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_it_type (transaction_type),
    INDEX idx_it_ref (reference_type, reference_id),
    INDEX idx_it_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 51. Phiếu kiểm kê & điều chỉnh kho (Inventory Adjustments)
CREATE TABLE inventory_adjustments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    adjustment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason TEXT NOT NULL COMMENT 'Kiểm kê định kỳ, Hàng hỏng/mốc, Thất thoát...',
    adjusted_by_user_id BIGINT UNSIGNED NOT NULL,
    approved_by_user_id BIGINT UNSIGNED NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ia_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ia_adjusted_by FOREIGN KEY (adjusted_by_user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ia_approved_by FOREIGN KEY (approved_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_ia_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 52. Chi tiết mặt hàng điều chỉnh kiểm kê (Inventory Adjustment Items)
CREATE TABLE inventory_adjustment_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    adjustment_id BIGINT UNSIGNED NOT NULL,
    batch_id BIGINT UNSIGNED NULL,
    ingredient_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    system_quantity DECIMAL(15,3) NOT NULL,
    actual_quantity DECIMAL(15,3) NOT NULL,
    difference_quantity DECIMAL(15,3) GENERATED ALWAYS AS (actual_quantity - system_quantity) STORED,
    reason VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_iai_adjustment FOREIGN KEY (adjustment_id) REFERENCES inventory_adjustments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_iai_batch FOREIGN KEY (batch_id) REFERENCES inventory_batches(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_iai_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_iai_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 9: KHUYẾN MÃI, VOUCHER & ĐIỂM THÀNH VIÊN (PROMOTIONS & LOYALTY)
-- ==============================================================================

-- 53. Chương trình khuyến mãi (Promotions)
CREATE TABLE promotions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NULL COMMENT 'NULL = Toàn bộ hệ thống',
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    promotion_type ENUM('PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y', 'COMBO_DISCOUNT', 'FREE_TOPPING') NOT NULL,
    discount_value DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    max_discount_amount DECIMAL(15,2) NULL,
    min_order_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    target_user_type ENUM('ALL', 'STUDENT', 'TEACHER', 'EMPLOYEE') NOT NULL DEFAULT 'ALL',
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_promotions_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_promotions_code (code),
    INDEX idx_promotions_date (start_date, end_date, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 54. Điều kiện áp dụng khuyến mãi (Promotion Conditions)
CREATE TABLE promotion_conditions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    promotion_id BIGINT UNSIGNED NOT NULL,
    condition_type ENUM('MIN_QUANTITY', 'SPECIFIC_CATEGORY', 'SPECIFIC_FOOD', 'TIME_OF_DAY', 'DAY_OF_WEEK') NOT NULL,
    condition_value VARCHAR(255) NOT NULL COMMENT 'JSON hoặc giá trị chuỗi tùy condition_type',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pc_promotion FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 55. Món ăn / Danh mục gắn với Khuyến mãi (Promotion Items)
CREATE TABLE promotion_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    promotion_id BIGINT UNSIGNED NOT NULL,
    food_id BIGINT UNSIGNED NULL,
    category_id BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pi_promotion FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pi_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pi_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 56. Mã giảm giá / Voucher (Vouchers)
CREATE TABLE vouchers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    promotion_id BIGINT UNSIGNED NOT NULL,
    canteen_id BIGINT UNSIGNED NULL,
    voucher_code VARCHAR(50) NOT NULL UNIQUE,
    usage_limit INT NOT NULL DEFAULT 100 COMMENT 'Tổng số lượt dùng',
    used_count INT NOT NULL DEFAULT 0,
    per_user_limit INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vouchers_promotion FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_vouchers_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_vouchers_code (voucher_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 57. Điểm tích lũy thành viên (Customer Points)
CREATE TABLE customer_points (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    total_points INT NOT NULL DEFAULT 0,
    available_points INT NOT NULL DEFAULT 0,
    spent_points INT NOT NULL DEFAULT 0,
    membership_tier ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM') NOT NULL DEFAULT 'BRONZE',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_points_positive CHECK (total_points >= 0 AND available_points >= 0 AND spent_points >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 10: GIỎ HÀNG, ĐƠN HÀNG, CHI TIẾT & BẾP (CART, ORDERS & KITCHEN)
-- ==============================================================================

-- 58. Giỏ hàng người dùng (Carts)
CREATE TABLE carts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    canteen_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_carts_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 59. Chi tiết món trong giỏ hàng (Cart Items)
CREATE TABLE cart_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT UNSIGNED NOT NULL,
    food_id BIGINT UNSIGNED NULL,
    food_variant_id BIGINT UNSIGNED NULL,
    combo_id BIGINT UNSIGNED NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    special_notes VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cart_items_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_cart_items_variant FOREIGN KEY (food_variant_id) REFERENCES food_variants(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_cart_items_combo FOREIGN KEY (combo_id) REFERENCES combos(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_cart_item_qty CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 60. Topping cho món trong giỏ hàng (Cart Item Toppings)
CREATE TABLE cart_item_toppings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cart_item_id BIGINT UNSIGNED NOT NULL,
    topping_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cit_cart_item FOREIGN KEY (cart_item_id) REFERENCES cart_items(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cit_topping FOREIGN KEY (topping_id) REFERENCES toppings(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 61. Đơn hàng (Orders)
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    counter_id BIGINT UNSIGNED NULL,
    table_id BIGINT UNSIGNED NULL,
    user_id BIGINT UNSIGNED NULL COMMENT 'NULL nếu khách vãng lai thanh toán tại quầy',
    cashier_user_id BIGINT UNSIGNED NULL,
    voucher_id BIGINT UNSIGNED NULL,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    order_type ENUM('DINE_IN', 'TAKE_AWAY', 'PRE_ORDER', 'PICK_UP', 'DELIVERY') NOT NULL DEFAULT 'DINE_IN',
    pickup_time DATETIME NULL COMMENT 'Dành cho Pre-order',
    subtotal_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    final_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    points_earned INT NOT NULL DEFAULT 0,
    points_redeemed INT NOT NULL DEFAULT 0,
    order_status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    payment_status ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'UNPAID',
    cancel_reason VARCHAR(255) NULL,
    notes TEXT NULL,
    ordered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_orders_counter FOREIGN KEY (counter_id) REFERENCES counters(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_orders_table FOREIGN KEY (table_id) REFERENCES dining_tables(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_orders_cashier FOREIGN KEY (cashier_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_orders_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_orders_amount CHECK (subtotal_amount >= 0 AND discount_amount >= 0 AND final_amount >= 0),
    INDEX idx_orders_code (order_code),
    INDEX idx_orders_canteen_date (canteen_id, ordered_at),
    INDEX idx_orders_status (order_status),
    INDEX idx_orders_payment_status (payment_status),
    INDEX idx_orders_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 62. Chi tiết món trong đơn hàng (Order Items)
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    food_id BIGINT UNSIGNED NULL,
    food_variant_id BIGINT UNSIGNED NULL,
    combo_id BIGINT UNSIGNED NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    cost_price DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá vốn tại thời điểm bán',
    total_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    special_notes VARCHAR(255) NULL,
    item_status ENUM('PENDING', 'COOKING', 'READY', 'SERVED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_oi_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_oi_variant FOREIGN KEY (food_variant_id) REFERENCES food_variants(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_oi_combo FOREIGN KEY (combo_id) REFERENCES combos(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_oi_qty CHECK (quantity > 0),
    INDEX idx_oi_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 63. Topping đi kèm chi tiết món (Order Item Toppings)
CREATE TABLE order_item_toppings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_item_id BIGINT UNSIGNED NOT NULL,
    topping_id BIGINT UNSIGNED NOT NULL,
    topping_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    cost_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_oit_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_oit_topping FOREIGN KEY (topping_id) REFERENCES toppings(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_oit_qty CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 64. Lịch sử thay đổi trạng thái đơn hàng (Order Status History)
CREATE TABLE order_status_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    from_status VARCHAR(50) NULL,
    to_status VARCHAR(50) NOT NULL,
    changed_by_user_id BIGINT UNSIGNED NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_osh_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_osh_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_osh_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 65. Lịch sử sử dụng Voucher (Voucher Usages)
CREATE TABLE voucher_usages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    voucher_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    used_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vu_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_vu_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_vu_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 66. Lịch sử biến động điểm thưởng (Point Transactions)
CREATE TABLE point_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    transaction_type ENUM('EARN', 'REDEEM', 'EXPIRE', 'MANUAL_ADJUST') NOT NULL,
    points INT NOT NULL COMMENT 'Dương (+) là cộng điểm, Âm (-) là tiêu điểm',
    balance_after INT NOT NULL,
    description VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pt_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_pt_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 67. Màn hình Bếp KDS (Kitchen Orders)
CREATE TABLE kitchen_orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    canteen_id BIGINT UNSIGNED NOT NULL,
    counter_id BIGINT UNSIGNED NULL,
    kitchen_order_number VARCHAR(50) NOT NULL,
    order_priority ENUM('NORMAL', 'HIGH', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    status ENUM('WAITING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED') NOT NULL DEFAULT 'WAITING',
    started_at DATETIME NULL,
    ready_at DATETIME NULL,
    served_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ko_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ko_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ko_counter FOREIGN KEY (counter_id) REFERENCES counters(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_ko_status (canteen_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 68. Chi tiết món trong Bếp (Kitchen Order Items)
CREATE TABLE kitchen_order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kitchen_order_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    food_id BIGINT UNSIGNED NULL,
    food_variant_id BIGINT UNSIGNED NULL,
    quantity INT NOT NULL,
    status ENUM('WAITING', 'COOKING', 'READY', 'CANCELLED') NOT NULL DEFAULT 'WAITING',
    chef_employee_id BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_koi_ko FOREIGN KEY (kitchen_order_id) REFERENCES kitchen_orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_koi_oi FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_koi_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_koi_chef FOREIGN KEY (chef_employee_id) REFERENCES employees(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 69. Lịch sử trạng thái chế biến tại Bếp (Kitchen Status History)
CREATE TABLE kitchen_status_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kitchen_order_id BIGINT UNSIGNED NOT NULL,
    kitchen_order_item_id BIGINT UNSIGNED NULL,
    from_status VARCHAR(50) NULL,
    to_status VARCHAR(50) NOT NULL,
    changed_by_user_id BIGINT UNSIGNED NULL,
    notes VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ksh_ko FOREIGN KEY (kitchen_order_id) REFERENCES kitchen_orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ksh_koi FOREIGN KEY (kitchen_order_item_id) REFERENCES kitchen_order_items(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_ksh_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 11: THANH TOÁN & HOÀN TIỀN (PAYMENTS & REFUNDS)
-- ==============================================================================

-- 70. Thông tin thanh toán (Payments)
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    canteen_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    payment_code VARCHAR(50) NOT NULL UNIQUE,
    payment_method ENUM('CASH', 'BANK_TRANSFER', 'QR_CODE', 'STUDENT_WALLET', 'VNPAY', 'MOMO', 'ZALOPAY', 'CARD') NOT NULL,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    paid_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_payments_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_payments_amount CHECK (amount >= 0),
    INDEX idx_payments_code (payment_code),
    INDEX idx_payments_status (status),
    INDEX idx_payments_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 71. Chi tiết giao dịch cổng thanh toán (Payment Transactions - Không lưu số thẻ đầy đủ)
CREATE TABLE payment_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT UNSIGNED NOT NULL,
    gateway_transaction_no VARCHAR(100) NULL,
    gateway_name VARCHAR(50) NOT NULL COMMENT 'VNPAY, MOMO, ZALOPAY, MANUAL_POS',
    gateway_response JSON NULL COMMENT 'Lưu toàn bộ payload webhook / callback bảo mật',
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    status ENUM('SUCCESS', 'FAILED', 'CANCELLED') NOT NULL,
    transaction_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ptx_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_ptx_gateway_txn (gateway_transaction_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 72. Đơn hoàn tiền (Refunds)
CREATE TABLE refunds (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    refund_code VARCHAR(50) NOT NULL UNIQUE,
    refund_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    refund_reason TEXT NOT NULL,
    processed_by_user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'COMPLETED',
    refunded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_refunds_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_refunds_user FOREIGN KEY (processed_by_user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_refund_amount CHECK (refund_amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 73. Chi tiết món được hoàn tiền (Refund Items)
CREATE TABLE refund_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    refund_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ri_refund FOREIGN KEY (refund_id) REFERENCES refunds(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ri_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 12: ĐÁNH GIÁ, PHẢN HỒI & KHIẾU NẠI (REVIEWS & COMPLAINTS)
-- ==============================================================================

-- 74. Đánh giá món ăn và trải nghiệm (Reviews)
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    food_id BIGINT UNSIGNED NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    canteen_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL COMMENT '1 đến 5 sao',
    comment TEXT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    INDEX idx_reviews_food_id (food_id),
    INDEX idx_reviews_canteen_id (canteen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 75. Hình ảnh đính kèm đánh giá (Review Images)
CREATE TABLE review_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rim_review FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 76. Phản hồi đánh giá của Căng tin (Review Replies)
CREATE TABLE review_replies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT UNSIGNED NOT NULL,
    replied_by_user_id BIGINT UNSIGNED NOT NULL,
    reply_content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rr_review FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rr_user FOREIGN KEY (replied_by_user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 77. Khiếu nại / Góp ý (Complaints)
CREATE TABLE complaints (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NULL,
    canteen_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    assigned_to_user_id BIGINT UNSIGNED NULL,
    complaint_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    status ENUM('OPEN', 'PROCESSING', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    resolution_notes TEXT NULL,
    resolved_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaints_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_complaints_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_complaints_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_complaints_assigned FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_complaints_code (complaint_code),
    INDEX idx_complaints_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 78. Trao đổi trong khiếu nại (Complaint Messages)
CREATE TABLE complaint_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT UNSIGNED NOT NULL,
    sender_user_id BIGINT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Chỉ nhân viên thấy với nhau',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cm_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cm_sender FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 79. File đính kèm khiếu nại (Complaint Attachments)
CREATE TABLE complaint_attachments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    complaint_message_id BIGINT UNSIGNED NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ca_message FOREIGN KEY (complaint_message_id) REFERENCES complaint_messages(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 13: CA LÀM & CHẤM CÔNG NHÂN VIÊN (SHIFTS & ATTENDANCE)
-- ==============================================================================

-- 80. Ca làm việc tiêu chuẩn (Shifts)
CREATE TABLE shifts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT 'Ca Sáng (06:00 - 14:00), Ca Chiều (14:00 - 21:00)...',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration_minutes INT NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_shifts_canteen_code UNIQUE (canteen_id, code),
    CONSTRAINT fk_shifts_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 81. Lịch phân ca nhân viên (Employee Shifts)
CREATE TABLE employee_shifts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    shift_id BIGINT UNSIGNED NOT NULL,
    canteen_id BIGINT UNSIGNED NOT NULL,
    shift_date DATE NOT NULL,
    status ENUM('SCHEDULED', 'CONFIRMED', 'CANCELLED', 'ABSENT', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_emp_shift_date UNIQUE (employee_id, shift_id, shift_date),
    CONSTRAINT fk_es_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_es_shift FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_es_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_es_date (shift_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 82. Bảng chấm công (Attendances)
CREATE TABLE attendances (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    shift_id BIGINT UNSIGNED NOT NULL,
    canteen_id BIGINT UNSIGNED NOT NULL,
    work_date DATE NOT NULL,
    check_in_time DATETIME NULL,
    check_out_time DATETIME NULL,
    late_minutes INT NOT NULL DEFAULT 0,
    early_leave_minutes INT NOT NULL DEFAULT 0,
    overtime_hours DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    status ENUM('PRESENT', 'LATE', 'EARLY_LEAVE', 'ABSENT', 'ON_LEAVE') NOT NULL DEFAULT 'PRESENT',
    notes VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_attendance_day UNIQUE (employee_id, shift_id, work_date),
    CONSTRAINT fk_att_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_att_shift FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_att_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_att_date (work_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 83. Lịch sử log quẹt vân tay / nhận diện khuôn mặt chấm công (Attendance Logs)
CREATE TABLE attendance_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attendance_id BIGINT UNSIGNED NULL,
    employee_id BIGINT UNSIGNED NOT NULL,
    log_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    log_type ENUM('CHECK_IN', 'CHECK_OUT') NOT NULL,
    device_ip VARCHAR(45) NULL,
    device_name VARCHAR(100) NULL,
    image_snapshot_url VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_al_attendance FOREIGN KEY (attendance_id) REFERENCES attendances(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_al_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 14: TÀI CHÍNH, DOANH THU, CHI PHÍ & CÔNG NỢ (FINANCE & ACCOUNTING)
-- ==============================================================================

-- 84. Tài khoản thanh toán / Quỹ tiền mặt căng tin (Financial Accounts)
CREATE TABLE financial_accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    account_code VARCHAR(50) NOT NULL UNIQUE,
    account_name VARCHAR(150) NOT NULL COMMENT 'Két tiền mặt Quầy 1, Tài khoản Vietcombank Căng tin A...',
    account_type ENUM('CASH_DRAWER', 'BANK_ACCOUNT', 'E_WALLET', 'PETTY_CASH') NOT NULL DEFAULT 'CASH_DRAWER',
    current_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fa_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 85. Danh mục loại chi phí (Expense Categories)
CREATE TABLE expense_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL COMMENT 'Nguyên vật liệu, Lương nhân viên, Tiền điện, Tiền nước, Tiền Gas, Bảo trì thiết bị, Marketing...',
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 86. Phiếu chi (Expenses)
CREATE TABLE expenses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    account_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    created_by_user_id BIGINT UNSIGNED NOT NULL,
    approved_by_user_id BIGINT UNSIGNED NULL,
    expense_code VARCHAR(50) NOT NULL UNIQUE,
    expense_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    recipient_name VARCHAR(150) NOT NULL COMMENT 'Tên người nhận tiền / NCC',
    description TEXT NOT NULL,
    invoice_ref_url VARCHAR(500) NULL,
    status ENUM('DRAFT', 'APPROVED', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PAID',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_exp_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_exp_account FOREIGN KEY (account_id) REFERENCES financial_accounts(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_exp_category FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_exp_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_exp_approved_by FOREIGN KEY (approved_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_exp_amount CHECK (amount > 0),
    INDEX idx_exp_date (canteen_id, expense_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 87. Doanh thu (Revenues)
CREATE TABLE revenues (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    account_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    payment_id BIGINT UNSIGNED NULL,
    revenue_code VARCHAR(50) NOT NULL UNIQUE,
    revenue_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    revenue_type ENUM('SALES_ORDER', 'CATERING_CONTRACT', 'OTHER_INCOME') NOT NULL DEFAULT 'SALES_ORDER',
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rev_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_rev_account FOREIGN KEY (account_id) REFERENCES financial_accounts(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_rev_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_rev_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_rev_amount CHECK (amount > 0),
    INDEX idx_rev_date (canteen_id, revenue_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 88. Sổ cái biến động dòng tiền (Financial Transactions)
CREATE TABLE financial_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    account_id BIGINT UNSIGNED NOT NULL,
    expense_id BIGINT UNSIGNED NULL,
    revenue_id BIGINT UNSIGNED NULL,
    transaction_code VARCHAR(50) NOT NULL UNIQUE,
    transaction_type ENUM('INFLOW', 'OUTFLOW', 'INTERNAL_TRANSFER') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ftx_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ftx_account FOREIGN KEY (account_id) REFERENCES financial_accounts(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ftx_expense FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_ftx_revenue FOREIGN KEY (revenue_id) REFERENCES revenues(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_ftx_date (canteen_id, transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 89. Sổ theo dõi công nợ Nhà cung cấp (Supplier Debts)
CREATE TABLE supplier_debts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT UNSIGNED NOT NULL,
    goods_receipt_id BIGINT UNSIGNED NOT NULL UNIQUE,
    canteen_id BIGINT UNSIGNED NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    remaining_amount DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    due_date DATE NOT NULL,
    status ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE') NOT NULL DEFAULT 'UNPAID',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sd_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sd_gr FOREIGN KEY (goods_receipt_id) REFERENCES goods_receipts(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sd_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_sd_supplier_status (supplier_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 90. Lịch sử thanh toán công nợ Nhà cung cấp (Supplier Debt Payments)
CREATE TABLE supplier_debt_payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    supplier_debt_id BIGINT UNSIGNED NOT NULL,
    supplier_id BIGINT UNSIGNED NOT NULL,
    account_id BIGINT UNSIGNED NOT NULL,
    payment_code VARCHAR(50) NOT NULL UNIQUE,
    payment_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    payment_date DATE NOT NULL,
    processed_by_user_id BIGINT UNSIGNED NOT NULL,
    payment_receipt_url VARCHAR(500) NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sdp_debt FOREIGN KEY (supplier_debt_id) REFERENCES supplier_debts(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sdp_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sdp_account FOREIGN KEY (account_id) REFERENCES financial_accounts(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sdp_user FOREIGN KEY (processed_by_user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_sdp_amount CHECK (payment_amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 15: THÔNG BÁO, AUDIT LOG, CẤU HÌNH & MEDIA (SYSTEM & UTILITIES)
-- ==============================================================================

-- 91. Mẫu thông báo (Notification Templates)
CREATE TABLE notification_templates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'ORDER_PLACED, ORDER_READY, LOW_STOCK_ALERT, VOUCHER_RECEIVED...',
    title_template VARCHAR(255) NOT NULL,
    body_template TEXT NOT NULL,
    notification_type ENUM('SYSTEM', 'ORDER', 'INVENTORY', 'PROMOTION', 'FINANCE') NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 92. Thông báo phát sinh (Notifications)
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    template_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    reference_type VARCHAR(50) NULL,
    reference_id BIGINT UNSIGNED NULL,
    target_role VARCHAR(50) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_template FOREIGN KEY (template_id) REFERENCES notification_templates(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 93. Trạng thái thông báo của từng người dùng (User Notifications)
CREATE TABLE user_notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    notification_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_un_notif FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_un_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_un_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 94. Nhật ký kiểm toán bảo mật (Audit Logs)
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'APPROVE') NOT NULL,
    entity_name VARCHAR(100) NOT NULL COMMENT 'foods, orders, inventory_batches, users...',
    entity_id BIGINT UNSIGNED NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_al_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_al_entity (entity_name, entity_id),
    INDEX idx_al_user (user_id),
    INDEX idx_al_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 95. Cấu hình hệ thống động (System Settings)
CREATE TABLE system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NULL COMMENT 'NULL = Global toàn hệ thống',
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT NOT NULL,
    data_type ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') NOT NULL DEFAULT 'STRING',
    description VARCHAR(255) NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'TRUE: Frontend khách có thể đọc',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_system_settings UNIQUE (canteen_id, setting_key),
    CONSTRAINT fk_ss_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_ss_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 96. Quản lý File & Đa phương tiện (Media Files)
CREATE TABLE media_files (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL,
    entity_type VARCHAR(50) NULL COMMENT 'FOOD, REVIEW, USER_AVATAR, INVOICE, COMPLAINT',
    entity_id BIGINT UNSIGNED NULL,
    uploaded_by_user_id BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mf_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_mf_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- PHẦN 16: DỮ LIỆU TỔNG HỢP CHO BÁO CÁO & AI / DATA ANALYTICS
-- ==============================================================================

-- 97. Thống kê bán hàng theo ngày phục vụ AI dự báo nhu cầu (Sales Daily Summary)
CREATE TABLE sales_daily_summary (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    summary_date DATE NOT NULL,
    total_orders INT NOT NULL DEFAULT 0,
    completed_orders INT NOT NULL DEFAULT 0,
    cancelled_orders INT NOT NULL DEFAULT 0,
    gross_revenue DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    discount_total DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    net_revenue DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_cogs DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng giá vốn bán hàng',
    gross_profit DECIMAL(15,2) GENERATED ALWAYS AS (net_revenue - total_cogs) STORED,
    day_of_week TINYINT NOT NULL COMMENT '1: Chủ nhật, 2-7: Thứ 2-7',
    weather_condition VARCHAR(50) NULL COMMENT 'Nắng, Mưa, Mát... nạp từ Python/API thời tiết',
    is_holiday BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_sales_daily UNIQUE (canteen_id, summary_date),
    CONSTRAINT fk_sds_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_sds_date (summary_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 98. Thống kê số lượng từng món bán ra theo ngày (Food Sales Statistics)
CREATE TABLE food_sales_statistics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    food_id BIGINT UNSIGNED NOT NULL,
    stat_date DATE NOT NULL,
    quantity_sold INT NOT NULL DEFAULT 0,
    total_revenue DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_cost DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    profit DECIMAL(15,2) GENERATED ALWAYS AS (total_revenue - total_cost) STORED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_food_sales_stat UNIQUE (canteen_id, food_id, stat_date),
    CONSTRAINT fk_fss_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_fss_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_fss_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 99. Tổng kết tồn kho cuối ngày phục vụ phân tích lãng phí & chuỗi cung ứng (Inventory Daily Summary)
CREATE TABLE inventory_daily_summary (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    canteen_id BIGINT UNSIGNED NOT NULL,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    ingredient_id BIGINT UNSIGNED NOT NULL,
    summary_date DATE NOT NULL,
    opening_quantity DECIMAL(15,3) NOT NULL,
    received_quantity DECIMAL(15,3) NOT NULL DEFAULT 0.000,
    consumed_quantity DECIMAL(15,3) NOT NULL DEFAULT 0.000,
    wasted_quantity DECIMAL(15,3) NOT NULL DEFAULT 0.000,
    closing_quantity DECIMAL(15,3) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_inv_daily UNIQUE (warehouse_id, ingredient_id, summary_date),
    CONSTRAINT fk_ids_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ids_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ids_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_ids_date (summary_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- PHẦN 17: CÁC DATABASE VIEWS QUAN TRỌNG (BUSINESS & ANALYTICS VIEWS)
-- ==============================================================================

-- 1. View Doanh thu theo ngày (v_daily_revenue)
CREATE OR REPLACE VIEW v_daily_revenue AS
SELECT 
    c.id AS canteen_id,
    c.name AS canteen_name,
    DATE(o.ordered_at) AS order_date,
    COUNT(o.id) AS total_orders,
    SUM(CASE WHEN o.order_status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_orders,
    SUM(CASE WHEN o.order_status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled_orders,
    COALESCE(SUM(CASE WHEN o.order_status = 'COMPLETED' THEN o.subtotal_amount ELSE 0 END), 0.00) AS gross_sales,
    COALESCE(SUM(CASE WHEN o.order_status = 'COMPLETED' THEN o.discount_amount ELSE 0 END), 0.00) AS total_discounts,
    COALESCE(SUM(CASE WHEN o.order_status = 'COMPLETED' THEN o.final_amount ELSE 0 END), 0.00) AS net_revenue
FROM canteens c
LEFT JOIN orders o ON c.id = o.canteen_id
GROUP BY c.id, c.name, DATE(o.ordered_at);

-- 2. View Doanh thu theo tháng (v_monthly_revenue)
CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT 
    c.id AS canteen_id,
    c.name AS canteen_name,
    YEAR(o.ordered_at) AS order_year,
    MONTH(o.ordered_at) AS order_month,
    COUNT(o.id) AS total_orders,
    COALESCE(SUM(CASE WHEN o.order_status = 'COMPLETED' THEN o.final_amount ELSE 0 END), 0.00) AS total_revenue
FROM canteens c
LEFT JOIN orders o ON c.id = o.canteen_id
GROUP BY c.id, c.name, YEAR(o.ordered_at), MONTH(o.ordered_at);

-- 3. View Bán hàng chi tiết theo món (v_food_sales)
CREATE OR REPLACE VIEW v_food_sales AS
SELECT 
    f.canteen_id,
    c.name AS canteen_name,
    cat.name AS category_name,
    f.id AS food_id,
    f.code AS food_code,
    f.name AS food_name,
    f.base_price,
    COALESCE(SUM(oi.quantity), 0) AS total_quantity_sold,
    COALESCE(SUM(oi.total_price), 0.00) AS total_revenue,
    COALESCE(SUM(oi.cost_price * oi.quantity), 0.00) AS total_cogs,
    COALESCE(SUM(oi.total_price - (oi.cost_price * oi.quantity)), 0.00) AS gross_profit
FROM foods f
JOIN canteens c ON f.canteen_id = c.id
JOIN categories cat ON f.category_id = cat.id
LEFT JOIN order_items oi ON f.id = oi.food_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.order_status = 'COMPLETED'
GROUP BY f.canteen_id, c.name, cat.name, f.id, f.code, f.name, f.base_price;

-- 4. View Top món ăn bán chạy nhất (v_best_selling_foods)
CREATE OR REPLACE VIEW v_best_selling_foods AS
SELECT 
    f.canteen_id,
    c.name AS canteen_name,
    f.id AS food_id,
    f.name AS food_name,
    f.thumbnail_url,
    f.base_price,
    SUM(oi.quantity) AS total_sold_qty,
    SUM(oi.total_price) AS total_sold_amount
FROM foods f
JOIN canteens c ON f.canteen_id = c.id
JOIN order_items oi ON f.id = oi.food_id
JOIN orders o ON oi.order_id = o.id
WHERE o.order_status = 'COMPLETED'
GROUP BY f.canteen_id, c.name, f.id, f.name, f.thumbnail_url, f.base_price
ORDER BY total_sold_qty DESC;

-- 5. View Tình trạng tồn kho tổng thể (v_inventory_status)
CREATE OR REPLACE VIEW v_inventory_status AS
SELECT 
    w.id AS warehouse_id,
    w.name AS warehouse_name,
    c.id AS canteen_id,
    c.name AS canteen_name,
    i.id AS ingredient_id,
    i.code AS ingredient_code,
    i.name AS ingredient_name,
    ic.name AS category_name,
    u.name AS unit_name,
    s.quantity AS on_hand_quantity,
    s.reserved_quantity,
    s.available_quantity,
    i.min_stock_level,
    i.max_stock_level,
    CASE 
        WHEN s.quantity <= 0 THEN 'OUT_OF_STOCK'
        WHEN s.quantity <= i.min_stock_level THEN 'LOW_STOCK'
        WHEN s.quantity > i.max_stock_level THEN 'OVERSTOCK'
        ELSE 'NORMAL'
    END AS stock_status
FROM inventory_stocks s
JOIN warehouses w ON s.warehouse_id = w.id
JOIN canteens c ON w.canteen_id = c.id
JOIN ingredients i ON s.ingredient_id = i.id
JOIN ingredient_categories ic ON i.category_id = ic.id
JOIN units u ON s.unit_id = u.id;

-- 6. View Cảnh báo nguyên liệu sắp hết kho (v_low_stock)
CREATE OR REPLACE VIEW v_low_stock AS
SELECT * FROM v_inventory_status
WHERE stock_status IN ('LOW_STOCK', 'OUT_OF_STOCK');

-- 7. View Cảnh báo lô hàng sắp hết hạn sử dụng (v_expiring_inventory)
CREATE OR REPLACE VIEW v_expiring_inventory AS
SELECT 
    w.name AS warehouse_name,
    i.code AS ingredient_code,
    i.name AS ingredient_name,
    b.batch_number,
    b.remaining_quantity,
    u.name AS unit_name,
    b.expiry_date,
    DATEDIFF(b.expiry_date, CURDATE()) AS days_until_expiry,
    CASE 
        WHEN b.expiry_date < CURDATE() THEN 'EXPIRED'
        WHEN DATEDIFF(b.expiry_date, CURDATE()) <= 7 THEN 'CRITICAL_7_DAYS'
        WHEN DATEDIFF(b.expiry_date, CURDATE()) <= 15 THEN 'WARNING_15_DAYS'
        ELSE 'SAFE'
    END AS expiry_status
FROM inventory_batches b
JOIN warehouses w ON b.warehouse_id = w.id
JOIN ingredients i ON b.ingredient_id = i.id
JOIN units u ON b.unit_id = u.id
WHERE b.remaining_quantity > 0 AND b.status = 'IN_STOCK'
ORDER BY b.expiry_date ASC;

-- 8. View Báo cáo công nợ nhà cung cấp (v_supplier_debt)
CREATE OR REPLACE VIEW v_supplier_debt AS
SELECT 
    s.id AS supplier_id,
    s.code AS supplier_code,
    s.name AS supplier_name,
    s.phone,
    COUNT(sd.id) AS total_invoices,
    SUM(sd.total_amount) AS total_purchased_amount,
    SUM(sd.paid_amount) AS total_paid_amount,
    SUM(sd.remaining_amount) AS total_outstanding_debt,
    SUM(CASE WHEN sd.due_date < CURDATE() AND sd.remaining_amount > 0 THEN sd.remaining_amount ELSE 0 END) AS overdue_debt
FROM suppliers s
LEFT JOIN supplier_debts sd ON s.id = sd.supplier_id
GROUP BY s.id, s.code, s.name, s.phone;

-- 9. View Chấm công nhân viên (v_employee_attendance)
CREATE OR REPLACE VIEW v_employee_attendance AS
SELECT 
    e.id AS employee_id,
    e.employee_code,
    u.full_name AS employee_name,
    c.name AS canteen_name,
    s.name AS shift_name,
    a.work_date,
    a.check_in_time,
    a.check_out_time,
    a.late_minutes,
    a.early_leave_minutes,
    a.overtime_hours,
    a.status AS attendance_status
FROM attendances a
JOIN employees e ON a.employee_id = e.id
JOIN users u ON e.user_id = u.id
JOIN canteens c ON a.canteen_id = c.id
JOIN shifts s ON a.shift_id = s.id;

-- 10. View Báo cáo Kết quả Kinh doanh Lãi / Lỗ (v_profit_loss)
CREATE OR REPLACE VIEW v_profit_loss AS
SELECT 
    c.id AS canteen_id,
    c.name AS canteen_name,
    MONTH(r.revenue_date) AS month,
    YEAR(r.revenue_date) AS year,
    COALESCE(SUM(r.amount), 0.00) AS total_revenue,
    (
        SELECT COALESCE(SUM(e.amount), 0.00)
        FROM expenses e
        WHERE e.canteen_id = c.id 
          AND MONTH(e.expense_date) = MONTH(r.revenue_date)
          AND YEAR(e.expense_date) = YEAR(r.revenue_date)
          AND e.status = 'PAID'
    ) AS total_operating_expenses,
    (
        COALESCE(SUM(r.amount), 0.00) - 
        (
            SELECT COALESCE(SUM(e.amount), 0.00)
            FROM expenses e
            WHERE e.canteen_id = c.id 
              AND MONTH(e.expense_date) = MONTH(r.revenue_date)
              AND YEAR(e.expense_date) = YEAR(r.revenue_date)
              AND e.status = 'PAID'
        )
    ) AS net_profit
FROM canteens c
LEFT JOIN revenues r ON c.id = r.canteen_id
GROUP BY c.id, c.name, YEAR(r.revenue_date), MONTH(r.revenue_date);

-- ==============================================================================
-- PHẦN 18: STORED PROCEDURES & FUNCTIONS CẦN THIẾT
-- ==============================================================================

DELIMITER //

-- Function 1: Tính tổng tiền một đơn hàng
CREATE FUNCTION fn_calculate_order_total(p_order_id BIGINT UNSIGNED) 
RETURNS DECIMAL(15,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_items_total DECIMAL(15,2) DEFAULT 0.00;
    DECLARE v_toppings_total DECIMAL(15,2) DEFAULT 0.00;
    DECLARE v_final_total DECIMAL(15,2) DEFAULT 0.00;

    -- Tổng món chính
    SELECT COALESCE(SUM(total_price), 0.00) INTO v_items_total
    FROM order_items
    WHERE order_id = p_order_id;

    -- Tổng topping đi kèm
    SELECT COALESCE(SUM(oit.total_price), 0.00) INTO v_toppings_total
    FROM order_item_toppings oit
    JOIN order_items oi ON oit.order_item_id = oi.id
    WHERE oi.order_id = p_order_id;

    SET v_final_total = v_items_total + v_toppings_total;
    RETURN v_final_total;
END //

-- Procedure 1: Lấy thông tin tồn kho tức thời của nguyên liệu
CREATE PROCEDURE sp_get_ingredient_stock(
    IN p_canteen_id BIGINT UNSIGNED,
    IN p_ingredient_id BIGINT UNSIGNED
)
BEGIN
    SELECT 
        w.id AS warehouse_id,
        w.name AS warehouse_name,
        i.code AS ingredient_code,
        i.name AS ingredient_name,
        s.quantity,
        s.reserved_quantity,
        s.available_quantity,
        u.name AS unit_name
    FROM inventory_stocks s
    JOIN warehouses w ON s.warehouse_id = w.id
    JOIN ingredients i ON s.ingredient_id = i.id
    JOIN units u ON s.unit_id = u.id
    WHERE w.canteen_id = p_canteen_id 
      AND s.ingredient_id = p_ingredient_id;
END //

-- Procedure 2: Trừ tồn kho tự động theo công thức món (Dùng trong Transaction)
CREATE PROCEDURE sp_deduct_recipe_inventory(
    IN p_order_id BIGINT UNSIGNED,
    IN p_warehouse_id BIGINT UNSIGNED,
    IN p_user_id BIGINT UNSIGNED
)
BEGIN
    -- Khai báo cursor lặp qua các nguyên liệu tiêu hao của đơn hàng
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_ingredient_id BIGINT UNSIGNED;
    DECLARE v_unit_id BIGINT UNSIGNED;
    DECLARE v_total_consumed DECIMAL(15,3);
    DECLARE v_current_qty DECIMAL(15,3);

    DECLARE cur_recipe CURSOR FOR
        SELECT 
            ri.ingredient_id,
            ri.unit_id,
            SUM(ri.quantity * oi.quantity) AS total_consumed
        FROM order_items oi
        JOIN recipes r ON (r.food_id = oi.food_id AND (r.food_variant_id IS NULL OR r.food_variant_id = oi.food_variant_id))
        JOIN recipe_items ri ON r.id = ri.recipe_id
        WHERE oi.order_id = p_order_id
        GROUP BY ri.ingredient_id, ri.unit_id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur_recipe;

    read_loop: LOOP
        FETCH cur_recipe INTO v_ingredient_id, v_unit_id, v_total_consumed;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Khóa dòng dữ liệu để chống Race Condition âm kho
        SELECT quantity INTO v_current_qty 
        FROM inventory_stocks
        WHERE warehouse_id = p_warehouse_id AND ingredient_id = v_ingredient_id
        FOR UPDATE;

        IF v_current_qty IS NULL OR v_current_qty < v_total_consumed THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Lỗi xuất kho: Nguyên liệu không đủ tồn kho để thực hiện đơn hàng!';
        END IF;

        -- Trừ kho chính
        UPDATE inventory_stocks
        SET quantity = quantity - v_total_consumed
        WHERE warehouse_id = p_warehouse_id AND ingredient_id = v_ingredient_id;

        -- Ghi log giao dịch kho
        INSERT INTO inventory_transactions (
            warehouse_id, ingredient_id, unit_id, transaction_type, 
            reference_type, reference_id, quantity, balance_after, user_id, notes
        ) VALUES (
            p_warehouse_id, v_ingredient_id, v_unit_id, 'KITCHEN_USAGE', 
            'ORDERS', p_order_id, -v_total_consumed, (v_current_qty - v_total_consumed), p_user_id, 'Xuất kho chế biến đơn hàng'
        );

    END LOOP;

    CLOSE cur_recipe;
END //

DELIMITER ;

-- ==============================================================================
-- PHẦN 19: DỮ LIỆU MẪU ĐẦY ĐỦ (SEED DATA)
-- ==============================================================================

-- 1. Trường học
INSERT INTO schools (id, code, name, short_name, tax_code, phone, email, website, address) VALUES
(1, 'UNI-DNU', 'Trường Đại Học Đại Nam', 'DNU', '0102434567', '02435577799', 'canteen@dainam.edu.vn', 'https://dainam.edu.vn', 'Số 1 Phố Xốm, Phú Lãm, Hà Đông, Hà Nội');

-- 2. Cơ sở
INSERT INTO campuses (id, school_id, code, name, phone, email, address) VALUES
(1, 1, 'CAMPUS-HADONG', 'Cơ sở Chính Hà Đông (Số 1 Phố Xốm)', '02435577799', 'hadong@dainam.edu.vn', 'Số 1 Phố Xốm, Phú Lãm, Hà Đông, Hà Nội'),
(2, 1, 'CAMPUS-MYDINH', 'Cơ sở Mỹ Đình / Thanh Xuân', '02435577798', 'mydinh@dainam.edu.vn', 'Khu Đô Thị Mỹ Đình, Nam Từ Liêm, Hà Nội');

-- 3. Khoa
INSERT INTO faculties (id, school_id, campus_id, code, name, phone, email) VALUES
(1, 1, 1, 'F-IT', 'Khoa Công Nghệ Thông Tin DNU', '02435577756', 'fit@dainam.edu.vn'),
(2, 1, 1, 'F-PHARM', 'Khoa Dược DNU', '02435577757', 'pharm@dainam.edu.vn'),
(3, 1, 2, 'F-MED', 'Khoa Y Khoa DNU', '02435577758', 'med@dainam.edu.vn'),
(4, 1, 2, 'F-BA', 'Khoa Quản Trị Kinh Doanh DNU', '02435577759', 'fba@dainam.edu.vn');

-- 4. Lớp học
INSERT INTO classes (id, faculty_id, code, name, academic_year) VALUES
(1, 1, 'IT-K16', 'Công Nghệ Thông Tin K16 - Lớp 01', '2022-2026'),
(2, 1, 'IT-K17', 'Công Nghệ Thông Tin K17 - Lớp 02', '2023-2027'),
(3, 2, 'DUOC-K16', 'Dược Học K16', '2022-2027'),
(4, 3, 'MED-K17', 'Y Khoa K17', '2023-2029'),
(5, 4, 'QTKD-K18', 'Quản Trị Kinh Doanh K18', '2024-2028');

-- 5. Roles
INSERT INTO roles (id, code, name, description, is_system) VALUES
(1, 'SUPER_ADMIN', 'Quản trị viên cấp cao', 'Toàn quyền cấu hình hệ thống', TRUE),
(2, 'CANTEEN_MANAGER', 'Quản lý Căng tin', 'Quản lý thực đơn, nhân viên, doanh thu quầy', TRUE),
(3, 'CASHIER', 'Thu ngân', 'Bán hàng tại quầy POS, in hóa đơn', TRUE),
(4, 'KITCHEN_STAFF', 'Nhân viên Bếp', 'Xem KDS, xác nhận nấu món', TRUE),
(5, 'WAREHOUSE_MANAGER', 'Thủ kho', 'Quản lý nhập xuất, tồn kho nguyên liệu', TRUE),
(6, 'ACCOUNTANT', 'Kế toán', 'Quản lý thu chi, công nợ nhà cung cấp', TRUE),
(7, 'STUDENT', 'Sinh viên', 'Khách hàng sinh viên đặt món qua Web/App', TRUE),
(8, 'TEACHER', 'Giảng viên', 'Khách hàng giảng viên, cán bộ trường', TRUE),
(9, 'STAFF', 'Nhân viên phục vụ', 'Nhân viên dọn bàn, bưng bê', TRUE);

-- 6. Permissions
INSERT INTO permissions (id, module, code, name, description) VALUES
(1, 'FOODS', 'food:view', 'Xem danh sách món', 'Quyền xem thực đơn'),
(2, 'FOODS', 'food:create', 'Tạo món mới', 'Thêm món ăn vào căng tin'),
(3, 'FOODS', 'food:update', 'Cập nhật món', 'Chỉnh sửa giá, trạng thái món'),
(4, 'ORDERS', 'order:create', 'Tạo đơn hàng', 'Quyền đặt món online/tại quầy'),
(5, 'ORDERS', 'order:update_status', 'Cập nhật trạng thái đơn', 'Chuyển đơn từ chờ sang hoàn thành'),
(6, 'INVENTORY', 'inventory:view', 'Xem tồn kho', 'Xem lượng tồn kho nguyên liệu'),
(7, 'INVENTORY', 'inventory:import', 'Nhập kho', 'Tạo phiếu nhập và tăng tồn kho'),
(8, 'FINANCE', 'finance:view_report', 'Xem báo cáo tài chính', 'Xem doanh thu và lãi lỗ');

-- 7. Role Permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8),
(3, 1), (3, 4), (3, 5),
(4, 1), (4, 5),
(5, 6), (5, 7),
(6, 8),
(7, 1), (7, 4),
(8, 1), (8, 4);

-- 8. Users (Mật khẩu hash giả lập bcrypt: $2b$10$abcdefghijklmnopqrstuuWXYZ1234567890 đại diện 'Password@123')
INSERT INTO users (id, user_type, username, password_hash, email, phone, full_name, gender, is_active, is_verified) VALUES
(1, 'ADMIN', 'admin_super', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'admin@canteen.edu.vn', '0901000001', 'Nguyễn Hoàng Long', 'MALE', TRUE, TRUE),
(2, 'EMPLOYEE', 'manager_canteen1', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'manager1@canteen.edu.vn', '0901000002', 'Trần Thị Thu Thảo', 'FEMALE', TRUE, TRUE),
(3, 'EMPLOYEE', 'manager_canteen2', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'manager2@canteen.edu.vn', '0901000003', 'Lê Văn Bảy', 'MALE', TRUE, TRUE),
(4, 'EMPLOYEE', 'cashier_01', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'cashier1@canteen.edu.vn', '0901000004', 'Phạm Quỳnh Như', 'FEMALE', TRUE, TRUE),
(5, 'EMPLOYEE', 'chef_01', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'chef1@canteen.edu.vn', '0901000005', 'Võ Hoàng Hải', 'MALE', TRUE, TRUE),
(6, 'EMPLOYEE', 'warehouse_01', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'warehouse1@canteen.edu.vn', '0901000006', 'Đặng Minh Quân', 'MALE', TRUE, TRUE),
(7, 'EMPLOYEE', 'accountant_01', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'accountant1@canteen.edu.vn', '0901000007', 'Nguyễn Thị Kim Loan', 'FEMALE', TRUE, TRUE),
(8, 'TEACHER', 'teacher_minh', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'minh.cse@hcmut.edu.vn', '0901000008', 'TS. Nguyễn Nhật Minh', 'MALE', TRUE, TRUE),
(9, 'TEACHER', 'teacher_lan', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'lan.chem@hcmut.edu.vn', '0901000009', 'ThS. Trần Mai Lan', 'FEMALE', TRUE, TRUE),
(10, 'STUDENT', 'student_2110001', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'nam.nguyen211@hcmut.edu.vn', '0901000010', 'Nguyễn Thành Nam', 'MALE', TRUE, TRUE),
(11, 'STUDENT', 'student_2110002', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'hoa.le211@hcmut.edu.vn', '0901000011', 'Lê Khánh Hòa', 'FEMALE', TRUE, TRUE),
(12, 'STUDENT', 'student_2110003', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'dat.tran211@hcmut.edu.vn', '0901000012', 'Trần Tiến Đạt', 'MALE', TRUE, TRUE),
(13, 'STUDENT', 'student_2110004', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'mai.pham211@hcmut.edu.vn', '0901000013', 'Phạm Ngọc Mai', 'FEMALE', TRUE, TRUE),
(14, 'STUDENT', 'student_2110005', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'tuan.vu211@hcmut.edu.vn', '0901000014', 'Vũ Anh Tuấn', 'MALE', TRUE, TRUE),
(15, 'STUDENT', 'student_2110006', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'bich.doan211@hcmut.edu.vn', '0901000015', 'Đoàn Ngọc Bích', 'FEMALE', TRUE, TRUE),
(16, 'STUDENT', 'student_2110007', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'hoang.ly211@hcmut.edu.vn', '0901000016', 'Lý Huy Hoàng', 'MALE', TRUE, TRUE),
(17, 'STUDENT', 'student_2110008', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'trang.bui211@hcmut.edu.vn', '0901000017', 'Bùi Thu Trang', 'FEMALE', TRUE, TRUE),
(18, 'STUDENT', 'student_2110009', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'duc.ha211@hcmut.edu.vn', '0901000018', 'Hà Minh Đức', 'MALE', TRUE, TRUE),
(19, 'STUDENT', 'student_2110010', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'nhu.dinh211@hcmut.edu.vn', '0901000019', 'Đinh Quỳnh Như', 'FEMALE', TRUE, TRUE),
(20, 'STUDENT', 'student_2110011', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'quang.ngo211@hcmut.edu.vn', '0901000020', 'Ngô Quốc Quang', 'MALE', TRUE, TRUE),
(21, 'STUDENT', 'student_2110012', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'thanh.luong211@hcmut.edu.vn', '0901000021', 'Lương Hải Thành', 'MALE', TRUE, TRUE),
(22, 'STUDENT', 'student_2110013', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'huyen.truong211@hcmut.edu.vn', '0901000022', 'Trương Khánh Huyền', 'FEMALE', TRUE, TRUE),
(23, 'STUDENT', 'student_2110014', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'phuc.ho211@hcmut.edu.vn', '0901000023', 'Hồ Vĩnh Phúc', 'MALE', TRUE, TRUE),
(24, 'STUDENT', 'student_2110015', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'anh.nguyen211@hcmut.edu.vn', '0901000024', 'Nguyễn Phương Anh', 'FEMALE', TRUE, TRUE),
(25, 'STUDENT', 'student_2110016', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'tri.cao211@hcmut.edu.vn', '0901000025', 'Cao Minh Trí', 'MALE', TRUE, TRUE),
(26, 'STUDENT', 'student_2110017', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'yen.phan211@hcmut.edu.vn', '0901000026', 'Phan Hải Yến', 'FEMALE', TRUE, TRUE),
(27, 'STUDENT', 'student_2110018', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'huy.lam211@hcmut.edu.vn', '0901000027', 'Lâm Gia Huy', 'MALE', TRUE, TRUE),
(28, 'STUDENT', 'student_2110019', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'linh.duong211@hcmut.edu.vn', '0901000028', 'Dương Thùy Linh', 'FEMALE', TRUE, TRUE),
(29, 'STUDENT', 'student_2110020', '$2b$10$e8ZaS2oN89f28UaDfxXk0u1kZ01m4vF3L/hR8y4jVqK2X90w7P9tS', 'bach.chau211@hcmut.edu.vn', '0901000029', 'Châu Hoàng Bách', 'MALE', TRUE, TRUE);

-- 9. User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 2),
(4, 3),
(5, 4),
(6, 5),
(7, 6),
(8, 8),
(9, 8),
(10, 7), (11, 7), (12, 7), (13, 7), (14, 7), (15, 7), (16, 7), (17, 7), (18, 7), (19, 7),
(20, 7), (21, 7), (22, 7), (23, 7), (24, 7), (25, 7), (26, 7), (27, 7), (28, 7), (29, 7);

-- 10. Phòng ban & Chức vụ
INSERT INTO employee_departments (id, code, name, description) VALUES
(1, 'DEPT-MGT', 'Ban Quản Lý Căng Tin', 'Điều hành chung'),
(2, 'DEPT-KIT', 'Bộ Phận Bếp & Nấu Nướng', 'Sơ chế và nấu món'),
(3, 'DEPT-SRV', 'Bộ Phận Thu Ngân & Phục Vụ', 'Bán hàng, thu ngân, giao món'),
(4, 'DEPT-LOG', 'Bộ Phận Kho Vận & Tiếp Liệu', 'Nhập nguyên liệu, bảo quản');

INSERT INTO employee_positions (id, code, name, base_salary) VALUES
(1, 'POS-MN', 'Trưởng Căng Tin', 18000000.00),
(2, 'POS-CH', 'Bếp Trưởng', 15000000.00),
(3, 'POS-CA', 'Thu Ngân', 8000000.00),
(4, 'POS-WH', 'Thủ Kho', 9000000.00),
(5, 'POS-AC', 'Kế Toán Quầy', 11000000.00),
(6, 'POS-SV', 'Nhân Viên Phục Vụ', 7000000.00);

-- 11. Nhân viên (Employees)
INSERT INTO employees (id, user_id, school_id, campus_id, department_id, position_id, employee_code, hire_date, contract_type, status) VALUES
(1, 2, 1, 1, 1, 1, 'EMP001', '2022-01-10', 'FULL_TIME', 'ACTIVE'),
(2, 3, 1, 2, 1, 1, 'EMP002', '2022-03-15', 'FULL_TIME', 'ACTIVE'),
(3, 4, 1, 1, 3, 3, 'EMP003', '2023-05-01', 'FULL_TIME', 'ACTIVE'),
(4, 5, 1, 1, 2, 2, 'EMP004', '2022-06-01', 'FULL_TIME', 'ACTIVE'),
(5, 6, 1, 1, 4, 4, 'EMP005', '2022-08-10', 'FULL_TIME', 'ACTIVE'),
(6, 7, 1, 1, 1, 5, 'EMP006', '2022-09-01', 'FULL_TIME', 'ACTIVE');

-- 12. Sinh viên (Students)
INSERT INTO students (id, user_id, school_id, campus_id, faculty_id, class_id, student_code, enrollment_year, status) VALUES
(1, 10, 1, 1, 1, 1, '2110001', 2021, 'STUDYING'),
(2, 11, 1, 1, 1, 1, '2110002', 2021, 'STUDYING'),
(3, 12, 1, 1, 1, 2, '2110003', 2022, 'STUDYING'),
(4, 13, 1, 1, 1, 2, '2110004', 2022, 'STUDYING'),
(5, 14, 1, 1, 2, 3, '2110005', 2021, 'STUDYING'),
(6, 15, 1, 1, 2, 3, '2110006', 2021, 'STUDYING'),
(7, 16, 1, 2, 3, 4, '2110007', 2022, 'STUDYING'),
(8, 17, 1, 2, 3, 4, '2110008', 2022, 'STUDYING'),
(9, 18, 1, 2, 4, 5, '2110009', 2023, 'STUDYING'),
(10, 19, 1, 2, 4, 5, '2110010', 2023, 'STUDYING'),
(11, 20, 1, 1, 1, 1, '2110011', 2021, 'STUDYING'),
(12, 21, 1, 1, 1, 1, '2110012', 2021, 'STUDYING'),
(13, 22, 1, 1, 1, 2, '2110013', 2022, 'STUDYING'),
(14, 23, 1, 1, 1, 2, '2110014', 2022, 'STUDYING'),
(15, 24, 1, 1, 2, 3, '2110015', 2021, 'STUDYING'),
(16, 25, 1, 1, 2, 3, '2110016', 2021, 'STUDYING'),
(17, 26, 1, 2, 3, 4, '2110017', 2022, 'STUDYING'),
(18, 27, 1, 2, 3, 4, '2110018', 2022, 'STUDYING'),
(19, 28, 1, 2, 4, 5, '2110019', 2023, 'STUDYING'),
(20, 29, 1, 2, 4, 5, '2110020', 2023, 'STUDYING');

-- 13. Giảng viên (Teachers)
INSERT INTO teachers (id, user_id, school_id, campus_id, faculty_id, teacher_code, academic_rank, status) VALUES
(1, 8, 1, 1, 1, 'GV-CSE01', 'Tiến sĩ', 'ACTIVE'),
(2, 9, 1, 2, 4, 'GV-CHEM01', 'Thạc sĩ', 'ACTIVE');

-- 14. Căng tin (Canteens: 3 Căng tin DNU)
INSERT INTO canteens (id, campus_id, manager_employee_id, code, name, phone, location_description, opening_time, closing_time) VALUES
(1, 1, 1, 'CT-DNU-G', 'Căng tin Trung Tâm (Tòa nhà G - Hà Đông)', '02435577701', 'Tầng 1 Tòa Nhà Trung Tâm G, Cơ sở Chính Phú Lãm', '06:30:00', '19:30:00'),
(2, 1, 1, 'CT-DNU-AB', 'Căng tin Khu Giảng Đường & KTX (Tòa A-B DNU)', '02435577702', 'Tầng Trệt Tòa Nhà A-B Giảng Đường', '07:00:00', '18:00:00'),
(3, 2, 2, 'CT-DNU-GARDEN', 'Căng tin DNU Garden & Coffee (Khu Thể Thao)', '02435577703', 'Khu Phức Hợp Sân Bóng & Thể Thao DNU', '06:00:00', '20:30:00');

-- 15. Quầy phục vụ (Counters)
INSERT INTO counters (id, canteen_id, code, name, counter_type) VALUES
(1, 1, 'CTR-G-RICE', 'Quầy Cơm Sinh Viên DNU (Tòa G)', 'FOOD'),
(2, 1, 'CTR-G-NOODLE', 'Quầy Bún Phở Hà Nội (Tòa G)', 'FOOD'),
(3, 1, 'CTR-G-DRINK', 'Quầy Trà Sữa & Cà Phê DNU', 'DRINK'),
(4, 2, 'CTR-AB-FAST', 'Quầy Bánh Mì & Ăn Vặt Tòa AB', 'FAST_FOOD'),
(5, 3, 'CTR-GARDEN-ALL', 'Quầy DNU Garden & Coffee', 'ALL_IN_ONE');

-- 16. Khu vực ăn & Bàn
INSERT INTO dining_areas (id, canteen_id, name, floor_number, capacity) VALUES
(1, 1, 'Sảnh Chính Máy Lạnh Tầng 1', 1, 200),
(2, 1, 'Khu Sân Vườn Thoáng Mát', 1, 80),
(3, 3, 'Đại Sảnh Sinh Viên Dĩ An', 1, 350);

INSERT INTO dining_tables (id, dining_area_id, canteen_id, table_number, seats, qr_code_token, status) VALUES
(1, 1, 1, 'A1-01', 4, 'QR-TAB-A1-01-SECURE99', 'AVAILABLE'),
(2, 1, 1, 'A1-02', 4, 'QR-TAB-A1-02-SECURE99', 'AVAILABLE'),
(3, 1, 1, 'A1-03', 6, 'QR-TAB-A1-03-SECURE99', 'AVAILABLE'),
(4, 1, 1, 'A1-04', 6, 'QR-TAB-A1-04-SECURE99', 'AVAILABLE'),
(5, 2, 1, 'SV-01', 4, 'QR-TAB-SV-01-SECURE99', 'AVAILABLE'),
(6, 3, 3, 'DA-01', 8, 'QR-TAB-DA-01-SECURE99', 'AVAILABLE');

-- 17. Đơn vị tính (Units)
INSERT INTO units (id, code, name, unit_type) VALUES
(1, 'g', 'Gram', 'WEIGHT'),
(2, 'kg', 'Kilogram', 'WEIGHT'),
(3, 'ml', 'Mililit', 'VOLUME'),
(4, 'l', 'Lít', 'VOLUME'),
(5, 'piece', 'Cái / Quả / Miếng', 'COUNT'),
(6, 'pack', 'Gói / Hộp', 'PACKAGE'),
(7, 'can', 'Lon', 'PACKAGE'),
(8, 'bottle', 'Chai', 'PACKAGE'),
(9, 'portion', 'Suất / Phần', 'COUNT');

-- Quy đổi đơn vị
INSERT INTO unit_conversions (id, from_unit_id, to_unit_id, conversion_rate) VALUES
(1, 2, 1, 1000.000000), -- 1 kg = 1000 g
(2, 4, 3, 1000.000000); -- 1 l = 1000 ml

-- 18. Danh mục nguyên liệu (Ingredient Categories)
INSERT INTO ingredient_categories (id, name, description) VALUES
(1, 'Thịt Tươi & Gia Cầm', 'Thịt heo, bò, gà tươi sống'),
(2, 'Hải Sản Tươi', 'Tôm, cá, mực'),
(3, 'Rau Củ Quả & Nấm', 'Rau xanh, cà chua, hành ngò'),
(4, 'Gia Vị & Dầu Ăn', 'Muối, đường, nước mắm, tiêu, dầu chiên'),
(5, 'Gạo, Bún & Ngũ Cốc', 'Gạo thơm, bún tươi, phở, bột mì'),
(6, 'Đồ Đóng Gói & Nước Giải Khát', 'Coca, nước suối, trà đóng chai');

-- 19. Nguyên liệu (30 Ingredients)
INSERT INTO ingredients (id, category_id, base_unit_id, code, name, average_cost_price, min_stock_level, max_stock_level, storage_type, shelf_life_days) VALUES
(1, 5, 2, 'ING-GAO', 'Gạo thơm lài ST25', 22000.00, 50.000, 1000.000, 'DRY', 180),
(2, 1, 2, 'ING-THIT-GA', 'Thịt đùi gà phi lê', 65000.00, 20.000, 200.000, 'CHILLED', 5),
(3, 1, 2, 'ING-SUON-HEO', 'Sườn non heo tươi', 120000.00, 15.000, 150.000, 'CHILLED', 5),
(4, 1, 2, 'ING-THIT-BO', 'Thịt thăn bò tươi', 230000.00, 10.000, 100.000, 'CHILLED', 4),
(5, 1, 5, 'ING-TRUNG-GA', 'Trứng gà tươi Ba Huân', 3000.00, 100.000, 2000.000, 'ROOM_TEMP', 25),
(6, 3, 2, 'ING-RAU-XA-LACH', 'Xà lách tươi sạch', 25000.00, 5.000, 50.000, 'CHILLED', 3),
(7, 3, 2, 'ING-CA-CHUA', 'Cà chua Đà Lạt', 20000.00, 5.000, 60.000, 'ROOM_TEMP', 7),
(8, 3, 2, 'ING-DUA-LEO', 'Dưa leo sạch', 18000.00, 5.000, 50.000, 'ROOM_TEMP', 7),
(9, 4, 4, 'ING-DAU-AN', 'Dầu thực vật Cái Lân', 35000.00, 20.000, 200.000, 'DRY', 365),
(10, 4, 4, 'ING-NUOC-MAM', 'Nước mắm Nam Ngư', 28000.00, 10.000, 100.000, 'DRY', 365),
(11, 4, 2, 'ING-DUONG', 'Đường tinh luyện Biên Hòa', 24000.00, 20.000, 200.000, 'DRY', 365),
(12, 4, 2, 'ING-MUOI', 'Muối iot tinh khiết', 8000.00, 10.000, 100.000, 'DRY', 730),
(13, 4, 2, 'ING-BOT-NGOT', 'Bột ngọt Ajinomoto', 55000.00, 5.000, 50.000, 'DRY', 730),
(14, 5, 2, 'ING-BANH-PHO', 'Bánh phở tươi truyền thống', 20000.00, 10.000, 100.000, 'ROOM_TEMP', 1),
(15, 5, 2, 'ING-BUN-TUOI', 'Bún tươi sợi nhỏ', 18000.00, 10.000, 100.000, 'ROOM_TEMP', 1),
(16, 3, 2, 'ING-HANH-LA', 'Hành lá tươi', 30000.00, 2.000, 20.000, 'ROOM_TEMP', 3),
(17, 3, 2, 'ING-GIA-DO', 'Giá đỗ sạch', 15000.00, 5.000, 40.000, 'ROOM_TEMP', 2),
(18, 6, 7, 'ING-COCA', 'Nước ngọt Coca Cola 320ml', 8500.00, 50.000, 1000.000, 'ROOM_TEMP', 365),
(19, 6, 7, 'ING-PEPSI', 'Nước ngọt Pepsi 320ml', 8500.00, 50.000, 1000.000, 'ROOM_TEMP', 365),
(20, 6, 8, 'ING-AQUAFINA', 'Nước tinh khiết Aquafina 500ml', 4500.00, 100.000, 2000.000, 'ROOM_TEMP', 730),
(21, 6, 6, 'ING-TRA-DAO-CAN', 'Đào ngâm đóng hộp Kronos', 38000.00, 10.000, 100.000, 'ROOM_TEMP', 730),
(22, 4, 2, 'ING-TRA-DEN', 'Trà đen Phúc Long', 120000.00, 2.000, 30.000, 'DRY', 365),
(23, 1, 5, 'ING-XUC-XICH', 'Xúc xích Đức Vissan', 4500.00, 50.000, 500.000, 'CHILLED', 30),
(24, 1, 2, 'ING-PHO-MAI', 'Phô mai Mozzarella', 180000.00, 2.000, 30.000, 'FROZEN', 90),
(25, 3, 2, 'ING-CHANH', 'Chanh tươi không hạt', 22000.00, 3.000, 30.000, 'ROOM_TEMP', 10),
(26, 3, 2, 'ING-OT', 'Ớt hiểm đỏ', 40000.00, 1.000, 10.000, 'ROOM_TEMP', 10),
(27, 4, 2, 'ING-TIEU', 'Tiêu đen xay Phú Quốc', 160000.00, 2.000, 20.000, 'DRY', 365),
(28, 4, 2, 'ING-TOI', 'Tỏi khô', 45000.00, 3.000, 30.000, 'DRY', 60),
(29, 4, 2, 'ING-HANH-TIM', 'Hành tím củ', 40000.00, 3.000, 30.000, 'DRY', 60),
(30, 2, 2, 'ING-TOM-TUOI', 'Tôm sú tươi sống', 220000.00, 5.000, 50.000, 'FROZEN', 30);

-- 20. Danh mục món ăn (10 Categories)
INSERT INTO categories (id, canteen_id, parent_id, code, name, display_order) VALUES
(1, NULL, NULL, 'CAT-COM', 'Cơm Phần & Cơm Đĩa', 1),
(2, NULL, NULL, 'CAT-BUN-PHO', 'Bún - Phở - Mì Nước', 2),
(3, NULL, NULL, 'CAT-FASTFOOD', 'Bánh Mì & Đồ Ăn Nhanh', 3),
(4, NULL, NULL, 'CAT-DRINK', 'Đồ Uống & Nước Giải Khát', 4),
(5, NULL, NULL, 'CAT-DESSERT', 'Tráng Miệng & Chè', 5),
(6, NULL, 1, 'CAT-COM-SUON', 'Cơm Sườn & Cơm Tấm', 6),
(7, NULL, 1, 'CAT-COM-GA', 'Cơm Gà Các Loại', 7),
(8, NULL, 4, 'CAT-TRA-CAFE', 'Trà Sữa & Cà Phê', 8),
(9, NULL, 4, 'CAT-NUOC-DONG-CHAI', 'Nước Ngọt Đóng Chai', 9),
(10, NULL, NULL, 'CAT-COMBO', 'Combo Tiết Kiệm Học Đường', 10);

-- 21. Món ăn (30 Foods)
INSERT INTO foods (id, canteen_id, counter_id, category_id, code, name, description, base_price, cost_price, is_featured, is_best_seller, is_available) VALUES
(1, 1, 1, 1, 'FOOD-COM-GA-XOI-MO', 'Cơm Gà Xối Mỡ Giòn Da', 'Đùi gà góc tư chiên giòn, cơm chiên hoàng bào kèm canh', 35000.00, 18000.00, TRUE, TRUE, TRUE),
(2, 1, 1, 1, 'FOOD-COM-SUON-NUONG', 'Cơm Sườn Nướng Mật Ong', 'Sườn non ướp mật ong nướng than hoa, mỡ hành, đồ chua', 35000.00, 17500.00, TRUE, TRUE, TRUE),
(3, 1, 1, 1, 'FOOD-COM-SUON-BI-CHA', 'Cơm Tấm Sườn Bì Chả', 'Đặc sản cơm tấm Sài Gòn chuẩn vị học đường', 40000.00, 20000.00, TRUE, TRUE, TRUE),
(4, 1, 1, 1, 'FOOD-COM-BO-LUC-LAC', 'Cơm Bò Lúc Lắc', 'Thịt bò xào ớt chuông hành tây đậm vị', 45000.00, 24000.00, FALSE, FALSE, TRUE),
(5, 1, 1, 1, 'FOOD-COM-THIT-KHO-TRUNG', 'Cơm Thịt Kho Trứng Cút', 'Thịt ba rọi kho tàu mềm thơm béo ngậy', 30000.00, 14000.00, FALSE, TRUE, TRUE),
(6, 1, 1, 1, 'FOOD-COM-CA-HU-KHO-TO', 'Cơm Cá Hú Kho Tộ', 'Cá hú kho đậm đà ăn kèm rau luộc', 30000.00, 13500.00, FALSE, FALSE, TRUE),
(7, 1, 2, 2, 'FOOD-PHO-BO-TAI', 'Phở Bò Tái Hà Nội', 'Nước dùng hầm xương 12 tiếng, thịt bò tươi mềm', 35000.00, 17000.00, TRUE, TRUE, TRUE),
(8, 1, 2, 2, 'FOOD-PHO-BO-NAM', 'Phở Bò Nạm Gầu', 'Nạm bò thơm béo đậm đà', 35000.00, 17000.00, FALSE, FALSE, TRUE),
(9, 1, 2, 2, 'FOOD-BUN-BO-HUE', 'Bún Bò Huế Đặc Biệt', 'Bún bò sa tế cay nồng kèm chả cua và nạm bò', 40000.00, 21000.00, TRUE, TRUE, TRUE),
(10, 1, 2, 2, 'FOOD-BUN-THIT-NUONG', 'Bún Thịt Nướng Chả Giò', 'Bún tươi, thịt nướng mỡ hành, đậu phộng rang giòn', 32000.00, 15000.00, FALSE, TRUE, TRUE),
(11, 1, 2, 2, 'FOOD-BUN-RIEU-CUA', 'Bún Riêu Cua Đồng', 'Riêu cua nguyên chất, đậu hũ chiên, cà chua', 30000.00, 14000.00, FALSE, FALSE, TRUE),
(12, 1, 2, 2, 'FOOD-MI-QUANG-GA', 'Mì Quảng Gà Xứ Quảng', 'Sợi mì vàng óng, thịt gà ta rim, bánh tráng nướng', 35000.00, 16500.00, FALSE, FALSE, TRUE),
(13, 1, 3, 4, 'FOOD-TRA-DAO-CAM-SA', 'Trà Đào Cam Sả', 'Trà đen thơm mát kết hợp đào miếng giòn ngọt và sả tươi', 25000.00, 9000.00, TRUE, TRUE, TRUE),
(14, 1, 3, 4, 'FOOD-TRA-TAC-MAT-ONG', 'Trà Tắc Mật Ong', 'Thức uống thanh nhiệt giải khát mùa thi', 15000.00, 4500.00, FALSE, TRUE, TRUE),
(15, 1, 3, 4, 'FOOD-TRA-SUA-TRAN-CHAU', 'Trà Sữa Trân Châu Đường Đen', 'Trà sữa truyền thống béo ngậy kèm trân châu dẻo', 25000.00, 10000.00, TRUE, TRUE, TRUE),
(16, 1, 3, 4, 'FOOD-CAFE-DA', 'Cà Phê Đen Đá', 'Cà phê Robusta Đắk Lắk nguyên chất', 15000.00, 4000.00, FALSE, TRUE, TRUE),
(17, 1, 3, 4, 'FOOD-CAFE-SUA-DA', 'Cà Phê Sữa Đá', 'Cà phê pha phin thơm lừng kết hợp sữa đặc', 18000.00, 5500.00, TRUE, TRUE, TRUE),
(18, 1, 3, 4, 'FOOD-COCA-CAN', 'Coca Cola Lon 320ml', 'Nước ngọt có gas ướp lạnh', 12000.00, 8500.00, FALSE, TRUE, TRUE),
(19, 1, 3, 4, 'FOOD-PEPSI-CAN', 'Pepsi Lon 320ml', 'Nước ngọt có gas ướp lạnh', 12000.00, 8500.00, FALSE, FALSE, TRUE),
(20, 1, 3, 4, 'FOOD-AQUAFINA-BOTTLE', 'Nước Suối Aquafina 500ml', 'Nước tinh khiết ướp lạnh', 8000.00, 4500.00, FALSE, TRUE, TRUE),
(21, 2, 4, 3, 'FOOD-BANH-MI-THIT-CHA', 'Bánh Mì Kẹp Thịt Chả', 'Bánh mì giòn rụm kẹp pate bơ, chả lụa và thịt nguội', 20000.00, 9500.00, TRUE, TRUE, TRUE),
(22, 2, 4, 3, 'FOOD-BANH-MI-OP-LA', 'Bánh Mì Xíu Mại Ốp La', '2 trứng ốp la lòng đào kèm xíu mại sốt cà', 22000.00, 10500.00, FALSE, TRUE, TRUE),
(23, 2, 4, 3, 'FOOD-BANH-BAO-TRUNG-CUT', 'Bánh Bao Nhân Thịt Trứng Cút', 'Bánh bao hấp nóng hổi', 15000.00, 7000.00, FALSE, FALSE, TRUE),
(24, 2, 4, 3, 'FOOD-XOI-GA-XE', 'Xôi Gà Xé Nấm Hương', 'Xôi nếp dẻo thơm, gà xé xào nấm', 25000.00, 11000.00, FALSE, TRUE, TRUE),
(25, 3, 5, 1, 'FOOD-COM-CHIEN-DUONG-CHAU', 'Cơm Chiên Dương Châu', 'Cơm chiên lạp xưởng, đậu hà lan, trứng gà', 30000.00, 13000.00, FALSE, TRUE, TRUE),
(26, 3, 5, 2, 'FOOD-HU-TIEU-NAM-VANG', 'Hủ Tiếu Nam Vang', 'Hủ tiếu nước dùng tôm mực thịt bằm chuẩn vị', 35000.00, 16500.00, TRUE, TRUE, TRUE),
(27, 3, 5, 5, 'FOOD-CHE-DUONG-QUY', 'Chè Dưỡng Nhan Tuyết Yến', 'Chè thanh mát bổ dưỡng', 20000.00, 8000.00, FALSE, FALSE, TRUE),
(28, 3, 5, 5, 'FOOD-CHE-THAI', 'Chè Thái Sầu Riêng', 'Chè trái cây sữa tươi thơm lừng', 25000.00, 11000.00, TRUE, FALSE, TRUE),
(29, 3, 5, 5, 'FOOD-YAOURT-TRAI-CAY', 'Sữa Chua Trái Cây Tươi', 'Sữa chua nhà làm mix dưa hấu, thanh long', 18000.00, 7500.00, FALSE, FALSE, TRUE),
(30, 3, 5, 1, 'FOOD-COM-CHAY-RAU-NAM', 'Cơm Chay Nấm Rau Củ', 'Phần cơm chay thanh đạm đầy đủ dưỡng chất', 25000.00, 9500.00, FALSE, FALSE, TRUE);

-- 22. Biến thể món ăn (Food Variants - Size S, M, L)
INSERT INTO food_variants (id, food_id, sku, name, price_adjustment, final_price, is_default) VALUES
(1, 13, 'VAR-TRA-DAO-M', 'Size M (Chuẩn 500ml)', 0.00, 25000.00, TRUE),
(2, 13, 'VAR-TRA-DAO-L', 'Size L (Khổng lồ 700ml)', 7000.00, 32000.00, FALSE),
(3, 15, 'VAR-TRA-SUA-M', 'Size M (Vừa 500ml)', 0.00, 25000.00, TRUE),
(4, 15, 'VAR-TRA-SUA-L', 'Size L (Lớn 700ml)', 8000.00, 33000.00, FALSE),
(5, 7, 'VAR-PHO-THUONG', 'Tô Thường', 0.00, 35000.00, TRUE),
(6, 7, 'VAR-PHO-DAC-BIET', 'Tô Đặc Biệt (Thêm Thịt & Bò Viên)', 10000.00, 45000.00, FALSE),
(7, 2, 'VAR-COM-SUON-THUONG', 'Cơm Sườn 1 Miếng', 0.00, 35000.00, TRUE),
(8, 2, 'VAR-COM-SUON-2MIENG', 'Cơm Sườn 2 Miếng To', 18000.00, 53000.00, FALSE);

-- 23. Topping (10 Toppings)
INSERT INTO toppings (id, canteen_id, code, name, price, cost_price, is_available) VALUES
(1, 1, 'TOP-TRUNG-OP-LA', 'Trứng Ốp La Lòng Đào', 6000.00, 3000.00, TRUE),
(2, 1, 'TOP-XUC-XICH', 'Xúc Xích Nướng Chiên', 8000.00, 4500.00, TRUE),
(3, 1, 'TOP-CHA-LUA', 'Chả Lụa Hấp Thêm', 7000.00, 3500.00, TRUE),
(4, 1, 'TOP-PHO-MAI', 'Phô Mai Lát Tan Chảy', 8000.00, 4500.00, TRUE),
(5, 1, 'TOP-COM-THEM', 'Cơm Thêm / Bún Thêm', 5000.00, 1500.00, TRUE),
(6, 1, 'TOP-THIT-THEM', 'Thịt Gà / Heo Thêm', 12000.00, 6500.00, TRUE),
(7, 1, 'TOP-TRAN-CHAU', 'Trân Châu Đen Dẻo', 5000.00, 2000.00, TRUE),
(8, 1, 'TOP-THACH-DAO', 'Đào Miếng Giòn Thêm (2 miếng)', 7000.00, 3500.00, TRUE),
(9, 1, 'TOP-BO-VIEN', 'Bò Viên Thêm (3 viên)', 10000.00, 5000.00, TRUE),
(10, 1, 'TOP-CANH-THO-CAM', 'Chén Canh Rong Biển / Thịt Bằm', 5000.00, 2000.00, TRUE);

-- Gán Topping vào Món
INSERT INTO food_toppings (food_id, topping_id, max_quantity, is_default) VALUES
(1, 1, 3, FALSE), (1, 2, 2, FALSE), (1, 5, 2, FALSE), (1, 6, 2, FALSE),
(2, 1, 3, FALSE), (2, 3, 2, FALSE), (2, 5, 2, FALSE),
(3, 1, 3, FALSE), (3, 5, 2, FALSE),
(7, 9, 3, FALSE),
(9, 9, 3, FALSE),
(13, 8, 3, FALSE),
(15, 7, 3, FALSE);

-- 24. Combo (5 Combos)
INSERT INTO combos (id, canteen_id, code, name, description, price, original_price) VALUES
(1, 1, 'COMBO-SANG-01', 'Combo Năng Lượng Sáng', 'Bánh Mì Thịt Chả + 1 Cà Phê Sữa Đá', 32000.00, 38000.00),
(2, 1, 'COMBO-TRUA-SV', 'Combo Cơm Trưa Sinh Viên A1', 'Cơm Gà Xối Mỡ + 1 Ly Trà Tắc Mật Ong', 44000.00, 50000.00),
(3, 1, 'COMBO-PHO-DAO', 'Combo Phở Bò Tái & Trà Đào', '1 Tô Phở Bò Tái + 1 Ly Trà Đào Cam Sả Size M', 52000.00, 60000.00),
(4, 1, 'COMBO-SUON-COCA', 'Combo Cơm Sườn & Coca Mát Lạnh', '1 Cơm Sườn Nướng + 1 Lon Coca 320ml', 42000.00, 47000.00),
(5, 3, 'COMBO-CHIEU-DA', 'Combo Ăn Vặt Giờ Giải Lao Dĩ An', '1 Cơm Chiên Dương Châu + 1 Trà Sữa Trân Châu', 48000.00, 55000.00);

-- Chi tiết món trong combo
INSERT INTO combo_items (id, combo_id, food_id, food_variant_id, quantity) VALUES
(1, 1, 21, NULL, 1),
(2, 1, 17, NULL, 1),
(3, 2, 1, NULL, 1),
(4, 2, 14, NULL, 1),
(5, 3, 7, 5, 1),
(6, 3, 13, 1, 1),
(7, 4, 2, 7, 1),
(8, 4, 18, NULL, 1),
(9, 5, 25, NULL, 1),
(10, 5, 15, 3, 1);

-- 25. Công thức định lượng món (Recipes & Recipe Items)
INSERT INTO recipes (id, food_id, food_variant_id, code, name, yield_quantity) VALUES
(1, 1, NULL, 'REC-COM-GA-XOIMO', 'Định lượng 1 suất Cơm Gà Xối Mỡ', 1.00),
(2, 2, 7, 'REC-COM-SUON', 'Định lượng 1 suất Cơm Sườn Nướng', 1.00),
(3, 7, 5, 'REC-PHO-BO-TAI', 'Định lượng 1 tô Phở Bò Tái', 1.00),
(4, 13, 1, 'REC-TRA-DAO-M', 'Định lượng 1 ly Trà Đào Cam Sả Size M', 1.00);

INSERT INTO recipe_items (id, recipe_id, ingredient_id, quantity, unit_id) VALUES
-- Cơm gà: 0.2 kg gạo, 0.25 kg thịt gà, 0.05 kg rau dưa leo xà lách, 0.02 l dầu ăn, 0.005 kg gia vị
(1, 1, 1, 0.2000, 2),
(2, 1, 2, 0.2500, 2),
(3, 1, 8, 0.0500, 2),
(4, 1, 9, 0.0200, 4),
(5, 1, 12, 0.0050, 2),
-- Cơm sườn: 0.2 kg gạo, 0.15 kg sườn heo, 0.01 l nước mắm, 0.01 kg đường
(6, 2, 1, 0.2000, 2),
(7, 2, 3, 0.1500, 2),
(8, 2, 10, 0.0100, 4),
(9, 2, 11, 0.0100, 2),
-- Phở bò tái: 0.18 kg bánh phở, 0.12 kg thịt bò, 0.02 kg hành lá, 0.05 kg giá đỗ
(10, 3, 14, 0.1800, 2),
(11, 3, 4, 0.1200, 2),
(12, 3, 16, 0.0200, 2),
(13, 3, 17, 0.0500, 2),
-- Trà đào size M: 0.015 kg trà đen, 1 hộp/phần đào (0.1 pack), 0.025 kg đường
(14, 4, 22, 0.0150, 2),
(15, 4, 11, 0.0250, 2);

-- 26. Nhà cung cấp (5 Suppliers)
INSERT INTO suppliers (id, code, name, tax_code, phone, email, address, contact_person, payment_terms_days) VALUES
(1, 'SUP-CP-FOOD', 'Công ty Cổ Phần Chăn Nuôi C.P. Việt Nam', '0300123999', '02838112233', 'orders@cp.com.vn', 'KCN Biên Hòa 2, Đồng Nai', 'Nguyễn Văn Hùng', 30),
(2, 'SUP-BA-HUAN', 'Công ty TNHH Ba Huân (Trứng Gia Cầm)', '0300456888', '02838556677', 'kinhdoanh@bahuan.vn', 'Bình Chánh, TP.HCM', 'Phạm Thị Huân', 15),
(3, 'SUP-SACH-DALAT', 'Hợp Tác Xã Nông Sản Rau Củ Sạch Đà Lạt', '5800789111', '02633889900', 'contact@dalatfarm.vn', 'Đà Lạt, Lâm Đồng', 'Lê Hoàng Hải', 15),
(4, 'SUP-COCA-VN', 'Công ty TNHH Nước Giải Khát Coca-Cola Việt Nam', '0301987654', '02838961122', 'coca_order@coca-cola.com', 'Xa Lộ Hà Nội, TP. Thủ Đức, TP.HCM', 'Trần Bảo Ngọc', 45),
(5, 'SUP-VISSAN', 'Công Ty Cổ Phần Việt Nam Kỹ Nghệ Súc Sản (Vissan)', '0300100200', '02835533888', 'vissanco@vissan.com.vn', '420 Nơ Trang Long, Bình Thạnh, TP.HCM', 'Đỗ Minh Trí', 30);

-- Gán nguyên liệu NCC phân phối
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, unit_id, supplier_price, lead_time_days, is_preferred) VALUES
(1, 1, 2, 2, 65000.00, 1, TRUE),
(2, 1, 3, 2, 120000.00, 1, TRUE),
(3, 2, 5, 5, 3000.00, 1, TRUE),
(4, 3, 6, 2, 25000.00, 1, TRUE),
(5, 3, 7, 2, 20000.00, 1, TRUE),
(6, 4, 18, 7, 8500.00, 2, TRUE),
(7, 4, 20, 8, 4500.00, 2, TRUE),
(8, 5, 23, 5, 4500.00, 1, TRUE);

-- 27. Kho hàng (Warehouses)
INSERT INTO warehouses (id, canteen_id, manager_employee_id, code, name, warehouse_type, address) VALUES
(1, 1, 5, 'WH-A1-MAIN', 'Kho Tổng & Sơ Chế Căng Tin A1 (Q.10)', 'CANTEEN_KITCHEN_STORAGE', 'Sau bếp trung tâm Tòa H1'),
(2, 2, 5, 'WH-B2-DRY', 'Kho Thực Phẩm & Nước B2 (Q.10)', 'DRY_STORAGE', 'Kế bên quầy Fastfood B4'),
(3, 3, 2, 'WH-DA-CENTRAL', 'Kho Trung Tâm Căng Tin Dĩ An', 'CENTRAL_STORAGE', 'Khu Bếp Ký Túc Xá Dĩ An');

-- Vị trí ô chứa trong kho
INSERT INTO warehouse_locations (id, warehouse_id, code, name, temperature_zone) VALUES
(1, 1, 'LOC-A1-FREEZER-01', 'Tủ Đông Công Nghiệp 01 (-18C)', 'FROZEN'),
(2, 1, 'LOC-A1-CHILL-01', 'Tủ Mát Bảo Quản Rau Củ (4C)', 'COOL'),
(3, 1, 'LOC-A1-DRY-RACK1', 'Kệ Khô Gạo & Gia Vị Tầng 1', 'AMBIENT'),
(4, 3, 'LOC-DA-COLD', 'Kho Lạnh Trung Tâm Dĩ An', 'FROZEN');

-- 28. Tồn kho tức thời (Inventory Stocks)
INSERT INTO inventory_stocks (id, warehouse_id, ingredient_id, unit_id, quantity, reserved_quantity) VALUES
(1, 1, 1, 2, 450.000, 20.000), -- Gạo
(2, 1, 2, 2, 85.000, 15.000),  -- Gà
(3, 1, 3, 2, 60.000, 10.000),  -- Sườn
(4, 1, 4, 2, 40.000, 5.000),   -- Bò
(5, 1, 5, 5, 800.000, 50.000), -- Trứng
(6, 1, 6, 2, 25.000, 2.000),   -- Xà lách
(7, 1, 7, 2, 30.000, 2.000),   -- Cà chua
(8, 1, 8, 2, 35.000, 3.000),   -- Dưa leo
(9, 1, 9, 4, 90.000, 5.000),   -- Dầu ăn
(10, 1, 10, 4, 50.000, 2.000), -- Nước mắm
(11, 1, 11, 2, 80.000, 5.000), -- Đường
(12, 1, 12, 2, 40.000, 1.000), -- Muối
(13, 1, 14, 2, 45.000, 10.000),-- Bánh phở
(14, 1, 16, 2, 12.000, 1.000), -- Hành lá
(15, 1, 17, 2, 20.000, 2.000), -- Giá đỗ
(16, 1, 18, 7, 350.000, 20.000),-- Coca
(17, 1, 20, 8, 500.000, 30.000),-- Nước suối
(18, 1, 22, 2, 15.000, 1.000), -- Trà đen
(19, 1, 23, 5, 200.000, 10.000),-- Xúc xích
(20, 1, 24, 2, 15.000, 1.000); -- Phô mai

-- 29. Lô hàng tồn kho (Batches - FIFO/FEFO)
INSERT INTO inventory_batches (id, warehouse_id, location_id, ingredient_id, supplier_id, unit_id, batch_number, initial_quantity, remaining_quantity, unit_cost_price, expiry_date, status) VALUES
(1, 1, 1, 2, 1, 2, 'BATCH-GA-20260820-A', 50.000, 35.000, 65000.00, '2026-08-28', 'IN_STOCK'),
(2, 1, 1, 2, 1, 2, 'BATCH-GA-20260824-B', 50.000, 50.000, 65000.00, '2026-09-02', 'IN_STOCK'),
(3, 1, 1, 3, 1, 2, 'BATCH-SUON-20260822', 60.000, 60.000, 120000.00, '2026-08-30', 'IN_STOCK'),
(4, 1, 1, 4, 1, 2, 'BATCH-BO-20260824', 40.000, 40.000, 230000.00, '2026-08-29', 'IN_STOCK'),
(5, 1, 3, 1, 1, 2, 'BATCH-GAO-20260801', 500.000, 450.000, 22000.00, '2027-02-01', 'IN_STOCK'),
(6, 1, 2, 5, 2, 5, 'BATCH-TRUNG-20260820', 1000.000, 800.000, 3000.00, '2026-09-15', 'IN_STOCK'),
(7, 1, 3, 18, 4, 7, 'BATCH-COCA-20260715', 500.000, 350.000, 8500.00, '2027-07-15', 'IN_STOCK'),
(8, 1, 3, 20, 4, 8, 'BATCH-AQUA-20260710', 600.000, 500.000, 4500.00, '2028-07-10', 'IN_STOCK');

-- 30. Chương trình Khuyến mãi & Vouchers
INSERT INTO promotions (id, canteen_id, code, name, description, promotion_type, discount_value, min_order_amount, target_user_type, start_date, end_date, is_active) VALUES
(1, NULL, 'PROMO-SV-WELCOME', 'Chào Đón Tân Sinh Viên K24', 'Giảm 20% tối đa 15k cho đơn hàng sinh viên', 'PERCENTAGE', 20.00, 30000.00, 'STUDENT', '2026-08-01 00:00:00', '2026-09-30 23:59:59', TRUE),
(2, 1, 'PROMO-SANG-A1', 'Khuyến Mãi Ăn Sáng Căng Tin A1', 'Giảm trực tiếp 5.000đ cho đơn sáng', 'FIXED_AMOUNT', 5000.00, 25000.00, 'ALL', '2026-08-01 06:00:00', '2026-12-31 09:30:00', TRUE);

INSERT INTO vouchers (id, promotion_id, canteen_id, voucher_code, usage_limit, used_count, per_user_limit, is_active) VALUES
(1, 1, NULL, 'BKCHAO2026', 500, 15, 1, TRUE),
(2, 2, 1, 'BKSANG5K', 1000, 45, 10, TRUE);

-- 31. Điểm thưởng khách hàng mẫu (Customer Points)
INSERT INTO customer_points (id, user_id, total_points, available_points, spent_points, membership_tier) VALUES
(1, 10, 120, 120, 0, 'SILVER'),
(2, 11, 85, 85, 0, 'BRONZE'),
(3, 12, 250, 150, 100, 'GOLD');

-- 32. Đơn hàng mẫu (20 Orders)
INSERT INTO orders (id, canteen_id, counter_id, table_id, user_id, cashier_user_id, voucher_id, order_code, order_type, subtotal_amount, discount_amount, tax_amount, final_amount, points_earned, order_status, payment_status, ordered_at, completed_at) VALUES
(1, 1, 1, 1, 10, 4, 1, 'ORD-20260826-0001', 'DINE_IN', 41000.00, 8200.00, 0.00, 32800.00, 3, 'COMPLETED', 'PAID', '2026-08-26 07:15:00', '2026-08-26 07:22:00'),
(2, 1, 2, 2, 11, 4, NULL, 'ORD-20260826-0002', 'DINE_IN', 35000.00, 0.00, 0.00, 35000.00, 3, 'COMPLETED', 'PAID', '2026-08-26 07:20:00', '2026-08-26 07:27:00'),
(3, 1, 3, NULL, 12, 4, NULL, 'ORD-20260826-0003', 'TAKE_AWAY', 25000.00, 0.00, 0.00, 25000.00, 2, 'COMPLETED', 'PAID', '2026-08-26 07:35:00', '2026-08-26 07:38:00'),
(4, 1, 1, 3, 13, 4, NULL, 'ORD-20260826-0004', 'DINE_IN', 70000.00, 0.00, 0.00, 70000.00, 7, 'COMPLETED', 'PAID', '2026-08-26 11:30:00', '2026-08-26 11:42:00'),
(5, 1, 1, 4, 14, 4, NULL, 'ORD-20260826-0005', 'DINE_IN', 35000.00, 0.00, 0.00, 35000.00, 3, 'COMPLETED', 'PAID', '2026-08-26 11:35:00', '2026-08-26 11:45:00'),
(6, 1, 1, 1, 15, 4, NULL, 'ORD-20260826-0006', 'DINE_IN', 40000.00, 0.00, 0.00, 40000.00, 4, 'COMPLETED', 'PAID', '2026-08-26 11:40:00', '2026-08-26 11:50:00'),
(7, 1, 2, 2, 16, 4, NULL, 'ORD-20260826-0007', 'DINE_IN', 40000.00, 0.00, 0.00, 40000.00, 4, 'COMPLETED', 'PAID', '2026-08-26 11:45:00', '2026-08-26 11:55:00'),
(8, 1, 3, NULL, 17, 4, NULL, 'ORD-20260826-0008', 'TAKE_AWAY', 15000.00, 0.00, 0.00, 15000.00, 1, 'COMPLETED', 'PAID', '2026-08-26 11:50:00', '2026-08-26 11:52:00'),
(9, 1, 1, 3, 18, 4, NULL, 'ORD-20260826-0009', 'DINE_IN', 35000.00, 0.00, 0.00, 35000.00, 3, 'COMPLETED', 'PAID', '2026-08-26 12:00:00', '2026-08-26 12:10:00'),
(10, 1, 1, 4, 19, 4, NULL, 'ORD-20260826-0010', 'DINE_IN', 30000.00, 0.00, 0.00, 30000.00, 3, 'COMPLETED', 'PAID', '2026-08-26 12:05:00', '2026-08-26 12:14:00'),
(11, 1, 1, 1, 20, 4, NULL, 'ORD-20260826-0011', 'DINE_IN', 35000.00, 0.00, 0.00, 35000.00, 3, 'COMPLETED', 'PAID', '2026-08-26 12:10:00', '2026-08-26 12:19:00'),
(12, 1, 2, 2, 21, 4, NULL, 'ORD-20260826-0012', 'DINE_IN', 35000.00, 0.00, 0.00, 35000.00, 3, 'COMPLETED', 'PAID', '2026-08-26 12:15:00', '2026-08-26 12:25:00'),
(13, 1, 1, 3, 22, 4, NULL, 'ORD-20260826-0013', 'DINE_IN', 35000.00, 0.00, 0.00, 35000.00, 3, 'COMPLETED', 'PAID', '2026-08-26 12:20:00', '2026-08-26 12:30:00'),
(14, 1, 1, 4, 23, 4, NULL, 'ORD-20260826-0014', 'DINE_IN', 44000.00, 0.00, 0.00, 44000.00, 4, 'COMPLETED', 'PAID', '2026-08-26 12:25:00', '2026-08-26 12:35:00'),
(15, 1, 3, NULL, 24, 4, NULL, 'ORD-20260826-0015', 'TAKE_AWAY', 25000.00, 0.00, 0.00, 25000.00, 2, 'COMPLETED', 'PAID', '2026-08-26 12:30:00', '2026-08-26 12:33:00'),
(16, 1, 1, 1, 25, 4, NULL, 'ORD-20260826-0016', 'DINE_IN', 35000.00, 0.00, 0.00, 35000.00, 3, 'PREPARING', 'PAID', '2026-08-26 12:45:00', NULL),
(17, 1, 1, 2, 26, 4, NULL, 'ORD-20260826-0017', 'DINE_IN', 35000.00, 0.00, 0.00, 35000.00, 3, 'CONFIRMED', 'PAID', '2026-08-26 12:48:00', NULL),
(18, 1, 2, 3, 27, 4, NULL, 'ORD-20260826-0018', 'DINE_IN', 35000.00, 0.00, 0.00, 35000.00, 3, 'CONFIRMED', 'PAID', '2026-08-26 12:50:00', NULL),
(19, 1, 3, NULL, 28, 4, NULL, 'ORD-20260826-0019', 'TAKE_AWAY', 18000.00, 0.00, 0.00, 18000.00, 0, 'PENDING', 'UNPAID', '2026-08-26 12:52:00', NULL),
(20, 1, 1, NULL, 29, NULL, NULL, 'ORD-20260826-0020', 'PRE_ORDER', 40000.00, 0.00, 0.00, 40000.00, 0, 'CANCELLED', 'REFUNDED', '2026-08-26 08:00:00', NULL);

-- 33. Chi tiết món trong đơn hàng (Order Items & Toppings)
INSERT INTO order_items (id, order_id, food_id, food_variant_id, combo_id, item_name, quantity, unit_price, cost_price, total_price, item_status) VALUES
(1, 1, 1, NULL, NULL, 'Cơm Gà Xối Mỡ Giòn Da', 1, 35000.00, 18000.00, 35000.00, 'SERVED'),
(2, 2, 7, 5, NULL, 'Phở Bò Tái Hà Nội', 1, 35000.00, 17000.00, 35000.00, 'SERVED'),
(3, 3, 13, 1, NULL, 'Trà Đào Cam Sả Size M', 1, 25000.00, 9000.00, 25000.00, 'SERVED'),
(4, 4, 1, NULL, NULL, 'Cơm Gà Xối Mỡ Giòn Da', 2, 35000.00, 18000.00, 70000.00, 'SERVED'),
(5, 5, 2, 7, NULL, 'Cơm Sườn Nướng Mật Ong', 1, 35000.00, 17500.00, 35000.00, 'SERVED'),
(6, 6, 3, NULL, NULL, 'Cơm Tấm Sườn Bì Chả', 1, 40000.00, 20000.00, 40000.00, 'SERVED'),
(7, 7, 9, NULL, NULL, 'Bún Bò Huế Đặc Biệt', 1, 40000.00, 21000.00, 40000.00, 'SERVED'),
(8, 8, 14, NULL, NULL, 'Trà Tắc Mật Ong', 1, 15000.00, 4500.00, 15000.00, 'SERVED'),
(9, 9, 1, NULL, NULL, 'Cơm Gà Xối Mỡ Giòn Da', 1, 35000.00, 18000.00, 35000.00, 'SERVED'),
(10, 10, 5, NULL, NULL, 'Cơm Thịt Kho Trứng Cút', 1, 30000.00, 14000.00, 30000.00, 'SERVED'),
(11, 11, 2, 7, NULL, 'Cơm Sườn Nướng Mật Ong', 1, 35000.00, 17500.00, 35000.00, 'SERVED'),
(12, 12, 7, 5, NULL, 'Phở Bò Tái Hà Nội', 1, 35000.00, 17000.00, 35000.00, 'SERVED'),
(13, 13, 1, NULL, NULL, 'Cơm Gà Xối Mỡ Giòn Da', 1, 35000.00, 18000.00, 35000.00, 'SERVED'),
(14, 14, NULL, NULL, 2, 'Combo Cơm Trưa Sinh Viên A1', 1, 44000.00, 22500.00, 44000.00, 'SERVED'),
(15, 15, 15, 3, NULL, 'Trà Sữa Trân Châu Size M', 1, 25000.00, 10000.00, 25000.00, 'SERVED'),
(16, 16, 1, NULL, NULL, 'Cơm Gà Xối Mỡ Giòn Da', 1, 35000.00, 18000.00, 35000.00, 'COOKING'),
(17, 17, 2, 7, NULL, 'Cơm Sườn Nướng Mật Ong', 1, 35000.00, 17500.00, 35000.00, 'PENDING'),
(18, 18, 7, 5, NULL, 'Phở Bò Tái Hà Nội', 1, 35000.00, 17000.00, 35000.00, 'PENDING'),
(19, 19, 17, NULL, NULL, 'Cà Phê Sữa Đá', 1, 18000.00, 5500.00, 18000.00, 'PENDING'),
(20, 20, 3, NULL, NULL, 'Cơm Tấm Sườn Bì Chả', 1, 40000.00, 20000.00, 40000.00, 'CANCELLED');

-- Topping trong đơn hàng 1
INSERT INTO order_item_toppings (id, order_item_id, topping_id, topping_name, quantity, unit_price, cost_price, total_price) VALUES
(1, 1, 1, 'Trứng Ốp La Lòng Đào', 1, 6000.00, 3000.00, 6000.00);

-- Lịch sử trạng thái đơn hàng
INSERT INTO order_status_history (id, order_id, from_status, to_status, changed_by_user_id, notes) VALUES
(1, 1, 'PENDING', 'CONFIRMED', 4, 'Thu ngân nhận đơn'),
(2, 1, 'CONFIRMED', 'PREPARING', 5, 'Bếp bắt đầu chế biến'),
(3, 1, 'PREPARING', 'READY', 5, 'Bếp ra món'),
(4, 1, 'READY', 'COMPLETED', 4, 'Khách nhận món tại bàn');

-- 34. Thanh toán (Payments)
INSERT INTO payments (id, order_id, canteen_id, user_id, payment_code, payment_method, amount, status, paid_at) VALUES
(1, 1, 1, 10, 'PAY-20260826-0001', 'QR_CODE', 32800.00, 'SUCCESS', '2026-08-26 07:15:30'),
(2, 2, 1, 11, 'PAY-20260826-0002', 'CASH', 35000.00, 'SUCCESS', '2026-08-26 07:20:15'),
(3, 3, 1, 12, 'PAY-20260826-0003', 'STUDENT_WALLET', 25000.00, 'SUCCESS', '2026-08-26 07:35:10'),
(4, 4, 1, 13, 'PAY-20260826-0004', 'VNPAY', 70000.00, 'SUCCESS', '2026-08-26 11:30:25'),
(5, 5, 1, 14, 'PAY-20260826-0005', 'CASH', 35000.00, 'SUCCESS', '2026-08-26 11:35:12'),
(6, 6, 1, 15, 'PAY-20260826-0006', 'QR_CODE', 40000.00, 'SUCCESS', '2026-08-26 11:40:40'),
(7, 7, 1, 16, 'PAY-20260826-0007', 'MOMO', 40000.00, 'SUCCESS', '2026-08-26 11:45:30'),
(8, 8, 1, 17, 'PAY-20260826-0008', 'CASH', 15000.00, 'SUCCESS', '2026-08-26 11:50:10'),
(9, 9, 1, 18, 'PAY-20260826-0009', 'STUDENT_WALLET', 35000.00, 'SUCCESS', '2026-08-26 12:00:15'),
(10, 10, 1, 19, 'PAY-20260826-0010', 'CASH', 30000.00, 'SUCCESS', '2026-08-26 12:05:22');

-- 35. Tài chính, Quỹ & Chi phí (Finance, Accounts, Expenses, Revenues)
INSERT INTO financial_accounts (id, canteen_id, account_code, account_name, account_type, current_balance) VALUES
(1, 1, 'ACC-CASH-A1', 'Két Tiền Mặt Quầy Thu Ngân A1', 'CASH_DRAWER', 8500000.00),
(2, 1, 'ACC-BANK-VCB', 'Tài Khoản Ngân Hàng Vietcombank Căng Tin A1', 'BANK_ACCOUNT', 45000000.00),
(3, 3, 'ACC-CASH-DA', 'Két Tiền Mặt Căng Tin Dĩ An', 'CASH_DRAWER', 12000000.00);

INSERT INTO expense_categories (id, canteen_id, code, name, description) VALUES
(1, NULL, 'EXP-INGREDIENTS', 'Chi phí nhập nguyên vật liệu', 'Thịt, rau củ, gia vị'),
(2, NULL, 'EXP-SALARY', 'Chi phí lương nhân sự', 'Lương nhân viên tháng'),
(3, NULL, 'EXP-UTILITIES', 'Điện, Nước & Tiện ích', 'Hóa đơn EVN & Sawaco'),
(4, NULL, 'EXP-MAINTENANCE', 'Bảo trì & Sửa chữa thiết bị', 'Bảo trì tủ đông, bếp gas');

INSERT INTO expenses (id, canteen_id, account_id, category_id, created_by_user_id, approved_by_user_id, expense_code, expense_date, amount, recipient_name, description, status) VALUES
(1, 1, 2, 1, 6, 2, 'EXP-20260825-01', '2026-08-25', 12500000.00, 'CP Food Việt Nam', 'Thanh toán tiền thịt gà và sườn tuần 3 tháng 8', 'PAID'),
(2, 1, 2, 3, 7, 2, 'EXP-20260820-01', '2026-08-20', 4800000.00, 'Điện Lực Tân Bình', 'Hóa đơn tiền điện tháng 7 căng tin A1', 'PAID');

INSERT INTO revenues (id, canteen_id, account_id, order_id, payment_id, revenue_code, revenue_date, amount, revenue_type, description) VALUES
(1, 1, 2, 1, 1, 'REV-20260826-001', '2026-08-26', 32800.00, 'SALES_ORDER', 'Doanh thu đơn hàng ORD-20260826-0001'),
(2, 1, 1, 2, 2, 'REV-20260826-002', '2026-08-26', 35000.00, 'SALES_ORDER', 'Doanh thu đơn hàng ORD-20260826-0002');

-- 36. Ca làm & Chấm công (Shifts & Attendances)
INSERT INTO shifts (id, canteen_id, code, name, start_time, end_time, break_duration_minutes) VALUES
(1, 1, 'SHIFT-MORNING', 'Ca Sáng (Chuẩn bị & Bán sáng - trưa)', '06:00:00', '14:00:00', 45),
(2, 1, 'SHIFT-AFTERNOON', 'Ca Chiều (Bán chiều - tối & Dọn dẹp)', '13:30:00', '20:30:00', 45);

INSERT INTO attendances (id, employee_id, shift_id, canteen_id, work_date, check_in_time, check_out_time, late_minutes, status) VALUES
(1, 3, 1, 1, '2026-08-26', '2026-08-26 05:55:00', '2026-08-26 14:05:00', 0, 'PRESENT'),
(2, 4, 1, 1, '2026-08-26', '2026-08-26 05:50:00', '2026-08-26 14:10:00', 0, 'PRESENT'),
(3, 5, 1, 1, '2026-08-26', '2026-08-26 06:10:00', '2026-08-26 14:00:00', 10, 'LATE');

-- 37. Đánh giá món ăn (Reviews)
INSERT INTO reviews (id, order_id, food_id, user_id, canteen_id, rating, comment, is_approved) VALUES
(1, 1, 1, 10, 1, 5, 'Gà giòn rụm, cơm thơm ngon, phục vụ nhanh!', TRUE),
(2, 2, 7, 11, 1, 5, 'Phở bò nước dùng rất thanh và đậm đà.', TRUE),
(3, 3, 13, 12, 1, 4, 'Trà đào thơm ngon nhưng hơi nhiều đá một chút.', TRUE);

-- 38. Cấu hình hệ thống (System Settings)
INSERT INTO system_settings (id, canteen_id, setting_key, setting_value, data_type, description, is_public) VALUES
(1, NULL, 'SYSTEM_NAME', 'Hệ Thống Quản Lý Căng Tin Thông Minh Bách Khoa', 'STRING', 'Tên hệ thống hiển thị', TRUE),
(2, NULL, 'DEFAULT_VAT_PERCENT', '8', 'NUMBER', 'Tỷ lệ thuế VAT mặc định', FALSE),
(3, NULL, 'ORDER_TIMEOUT_MINUTES', '15', 'NUMBER', 'Thời gian tự hủy đơn nếu không thanh toán', TRUE),
(4, NULL, 'POINTS_CONVERSION_RATE', '10000', 'NUMBER', 'Số tiền chi tiêu để tích 1 điểm (10k = 1đ)', TRUE);

-- ==============================================================================
-- KẾT THÚC TOÀN BỘ FILE SCRIPT DATABASE CANTEEN_MANAGEMENT.SQL
-- ==============================================================================
