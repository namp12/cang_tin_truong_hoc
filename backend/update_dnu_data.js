const mysql = require('mysql2/promise');

async function updateDnuData() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'phuongnam@3333',
    database: 'canteen_management',
    multipleStatements: true,
  });

  console.log('✅ Connected to MySQL database canteen_management. Starting DNU migration...');

  const sql = `
    -- 1. Cập nhật trường học (Trường Đại Học Đại Nam)
    UPDATE schools SET 
      code = 'UNI-DNU',
      name = 'Trường Đại Học Đại Nam',
      short_name = 'DNU',
      tax_code = '0102434567',
      phone = '02435577799',
      email = 'canteen@dainam.edu.vn',
      website = 'https://dainam.edu.vn',
      address = 'Số 1 Phố Xốm, Phú Lãm, Hà Đông, Hà Nội'
    WHERE id = 1;

    -- 2. Cập nhật cơ sở DNU
    UPDATE campuses SET 
      code = 'CAMPUS-HADONG',
      name = 'Cơ sở Chính Hà Đông (Số 1 Phố Xốm)',
      phone = '02435577799',
      email = 'hadong@dainam.edu.vn',
      address = 'Số 1 Phố Xốm, Phú Lãm, Hà Đông, Hà Nội'
    WHERE id = 1;

    UPDATE campuses SET 
      code = 'CAMPUS-MYDINH',
      name = 'Cơ sở Mỹ Đình / Thanh Xuân',
      phone = '02435577798',
      email = 'mydinh@dainam.edu.vn',
      address = 'Khu Đô Thị Mỹ Đình, Nam Từ Liêm, Hà Nội'
    WHERE id = 2;

    -- 3. Cập nhật khoa DNU
    UPDATE faculties SET code = 'F-IT', name = 'Khoa Công Nghệ Thông Tin DNU' WHERE id = 1;
    UPDATE faculties SET code = 'F-PHARM', name = 'Khoa Dược DNU' WHERE id = 2;
    UPDATE faculties SET code = 'F-MED', name = 'Khoa Y Khoa DNU' WHERE id = 3;
    UPDATE faculties SET code = 'F-BA', name = 'Khoa Quản Trị Kinh Doanh DNU' WHERE id = 4;

    -- 4. Cập nhật lớp học DNU
    UPDATE classes SET code = 'IT-K16', name = 'Công Nghệ Thông Tin K16 - Lớp 01', academic_year = '2022-2026' WHERE id = 1;
    UPDATE classes SET code = 'IT-K17', name = 'Công Nghệ Thông Tin K17 - Lớp 02', academic_year = '2023-2027' WHERE id = 2;
    UPDATE classes SET code = 'DUOC-K16', name = 'Dược Học K16', academic_year = '2022-2027' WHERE id = 3;
    UPDATE classes SET code = 'MED-K17', name = 'Y Khoa K17', academic_year = '2023-2029' WHERE id = 4;
    UPDATE classes SET code = 'QTKD-K18', name = 'Quản Trị Kinh Doanh K18', academic_year = '2024-2028' WHERE id = 5;

    -- 5. Cập nhật Căng tin DNU
    UPDATE canteens SET 
      code = 'CT-DNU-G',
      name = 'Căng tin Trung Tâm (Tòa nhà G - Hà Đông)',
      phone = '02435577701',
      location_description = 'Tầng 1 Tòa Nhà Trung Tâm G, Cơ sở Chính Phú Lãm'
    WHERE id = 1;

    UPDATE canteens SET 
      code = 'CT-DNU-AB',
      name = 'Căng tin Khu Giảng Đường & KTX (Tòa A-B DNU)',
      phone = '02435577702',
      location_description = 'Tầng Trệt Tòa Nhà A-B Giảng Đường'
    WHERE id = 2;

    UPDATE canteens SET 
      code = 'CT-DNU-GARDEN',
      name = 'Căng tin DNU Garden & Coffee (Khu Thể Thao)',
      phone = '02435577703',
      location_description = 'Khu Phức Hợp Sân Bóng & Thể Thao DNU'
    WHERE id = 3;

    -- 6. Cập nhật Quầy phục vụ DNU
    UPDATE counters SET code = 'CTR-G-RICE', name = 'Quầy Cơm Sinh Viên DNU (Tòa G)' WHERE id = 1;
    UPDATE counters SET code = 'CTR-G-NOODLE', name = 'Quầy Bún Phở Hà Nội (Tòa G)' WHERE id = 2;
    UPDATE counters SET code = 'CTR-G-DRINK', name = 'Quầy Trà Sữa & Cà Phê DNU' WHERE id = 3;
    UPDATE counters SET code = 'CTR-AB-FAST', name = 'Quầy Bánh Mì & Ăn Vặt Tòa AB' WHERE id = 4;
    UPDATE counters SET code = 'CTR-GARDEN-ALL', name = 'Quầy DNU Garden & Coffee' WHERE id = 5;

    -- 7. Cập nhật Dining Areas & Dining Tables
    UPDATE dining_areas SET name = 'Sảnh Chính Tòa Nhà G (Máy Lạnh)' WHERE id = 1;
    UPDATE dining_areas SET name = 'Khu Sân Vườn DNU Garden' WHERE id = 2;
    UPDATE dining_areas SET name = 'Đại Sảnh Sinh Viên Tòa A-B' WHERE id = 3;

    UPDATE dining_tables SET table_number = 'G1-01' WHERE id = 1;
    UPDATE dining_tables SET table_number = 'G1-02' WHERE id = 2;
    UPDATE dining_tables SET table_number = 'G1-03' WHERE id = 3;
    UPDATE dining_tables SET table_number = 'G1-04' WHERE id = 4;
    UPDATE dining_tables SET table_number = 'GD-01' WHERE id = 5;
    UPDATE dining_tables SET table_number = 'AB-01' WHERE id = 6;

    -- 8. Cập nhật Users & Emails DNU
    UPDATE users SET email = 'admin@dainam.edu.vn' WHERE id = 1;
    UPDATE users SET email = 'manager_toag@dainam.edu.vn' WHERE id = 2;
    UPDATE users SET email = 'manager_toab@dainam.edu.vn' WHERE id = 3;
    UPDATE users SET email = 'cashier1@dainam.edu.vn' WHERE id = 4;
    UPDATE users SET email = 'chef1@dainam.edu.vn' WHERE id = 5;
    UPDATE users SET email = 'warehouse1@dainam.edu.vn' WHERE id = 6;
    UPDATE users SET email = 'accountant1@dainam.edu.vn' WHERE id = 7;
    UPDATE users SET email = 'minh.gv@dainam.edu.vn' WHERE id = 8;
    UPDATE users SET email = 'lan.gv@dainam.edu.vn' WHERE id = 9;
    UPDATE users SET email = 'nam.nguyen16@dainam.edu.vn' WHERE id = 10;
    UPDATE users SET email = 'hoa.le16@dainam.edu.vn' WHERE id = 11;
    UPDATE users SET email = 'dat.tran17@dainam.edu.vn' WHERE id = 12;
    UPDATE users SET email = 'mai.pham17@dainam.edu.vn' WHERE id = 13;
    UPDATE users SET email = 'tuan.vu18@dainam.edu.vn' WHERE id = 14;

    -- 9. Mở rộng danh mục món ăn (Categories)
    UPDATE categories SET name = 'Cơm Phần & Cơm Đĩa DNU' WHERE id = 1;
    UPDATE categories SET name = 'Bún - Phở - Mì Hà Nội' WHERE id = 2;
    UPDATE categories SET name = 'Bánh Mì & Đồ Ăn Vặt' WHERE id = 3;
    UPDATE categories SET name = 'Đồ Uống & Trà Sữa DNU' WHERE id = 4;
    UPDATE categories SET name = 'Tráng Miệng & Chè' WHERE id = 5;
    UPDATE categories SET name = 'Combo Tiết Kiệm Sinh Viên DNU' WHERE id = 10;

    -- 10. Chèn và cập nhật Thực đơn 40+ Món ăn Đại học Đại Nam
    INSERT INTO foods (id, canteen_id, counter_id, category_id, code, name, description, base_price, cost_price, is_featured, is_best_seller, is_available) VALUES
    (31, 1, 1, 1, 'FOOD-COM-RANG-DUA-BO', 'Cơm Rang Dưa Bò Hà Nội', 'Cơm chiên giòn hạt xào thịt bò mềm và dưa cải chua giòn đậm đà', 35000.00, 18000.00, TRUE, TRUE, TRUE),
    (32, 1, 2, 2, 'FOOD-BUN-CHA-HA-NOI', 'Bún Chả Hà Nội Nướng Than Hoa', 'Chả miếng và chả băm nướng thơm lừng kèm bún tươi, rau sống và nước chấm đu đủ', 35000.00, 17500.00, TRUE, TRUE, TRUE),
    (33, 1, 2, 2, 'FOOD-PHO-BO-TAI-LAN', 'Phở Bò Tái Lăn DNU', 'Bò tái lăn xào tỏi thơm phức, nước dùng ninh xương đậm đà chuẩn vị Hà Nội', 40000.00, 20000.00, TRUE, TRUE, TRUE),
    (34, 1, 2, 2, 'FOOD-PHO-GA-TA-LA-CHANH', 'Phở Gà Ta Lá Chanh', 'Thịt gà ta da giòn thịt ngọt, lá chanh thái chỉ thơm nức mũi', 35000.00, 17000.00, TRUE, FALSE, TRUE),
    (35, 1, 2, 2, 'FOOD-BUN-DAU-MAM-TOM', 'Bún Đậu Mắm Tôm Thập Cẩm', 'Bún lá, đậu mơ chiên giòn, chả cốm, nem rán, thịt chân giò luộc chấm mắm tôm', 40000.00, 19000.00, TRUE, TRUE, TRUE),
    (36, 1, 3, 4, 'FOOD-CAFE-COT-DUA', 'Cà Phê Cốt Dừa Hà Nội', 'Cà phê phin kết hợp cốt dừa béo ngậy xay tuyết mát lạnh', 25000.00, 10000.00, TRUE, TRUE, TRUE),
    (37, 1, 3, 4, 'FOOD-CAFE-MUOI', 'Cà Phê Muối Béo Ngậy', 'Lớp kem muối béo mặn kết hợp cà phê Robusta đậm đà', 22000.00, 8500.00, TRUE, TRUE, TRUE),
    (38, 1, 3, 4, 'FOOD-TRA-CHANH-GIA-TAY', 'Trà Chanh Giã Tay DNU', 'Chanh Quảng Đông thơm nồng kết hợp trà nhài thanh mát', 18000.00, 6000.00, TRUE, TRUE, TRUE),
    (39, 2, 4, 3, 'FOOD-BANH-MI-CHAO-DNU', 'Bánh Mì Chảo Đặc Biệt DNU', 'Pate cột đèn, trứng ốp la lòng đào, xúc xích Đức, sốt cà chua sánh mịn', 30000.00, 14000.00, TRUE, TRUE, TRUE),
    (40, 2, 4, 3, 'FOOD-NEM-CHUA-RAN', 'Nem Chua Rán Phố Cổ (5 chiếc)', 'Nem chua tẩm bột chiên xù giòn rụm chấm tương ớt', 25000.00, 11000.00, TRUE, TRUE, TRUE)
    ON DUPLICATE KEY UPDATE 
      name = VALUES(name),
      description = VALUES(description),
      base_price = VALUES(base_price),
      cost_price = VALUES(cost_price),
      is_featured = VALUES(is_featured),
      is_best_seller = VALUES(is_best_seller);
  `;

  await conn.query(sql);
  console.log('🎉 Successfully migrated MySQL Database to Dai Nam University (DNU) with 40+ foods!');
  await conn.end();
}

updateDnuData().catch(console.error);
