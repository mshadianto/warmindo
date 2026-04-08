-- ============================================================
-- WARMINDO DATABASE SCHEMA
-- Supabase: https://tyvuqugmkajdltqaudaw.supabase.co
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. BRANCHES (Cabang)
-- ============================================================
CREATE TABLE branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  phone TEXT,
  is_hq BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO branches (id, name, address, city, phone, is_hq) VALUES
  ('hq',  'Warmindo Pusat',    'Jl. Ir. H. Juanda No.45',   'Ciputat, Tangerang Selatan', '0812-1234-5678', TRUE),
  ('br1', 'Cabang Pamulang',   'Jl. Raya Pamulang No.12',   'Tangerang Selatan',          '0812-2345-6789', FALSE),
  ('br2', 'Cabang Depok',      'Jl. Margonda Raya No.100',  'Depok',                      '0812-3456-7890', FALSE);

-- ============================================================
-- 2. CATEGORIES (Kategori Produk)
-- ============================================================
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  sort_order INT DEFAULT 0
);

INSERT INTO categories (id, name, icon, sort_order) VALUES
  ('indomie',  'Indomie',   '🍜', 1),
  ('nasi',     'Nasi',      '🍚', 2),
  ('gorengan', 'Gorengan',  '🍗', 3),
  ('minuman',  'Minuman',   '🥤', 4),
  ('snack',    'Snack',     '🍿', 5),
  ('extra',    'Topping',   '🥚', 6);

-- ============================================================
-- 3. PRODUCTS (Produk/Menu)
-- ============================================================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INT NOT NULL DEFAULT 0,
  category_id TEXT REFERENCES categories(id),
  stock INT DEFAULT 0,
  image TEXT,
  description TEXT,
  sku TEXT,
  unit TEXT DEFAULT 'pcs',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO products (name, price, category_id, stock, image) VALUES
  ('Indomie Goreng',         8000,  'indomie',  50, '🍜'),
  ('Indomie Rebus',          8000,  'indomie',  50, '🍜'),
  ('Indomie Goreng Telur',   10000, 'indomie',  40, '🍳'),
  ('Indomie Rebus Telur',    10000, 'indomie',  40, '🍳'),
  ('Indomie Goreng Double',  13000, 'indomie',  30, '🍜'),
  ('Indomie Rebus Double',   13000, 'indomie',  30, '🍜'),
  ('Indomie Geprek',         12000, 'indomie',  25, '🌶️'),
  ('Nasi Goreng',            12000, 'nasi',     30, '🍚'),
  ('Nasi Goreng Telur',      14000, 'nasi',     30, '🍳'),
  ('Nasi Goreng Ayam',       16000, 'nasi',     20, '🍗'),
  ('Nasi Uduk',              10000, 'nasi',     25, '🍚'),
  ('Nasi Telur',             8000,  'nasi',     35, '🍳'),
  ('Kentang Goreng',         8000,  'gorengan', 30, '🍟'),
  ('Pisang Goreng',          5000,  'gorengan', 40, '🍌'),
  ('Tahu Goreng',            5000,  'gorengan', 40, '🫘'),
  ('Tempe Goreng',           5000,  'gorengan', 40, '🫘'),
  ('Bakwan',                 3000,  'gorengan', 50, '🥟'),
  ('Es Teh Manis',           5000,  'minuman',  99, '🧊'),
  ('Es Jeruk',               6000,  'minuman',  99, '🍊'),
  ('Teh Hangat',             4000,  'minuman',  99, '☕'),
  ('Kopi Hitam',             5000,  'minuman',  99, '☕'),
  ('Es Kopi Susu',           10000, 'minuman',  40, '☕'),
  ('Air Mineral',            3000,  'minuman',  99, '💧'),
  ('Kerupuk',                2000,  'snack',    99, '🥠'),
  ('Telur Ceplok',           4000,  'extra',    50, '🍳'),
  ('Telur Dadar',            4000,  'extra',    50, '🍳'),
  ('Sosis',                  5000,  'extra',    30, '🌭'),
  ('Kornet',                 5000,  'extra',    30, '🥫');

