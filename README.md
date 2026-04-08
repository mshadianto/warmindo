# Warmindo POS

Sistem manajemen warung makan Indonesia lengkap — POS, Dashboard Keuangan, Enterprise Management, dan Table/CRM. Dibangun dengan React.

## Aplikasi

### 1. `warmindo-pos.jsx` — POS Kasir (v1)
Aplikasi kasir sederhana single-file untuk operasional harian.

- POS dengan grid produk, kategori, pencarian, keranjang belanja
- Tipe pesanan: Dine In, Bungkus, GoFood, GrabFood
- Pembayaran: Tunai (kalkulasi kembalian), QRIS, Transfer, GoFood, GrabFood
- Cetak struk digital
- Manajemen produk & stok
- Riwayat transaksi & laporan penjualan
- Pengaturan toko

### 2. `warmindo-pos-v3.jsx` — POS Enterprise (v3)
Versi enterprise dengan fitur multi-cabang dan manajemen lengkap.

- **Multi-Cabang** — Pusat + cabang Pamulang & Depok, branch switcher
- **Pembayaran Lengkap** — Tunai, QRIS, E-Wallet (GoPay/OVO/DANA/ShopeePay), Transfer Bank (BCA/BRI/Mandiri/BSI), Platform (GoFood/GrabFood)
- **Karyawan** — Data pegawai, absensi (clock in/out), performa, multi-branch assignment
- **CCTV** — Monitoring kamera per cabang (placeholder streams)
- **Inventori** — Manajemen aset (alat makan, masak, kebersihan, kemasan)
- **QR Code** — Generator QRIS built-in (canvas-based)
- Tipe pesanan tambahan: ShopeeFood

### 3. `warmindo-dashboard.jsx` — Dashboard Keuangan
Dashboard analitik dengan data riil periode 11 Mar – 5 Apr 2026.

- **Overview** — KPI cards (total omset, laba bersih, margin, rata-rata harian)
- **Daily Report** — Tabel detail harian (omset, potongan platform, pengeluaran, sisa kas)
- **Payroll** — Gaji karyawan, kasbon, total pembayaran
- **Stok Gudang** — Inventori bar & dapur dengan nilai stok
- **Channel Analysis** — Breakdown pendapatan per channel (GoFood, GrabFood, QRIS, Cash)
- **Expense Breakdown** — Analisis pengeluaran (bahan pokok, operasional, aset)

### 4. `warmindo-table-crm.jsx` — Table Management + CRM (v5)
Manajemen meja restoran dan database pelanggan.

- **Manajemen Meja** — 12 meja dengan status real-time (empty/occupied/ordering/served/paying/cleaning), kapasitas, dan timer durasi
- **QR per Meja** — Setiap meja punya QR code unik untuk self-order
- **Self-Order Preview** — Simulasi tampilan pelanggan scan QR untuk pesan mandiri
- **Customer CRM** — Database pelanggan dengan poin loyalti, total kunjungan, total belanja, dan tier (Bronze/Silver/Gold/Platinum)
- **Feedback** — Sistem rating & review pelanggan per meja
- **Kitchen Print** — Cetak pesanan ke dapur per meja
- **QR Manager** — Halaman khusus untuk print/manage semua QR code meja

## Tech Stack

- **React** (hooks only — no class components)
- **Single-file architecture** — Setiap aplikasi adalah satu file JSX mandiri
- **localStorage** — Data tersimpan di browser (POS v1 & v3)
- **No backend / No build tool** — Tidak ada server, bundler, atau package.json

## Penggunaan

Impor komponen ke dalam proyek React:

```jsx
// POS Kasir
import WarmindoPOS from "./warmindo-pos";

// POS Enterprise
import WarmindoPOS from "./warmindo-pos-v3";

// Dashboard Keuangan
import WarmindoDashboard from "./warmindo-dashboard";

// Table Management + CRM
import WarmindoPOS from "./warmindo-table-crm";

function App() {
  return <WarmindoPOS />;  // atau <WarmindoDashboard />
}
```

## Struktur Data (localStorage)

### POS v1 (`warmindo-pos.jsx`)
| Key | Isi |
|-----|-----|
| `warmindo_products` | Array produk (id, name, price, category, stock, image) |
| `warmindo_txns` | Array transaksi (id, items, total, payment, orderType, timestamp) |
| `warmindo_shop` | Nama warung (string) |

### POS v3 (`warmindo-pos-v3.jsx`)
| Key | Isi |
|-----|-----|
| `w3_products` | Array produk (id, name, price, cat, stock, img) |
| `w3_txns` | Array transaksi per cabang |
| `w3_employees` | Data karyawan multi-cabang |
| `w3_attendance` | Data absensi |
| `w3_inventory` | Inventori aset |
| `w3_shop` | Nama warung |

### Table CRM (`warmindo-table-crm.jsx`)
| Key | Isi |
|-----|-----|
| `wtc_tables` | Array meja (id, num, status, capacity, orders, qrCode) |
| `wtc_customers` | Database pelanggan (id, name, phone, points, tier, visits, totalSpent) |
| `wtc_feedback` | Array feedback/rating pelanggan |

### Dashboard (`warmindo-dashboard.jsx`)
Data hardcoded dari laporan keuangan riil — tidak menggunakan localStorage.
