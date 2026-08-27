import { pool } from './database.js';

export async function initDatabaseSchema() {
  try {
    const connection = await pool.getConnection();

    // 1. Table: users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(150),
        phone VARCHAR(20),
        role ENUM('SUPER_ADMIN', 'ADMIN', 'CASHIER', 'KITCHEN_STAFF', 'WAREHOUSE_STAFF', 'STUDENT') DEFAULT 'STUDENT',
        avatar_url VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Table: categories
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        icon VARCHAR(20),
        status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Table: foods
    await connection.query(`
      CREATE TABLE IF NOT EXISTS foods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT,
        name VARCHAR(150) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        cost_price DECIMAL(12,2) DEFAULT 0,
        image_url VARCHAR(255),
        description TEXT,
        is_best BOOLEAN DEFAULT FALSE,
        sold_count INT DEFAULT 0,
        status ENUM('ACTIVE', 'INACTIVE', 'SOLD_OUT') DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX (category_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Table: orders
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        customer_name VARCHAR(150),
        canteen_name VARCHAR(150) DEFAULT 'Căng tin Tòa G (Hà Đông)',
        table_number VARCHAR(100),
        pickup_time VARCHAR(100),
        items_summary TEXT,
        subtotal DECIMAL(12,2) DEFAULT 0,
        discount DECIMAL(12,2) DEFAULT 0,
        final_amount DECIMAL(12,2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'Tiền mặt',
        payment_status ENUM('PAID', 'UNPAID', 'REFUNDED') DEFAULT 'PAID',
        status ENUM('PENDING', 'WAITING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED') DEFAULT 'PREPARING',
        ordered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        INDEX (ordered_at),
        INDEX (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Table: order_items
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id BIGINT,
        food_name VARCHAR(150) NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(12,2) NOT NULL,
        note VARCHAR(255),
        INDEX (order_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Table: stocks (Kho & Nguyên liệu)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(100),
        quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
        reserved DECIMAL(10,2) NOT NULL DEFAULT 0,
        available DECIMAL(10,2) NOT NULL DEFAULT 0,
        unit VARCHAR(20) NOT NULL DEFAULT 'kg',
        min_stock DECIMAL(10,2) NOT NULL DEFAULT 10,
        unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
        supplier_name VARCHAR(150),
        expiry_date DATE,
        status ENUM('NORMAL', 'LOW_STOCK', 'OUT_OF_STOCK') DEFAULT 'NORMAL',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Table: kitchen_requisitions (Phiếu Yêu Cầu Cấp Nguyên Liệu Cho Bếp)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kitchen_requisitions (
        id BIGINT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        chef_name VARCHAR(150) NOT NULL,
        ingredient_name VARCHAR(150) NOT NULL,
        qty DECIMAL(10,2) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        urgency ENUM('NORMAL', 'HIGH', 'URGENT') DEFAULT 'NORMAL',
        reason TEXT,
        status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
        canteen_name VARCHAR(150) DEFAULT 'Căng tin Tòa G',
        requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        INDEX (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. Table: inbound_receipts (Phiếu Nhập Kho)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS inbound_receipts (
        id BIGINT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        supplier_name VARCHAR(150) NOT NULL,
        receiver VARCHAR(150),
        total_amount DECIMAL(14,2) DEFAULT 0,
        received_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        items_json JSON,
        status ENUM('COMPLETED', 'PENDING', 'CANCELLED') DEFAULT 'COMPLETED'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 9. Table: outbound_issues (Phiếu Xuất Kho)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS outbound_issues (
        id BIGINT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        reason TEXT,
        issuer VARCHAR(150),
        issued_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        items_json JSON
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 10. Table: finance_transactions (Sổ Quỹ Thu Chi)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS finance_transactions (
        id BIGINT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        type ENUM('INCOME', 'EXPENSE') NOT NULL,
        category VARCHAR(50) NOT NULL,
        category_label VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(14,2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'CASH',
        payment_method_label VARCHAR(100),
        counterpart VARCHAR(150),
        performed_by VARCHAR(150),
        canteen_name VARCHAR(150) DEFAULT 'Căng tin Tòa G',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX (type),
        INDEX (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 11. Table: vouchers
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255),
        discount_type ENUM('PERCENT', 'FIXED') DEFAULT 'PERCENT',
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_value DECIMAL(12,2) DEFAULT 0,
        max_discount DECIMAL(12,2) DEFAULT 0,
        target_role VARCHAR(50) DEFAULT 'ALL',
        usage_count INT DEFAULT 0,
        usage_limit INT DEFAULT 1000,
        status ENUM('ACTIVE', 'INACTIVE', 'EXPIRED') DEFAULT 'ACTIVE',
        start_date DATE,
        end_date DATE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 12. Table: dish_reviews
    await connection.query(`
      CREATE TABLE IF NOT EXISTS dish_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(150) NOT NULL,
        student_class VARCHAR(100),
        food_name VARCHAR(150) NOT NULL,
        rating INT NOT NULL DEFAULT 5,
        comment TEXT,
        likes INT DEFAULT 0,
        admin_reply_name VARCHAR(150) DEFAULT 'Căng tin Đại Nam',
        admin_reply_content TEXT,
        admin_replied_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    connection.release();
    console.log('✅ Synchronized MySQL Database Schema (All 12 Core Canteen Tables Ready)');
  } catch (error: any) {
    console.warn('⚠️ Note on Database Sync:', error.message);
  }
}