-- ============================================================
-- 4. EMPLOYEES (Karyawan)
-- ============================================================
CREATE TABLE employees (
  id TEXT PRIMARY KEY DEFAULT 'EMP-' || SUBSTRING(uuid_generate_v4()::TEXT, 1, 8),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  branch_id TEXT REFERENCES branches(id),
  salary INT DEFAULT 0,
  photo TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','cuti','resign')),
  join_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO employees (id, name, role, phone, branch_id, salary, photo, status, join_date) VALUES
  ('EMP-001', 'Andi Saputra',   'Kasir',        '0812-1111-0001', 'hq',  2200000, '👨', 'active', '2025-06-01'),
  ('EMP-002', 'Budi Hartono',   'Koki',         '0812-1111-0002', 'hq',  2500000, '👨‍🍳', 'active', '2025-06-01'),
  ('EMP-003', 'Citra Dewi',     'Pelayan',      '0812-1111-0003', 'hq',  2000000, '👩', 'active', '2025-07-15'),
  ('EMP-004', 'Dimas Prakoso',  'Head Kitchen',  '0812-1111-0004', 'hq',  2800000, '👨‍🍳', 'active', '2025-05-01'),
  ('EMP-005', 'Eka Putri',      'Barista',      '0812-1111-0005', 'br1', 2200000, '👩', 'active', '2025-08-01'),
  ('EMP-006', 'Fajar Rahman',   'Kasir',        '0812-1111-0006', 'br1', 2200000, '👨', 'active', '2025-08-01'),
  ('EMP-007', 'Gita Nuraini',   'Pelayan',      '0812-1111-0007', 'br2', 2000000, '👩', 'active', '2025-09-01'),
  ('EMP-008', 'Hendra Wijaya',  'Koki',         '0812-1111-0008', 'br2', 2500000, '👨‍🍳', 'active', '2025-09-01'),
  ('EMP-009', 'Indra Kusuma',   'Waiter',       '0812-1111-0009', 'br2', 2000000, '👨', 'active', '2025-10-01');

-- ============================================================
-- 5. TABLES (Meja)
-- ============================================================
CREATE TABLE tables (
  id TEXT PRIMARY KEY,
  num INT NOT NULL,
  name TEXT NOT NULL,
  capacity INT NOT NULL DEFAULT 4,
  status TEXT DEFAULT 'empty' CHECK (status IN ('empty','occupied','ordering','served','paying','cleaning')),
  qr_code TEXT,
  current_bill INT DEFAULT 0,
  customer_id TEXT,
  start_time TIMESTAMPTZ,
  branch_id TEXT REFERENCES branches(id) DEFAULT 'hq'
);

-- 12 tables: 4x cap 2, 4x cap 4, 4x cap 6
INSERT INTO tables (id, num, name, capacity, branch_id) VALUES
  ('T1',  1,  'Meja 1',  2, 'hq'),
  ('T2',  2,  'Meja 2',  2, 'hq'),
  ('T3',  3,  'Meja 3',  2, 'hq'),
  ('T4',  4,  'Meja 4',  2, 'hq'),
  ('T5',  5,  'Meja 5',  4, 'hq'),
  ('T6',  6,  'Meja 6',  4, 'hq'),
  ('T7',  7,  'Meja 7',  4, 'hq'),
  ('T8',  8,  'Meja 8',  4, 'hq'),
  ('T9',  9,  'Meja 9',  6, 'hq'),
  ('T10', 10, 'Meja 10', 6, 'hq'),
  ('T11', 11, 'Meja 11', 6, 'hq'),
  ('T12', 12, 'Meja 12', 6, 'hq');

-- ============================================================
-- 6. CUSTOMERS (Pelanggan/CRM)
-- ============================================================
CREATE TABLE customers (
  id TEXT PRIMARY KEY DEFAULT 'CUST-' || SUBSTRING(uuid_generate_v4()::TEXT, 1, 8),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  visits INT DEFAULT 0,
  total_spent INT DEFAULT 0,
  last_visit TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  tier TEXT GENERATED ALWAYS AS (
    CASE
      WHEN total_spent >= 1000000 THEN 'Platinum'
      WHEN total_spent >= 500000  THEN 'Gold'
      WHEN total_spent >= 200000  THEN 'Silver'
      ELSE 'Bronze'
    END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. PAYMENT METHODS (Metode Pembayaran)
-- ============================================================
CREATE TABLE payment_methods (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT,
  grp TEXT NOT NULL CHECK (grp IN ('cash','digital','ewallet','bank','platform')),
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0
);

INSERT INTO payment_methods (id, label, icon, grp, sort_order) VALUES
  ('tunai',       'Tunai',       '💵', 'cash',     1),
  ('qris',        'QRIS',        '📱', 'digital',  2),
  ('gopay',       'GoPay',       '💚', 'ewallet',  3),
  ('ovo',         'OVO',         '💜', 'ewallet',  4),
  ('dana',        'DANA',        '💙', 'ewallet',  5),
  ('shopeepay',   'ShopeePay',   '🧡', 'ewallet',  6),
  ('bca',         'BCA',         '🏦', 'bank',     7),
  ('bri',         'BRI',         '🏦', 'bank',     8),
  ('mandiri',     'Mandiri',     '🏦', 'bank',     9),
  ('bsi',         'BSI',         '🏦', 'bank',     10),
  ('gofood_pay',  'GoFood Pay',  '🟢', 'platform', 11),
  ('grab_pay',    'GrabFood Pay','🟠', 'platform', 12);

-- ============================================================
-- 8. ORDER TYPES (Tipe Pesanan)
-- ============================================================
CREATE TABLE order_types (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0
);

INSERT INTO order_types (id, label, icon, sort_order) VALUES
  ('dine_in',   'Dine In',    '🍽️', 1),
  ('take_away', 'Take Away',  '🥡', 2),
  ('gofood',    'GoFood',     '🟢', 3),
  ('grab',      'GrabFood',   '🟠', 4),
  ('shopee',    'ShopeeFood', '🟧', 5);

-- ============================================================
-- 9. ORDERS (Pesanan/Transaksi)
-- ============================================================
CREATE TABLE orders (
  id TEXT PRIMARY KEY DEFAULT 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(uuid_generate_v4()::TEXT, 1, 6),
  order_type TEXT REFERENCES order_types(id),
  payment_method TEXT REFERENCES payment_methods(id),
  subtotal INT DEFAULT 0,
  tax INT DEFAULT 0,
  discount INT DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','paid','cancelled')),
  notes TEXT,
  customer_id TEXT REFERENCES customers(id),
  customer_phone TEXT,
  cashier_id TEXT REFERENCES employees(id),
  branch_id TEXT REFERENCES branches(id) DEFAULT 'hq',
  table_id TEXT REFERENCES tables(id),
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. ORDER ITEMS (Item Pesanan)
-- ============================================================
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  price INT NOT NULL,
  subtotal INT GENERATED ALWAYS AS (qty * price) STORED,
  notes TEXT
);

-- ============================================================
-- 11. ATTENDANCE (Kehadiran)
-- ============================================================
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in TIME,
  clock_out TIME,
  status TEXT DEFAULT 'hadir' CHECK (status IN ('hadir','terlambat','izin','alpha')),
  note TEXT,
  UNIQUE(employee_id, date)
);

-- ============================================================
-- 12. EMPLOYEE PERFORMANCE (Performa Karyawan)
-- ============================================================
CREATE TABLE employee_performance (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(id),
  month TEXT NOT NULL, -- YYYY-MM
  orders_handled INT DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  complaints INT DEFAULT 0,
  punctuality INT DEFAULT 0, -- percentage 0-100
  speed INT DEFAULT 0,       -- percentage 0-100
  UNIQUE(employee_id, month)
);

-- ============================================================
-- 13. KASBON (Pinjaman Karyawan)
-- ============================================================
CREATE TABLE kasbon (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(id),
  amount INT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','paid','partial')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- ============================================================
-- 14. INVENTORY (Inventaris/Aset)
-- ============================================================
CREATE TABLE inventory_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT
);

INSERT INTO inventory_categories (id, name, icon) VALUES
  ('makan',      'Peralatan Makan',   '🍽️'),
  ('masak',      'Peralatan Masak',   '🍳'),
  ('kebersihan', 'Kebersihan',        '🧹'),
  ('kemasan',    'Kemasan',           '📦'),
  ('lainnya',    'Lainnya',           '📋');

CREATE TABLE inventory (
  id TEXT PRIMARY KEY DEFAULT 'INV-' || SUBSTRING(uuid_generate_v4()::TEXT, 1, 8),
  name TEXT NOT NULL,
  category_id TEXT REFERENCES inventory_categories(id),
  qty INT DEFAULT 0,
  min_qty INT DEFAULT 0,
  unit TEXT DEFAULT 'pcs',
  price INT DEFAULT 0,
  condition TEXT DEFAULT 'baik' CHECK (condition IN ('baik','aus','rusak')),
  branch_id TEXT REFERENCES branches(id) DEFAULT 'hq',
  last_check DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 15. CCTV (Kamera Keamanan)
-- ============================================================
CREATE TABLE cctv (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  branch_id TEXT REFERENCES branches(id),
  status TEXT DEFAULT 'online' CHECK (status IN ('online','offline','recording')),
  ip TEXT,
  last_motion TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 16. CUSTOMER FEEDBACK (Ulasan Pelanggan)
-- ============================================================
CREATE TABLE feedback (
  id TEXT PRIMARY KEY DEFAULT 'FB-' || SUBSTRING(uuid_generate_v4()::TEXT, 1, 8),
  customer_id TEXT REFERENCES customers(id),
  customer_name TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  table_num INT,
  branch_id TEXT REFERENCES branches(id) DEFAULT 'hq',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 17. DAILY FINANCIAL SUMMARY (Ringkasan Keuangan Harian)
-- ============================================================
CREATE TABLE daily_summary (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  day_name TEXT,
  branch_id TEXT REFERENCES branches(id) DEFAULT 'hq',
  omset INT DEFAULT 0,
  -- Platform breakdown
  gojek_komisi INT DEFAULT 0,
  gojek_bersih INT DEFAULT 0,
  grab_komisi INT DEFAULT 0,
  grab_bersih INT DEFAULT 0,
  qris_komisi INT DEFAULT 0,
  qris_bersih INT DEFAULT 0,
  -- Expenses
  bahan_pokok INT DEFAULT 0,
  operasional INT DEFAULT 0,
  aset INT DEFAULT 0,
  lain_lain INT DEFAULT 0,
  -- Net
  sisa INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, branch_id)
);

-- ============================================================
-- 18. STOCK PURCHASES (Pembelian Stok)
-- ============================================================
CREATE TABLE stock_purchases (
  id SERIAL PRIMARY KEY,
  item_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  qty INT NOT NULL,
  price INT NOT NULL,
  total INT GENERATED ALWAYS AS (qty * price) STORED,
  branch_id TEXT REFERENCES branches(id) DEFAULT 'hq',
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for common queries
-- ============================================================
CREATE INDEX idx_orders_branch     ON orders(branch_id);
CREATE INDEX idx_orders_created    ON orders(created_at);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_cashier    ON orders(cashier_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_attendance_emp    ON attendance(employee_id);
CREATE INDEX idx_attendance_date   ON attendance(date);
CREATE INDEX idx_inventory_cat     ON inventory(category_id);
CREATE INDEX idx_feedback_date     ON feedback(created_at);
CREATE INDEX idx_daily_date        ON daily_summary(date);
CREATE INDEX idx_customers_phone   ON customers(phone);
CREATE INDEX idx_products_cat      ON products(category_id);

-- ============================================================
-- ROW LEVEL SECURITY (enable for all tables)
-- ============================================================
ALTER TABLE branches            ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories          ENABLE ROW LEVEL SECURITY;
ALTER TABLE products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables              ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_types         ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance          ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE kasbon              ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cctv                ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback            ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summary       ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_purchases     ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (adjust per your auth needs)
CREATE POLICY "Allow all" ON branches            FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON categories          FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON products            FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON employees           FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON tables              FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON customers           FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON payment_methods     FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON order_types         FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON orders              FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON order_items         FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON attendance          FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON employee_performance FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON kasbon              FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON inventory_categories FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON inventory           FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON cctv                FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON feedback            FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON daily_summary       FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow all" ON stock_purchases     FOR ALL USING (TRUE) WITH CHECK (TRUE);
