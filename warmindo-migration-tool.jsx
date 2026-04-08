import { useState, useRef, useCallback } from "react";

// ═════════════════════════════════════════════════════════════════════════════
// WARMINDO MIGRATION TOOL — Qasir → Warmindo POS
// Export Guide • CSV Parser • Data Mapper • Import Preview
// Akun: warmindo-djaya-rasa-1204655.qasir.id
// ═════════════════════════════════════════════════════════════════════════════

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
:root{
--b0:#04060C;--b1:#080C16;--b2:#0F1520;--b3:#17202F;--b4:#202D42;
--bd:#1A2438;--t1:#F1F5F9;--t2:#CBD5E1;--t3:#7C8BA1;--t4:#4F5D78;
--ac:#F97316;--acg:rgba(249,115,22,.1);
--gn:#10B981;--gng:rgba(16,185,129,.08);
--rd:#EF4444;--rdg:rgba(239,68,68,.08);
--bl:#3B82F6;--blg:rgba(59,130,246,.08);
--pr:#8B5CF6;--prg:rgba(139,92,246,.08);
--yl:#FBBF24;--ylg:rgba(251,191,36,.08);
--cn:#06B6D4;--cng:rgba(6,182,212,.08);
--f:'Outfit',sans-serif;--fm:'JetBrains Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
.app{font-family:var(--f);background:var(--b0);color:var(--t1);min-height:100vh;display:flex}
.sb{width:220px;background:var(--b1);border-right:1px solid var(--bd);display:flex;flex-direction:column;padding:14px 0;flex-shrink:0;overflow-y:auto}.sb::-webkit-scrollbar{width:0}
.sb-logo{display:flex;align-items:center;gap:8px;padding:0 14px;margin-bottom:18px}
.sb-li{width:34px;height:34px;background:linear-gradient(135deg,#F97316,#DC2626);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 16px rgba(249,115,22,.3)}
.sb-lt{font-size:14px;font-weight:800}.sb-ls{font-size:7px;color:var(--t4);font-weight:700;letter-spacing:.08em}
.sb-lbl{font-size:7px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;padding:10px 14px 4px}
.sb-i{display:flex;align-items:center;gap:7px;padding:8px 14px;cursor:pointer;font-size:12px;font-weight:500;color:var(--t3);transition:all .15s;border-left:3px solid transparent}
.sb-i:hover{background:var(--b3);color:var(--t2)}.sb-i.on{background:var(--acg);color:var(--ac);font-weight:700;border-left-color:var(--ac)}
.sb-sp{flex:1}
.sb-ft{padding:12px 14px;border-top:1px solid var(--bd);font-size:8px;color:var(--t4);line-height:1.6}
.mn{flex:1;display:flex;flex-direction:column;overflow:hidden}
.hdr{height:52px;background:var(--b1);border-bottom:1px solid var(--bd);display:flex;align-items:center;padding:0 20px;gap:10px}
.hdr-t{font-size:16px;font-weight:800}.hdr-sp{flex:1}
.hdr-b{font-size:9px;padding:3px 8px;border-radius:999px;font-weight:700}
.cnt{flex:1;overflow-y:auto;padding:16px 20px}.cnt::-webkit-scrollbar{width:3px}.cnt::-webkit-scrollbar-thumb{background:var(--b4);border-radius:3px}
.bx{background:var(--b2);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:14px}
.bx-t{font-size:14px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.step{display:flex;gap:12px;margin-bottom:14px}
.step-num{width:32px;height:32px;background:var(--acg);color:var(--ac);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;flex-shrink:0}
.step-body{flex:1}
.step-title{font-size:13px;font-weight:700;margin-bottom:4px}
.step-desc{font-size:11px;color:var(--t3);line-height:1.7}
.step-url{font-family:var(--fm);font-size:10px;color:var(--bl);background:var(--blg);padding:4px 8px;border-radius:6px;display:inline-block;margin-top:4px;word-break:break-all}
.step-img{margin-top:8px;padding:10px;background:var(--b3);border-radius:8px;font-size:10px;color:var(--t3);border:1px dashed var(--bd)}
.g{display:grid;gap:10px;margin-bottom:14px}.g2{grid-template-columns:repeat(2,1fr)}.g3{grid-template-columns:repeat(3,1fr)}
.card{background:var(--b3);border:1px solid var(--bd);border-radius:12px;padding:14px;transition:all .2s;cursor:pointer}
.card:hover{border-color:var(--ac);transform:translateY(-1px)}
.card-ic{font-size:28px;margin-bottom:6px}
.card-t{font-size:13px;font-weight:700;margin-bottom:2px}
.card-d{font-size:10px;color:var(--t3);line-height:1.5}
.card-status{margin-top:8px;font-size:9px;font-weight:600;padding:2px 8px;border-radius:999px;display:inline-block}
.bdg{display:inline-flex;align-items:center;gap:2px;padding:2px 7px;border-radius:999px;font-size:9px;font-weight:600}
.b-gn{background:var(--gng);color:var(--gn)}.b-rd{background:var(--rdg);color:var(--rd)}.b-bl{background:var(--blg);color:var(--bl)}
.b-yl{background:var(--ylg);color:var(--yl)}.b-pr{background:var(--prg);color:var(--pr)}.b-ac{background:var(--acg);color:var(--ac)}
.bp{height:40px;background:linear-gradient(135deg,var(--ac),#EA580C);color:#fff;border:none;border-radius:10px;font-family:var(--f);font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;padding:0 16px;transition:all .2s;box-shadow:0 4px 14px rgba(249,115,22,.25)}
.bp:hover{transform:translateY(-1px)}
.bs{height:32px;background:var(--b2);color:var(--t1);border:1px solid var(--bd);border-radius:8px;font-family:var(--f);font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;padding:0 12px;transition:all .15s}
.bs:hover{border-color:var(--t4)}
.inp{height:32px;background:var(--b3);border:1px solid var(--bd);border-radius:8px;padding:0 10px;font-family:var(--f);font-size:12px;color:var(--t1);outline:none}.inp:focus{border-color:var(--ac)}
.tbl{width:100%;border-collapse:separate;border-spacing:0}
.tbl th{text-align:left;font-size:8px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.06em;padding:7px 10px;border-bottom:1px solid var(--bd);background:var(--b2);position:sticky;top:0;z-index:1}
.tbl td{padding:6px 10px;font-size:11px;border-bottom:1px solid var(--bd)}
.tbl tr:hover td{background:rgba(255,255,255,.015)}
.upload-zone{border:2px dashed var(--bd);border-radius:12px;padding:30px;text-align:center;transition:all .2s;cursor:pointer}
.upload-zone:hover{border-color:var(--ac);background:var(--acg)}
.upload-zone.active{border-color:var(--gn);background:var(--gng)}
.timeline{position:relative;padding-left:24px}
.timeline::before{content:'';position:absolute;left:9px;top:0;bottom:0;width:2px;background:var(--bd)}
.tl-item{position:relative;padding-bottom:16px}
.tl-dot{position:absolute;left:-20px;top:2px;width:12px;height:12px;border-radius:50%;border:2px solid var(--bd);background:var(--b2)}
.tl-dot.done{background:var(--gn);border-color:var(--gn)}
.tl-dot.active{background:var(--ac);border-color:var(--ac);box-shadow:0 0 8px rgba(249,115,22,.4)}
.tl-title{font-size:12px;font-weight:600;margin-bottom:2px}
.tl-desc{font-size:10px;color:var(--t3)}
.pe{animation:pe .3s ease}@keyframes pe{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.warn{background:var(--ylg);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:12px;margin-bottom:14px;display:flex;gap:8px;align-items:flex-start}
.warn-ic{font-size:18px;flex-shrink:0}
.warn-txt{font-size:11px;color:var(--t2);line-height:1.6}
.success{background:var(--gng);border:1px solid rgba(16,185,129,.2);border-radius:10px;padding:12px;margin-bottom:14px}
.code{font-family:var(--fm);font-size:10px;background:var(--b3);border:1px solid var(--bd);border-radius:8px;padding:12px;margin:8px 0;overflow-x:auto;white-space:pre;color:var(--t2);line-height:1.6}
@media(max-width:800px){.sb{width:56px}.sb-lt,.sb-ls,.sb-lbl,.sb-i span:not(:first-child),.sb-ft{display:none}.sb-i{justify-content:center;padding:10px}.g2,.g3{grid-template-columns:1fr}}
`;

// ═════════════════════════════════════════════════════════════════════
// DATA MODULES TO MIGRATE
// ═════════════════════════════════════════════════════════════════════
const MODULES = [
  { id: "sales", icon: "📊", name: "Ringkasan Penjualan", qasirPath: "Laporan → Ringkasan Penjualan", desc: "Omset harian, bulanan, tahunan", priority: "high", fields: "Tanggal, Total Penjualan, Total Transaksi, Rata-rata" },
  { id: "trend", icon: "📈", name: "Tren Penjualan", qasirPath: "Laporan → Tren Penjualan", desc: "Grafik tren penjualan periode tertentu", priority: "high", fields: "Tanggal, Jumlah Penjualan" },
  { id: "payment", icon: "💳", name: "Metode Pembayaran", qasirPath: "Laporan → Metode Pembayaran", desc: "Breakdown per metode: Cash, QRIS, GoFood, Grab", priority: "high", fields: "Metode, Jumlah Transaksi, Total Nominal" },
  { id: "ordertype", icon: "📦", name: "Tipe Order", qasirPath: "Laporan → Tipe Order", desc: "Dine-in, Takeaway, GoFood, GrabFood", priority: "high", fields: "Tipe, Jumlah, Nominal" },
  { id: "category", icon: "📂", name: "Penjualan Per Kategori", qasirPath: "Laporan → Penjualan Per Kategori", desc: "Revenue breakdown per kategori menu", priority: "medium", fields: "Kategori, Qty Terjual, Revenue" },
  { id: "product", icon: "🍜", name: "Penjualan Per Produk", qasirPath: "Laporan → Penjualan Per Produk", desc: "Detail per menu item — best sellers", priority: "high", fields: "Nama Produk, Kategori, Qty Terjual, Revenue, HPP" },
  { id: "brand", icon: "🏷️", name: "Penjualan Per Merek", qasirPath: "Laporan → Penjualan Per Merek", desc: "Revenue per brand/supplier", priority: "low", fields: "Merek, Qty, Revenue" },
  { id: "tax", icon: "🧾", name: "Laporan Pajak", qasirPath: "Laporan → Laporan Pajak", desc: "PPN / pajak restoran jika ada", priority: "medium", fields: "Periode, DPP, PPN, Total" },
  { id: "customer", icon: "👥", name: "Laporan Pelanggan", qasirPath: "Laporan → Laporan Pelanggan", desc: "Database customer & frekuensi kunjungan", priority: "high", fields: "Nama, HP, Email, Total Kunjungan, Total Belanja" },
  { id: "employee", icon: "👨‍🍳", name: "Laporan Pegawai", qasirPath: "Laporan → Laporan Pegawai", desc: "Data karyawan & performa", priority: "high", fields: "Nama, Jabatan, Transaksi Dihandle, Total Penjualan" },
  { id: "attendance", icon: "📋", name: "Laporan Absensi", qasirPath: "Laporan → Laporan Absensi", desc: "Kehadiran karyawan harian", priority: "medium", fields: "Nama, Tanggal, Clock In, Clock Out, Status" },
  { id: "discount", icon: "🏷️", name: "Laporan Diskon", qasirPath: "Laporan → Laporan Diskon", desc: "Diskon yang diberikan", priority: "low", fields: "Nama Diskon, Qty Digunakan, Total Nominal" },
  { id: "transactions", icon: "🧾", name: "Riwayat Transaksi", qasirPath: "Riwayat Transaksi", desc: "Semua transaksi detail per struk", priority: "high", fields: "No Struk, Tanggal, Items, Total, Pembayaran, Kasir" },
  { id: "products_db", icon: "📦", name: "Database Produk", qasirPath: "Produk (Export)", desc: "Semua produk/menu dengan harga & stok", priority: "high", fields: "Nama, SKU, Kategori, Harga Jual, HPP, Stok" },
];

// ═════════════════════════════════════════════════════════════════════
// CSV PARSER
// ═════════════════════════════════════════════════════════════════════
function parseCSV(text) {
  const lines = text.split("\n").filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const sep = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map(h => h.replace(/"/g, "").trim());
  const rows = lines.slice(1).map(line => {
    const vals = line.split(sep).map(v => v.replace(/"/g, "").trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] || "");
    return obj;
  });
  return { headers, rows };
}

// ═════════════════════════════════════════════════════════════════════
// PAGES
// ═════════════════════════════════════════════════════════════════════

const OverviewPage = () => (
  <div className="pe">
    <div className="warn">
      <div className="warn-ic">⚠️</div>
      <div className="warn-txt">
        <b>Penting:</b> Qasir tidak menyediakan public API untuk integrasi langsung.
        Migrasi data dilakukan via <b>Export manual</b> dari dashboard Qasir (format Excel/CSV),
        lalu <b>Import</b> ke Warmindo POS menggunakan tool ini. Proses ini aman — data langsung dari akun kamu sendiri.
      </div>
    </div>

    <div className="bx">
      <div className="bx-t">🔄 Alur Migrasi Data</div>
      <div className="timeline">
        {[
          { t: "Login ke Qasir Dashboard", d: "Buka warmindo-djaya-rasa-1204655.qasir.id dengan akun PRO+ kamu", done: true },
          { t: "Export Data per Modul", d: "Download setiap laporan dalam format Excel/CSV via tombol Export", active: true },
          { t: "Upload ke Migration Tool", d: "Drag & drop file CSV/Excel ke halaman Import di tool ini" },
          { t: "Review & Map Fields", d: "Periksa mapping kolom Qasir → Warmindo POS" },
          { t: "Import ke Database", d: "Konfirmasi dan import data ke sistem Warmindo POS" },
          { t: "Verifikasi", d: "Cek data sudah masuk dengan benar di setiap modul" },
        ].map((s, i) => (
          <div key={i} className="tl-item">
            <div className={`tl-dot ${s.done ? "done" : s.active ? "active" : ""}`} />
            <div className="tl-title">{s.t}</div>
            <div className="tl-desc">{s.d}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="bx">
      <div className="bx-t">📋 14 Modul Data untuk Migrasi</div>
      <div style={{ fontSize: 11, color: "var(--t3)", marginBottom: 10 }}>Klik "Panduan Export" di sidebar untuk detail step-by-step setiap modul.</div>
      <div className="g g3">
        {MODULES.map(m => (
          <div key={m.id} className="card">
            <div className="card-ic">{m.icon}</div>
            <div className="card-t">{m.name}</div>
            <div className="card-d">{m.desc}</div>
            <div className="card-status" style={{
              background: m.priority === "high" ? "var(--rdg)" : m.priority === "medium" ? "var(--ylg)" : "var(--blg)",
              color: m.priority === "high" ? "var(--rd)" : m.priority === "medium" ? "var(--yl)" : "var(--bl)"
            }}>
              {m.priority === "high" ? "🔴 Prioritas" : m.priority === "medium" ? "🟡 Sedang" : "🔵 Opsional"}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="success">
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gn)", marginBottom: 6 }}>💡 Tips Migrasi</div>
      <div style={{ fontSize: 11, color: "var(--t2)", lineHeight: 1.8 }}>
        • Set rentang tanggal <b>04/08/2025 - 04/08/2026</b> (1 tahun penuh) untuk data lengkap<br/>
        • Export satu per satu, mulai dari yang prioritas tinggi (🔴)<br/>
        • Simpan semua file di satu folder: <code style={{fontFamily:"var(--fm)",background:"var(--b3)",padding:"1px 4px",borderRadius:3}}>~/warmindo-migration/</code><br/>
        • Data Produk/Menu adalah yang paling krusial — export ini duluan<br/>
        • Riwayat Transaksi mungkin file terbesar — bisa dipecah per bulan
      </div>
    </div>
  </div>
);

const ExportGuidePage = () => (
  <div className="pe">
    <div className="bx" style={{ background: "var(--acg)", borderColor: "rgba(249,115,22,.15)" }}>
      <div className="bx-t" style={{ color: "var(--ac)" }}>🔗 Akun Qasir Kamu</div>
      <div style={{ fontFamily: "var(--fm)", fontSize: 12, color: "var(--ac)", marginBottom: 4 }}>warmindo-djaya-rasa-1204655.qasir.id</div>
      <div style={{ fontSize: 10, color: "var(--t3)" }}>PRO+ • Pusat Utama • Periode: 04/08/2025 - 04/08/2026</div>
    </div>

    {/* Step by step for each module */}
    {[
      { module: "📊 Ringkasan Penjualan", steps: [
        { title: "Buka Laporan → Ringkasan Penjualan", desc: "Di sidebar kiri Qasir, klik Laporan → Ringkasan Penjualan" },
        { title: "Set Periode", desc: "Ubah rentang tanggal menjadi 04/08/2025 - 04/08/2026 (atau sesuai kebutuhan)" },
        { title: "Klik Export", desc: "Klik tombol merah 'Export' di kanan atas. File akan diunduh dalam format Excel (.xlsx)" },
      ]},
      { module: "💳 Metode Pembayaran", steps: [
        { title: "Buka Laporan → Metode Pembayaran", desc: "Akan tampil breakdown: Tunai, QRIS, GoFood Pay, GrabFood Pay, dll" },
        { title: "Set Periode & Export", desc: "Sama seperti sebelumnya — set tanggal lalu klik Export" },
      ]},
      { module: "📦 Tipe Order", steps: [
        { title: "Buka Laporan → Tipe Order", desc: "Menampilkan: Dine In, Bungkus, GoFood, GrabFood, ShopeeFood" },
        { title: "Export", desc: "Klik Export — data termasuk jumlah transaksi dan total nominal per tipe" },
      ]},
      { module: "🍜 Penjualan Per Produk (PENTING!)", steps: [
        { title: "Buka Laporan → Penjualan Per Produk", desc: "Ini data menu best seller kamu — paling penting untuk migrasi" },
        { title: "Export", desc: "File berisi: Nama Produk, Kategori, Qty Terjual, Revenue, HPP (jika diisi)" },
      ]},
      { module: "👥 Laporan Pelanggan", steps: [
        { title: "Buka Laporan → Laporan Pelanggan", desc: "Database customer yang pernah transaksi" },
        { title: "Export", desc: "Data: Nama, HP, Email, Total Kunjungan, Total Belanja — langsung jadi CRM kamu" },
      ]},
      { module: "👨‍🍳 Laporan Pegawai + Absensi", steps: [
        { title: "Export Laporan Pegawai", desc: "Laporan → Laporan Pegawai → Export: Nama, Role, Performa" },
        { title: "Export Laporan Absensi", desc: "Laporan → Laporan Absensi → Export: Clock In/Out harian" },
      ]},
      { module: "🧾 Riwayat Transaksi (TERBESAR)", steps: [
        { title: "Buka Riwayat Transaksi", desc: "Di sidebar, klik Riwayat Transaksi" },
        { title: "Export per Bulan", desc: "Karena data besar, export per bulan: Mar 2026, Feb 2026, dst. File berisi detail struk, items, pembayaran" },
      ]},
      { module: "📦 Database Produk", steps: [
        { title: "Buka halaman Produk", desc: "Di menu utama Qasir, cari menu Produk / Inventori" },
        { title: "Export Produk", desc: "Download list semua produk: Nama, SKU, Kategori, Harga Jual, HPP, Stok — ini jadi master data menu kamu" },
      ]},
    ].map((section, si) => (
      <div key={si} className="bx">
        <div className="bx-t">{section.module}</div>
        {section.steps.map((s, i) => (
          <div key={i} className="step">
            <div className="step-num">{i + 1}</div>
            <div className="step-body">
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    ))}

    <div className="warn">
      <div className="warn-ic">💡</div>
      <div className="warn-txt">
        <b>Opsi Tambahan:</b> Kalau mau lebih cepat, kamu bisa buka Qasir di browser → login → buka Developer Tools (F12) → Network tab → 
        lalu navigate ke setiap halaman laporan. Kamu bisa lihat API calls internal yang dipakai Qasir untuk fetch data. 
        Response JSON-nya bisa disimpan langsung. Tapi cara Export resmi lebih aman dan didukung.
      </div>
    </div>
  </div>
);

// Supabase table targets for import
const IMPORT_TARGETS = [
  { id: "products", label: "Produk / Menu", table: "products", icon: "🍜",
    mapRow: (row, m) => ({ name: row[m.nama_produk||"Nama Produk"]||row[m.name||"name"], price: parseInt((row[m.harga||"Harga Jual"]||row[m.price||"price"]||"0").replace(/\D/g,""))||0, category_id: (row[m.kategori||"Kategori"]||row[m.category||"category"]||"").toLowerCase().replace(/\s/g,""), stock: parseInt(row[m.stok||"Stok"]||row[m.stock||"stock"]||"0")||0, image: "🍜", active: true }) },
  { id: "orders", label: "Transaksi", table: "orders", icon: "🧾",
    mapRow: (row, m) => ({ id: row[m.no_struk||"No Receipt"]||row[m.id||"id"]||(Date.now().toString(36)+Math.random().toString(36).slice(2,6)), order_type: (row[m.tipe_order||"Tipe Order"]||"dine_in").toLowerCase().replace(/\s+/g,"_"), payment_method: (row[m.metode_bayar||"Metode Pembayaran"]||"cash").toLowerCase().replace(/\s+/g,"_"), total: parseInt((row[m.total||"Total"]||"0").replace(/\D/g,""))||0, status: "completed", is_paid: true, created_at: row[m.tanggal||"Tanggal"]||new Date().toISOString() }) },
  { id: "customers", label: "Pelanggan", table: "customers", icon: "👥",
    mapRow: (row, m) => ({ id: "CUST-"+(Date.now().toString(36)+Math.random().toString(36).slice(2,6)), name: row[m.nama_customer||"Nama"]||"", phone: row[m.telepon||"No HP"]||"", email: row[m.email||"Email"]||null, visits: parseInt(row[m.kunjungan||"Total Kunjungan"]||"0")||0, total_spent: parseInt((row[m.total_belanja||"Total Belanja"]||"0").replace(/\D/g,""))||0, tags: [] }) },
  { id: "employees", label: "Karyawan", table: "employees", icon: "👨‍🍳",
    mapRow: (row, m) => ({ id: "EMP-"+(Date.now().toString(36)+Math.random().toString(36).slice(2,6)), name: row[m.nama_karyawan||"Nama"]||"", role: row[m.jabatan||"Jabatan"]||"Staff", phone: row[m.telepon||"No HP"]||"", branch_id: "hq", salary: 0, status: "active" }) },
  { id: "attendance", label: "Absensi", table: "attendance", icon: "📋",
    mapRow: (row, m) => ({ employee_id: row[m.nama_karyawan||"Nama"]||"", date: row[m.tanggal||"Tanggal"]||"", clock_in: row[m.jam_masuk||"Jam Masuk"]||null, clock_out: row[m.jam_keluar||"Jam Keluar"]||null, status: (row[m.status||"Status"]||"hadir").toLowerCase() }) },
];

const ImportPage = () => {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [mapping, setMapping] = useState({});
  const [target, setTarget] = useState("products");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files || e.dataTransfer?.files || []);
    const processed = newFiles.map(f => ({ file: f, name: f.name, size: (f.size / 1024).toFixed(1) + " KB", type: f.name.endsWith(".csv") ? "CSV" : "Excel", status: "ready" }));
    setFiles(prev => [...prev, ...processed]);
  };

  const parseFile = async (fileObj) => {
    setActiveFile(fileObj);
    const text = await fileObj.file.text();
    const result = parseCSV(text);
    setParsed(result);
  };

  const handleDrop = (e) => { e.preventDefault(); handleFiles(e); };

  return (
    <div className="pe">
      {/* Upload Zone */}
      <div className="upload-zone" onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}>
        <input ref={fileRef} type="file" multiple accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={handleFiles} />
        <div style={{ fontSize: 40, marginBottom: 8 }}>📁</div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Drag & Drop file CSV/Excel di sini</div>
        <div style={{ fontSize: 11, color: "var(--t3)" }}>atau klik untuk browse • Hasil export dari Qasir</div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bx" style={{ marginTop: 14 }}>
          <div className="bx-t">📁 File Diupload ({files.length})</div>
          <table className="tbl">
            <thead><tr><th>File</th><th>Ukuran</th><th>Format</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>{files.map((f, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{f.name}</td>
                <td style={{ fontFamily: "var(--fm)", fontSize: 10 }}>{f.size}</td>
                <td><span className={`bdg ${f.type === "CSV" ? "b-gn" : "b-bl"}`}>{f.type}</span></td>
                <td><span className={`bdg ${f.status === "ready" ? "b-yl" : f.status === "parsed" ? "b-gn" : "b-rd"}`}>{f.status === "ready" ? "⏳ Siap" : f.status === "parsed" ? "✅ Parsed" : "❌ Error"}</span></td>
                <td>
                  {f.type === "CSV" && <button className="bs" style={{ height: 26, fontSize: 9 }} onClick={() => parseFile(f)}>🔍 Parse & Preview</button>}
                  {f.type === "Excel" && <span style={{ fontSize: 9, color: "var(--t4)" }}>Konversi ke CSV dulu</span>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* Parsed Preview */}
      {parsed && (
        <div className="bx">
          <div className="bx-t">📋 Preview Data: {activeFile?.name} <span className="bdg b-gn">{parsed.rows.length} rows × {parsed.headers.length} cols</span></div>

          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Kolom terdeteksi:</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
            {parsed.headers.map((h, i) => <span key={i} className="bdg b-bl">{h}</span>)}
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>🔗 Mapping ke Warmindo POS:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "6px 8px", alignItems: "center", marginBottom: 12 }}>
            {parsed.headers.slice(0, 10).map((h, i) => (
              <>
                <div key={`from-${i}`} style={{ fontSize: 11, fontFamily: "var(--fm)", color: "var(--bl)", background: "var(--blg)", padding: "4px 8px", borderRadius: 6 }}>{h}</div>
                <div key={`arrow-${i}`} style={{ color: "var(--t4)", fontSize: 12 }}>→</div>
                <select key={`to-${i}`} className="inp" style={{ width: "100%", height: 28, fontSize: 10 }} value={mapping[h] || h} onChange={e => setMapping({ ...mapping, [h]: e.target.value })}>
                  <option value={h}>{h} (sama)</option>
                  <option value="tanggal">tanggal</option>
                  <option value="nama_produk">nama_produk</option>
                  <option value="kategori">kategori</option>
                  <option value="qty">qty</option>
                  <option value="harga">harga</option>
                  <option value="total">total</option>
                  <option value="metode_bayar">metode_bayar</option>
                  <option value="nama_customer">nama_customer</option>
                  <option value="telepon">telepon</option>
                  <option value="nama_karyawan">nama_karyawan</option>
                  <option value="skip">❌ Skip</option>
                </select>
              </>
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>👀 Preview 5 baris pertama:</div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead><tr>{parsed.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
              <tbody>{parsed.rows.slice(0, 5).map((row, i) => (
                <tr key={i}>{parsed.headers.map((h, j) => <td key={j} style={{ fontSize: 10, fontFamily: "var(--fm)" }}>{row[h] || "—"}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>

          {/* Target table selector */}
          <div style={{ marginTop: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>🎯 Import ke tabel:</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {IMPORT_TARGETS.map(t => (
                <button key={t.id} className={target === t.id ? "bp" : "bs"} style={{ height: 30, fontSize: 10 }} onClick={() => setTarget(t.id)}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className={result.ok ? "success" : "warn"} style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: result.ok ? "var(--gn)" : "var(--rd)" }}>
                {result.ok ? `✅ Berhasil import ${result.count} rows ke ${result.table}!` : `❌ Error: ${result.error}`}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="bp" style={{ flex: 1, opacity: importing ? 0.6 : 1 }} disabled={importing} onClick={async () => {
              if (!window.WDB) { setResult({ ok: false, error: "Supabase belum terhubung (WDB not found)" }); return; }
              setImporting(true); setResult(null);
              const tgt = IMPORT_TARGETS.find(t => t.id === target);
              try {
                const rows = parsed.rows.map(r => tgt.mapRow(r, mapping)).filter(r => {
                  const vals = Object.values(r);
                  return vals.some(v => v && v !== "" && v !== 0);
                });
                const BATCH = 100;
                let inserted = 0;
                for (let i = 0; i < rows.length; i += BATCH) {
                  const batch = rows.slice(i, i + BATCH);
                  const res = await window.WDB.sb.from(tgt.table).upsert(batch, { onConflict: "id", ignoreDuplicates: true });
                  if (res.error) throw new Error(res.error.message);
                  inserted += batch.length;
                }
                setResult({ ok: true, count: inserted, table: tgt.table });
              } catch (e) { setResult({ ok: false, error: e.message }); }
              setImporting(false);
            }}>
              {importing ? "⏳ Importing..." : `✅ Import ${parsed.rows.length} rows ke ${IMPORT_TARGETS.find(t=>t.id===target)?.label}`}
            </button>
            <button className="bs" onClick={() => { setParsed(null); setActiveFile(null); setResult(null); }}>Batal</button>
          </div>
        </div>
      )}

      {files.length === 0 && (
        <div className="bx" style={{ marginTop: 14 }}>
          <div className="bx-t">📝 Contoh Format CSV yang Diterima</div>
          <div className="code">{`Tanggal;Nama Produk;Kategori;Qty;Harga;Total;Metode Bayar
2026-03-11;Indomie Goreng;Indomie;5;8000;40000;Cash
2026-03-11;Es Teh Manis;Minuman;3;5000;15000;QRIS
2026-03-11;Nasi Goreng;Nasi;2;15000;30000;GoPay`}</div>
          <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 4 }}>Separator: titik koma (;) atau koma (,) — otomatis terdeteksi</div>
        </div>
      )}
    </div>
  );
};

const MappingPage = () => (
  <div className="pe">
    <div className="bx">
      <div className="bx-t">🔗 Mapping Field: Qasir → Warmindo POS</div>
      <div style={{ fontSize: 11, color: "var(--t3)", marginBottom: 12 }}>Berikut mapping otomatis kolom dari export Qasir ke struktur Warmindo POS.</div>

      {[
        { module: "Produk / Menu", maps: [
          ["Nama Produk", "→", "name"],
          ["SKU", "→", "sku"],
          ["Kategori", "→", "category"],
          ["Harga Jual", "→", "price"],
          ["HPP", "→", "cost"],
          ["Stok", "→", "stock"],
        ]},
        { module: "Transaksi / Penjualan", maps: [
          ["No Receipt", "→", "transaction_id"],
          ["Tanggal", "→", "date"],
          ["Total", "→", "total"],
          ["Metode Pembayaran", "→", "payment_method"],
          ["Tipe Order", "→", "order_type"],
          ["Kasir", "→", "cashier"],
          ["Pelanggan", "→", "customer_id"],
        ]},
        { module: "Customer", maps: [
          ["Nama", "→", "name"],
          ["No HP", "→", "phone"],
          ["Email", "→", "email"],
          ["Total Kunjungan", "→", "visits"],
          ["Total Belanja", "→", "total_spent"],
        ]},
        { module: "Karyawan", maps: [
          ["Nama", "→", "name"],
          ["Jabatan", "→", "role"],
          ["No HP", "→", "phone"],
          ["Total Transaksi", "→", "transactions_handled"],
        ]},
        { module: "Absensi", maps: [
          ["Nama", "→", "employee_id"],
          ["Tanggal", "→", "date"],
          ["Jam Masuk", "→", "clock_in"],
          ["Jam Keluar", "→", "clock_out"],
          ["Status", "→", "status"],
        ]},
      ].map((section, si) => (
        <div key={si} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--ac)" }}>{section.module}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 30px 1fr", gap: "4px 8px", alignItems: "center" }}>
            {section.maps.map((m, i) => (
              <>
                <div key={`q-${si}-${i}`} style={{ fontSize: 11, fontFamily: "var(--fm)", background: "var(--rdg)", color: "var(--rd)", padding: "4px 8px", borderRadius: 6, textAlign: "center" }}>{m[0]}</div>
                <div key={`a-${si}-${i}`} style={{ textAlign: "center", color: "var(--t4)", fontSize: 11 }}>→</div>
                <div key={`w-${si}-${i}`} style={{ fontSize: 11, fontFamily: "var(--fm)", background: "var(--gng)", color: "var(--gn)", padding: "4px 8px", borderRadius: 6, textAlign: "center" }}>{m[2]}</div>
              </>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="bx">
      <div className="bx-t">⚡ Opsi Lanjutan: Scrape via Browser Console</div>
      <div style={{ fontSize: 11, color: "var(--t3)", marginBottom: 8 }}>Jika export resmi tidak lengkap, kamu bisa ambil data via browser Developer Tools:</div>
      <div className="code">{`// 1. Login ke Qasir dashboard di browser
// 2. Buka F12 → Console
// 3. Navigate ke halaman laporan yang diinginkan
// 4. Jalankan script ini:

// Ambil semua data dari tabel yang terlihat
const rows = document.querySelectorAll('table tbody tr');
const data = Array.from(rows).map(row => {
  const cells = row.querySelectorAll('td');
  return Array.from(cells).map(c => c.innerText);
});
console.table(data);

// Copy ke clipboard sebagai CSV
const csv = data.map(r => r.join(';')).join('\\n');
navigator.clipboard.writeText(csv);
console.log('✅ Copied ' + data.length + ' rows!');`}</div>
      <div className="warn" style={{ marginTop: 8 }}>
        <div className="warn-ic">⚠️</div>
        <div className="warn-txt">
          Metode console hanya sebagai backup. Gunakan fitur Export resmi dari Qasir sebagai cara utama.
          Scraping mungkin melanggar ToS Qasir — gunakan dengan bijak untuk data milik sendiri.
        </div>
      </div>
    </div>
  </div>
);

const ChecklistPage = () => {
  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const items = [
    { id: "products", label: "Export & Import Database Produk/Menu", priority: "🔴" },
    { id: "transactions", label: "Export & Import Riwayat Transaksi (per bulan)", priority: "🔴" },
    { id: "customers", label: "Export & Import Data Pelanggan", priority: "🔴" },
    { id: "employees", label: "Export & Import Data Pegawai", priority: "🔴" },
    { id: "sales_summary", label: "Export Ringkasan Penjualan", priority: "🔴" },
    { id: "payment_methods", label: "Export Metode Pembayaran", priority: "🔴" },
    { id: "order_types", label: "Export Tipe Order", priority: "🟡" },
    { id: "categories", label: "Export Penjualan per Kategori", priority: "🟡" },
    { id: "attendance", label: "Export Laporan Absensi", priority: "🟡" },
    { id: "tax", label: "Export Laporan Pajak", priority: "🟡" },
    { id: "discounts", label: "Export Laporan Diskon", priority: "🔵" },
    { id: "brands", label: "Export Penjualan per Merek", priority: "🔵" },
    { id: "verify_products", label: "Verifikasi: Produk sudah sesuai di Warmindo POS", priority: "✅" },
    { id: "verify_txn", label: "Verifikasi: Transaksi historis cocok", priority: "✅" },
    { id: "verify_customers", label: "Verifikasi: Customer database lengkap", priority: "✅" },
    { id: "go_live", label: "🚀 GO LIVE — Mulai pakai Warmindo POS!", priority: "🏁" },
  ];
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="pe">
      <div className="bx" style={{ background: doneCount === items.length ? "var(--gng)" : "var(--b2)", borderColor: doneCount === items.length ? "rgba(16,185,129,.2)" : "var(--bd)" }}>
        <div className="bx-t">{doneCount === items.length ? "🎉 Migrasi Selesai!" : "📋 Checklist Migrasi"} <span className="bdg b-ac">{doneCount}/{items.length}</span></div>
        <div style={{ height: 6, background: "var(--b4)", borderRadius: 3, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(doneCount / items.length) * 100}%`, background: "linear-gradient(90deg, var(--ac), var(--gn))", borderRadius: 3, transition: "width .3s" }} />
        </div>
        {items.map(item => (
          <div key={item.id} onClick={() => toggle(item.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--bd)", cursor: "pointer" }}>
            <div style={{ width: 20, height: 20, border: `2px solid ${checked[item.id] ? "var(--gn)" : "var(--bd)"}`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", background: checked[item.id] ? "var(--gng)" : "transparent", flexShrink: 0, transition: "all .2s" }}>
              {checked[item.id] && <span style={{ color: "var(--gn)", fontSize: 12 }}>✓</span>}
            </div>
            <div style={{ flex: 1, fontSize: 12, fontWeight: 500, textDecoration: checked[item.id] ? "line-through" : "none", color: checked[item.id] ? "var(--t4)" : "var(--t1)" }}>{item.label}</div>
            <span style={{ fontSize: 12 }}>{item.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════════════════════════════════
export default function MigrationTool() {
  const [pg, sPg] = useState("overview");
  const nav = [
    { id: "overview", em: "🔄", l: "Overview Migrasi" },
    { id: "guide", em: "📖", l: "Panduan Export" },
    { id: "import", em: "📥", l: "Import Data" },
    { id: "mapping", em: "🔗", l: "Field Mapping" },
    { id: "checklist", em: "✅", l: "Checklist" },
  ];
  const titles = { overview: "Migration Overview", guide: "Panduan Export Qasir", import: "Import Data CSV/Excel", mapping: "Field Mapping", checklist: "Migration Checklist" };

  return (
    <><style>{CSS}</style><div className="app">
      <nav className="sb">
        <div className="sb-logo"><div className="sb-li">🔄</div><div><div className="sb-lt">Migration</div><div className="sb-ls">QASIR → WARMINDO</div></div></div>
        <div className="sb-lbl">Tools</div>
        {nav.map(n => <div key={n.id} className={`sb-i ${pg === n.id ? "on" : ""}`} onClick={() => sPg(n.id)}><span>{n.em}</span> <span>{n.l}</span></div>)}
        <div className="sb-sp" />
        <div className="sb-ft">
          🏪 Warmindo Djaya Rasa<br />
          🔗 qasir.id #1204655<br />
          📅 Data: 1 tahun<br />
          📦 14 modul migrasi<br /><br />
          🔥 Warmindo POS Migration Tool
        </div>
      </nav>
      <div className="mn">
        <header className="hdr">
          <div className="hdr-t">{titles[pg]}</div>
          <div className="hdr-b" style={{ background: "var(--acg)", color: "var(--ac)" }}>MIGRATION TOOL</div>
          <div className="hdr-sp" />
          <div className="hdr-b" style={{ background: "var(--rdg)", color: "var(--rd)" }}>Qasir PRO+</div>
          <div className="hdr-b" style={{ background: "var(--gng)", color: "var(--gn)" }}>→ Warmindo POS</div>
        </header>
        <div className="cnt">
          {pg === "overview" && <OverviewPage />}
          {pg === "guide" && <ExportGuidePage />}
          {pg === "import" && <ImportPage />}
          {pg === "mapping" && <MappingPage />}
          {pg === "checklist" && <ChecklistPage />}
        </div>
      </div>
    </div></>
  );
}
