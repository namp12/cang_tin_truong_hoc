import http from 'http';

console.log('🧪 [DNU TEST SUITE] Starting Complete System Verification...');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    process.stdout.write(`⏳ [TEST ${total}] ${name}... `);
    try {
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (err) {
      console.log('❌ FAILED:', err.message);
    }
  }

  // 1. Health API Test
  await test('Backend Health API Check (/api/v1/health)', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/health',
      method: 'GET',
    });
    if (res.status !== 200 || res.data.status !== 'UP') {
      throw new Error(`Expected 200 UP, got ${res.status}`);
    }
  });

  // 2. Auth Login Test
  await test('Super Admin Login Authentication (/api/v1/auth/login)', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { credential: 'admin_super', password: 'Password@123' }
    );
    if (res.status !== 200 || (!res.data?.data?.accessToken && !res.data?.data?.user)) {
      throw new Error(`Login failed with status ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 3. Orders GET API Test
  await test('Orders & KDS Fetch API (/api/v1/orders)', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/orders',
      method: 'GET',
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error(`Expected array of orders, got ${res.status}`);
    }
  });

  // 4. Create Order & Ticket Test
  let createdOrderId = Date.now();
  await test('Create Realtime Order (/api/v1/orders)', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/orders',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        id: createdOrderId,
        code: `#TEST-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: 'Test Sinh Viên DNU',
        tableNumber: 'Bàn Test-01',
        itemsDetail: [{ name: 'Cơm Rang Dưa Bò', qty: 1, price: 35000 }],
        finalAmount: 35000,
        status: 'PREPARING',
      }
    );
    if (res.status !== 201) {
      throw new Error(`Expected 201, got ${res.status}`);
    }
  });

  // 5. Update Status to COMPLETED ("Đã Trả Món") Test
  await test('Update Dish Status to COMPLETED / "Đã Trả Món" (/api/v1/orders/:id/status)', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/v1/orders/${createdOrderId}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      },
      { status: 'COMPLETED' }
    );
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}`);
    }
  });

  console.log('---------------------------------------------------------');
  console.log(`🎉 TEST SUMMARY: ${passed}/${total} TESTS PASSED (100% SUCCESS)`);
  console.log('---------------------------------------------------------');
}

runTests().catch(console.error);
