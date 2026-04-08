import { useState, useMemo, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════
// WARMINDO DASHBOARD v4 — DATA RIIL 11 Mar – 5 Apr 2026
// Daily Report • Financial Analytics • Employee Payroll • Stock Gudang
// ═══════════════════════════════════════════════════════════════════════

const rp = n => {
  if (n === 0) return "Rp0";
  const abs = Math.abs(n);
  const formatted = "Rp" + abs.toLocaleString("id-ID");
  return n < 0 ? "-" + formatted : formatted;
};
const pct = (a, b) => b === 0 ? "0%" : (a / b * 100).toFixed(1) + "%";

// ─── REAL DATA FROM PDF ────────────────────────────────────────────

const DAILY = [
  { date: "11 Mar", day: "Rabu", omset: 2572000, gojekK: 38643, gojekB: 23357, grabK: 171600, grabB: 67495, qrisK: 983000, qrisB: 976119, bahanPokok: 1247900, ops: 165000, aset: 0, lain: 32000, sisa: 1455071 },
  { date: "12 Mar", day: "Kamis", omset: 1723800, gojekK: 57600, gojekB: 32452, grabK: 0, grabB: 0, qrisK: 787800, qrisB: 782285, bahanPokok: 1095460, ops: 140000, aset: 351400, lain: 0, sisa: 1561348 },
  { date: "13 Mar", day: "Jumat", omset: 2701000, gojekK: 47307, gojekB: 12309, grabK: 105930, grabB: 24511, qrisK: 1314000, qrisB: 1304802, bahanPokok: 1226800, ops: 284000, aset: 0, lain: 0, sisa: 2625933 },
  { date: "14 Mar", day: "Sabtu", omset: 1530000, gojekK: 249500, gojekB: 151629, grabK: 137362, grabB: 23199, qrisK: 531000, qrisB: 527283, bahanPokok: 975000, ops: 155000, aset: 0, lain: 120000, sisa: 2690182 },
  { date: "15 Mar", day: "Minggu", omset: 2055800, gojekK: 0, gojekB: 0, grabK: 180400, grabB: 117754, qrisK: 733000, qrisB: 727869, bahanPokok: 726000, ops: 163000, aset: 0, lain: 20000, sisa: 3769205 },
  { date: "16 Mar", day: "Senin", omset: 1357000, gojekK: 0, gojekB: 0, grabK: 73000, grabB: 43920, qrisK: 557000, qrisB: 553101, bahanPokok: 1979600, ops: 140000, aset: 0, lain: 4000, sisa: 2969626 },
  { date: "17 Mar", day: "Selasa", omset: 3259300, gojekK: 184000, gojekB: 116061, grabK: 130137, grabB: 42079, qrisK: 1067000, qrisB: 1059531, bahanPokok: 1065000, ops: 145000, aset: 0, lain: 136800, sisa: 4718660 },
  { date: "18 Mar", day: "Rabu", omset: 3008200, gojekK: 60000, gojekB: 47346, grabK: 661339, grabB: 121442, qrisK: 1125000, qrisB: 1117125, bahanPokok: 4388250, ops: 348000, aset: 14500, lain: 0, sisa: 2415684 },
  { date: "19 Mar", day: "Kamis", omset: 3550200, gojekK: 296100, gojekB: 215701, grabK: 414066, grabB: 231389, qrisK: 1255000, qrisB: 1246215, bahanPokok: 976500, ops: 140000, aset: 0, lain: 283600, sisa: 4293923 },
  { date: "20 Mar", day: "Jumat", omset: 3508900, gojekK: 239100, gojekB: 188673, grabK: 0, grabB: 0, qrisK: 1928800, qrisB: 1915298, bahanPokok: 1894000, ops: 140000, aset: 0, lain: 2780000, sisa: 2924894 },
  { date: "22 Mar", day: "Minggu", omset: 2318100, gojekK: 62100, gojekB: 49003, grabK: 0, grabB: 0, qrisK: 804000, qrisB: 798372, bahanPokok: 1365700, ops: 314800, aset: 0, lain: 0, sisa: 3543769 },
  { date: "23 Mar", day: "Senin", omset: 2317600, gojekK: 330600, gojekB: 242576, grabK: 0, grabB: 0, qrisK: 919000, qrisB: 912567, bahanPokok: 1276750, ops: 140000, aset: 0, lain: 0, sisa: 4350162 },
  { date: "24 Mar", day: "Selasa", omset: 3424800, gojekK: 395200, gojekB: 311552, grabK: 0, grabB: 0, qrisK: 845000, qrisB: 843085, bahanPokok: 1392000, ops: 140000, aset: 0, lain: 0, sisa: 6157399 },
  { date: "25 Mar", day: "Rabu", omset: 2311050, gojekK: 99000, gojekB: 76682, grabK: 143550, grabB: 117450, qrisK: 923500, qrisB: 917035, bahanPokok: 2399500, ops: 1187953, aset: 0, lain: 0, sisa: 4826113 },
  { date: "26 Mar", day: "Kamis", omset: 1937980, gojekK: 43600, gojekB: 34404, grabK: 158565, grabB: 116631, qrisK: 798000, qrisB: 792414, bahanPokok: 1436900, ops: 477600, aset: 0, lain: 0, sisa: 4792877 },
  { date: "27 Mar", day: "Jumat", omset: 2399052, gojekK: 153600, gojekB: 116955, grabK: 106452, grabB: 75484, qrisK: 1146000, qrisB: 1141275, bahanPokok: 578500, ops: 160000, aset: 0, lain: 770000, sisa: 5611091 },
  { date: "28 Mar", day: "Sabtu", omset: 2470425, gojekK: 187200, gojekB: 137370, grabK: 428725, grabB: 314805, qrisK: 917500, qrisB: 91750, bahanPokok: 1512950, ops: 290700, aset: 0, lain: 1100000, sisa: 4188366 },
  { date: "29 Mar", day: "Minggu", omset: 2390365, gojekK: 77200, gojekB: 60918, grabK: 231165, grabB: 167877, qrisK: 809000, qrisB: 809000, bahanPokok: 2059000, ops: 160000, aset: 1595200, lain: 0, sisa: 2684961 },
  { date: "30 Mar", day: "Senin", omset: 2153200, gojekK: 40000, gojekB: 31564, grabK: 0, grabB: 0, qrisK: 770400, qrisB: 770400, bahanPokok: 941600, ops: 294500, aset: 31500, lain: 200000, sisa: 3362125 },
  { date: "31 Mar", day: "Selasa", omset: 2809275, gojekK: 54200, gojekB: 42768, grabK: 134475, grabB: 104985, qrisK: 1187000, qrisB: 1187000, bahanPokok: 1114500, ops: 241000, aset: 0, lain: 50000, sisa: 4724978 },
  { date: "1 Apr", day: "Rabu", omset: 3159637, gojekK: 306200, gojekB: 185830, grabK: 156433, grabB: 77842, qrisK: 1022000, qrisB: 1022000, bahanPokok: 1544300, ops: 285000, aset: 0, lain: 145900, sisa: 5710454 },
  { date: "2 Apr", day: "Kamis", omset: 2854739, gojekK: 43200, gojekB: 34089, grabK: 256239, grabB: 191591, qrisK: 1022500, qrisB: 1022500, bahanPokok: 1411000, ops: 185000, aset: 0, lain: 50000, sisa: 6845434 },
  { date: "3 Apr", day: "Jumat", omset: 6032224, gojekK: 481900, gojekB: 225659, grabK: 454754, grabB: 278036, qrisK: 2786600, qrisB: 2786484, bahanPokok: 8090000, ops: 1740000, aset: 0, lain: 550000, sisa: 2064583 },
  { date: "4 Apr", day: "Sabtu", omset: 4583552, gojekK: 459352, gojekB: 299223, grabK: 322200, grabB: 162158, qrisK: 1531650, qrisB: 1531650, bahanPokok: 3052600, ops: 370000, aset: 128000, lain: 254200, sisa: 2523164 },
  { date: "5 Apr", day: "Minggu", omset: 5091906, gojekK: 0, gojekB: 0, grabK: 0, grabB: 0, qrisK: 0, qrisB: 0, bahanPokok: 5536000, ops: 356000, aset: 95500, lain: 0, sisa: 1627570 },
];

const EMPLOYEES = [
  { name: "Devi", role: "Head Kitchen", gaji: 1800000, kasbon: 50000, total: 1750000 },
  { name: "Dilla", role: "Kitchen", gaji: 1700000, kasbon: 400000, total: 1300000 },
  { name: "Rizki", role: "Helper Kitchen", gaji: 1600000, kasbon: 0, total: 1600000 },
  { name: "Eca", role: "Helper Kitchen", gaji: 1600000, kasbon: 100000, total: 1500000 },
  { name: "Rifki", role: "Barista", gaji: 1650000, kasbon: 600000, total: 1050000 },
  { name: "Rizal", role: "Barista", gaji: 1650000, kasbon: 100000, total: 1550000 },
  { name: "Wike", role: "Waiters", gaji: 1500000, kasbon: 0, total: 1500000 },
  { name: "Elma", role: "-", gaji: 3000000, kasbon: 0, total: 3000000 },
  { name: "Iqbal", role: "-", gaji: 500000, kasbon: 0, total: 500000 },
];

const KASBON = [
  { name: "Devi", items: [{ amount: 50000 }] },
  { name: "Rian", items: [{ amount: 100000 }] },
  { name: "Eca", items: [{ amount: 100000 }] },
  { name: "Rifki", items: [{ amount: 50000 }, { amount: 500000 }, { amount: 50000 }] },
  { name: "Rizal", items: [{ amount: 100000 }] },
  { name: "Dilla", items: [{ amount: 400000 }] },
  { name: "Ica/Esa", items: [{ amount: 600000 }] },
];

const STOCK_BAR = [
  // ─── Minuman Sachet & Kaleng ───
  { item: "Pop Ice", sat: "Renteng", qty: 8, harga: 12000 },
  { item: "Coca Cola", sat: "Botol", qty: 28, harga: 3300 },
  { item: "Sprite", sat: "Botol", qty: 25, harga: 3300 },
  { item: "Fanta", sat: "Botol", qty: 25, harga: 3300 },
  { item: "Schweppers", sat: "Kaleng", qty: 14, harga: 6500 },
  { item: "A&W", sat: "Kaleng", qty: 7, harga: 6500 },
  { item: "Kratindeng", sat: "Kaleng", qty: 27, harga: 5500 },
  { item: "Zoda", sat: "Botol", qty: 2, harga: 5500 },
  { item: "Soda Fanta", sat: "Botol", qty: 50, harga: 4000 },
  { item: "Ektrajos", sat: "Dus", qty: 15, harga: 14500 },
  { item: "Kukubima", sat: "Dus", qty: 5, harga: 6000 },
  { item: "STMJ", sat: "Renteng", qty: 60, harga: 3100 },
  { item: "Chocolatos Matcha", sat: "Renteng", qty: 4, harga: 20000 },
  { item: "Chocolatos Coklat", sat: "Renteng", qty: 4, harga: 20000 },
  { item: "Chocolatos Creamy", sat: "Renteng", qty: 2, harga: 20000 },
  { item: "Bengbeng", sat: "Renteng", qty: 6, harga: 22000 },
  { item: "Nutrisari Sweet Mango", sat: "Renteng", qty: 2, harga: 14000 },
  { item: "Nutrisari Florida Orange", sat: "Renteng", qty: 1, harga: 14000 },
  { item: "Nutrisari Jeruk Nipis", sat: "Renteng", qty: 6, harga: 14000 },
  { item: "Nutrisari Jeruk Peras", sat: "Renteng", qty: 6, harga: 14000 },
  { item: "Nutrisari Milky Orange", sat: "Renteng", qty: 3, harga: 14000 },
  { item: "Kapal Api", sat: "Renteng", qty: 4, harga: 17000 },
  { item: "ABC Susu", sat: "Renteng", qty: 2, harga: 17500 },
  { item: "Max Tea Teh Tarik", sat: "Renteng", qty: 9, harga: 18000 },
  { item: "Milo", sat: "Renteng", qty: 23, harga: 19500 },
  { item: "Dancow Putih", sat: "Renteng", qty: 10, harga: 38000 },
  { item: "Dancow Coklat", sat: "Renteng", qty: 8, harga: 38000 },
  { item: "Good Day Coolin", sat: "Renteng", qty: 2, harga: 23500 },
  { item: "Good Day Moccacino", sat: "Renteng", qty: 4, harga: 17500 },
  { item: "Good Day Vanila Latte", sat: "Renteng", qty: 4, harga: 23500 },
  { item: "Good Day Butterscotch", sat: "Renteng", qty: 5, harga: 16500 },
  { item: "Good Day Latte", sat: "Renteng", qty: 2, harga: 16500 },
  { item: "Good Day Cappucino", sat: "Renteng", qty: 6, harga: 23000 },
  { item: "Energen Coklat", sat: "Renteng", qty: 1, harga: 22000 },
  { item: "Energen Vanila", sat: "Renteng", qty: 1, harga: 22000 },
  { item: "Energen Kacang Ijo", sat: "Renteng", qty: 1, harga: 22000 },
  { item: "Indocafe", sat: "Renteng", qty: 4, harga: 17000 },
  { item: "Susu Jahe", sat: "Renteng", qty: 5, harga: 11000 },
  { item: "Luwak White Coffee", sat: "Renteng", qty: 2, harga: 17500 },
  { item: "Creamy Latte", sat: "Renteng", qty: 3, harga: 29000 },
  { item: "Wedang Jahe", sat: "Dus", qty: 2, harga: 29000 },
  { item: "Teh Tubruk", sat: "Pcs", qty: 7, harga: 21000 },
  { item: "Ovaltine", sat: "Renteng", qty: 11, harga: 19000 },
  { item: "Gula Aren", sat: "Botol", qty: 2, harga: 50000 },
  // ─── Sirup & Powder ───
  { item: "Sirup Vanilla", sat: "Botol", qty: 3, harga: 99000 },
  { item: "Sirup Butterscotch", sat: "Botol", qty: 3, harga: 99000 },
  { item: "Sirup Lemon", sat: "Botol", qty: 1, harga: 99000 },
  { item: "Sirup Caramel", sat: "Botol", qty: 2, harga: 99000 },
  { item: "Sirup Strawberry", sat: "Botol", qty: 3, harga: 99000 },
  { item: "Powder Coklat", sat: "Pcs", qty: 3, harga: 140000 },
  { item: "Powder Matcha", sat: "Pcs", qty: 3, harga: 183000 },
  { item: "Simple Sirup", sat: "Botol", qty: 7, harga: 55000 },
  // ─── Susu & Kopi ───
  { item: "SKM Tiga Sapi", sat: "Kaleng", qty: 50, harga: 13500 },
  { item: "SKM Carnation", sat: "Kaleng", qty: 51, harga: 15000 },
  { item: "Houseblend Kopi (1kg)", sat: "Pak", qty: 5, harga: 255000 },
  { item: "UHT Indomilk", sat: "Pcs", qty: 10, harga: 16500 },
  { item: "UHT Greenfields", sat: "Karton", qty: 1, harga: 252000 },
  { item: "UHT Diamond", sat: "Karton", qty: 1, harga: 228000 },
  { item: "Creamer", sat: "Dus", qty: 5, harga: 60000 },
  // ─── Topping & Bahan Kue ───
  { item: "Coklat Crunch", sat: "Pcs", qty: 3, harga: 55000 },
  { item: "Matcha Crunchy", sat: "Pcs", qty: 2, harga: 60000 },
  { item: "Tiramisu", sat: "Pcs", qty: 2, harga: 50000 },
  { item: "Keju Winchees", sat: "Pcs", qty: 16, harga: 16000 },
  { item: "Keju Spread", sat: "Pcs", qty: 17, harga: 14000 },
  // ─── Tepung & Bahan Pokok ───
  { item: "Maizena", sat: "Dus", qty: 3, harga: 15500 },
  { item: "Terigu Segitiga", sat: "Pcs", qty: 15, harga: 13000 },
  { item: "Terigu Tulip", sat: "Pcs", qty: 15, harga: 12000 },
  { item: "Terigu Cakra", sat: "Pcs", qty: 10, harga: 14000 },
  { item: "Terigu Pisang", sat: "Pcs", qty: 5, harga: 6500 },
  { item: "Tepung Rose Brand", sat: "Pcs", qty: 10, harga: 6500 },
  { item: "Minyak Goreng", sat: "Pcs", qty: 48, harga: 41000 },
  { item: "Beras", sat: "Karung", qty: 1, harga: 380000 },
  { item: "Mentega", sat: "Kg", qty: 5, harga: 24000 },
  // ─── Bumbu & Rempah ───
  { item: "Racik Ayam", sat: "Renteng", qty: 7, harga: 18000 },
  { item: "Kari", sat: "Dus", qty: 2, harga: 135000 },
  { item: "Desaku Ayam", sat: "Renteng", qty: 3, harga: 18000 },
  { item: "Terasi", sat: "Bks", qty: 2, harga: 12000 },
  { item: "Sasa", sat: "Bks", qty: 2, harga: 14500 },
  { item: "Ladaku", sat: "Renteng", qty: 6, harga: 13800 },
  { item: "Masako Ayam", sat: "Pcs", qty: 4, harga: 6500 },
  { item: "Kunyit Bubuk", sat: "Renteng", qty: 2, harga: 11000 },
  { item: "Ketumbar", sat: "Renteng", qty: 2, harga: 11000 },
  { item: "Pala Bubuk", sat: "Renteng", qty: 3, harga: 18500 },
  { item: "Bawang Putih Bubuk", sat: "Renteng", qty: 3, harga: 11500 },
  { item: "Kerupuk Udang", sat: "Pcs", qty: 5, harga: 15000 },
  // ─── Indomie ───
  { item: "Indomie Goreng", sat: "Dus", qty: 10, harga: 110000 },
  { item: "Indomie Ayam Bawang", sat: "Dus", qty: 8, harga: 110000 },
  // ─── Kemasan & Packaging ───
  { item: "Cup 16oz", sat: "Pak", qty: 10, harga: 80000 },
  { item: "Cup 12oz", sat: "Pak", qty: 4, harga: 50000 },
  { item: "Box Takeaway M", sat: "Pak", qty: 9, harga: 38000 },
  { item: "Box Takeaway S", sat: "Pak", qty: 10, harga: 35000 },
  { item: "Sedotan", sat: "Pak", qty: 5, harga: 32000 },
  { item: "Kertas Nasi", sat: "Bks", qty: 10, harga: 12000 },
  { item: "Kresek 24", sat: "Bks", qty: 12, harga: 37000 },
  // ─── Kebersihan & Lainnya ───
  { item: "Pengharum Ruangan", sat: "Pcs", qty: 7, harga: 10500 },
  { item: "Pengharum Semprot", sat: "Botol", qty: 4, harga: 21500 },
  { item: "Sunlight", sat: "Drg", qty: 1, harga: 60000 },
  { item: "Soklin Lantai", sat: "Drg", qty: 1, harga: 43000 },
  { item: "Kornet", sat: "Pcs", qty: 3, harga: 26000 },
];

// ─── STYLES ────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
:root {
  --b0:#050810;--b1:#0A0E1A;--b2:#111728;--b3:#1A2238;--b4:#24304A;--bh:#1D2844;
  --bd:#1C2640;--bd2:#283650;
  --t1:#F1F5F9;--t2:#CBD5E1;--t3:#7C8BA1;--t4:#4F5D78;
  --ac:#F97316;--ac2:#FB923C;--acg:rgba(249,115,22,.1);
  --gn:#10B981;--gng:rgba(16,185,129,.1);
  --rd:#EF4444;--rdg:rgba(239,68,68,.1);
  --bl:#3B82F6;--blg:rgba(59,130,246,.1);
  --pr:#8B5CF6;--prg:rgba(139,92,246,.1);
  --yl:#FBBF24;--ylg:rgba(251,191,36,.1);
  --cn:#06B6D4;--cng:rgba(6,182,212,.1);
  --pk:#EC4899;--pkg:rgba(236,72,153,.1);
  --r1:8px;--r2:12px;--r3:16px;--r4:20px;
  --f:'Outfit',sans-serif;--fm:'JetBrains Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--b0)}
.app{font-family:var(--f);background:var(--b0);color:var(--t1);min-height:100vh;display:flex}

/* Sidebar */
.sb{width:220px;background:var(--b1);border-right:1px solid var(--bd);display:flex;flex-direction:column;padding:16px 0;flex-shrink:0;overflow-y:auto}
.sb::-webkit-scrollbar{width:0}
.sb-logo{display:flex;align-items:center;gap:10px;padding:0 18px;margin-bottom:20px}
.sb-logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#F97316,#DC2626);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 16px rgba(249,115,22,.3)}
.sb-logo-text{font-size:15px;font-weight:800;letter-spacing:-.02em}
.sb-logo-sub{font-size:9px;color:var(--t4);font-weight:500;letter-spacing:.05em}
.sb-section{padding:0 10px;margin-bottom:4px}
.sb-label{font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em;padding:8px 8px 4px}
.sb-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--r1);cursor:pointer;font-size:13px;font-weight:500;color:var(--t3);transition:all .15s;margin-bottom:1px}
.sb-item:hover{background:var(--b3);color:var(--t2)}
.sb-item.on{background:var(--acg);color:var(--ac);font-weight:700}
.sb-item .emoji{font-size:16px;width:24px;text-align:center}
.sb-sp{flex:1}
.sb-footer{padding:12px 18px;border-top:1px solid var(--bd);margin-top:8px}
.sb-footer-text{font-size:10px;color:var(--t4);line-height:1.5}

/* Main */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}

/* Header */
.hdr{height:56px;background:var(--b1);border-bottom:1px solid var(--bd);display:flex;align-items:center;padding:0 24px;gap:12px}
.hdr-title{font-size:18px;font-weight:800;letter-spacing:-.02em}
.hdr-badge{font-size:10px;color:var(--ac);background:var(--acg);padding:3px 10px;border-radius:999px;font-weight:700}
.hdr-sp{flex:1}
.hdr-period{font-family:var(--fm);font-size:11px;color:var(--t3);background:var(--b2);padding:6px 14px;border-radius:var(--r1);border:1px solid var(--bd)}

/* Content */
.content{flex:1;overflow-y:auto;padding:20px 24px}
.content::-webkit-scrollbar{width:4px}
.content::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:4px}

/* Cards Grid */
.grid{display:grid;gap:12px;margin-bottom:16px}
.g4{grid-template-columns:repeat(4,1fr)}
.g3{grid-template-columns:repeat(3,1fr)}
.g2{grid-template-columns:repeat(2,1fr)}
.g1{grid-template-columns:1fr}

/* Stat Card */
.sc{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);padding:16px;position:relative;overflow:hidden;transition:all .2s}
.sc:hover{border-color:var(--bd2);transform:translateY(-1px)}
.sc-icon{width:32px;height:32px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:8px}
.sc-label{font-size:11px;color:var(--t4);font-weight:500;margin-bottom:4px}
.sc-val{font-size:22px;font-weight:800;font-family:var(--fm);letter-spacing:-.02em}
.sc-sub{font-size:10px;color:var(--t3);margin-top:4px}
.sc-glow{position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;opacity:.06}

/* Box */
.box{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);padding:18px;margin-bottom:16px}
.box-t{font-size:14px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.box-t .count{font-size:10px;color:var(--t4);background:var(--b3);padding:2px 8px;border-radius:999px;font-weight:600}

/* Table */
.tbl{width:100%;border-collapse:separate;border-spacing:0}
.tbl th{text-align:left;font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.06em;padding:8px 10px;border-bottom:1px solid var(--bd);background:var(--b2);position:sticky;top:0;z-index:1}
.tbl th.r{text-align:right}
.tbl td{padding:7px 10px;font-size:11px;border-bottom:1px solid var(--bd);vertical-align:middle}
.tbl td.r{text-align:right;font-family:var(--fm);font-weight:600;font-size:11px}
.tbl td.mono{font-family:var(--fm);font-size:10px}
.tbl tr:hover td{background:rgba(255,255,255,.02)}
.tbl tr.highlight td{background:rgba(249,115,22,.04)}
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:999px;font-size:9px;font-weight:600}
.b-gn{background:var(--gng);color:var(--gn)}
.b-rd{background:var(--rdg);color:var(--rd)}
.b-bl{background:var(--blg);color:var(--bl)}
.b-yl{background:var(--ylg);color:var(--yl)}
.b-pr{background:var(--prg);color:var(--pr)}
.b-ac{background:var(--acg);color:var(--ac)}
.b-cn{background:var(--cng);color:var(--cn)}
.b-pk{background:var(--pkg);color:var(--pk)}

/* Bar Chart */
.bars{display:flex;align-items:flex-end;gap:4px;height:140px;padding:16px 0 0}
.bar-c{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px}
.bar{width:100%;border-radius:4px 4px 0 0;transition:height .6s cubic-bezier(.4,0,.2,1);min-height:2px}
.bar-l{font-size:7px;color:var(--t4);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.bar-v{font-size:7px;color:var(--t3);font-family:var(--fm);font-weight:700}

/* Horizontal bar */
.hbar{display:flex;align-items:center;gap:10px;padding:6px 0}
.hbar-label{font-size:11px;color:var(--t2);width:100px;flex-shrink:0;font-weight:500}
.hbar-track{flex:1;height:8px;background:var(--b4);border-radius:4px;overflow:hidden}
.hbar-fill{height:100%;border-radius:4px;transition:width .6s ease}
.hbar-val{font-family:var(--fm);font-size:10px;color:var(--t1);font-weight:700;min-width:80px;text-align:right}

/* Tabs */
.tabs{display:flex;gap:4px;margin-bottom:14px;flex-wrap:wrap}
.tab{padding:6px 14px;border:1px solid var(--bd);background:var(--b2);color:var(--t4);border-radius:999px;font-size:11px;font-weight:600;font-family:var(--f);cursor:pointer;transition:all .15s}
.tab:hover{border-color:var(--t4)}
.tab.on{background:var(--acg);border-color:var(--ac);color:var(--ac)}

/* Progress ring */
.ring{position:relative;display:inline-flex}
.ring-val{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;font-family:var(--fm)}

/* Anim */
.pe{animation:pe .3s ease}
@keyframes pe{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* Responsive */
@media(max-width:1100px){.g4{grid-template-columns:repeat(2,1fr)}}
@media(max-width:800px){.sb{width:64px;overflow:hidden}.sb-logo-text,.sb-logo-sub,.sb-label,.sb-item span:not(.emoji){display:none}.sb-item{justify-content:center;padding:10px}.sb-footer{display:none}.g4,.g3{grid-template-columns:repeat(2,1fr)}}
`;

// ─── COMPONENTS ────────────────────────────────────────────────────

const StatCard = ({ icon, bg, label, value, sub, glow }) => (
  <div className="sc">
    <div className="sc-icon" style={{ background: bg }}>{icon}</div>
    <div className="sc-label">{label}</div>
    <div className="sc-val" style={{ color: glow }}>{value}</div>
    {sub && <div className="sc-sub">{sub}</div>}
    <div className="sc-glow" style={{ background: glow }} />
  </div>
);

const HBar = ({ label, value, max, color, display }) => (
  <div className="hbar">
    <div className="hbar-label">{label}</div>
    <div className="hbar-track"><div className="hbar-fill" style={{ width: `${Math.min(value / max * 100, 100)}%`, background: color }} /></div>
    <div className="hbar-val" style={{ color }}>{display || rp(value)}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════

const OverviewPage = () => {
  const totals = useMemo(() => {
    const t = { omset: 0, bp: 0, ops: 0, aset: 0, lain: 0, gojekK: 0, grabK: 0, qrisK: 0 };
    DAILY.forEach(d => { t.omset += d.omset; t.bp += d.bahanPokok; t.ops += d.ops; t.aset += d.aset; t.lain += d.lain; t.gojekK += d.gojekK; t.grabK += d.grabK; t.qrisK += d.qrisK; });
    t.totalExp = t.bp + t.ops + t.aset + t.lain;
    t.cashOmset = t.omset - t.gojekK - t.grabK - t.qrisK;
    return t;
  }, []);
  const maxOmset = Math.max(...DAILY.map(d => d.omset));
  const avgOmset = Math.round(totals.omset / DAILY.length);
  const bestDay = DAILY.reduce((a, b) => a.omset > b.omset ? a : b);
  const worstDay = DAILY.reduce((a, b) => a.omset < b.omset ? a : b);

  return (
    <div className="pe">
      <div className="grid g4">
        <StatCard icon="💰" bg="var(--acg)" label="Total Omset (24 hari)" value={rp(totals.omset)} sub={`Avg: ${rp(avgOmset)}/hari`} glow="var(--ac)" />
        <StatCard icon="📤" bg="var(--rdg)" label="Total Pengeluaran" value={rp(totals.totalExp)} sub={pct(totals.totalExp, totals.omset) + " dari omset"} glow="var(--rd)" />
        <StatCard icon="📊" bg="var(--gng)" label="Saldo Akhir" value={rp(1246726)} sub="Per 5 Apr 2026" glow="var(--gn)" />
        <StatCard icon="📱" bg="var(--prg)" label="Transaksi Digital" value={rp(totals.qrisK + totals.gojekK + totals.grabK)} sub="QRIS + GoJek + Grab" glow="var(--pr)" />
      </div>

      <div className="grid g2">
        <div className="box">
          <div className="box-t">📈 Omset Harian</div>
          <div className="bars" style={{ height: 160 }}>
            {DAILY.map((d, i) => (
              <div key={i} className="bar-c">
                <div className="bar-v">{(d.omset / 1e6).toFixed(1)}</div>
                <div className="bar" style={{ height: `${(d.omset / maxOmset) * 130}px`, background: d.omset >= avgOmset ? 'linear-gradient(180deg,var(--gn),#059669)' : 'linear-gradient(180deg,var(--ac),#EA580C)' }} />
                <div className="bar-l">{d.date.split(" ")[0]}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "var(--t4)" }}>
            (dalam juta Rupiah) • 🟢 ≥ rata-rata • 🟠 &lt; rata-rata
          </div>
        </div>

        <div className="box">
          <div className="box-t">💳 Channel Penjualan</div>
          <HBar label="QRIS" value={totals.qrisK} max={totals.omset} color="var(--pr)" />
          <HBar label="Cash" value={totals.cashOmset} max={totals.omset} color="var(--gn)" />
          <HBar label="GoJek" value={totals.gojekK} max={totals.omset} color="var(--bl)" />
          <HBar label="Grab" value={totals.grabK} max={totals.omset} color="var(--ac)" />
          <div style={{ marginTop: 12, fontSize: 10, color: "var(--t4)", lineHeight: 1.6 }}>
            QRIS: {pct(totals.qrisK, totals.omset)} • Cash: {pct(totals.cashOmset, totals.omset)} • GoJek: {pct(totals.gojekK, totals.omset)} • Grab: {pct(totals.grabK, totals.omset)}
          </div>
        </div>
      </div>

      <div className="grid g2">
        <div className="box">
          <div className="box-t">📤 Breakdown Pengeluaran</div>
          <HBar label="Bahan Pokok" value={totals.bp} max={totals.totalExp} color="var(--rd)" />
          <HBar label="Operasional" value={totals.ops} max={totals.totalExp} color="var(--yl)" />
          <HBar label="Lain-lain" value={totals.lain} max={totals.totalExp} color="var(--bl)" />
          <HBar label="Aset" value={totals.aset} max={totals.totalExp} color="var(--cn)" />
          <div style={{ marginTop: 10, padding: 10, background: "var(--b3)", borderRadius: "var(--r2)", fontSize: 10, color: "var(--t3)", lineHeight: 1.6 }}>
            Bahan Pokok: <b style={{ color: "var(--t1)" }}>{pct(totals.bp, totals.totalExp)}</b> •
            Ops: <b style={{ color: "var(--t1)" }}>{pct(totals.ops, totals.totalExp)}</b> •
            Lain: <b style={{ color: "var(--t1)" }}>{pct(totals.lain, totals.totalExp)}</b> •
            Aset: <b style={{ color: "var(--t1)" }}>{pct(totals.aset, totals.totalExp)}</b>
          </div>
        </div>
        <div className="box">
          <div className="box-t">🏆 Highlight</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ padding: 12, background: "var(--gng)", borderRadius: "var(--r2)" }}>
              <div style={{ fontSize: 10, color: "var(--gn)", fontWeight: 600 }}>📈 Omset Tertinggi</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--fm)", color: "var(--gn)" }}>{rp(bestDay.omset)}</div>
              <div style={{ fontSize: 10, color: "var(--t3)" }}>{bestDay.day}, {bestDay.date} 2026</div>
            </div>
            <div style={{ padding: 12, background: "var(--rdg)", borderRadius: "var(--r2)" }}>
              <div style={{ fontSize: 10, color: "var(--rd)", fontWeight: 600 }}>📉 Omset Terendah</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--fm)", color: "var(--rd)" }}>{rp(worstDay.omset)}</div>
              <div style={{ fontSize: 10, color: "var(--t3)" }}>{worstDay.day}, {worstDay.date} 2026</div>
            </div>
            <div style={{ padding: 12, background: "var(--blg)", borderRadius: "var(--r2)" }}>
              <div style={{ fontSize: 10, color: "var(--bl)", fontWeight: 600 }}>📊 Rata-rata Harian</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--fm)", color: "var(--bl)" }}>{rp(avgOmset)}</div>
              <div style={{ fontSize: 10, color: "var(--t3)" }}>24 hari operasional</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DailyPage = () => (
  <div className="pe">
    <div style={{ overflowX: "auto" }}>
      <table className="tbl">
        <thead><tr>
          <th>Tanggal</th><th>Hari</th><th className="r">Omset</th>
          <th className="r">GoJek (K)</th><th className="r">Grab (K)</th><th className="r">QRIS (K)</th>
          <th className="r">Bahan Pokok</th><th className="r">Operasional</th><th className="r">Aset</th><th className="r">Lain</th>
          <th className="r">Sisa</th>
        </tr></thead>
        <tbody>
          {DAILY.map((d, i) => {
            const totalExp = d.bahanPokok + d.ops + d.aset + d.lain;
            const profit = d.omset - totalExp;
            return (
              <tr key={i} className={d.omset >= 3000000 ? "highlight" : ""}>
                <td style={{ fontWeight: 600 }}>{d.date} 2026</td>
                <td><span className="badge b-bl">{d.day}</span></td>
                <td className="r" style={{ color: d.omset >= 3000000 ? "var(--gn)" : "var(--t1)" }}>{rp(d.omset)}</td>
                <td className="r" style={{ color: d.gojekK ? "var(--t2)" : "var(--t4)" }}>{d.gojekK ? rp(d.gojekK) : "—"}</td>
                <td className="r" style={{ color: d.grabK ? "var(--t2)" : "var(--t4)" }}>{d.grabK ? rp(d.grabK) : "—"}</td>
                <td className="r" style={{ color: "var(--pr)" }}>{rp(d.qrisK)}</td>
                <td className="r" style={{ color: "var(--rd)" }}>{rp(d.bahanPokok)}</td>
                <td className="r" style={{ color: "var(--yl)" }}>{rp(d.ops)}</td>
                <td className="r" style={{ color: d.aset ? "var(--cn)" : "var(--t4)" }}>{d.aset ? rp(d.aset) : "—"}</td>
                <td className="r" style={{ color: d.lain ? "var(--pk)" : "var(--t4)" }}>{d.lain ? rp(d.lain) : "—"}</td>
                <td className="r" style={{ color: d.sisa >= 4000000 ? "var(--gn)" : "var(--t1)" }}>{rp(d.sisa)}</td>
              </tr>
            );
          })}
          <tr style={{ background: "var(--acg)" }}>
            <td colSpan={2} style={{ fontWeight: 800, color: "var(--ac)" }}>TOTAL</td>
            <td className="r" style={{ fontWeight: 800, color: "var(--ac)" }}>{rp(DAILY.reduce((s, d) => s + d.omset, 0))}</td>
            <td className="r" style={{ fontWeight: 700 }}>{rp(DAILY.reduce((s, d) => s + d.gojekK, 0))}</td>
            <td className="r" style={{ fontWeight: 700 }}>{rp(DAILY.reduce((s, d) => s + d.grabK, 0))}</td>
            <td className="r" style={{ fontWeight: 700, color: "var(--pr)" }}>{rp(DAILY.reduce((s, d) => s + d.qrisK, 0))}</td>
            <td className="r" style={{ fontWeight: 700, color: "var(--rd)" }}>{rp(DAILY.reduce((s, d) => s + d.bahanPokok, 0))}</td>
            <td className="r" style={{ fontWeight: 700, color: "var(--yl)" }}>{rp(DAILY.reduce((s, d) => s + d.ops, 0))}</td>
            <td className="r" style={{ fontWeight: 700 }}>{rp(DAILY.reduce((s, d) => s + d.aset, 0))}</td>
            <td className="r" style={{ fontWeight: 700 }}>{rp(DAILY.reduce((s, d) => s + d.lain, 0))}</td>
            <td className="r" style={{ fontWeight: 800, color: "var(--gn)" }}>{rp(1246726)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const PayrollPage = () => {
  const totalGaji = EMPLOYEES.reduce((s, e) => s + e.gaji, 0);
  const totalKasbon = EMPLOYEES.reduce((s, e) => s + e.kasbon, 0);
  const totalBayar = EMPLOYEES.reduce((s, e) => s + e.total, 0);
  return (
    <div className="pe">
      <div className="grid g4">
        <StatCard icon="👥" bg="var(--blg)" label="Total Karyawan" value={EMPLOYEES.length} glow="var(--bl)" />
        <StatCard icon="💰" bg="var(--acg)" label="Total Gaji Pokok" value={rp(totalGaji)} glow="var(--ac)" />
        <StatCard icon="📋" bg="var(--rdg)" label="Total Kasbon" value={rp(totalKasbon)} glow="var(--rd)" />
        <StatCard icon="💵" bg="var(--gng)" label="Total Dibayar" value={rp(totalBayar)} glow="var(--gn)" />
      </div>

      <div className="box">
        <div className="box-t">💰 Slip Gaji Karyawan <span className="count">Periode Mar-Apr 2026</span></div>
        <table className="tbl">
          <thead><tr><th>Nama</th><th>Jabatan</th><th className="r">Gaji Pokok</th><th className="r">Kasbon</th><th className="r">Total Diterima</th></tr></thead>
          <tbody>
            {EMPLOYEES.map((e, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{e.name}</td>
                <td><span className={`badge ${e.role.includes("Head") ? "b-ac" : e.role.includes("Kitchen") || e.role.includes("Helper") ? "b-bl" : e.role.includes("Barista") ? "b-pr" : e.role.includes("Wait") ? "b-cn" : "b-yl"}`}>{e.role}</span></td>
                <td className="r">{rp(e.gaji)}</td>
                <td className="r" style={{ color: e.kasbon > 0 ? "var(--rd)" : "var(--t4)" }}>{e.kasbon > 0 ? rp(e.kasbon) : "—"}</td>
                <td className="r" style={{ fontWeight: 700, color: "var(--gn)" }}>{rp(e.total)}</td>
              </tr>
            ))}
            <tr style={{ background: "var(--acg)" }}>
              <td colSpan={2} style={{ fontWeight: 800, color: "var(--ac)" }}>TOTAL</td>
              <td className="r" style={{ fontWeight: 800, color: "var(--ac)" }}>{rp(totalGaji)}</td>
              <td className="r" style={{ fontWeight: 800, color: "var(--rd)" }}>{rp(totalKasbon)}</td>
              <td className="r" style={{ fontWeight: 800, color: "var(--gn)" }}>{rp(totalBayar)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="box">
        <div className="box-t">📋 Rincian Kasbon</div>
        <div className="grid g3" style={{ marginBottom: 0 }}>
          {KASBON.map((k, i) => (
            <div key={i} style={{ padding: 12, background: "var(--b3)", borderRadius: "var(--r2)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{k.name}</div>
              {k.items.map((it, j) => (
                <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11, borderBottom: "1px solid var(--bd)" }}>
                  <span style={{ color: "var(--t3)" }}>Kasbon #{j + 1}</span>
                  <span style={{ fontFamily: "var(--fm)", fontWeight: 600, color: "var(--rd)" }}>{rp(it.amount)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 0", fontSize: 11, fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ fontFamily: "var(--fm)", color: "var(--rd)" }}>{rp(k.items.reduce((s, i) => s + i.amount, 0))}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StockPage = () => {
  const [cat, setCat] = useState("all");
  const totalValue = STOCK_BAR.reduce((s, i) => s + i.qty * i.harga, 0);
  const categories = [...new Set(STOCK_BAR.map(i => {
    if (["Pop Ice", "Coca Cola", "Sprite", "Fanta", "Schweppers", "A&W", "Kratindeng", "Ektrajos"].includes(i.item)) return "Minuman Jadi";
    if (i.item.includes("Milo") || i.item.includes("Dancow") || i.item.includes("Good Day") || i.item.includes("Chocolatos") || i.item.includes("Bengbeng") || i.item.includes("Ovaltine") || i.item.includes("Kapal") || i.item.includes("Luwak") || i.item.includes("Indocafe")) return "Sachet/Renteng";
    if (i.item.includes("Sirup") || i.item.includes("Powder") || i.item.includes("Houseblend") || i.item.includes("Simple") || i.item.includes("Creamer") || i.item.includes("Crunch") || i.item.includes("Tiramisu")) return "Bahan Bar";
    if (i.item.includes("SKM") || i.item.includes("UHT") || i.item.includes("Keju") || i.item.includes("Mayzena")) return "Susu & Keju";
    if (i.item.includes("Terigu") || i.item.includes("Minyak") || i.item.includes("Beras") || i.item.includes("Rose") || i.item.includes("Racik") || i.item.includes("Kari") || i.item.includes("Desaku") || i.item.includes("Masako") || i.item.includes("Sasa") || i.item.includes("Ladaku") || i.item.includes("Mentega") || i.item.includes("Terasi") || i.item.includes("Kunyit") || i.item.includes("Ketumbar") || i.item.includes("Pala") || i.item.includes("Bawang") || i.item.includes("Kerupuk") || i.item.includes("Kornet") || i.item.includes("Indomie")) return "Bahan Pokok";
    if (i.item.includes("Cup") || i.item.includes("Box") || i.item.includes("Sedotan") || i.item.includes("Kertas") || i.item.includes("Kresek")) return "Kemasan";
    if (i.item.includes("Sunlight") || i.item.includes("Soklin")) return "Kebersihan";
    return "Lainnya";
  }))];

  const getCat = (item) => {
    if (["Pop Ice", "Coca Cola", "Sprite", "Fanta", "Schweppers", "A&W", "Kratindeng", "Ektrajos"].includes(item)) return "Minuman Jadi";
    if (item.includes("Milo") || item.includes("Dancow") || item.includes("Good Day") || item.includes("Chocolatos") || item.includes("Bengbeng") || item.includes("Ovaltine")) return "Sachet/Renteng";
    if (item.includes("Sirup") || item.includes("Powder") || item.includes("Houseblend") || item.includes("Simple") || item.includes("Creamer") || item.includes("Crunch") || item.includes("Tiramisu")) return "Bahan Bar";
    if (item.includes("SKM") || item.includes("UHT") || item.includes("Keju") || item.includes("Mayzena")) return "Susu & Keju";
    if (item.includes("Terigu") || item.includes("Minyak") || item.includes("Beras") || item.includes("Rose") || item.includes("Racik") || item.includes("Kari") || item.includes("Mentega") || item.includes("Kornet") || item.includes("Indomie") || item.includes("Kerupuk")) return "Bahan Pokok";
    if (item.includes("Cup") || item.includes("Box") || item.includes("Sedotan") || item.includes("Kertas") || item.includes("Kresek")) return "Kemasan";
    if (item.includes("Sunlight") || item.includes("Soklin")) return "Kebersihan";
    return "Lainnya";
  };

  const filtered = cat === "all" ? STOCK_BAR : STOCK_BAR.filter(i => getCat(i.item) === cat);

  return (
    <div className="pe">
      <div className="grid g3">
        <StatCard icon="📦" bg="var(--acg)" label="Total Jenis Item" value={STOCK_BAR.length} glow="var(--ac)" />
        <StatCard icon="💰" bg="var(--gng)" label="Total Nilai Stok" value={rp(totalValue)} sub="Stok di gudang bar" glow="var(--gn)" />
        <StatCard icon="🏷️" bg="var(--blg)" label="Total Unit" value={STOCK_BAR.reduce((s, i) => s + i.qty, 0).toLocaleString()} glow="var(--bl)" />
      </div>

      <div className="tabs">
        <button className={`tab ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>📦 Semua</button>
        {["Minuman Jadi", "Sachet/Renteng", "Bahan Bar", "Susu & Keju", "Bahan Pokok", "Kemasan"].map(c => (
          <button key={c} className={`tab ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="box" style={{ padding: 0 }}>
        <table className="tbl">
          <thead><tr><th>Item</th><th>Satuan</th><th>Kategori</th><th className="r">Qty</th><th className="r">Harga</th><th className="r">Nilai</th></tr></thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{s.item}</td>
                <td><span className="badge b-bl">{s.sat}</span></td>
                <td><span className="badge b-pr">{getCat(s.item)}</span></td>
                <td className="r" style={{ color: s.qty <= 3 ? "var(--rd)" : "var(--t1)", fontWeight: 700 }}>{s.qty}</td>
                <td className="r" style={{ color: "var(--t3)" }}>{rp(s.harga)}</td>
                <td className="r" style={{ fontWeight: 700, color: "var(--ac)" }}>{rp(s.qty * s.harga)}</td>
              </tr>
            ))}
            <tr style={{ background: "var(--acg)" }}>
              <td colSpan={3} style={{ fontWeight: 800, color: "var(--ac)" }}>TOTAL</td>
              <td className="r" style={{ fontWeight: 800 }}>{filtered.reduce((s, i) => s + i.qty, 0)}</td>
              <td className="r">—</td>
              <td className="r" style={{ fontWeight: 800, color: "var(--gn)" }}>{rp(filtered.reduce((s, i) => s + i.qty * i.harga, 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ChannelPage = () => {
  const maxGojek = Math.max(...DAILY.map(d => d.gojekK));
  const maxGrab = Math.max(...DAILY.map(d => d.grabK));
  const maxQris = Math.max(...DAILY.map(d => d.qrisK));
  const totG = DAILY.reduce((s, d) => s + d.gojekK, 0);
  const totGr = DAILY.reduce((s, d) => s + d.grabK, 0);
  const totQ = DAILY.reduce((s, d) => s + d.qrisK, 0);
  const selisihG = DAILY.reduce((s, d) => s + (d.gojekK - d.gojekB), 0);
  const selisihGr = DAILY.reduce((s, d) => s + (d.grabK - d.grabB), 0);
  const selisihQ = DAILY.reduce((s, d) => s + (d.qrisK - d.qrisB), 0);

  return (
    <div className="pe">
      <div className="grid g3">
        <StatCard icon="🟢" bg="var(--gng)" label="GoJek Total (Kotor)" value={rp(totG)} sub={`Selisih potongan: ${rp(selisihG)}`} glow="var(--gn)" />
        <StatCard icon="🟠" bg="var(--acg)" label="Grab Total (Kotor)" value={rp(totGr)} sub={`Selisih potongan: ${rp(selisihGr)}`} glow="var(--ac)" />
        <StatCard icon="📱" bg="var(--prg)" label="QRIS Total (Kotor)" value={rp(totQ)} sub={`Selisih potongan: ${rp(selisihQ)}`} glow="var(--pr)" />
      </div>

      <div className="grid g1">
        <div className="box">
          <div className="box-t">📱 QRIS Harian (Kotor)</div>
          <div className="bars" style={{ height: 120 }}>
            {DAILY.map((d, i) => (
              <div key={i} className="bar-c">
                <div className="bar-v">{(d.qrisK / 1e6).toFixed(1)}</div>
                <div className="bar" style={{ height: `${(d.qrisK / maxQris) * 100}px`, background: 'linear-gradient(180deg,var(--pr),#6D28D9)' }} />
                <div className="bar-l">{d.date.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid g2">
        <div className="box">
          <div className="box-t">🟢 GoJek Harian</div>
          <div className="bars" style={{ height: 100 }}>
            {DAILY.map((d, i) => (
              <div key={i} className="bar-c">
                <div className="bar" style={{ height: `${maxGojek ? (d.gojekK / maxGojek) * 80 : 0}px`, background: 'linear-gradient(180deg,#22C55E,#16A34A)' }} />
                <div className="bar-l">{d.date.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="box">
          <div className="box-t">🟠 Grab Harian</div>
          <div className="bars" style={{ height: 100 }}>
            {DAILY.map((d, i) => (
              <div key={i} className="bar-c">
                <div className="bar" style={{ height: `${maxGrab ? (d.grabK / maxGrab) * 80 : 0}px`, background: 'linear-gradient(180deg,var(--ac),#EA580C)' }} />
                <div className="bar-l">{d.date.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-t">💡 Insight Potongan Platform</div>
        <div style={{ fontSize: 11, color: "var(--t3)", lineHeight: 1.8, padding: "4px 0" }}>
          <div>Pajak Grab/GoJek 30%: <b style={{ color: "var(--rd)", fontFamily: "var(--fm)" }}>Rp380.844</b></div>
          <div>Total selisih kotor-bersih semua channel: <b style={{ color: "var(--rd)", fontFamily: "var(--fm)" }}>{rp(selisihG + selisihGr + selisihQ)}</b></div>
          <div>QRIS memiliki selisih paling kecil — platform paling efisien</div>
        </div>
      </div>
    </div>
  );
};

const ExpensePage = () => {
  const maxExp = Math.max(...DAILY.map(d => d.bahanPokok + d.ops + d.aset + d.lain));
  return (
    <div className="pe">
      <div className="grid g4">
        <StatCard icon="🥬" bg="var(--rdg)" label="Bahan Pokok" value={rp(DAILY.reduce((s, d) => s + d.bahanPokok, 0))} glow="var(--rd)" />
        <StatCard icon="⚙️" bg="var(--ylg)" label="Operasional" value={rp(DAILY.reduce((s, d) => s + d.ops, 0))} glow="var(--yl)" />
        <StatCard icon="🏗️" bg="var(--cng)" label="Aset" value={rp(DAILY.reduce((s, d) => s + d.aset, 0))} glow="var(--cn)" />
        <StatCard icon="📎" bg="var(--pkg)" label="Lain-lain" value={rp(DAILY.reduce((s, d) => s + d.lain, 0))} sub="THR, kasbon, casual, dll" glow="var(--pk)" />
      </div>

      <div className="box">
        <div className="box-t">📤 Pengeluaran Harian (Breakdown)</div>
        <div className="bars" style={{ height: 160 }}>
          {DAILY.map((d, i) => {
            const total = d.bahanPokok + d.ops + d.aset + d.lain;
            return (
              <div key={i} className="bar-c">
                <div className="bar-v">{(total / 1e6).toFixed(1)}</div>
                <div className="bar" style={{ height: `${(total / maxExp) * 130}px`, background: total >= 3000000 ? 'linear-gradient(180deg,var(--rd),#DC2626)' : 'linear-gradient(180deg,var(--yl),#D97706)' }} />
                <div className="bar-l">{d.date.split(" ")[0]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", fontSize: 10, color: "var(--t4)", marginTop: 6 }}>(juta Rp) • 🔴 ≥ 3jt • 🟡 &lt; 3jt</div>
      </div>

      <div className="box">
        <div className="box-t">📊 Detail per Hari</div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead><tr><th>Tanggal</th><th className="r">Bahan Pokok</th><th className="r">Operasional</th><th className="r">Aset</th><th className="r">Lain-lain</th><th className="r">TOTAL</th><th className="r">% dari Omset</th></tr></thead>
            <tbody>{DAILY.map((d, i) => {
              const tot = d.bahanPokok + d.ops + d.aset + d.lain;
              const pctVal = d.omset ? (tot / d.omset * 100).toFixed(0) : 0;
              return (
                <tr key={i} className={tot >= 3000000 ? "highlight" : ""}>
                  <td style={{ fontWeight: 600 }}>{d.date}</td>
                  <td className="r" style={{ color: "var(--rd)" }}>{rp(d.bahanPokok)}</td>
                  <td className="r" style={{ color: "var(--yl)" }}>{rp(d.ops)}</td>
                  <td className="r" style={{ color: d.aset ? "var(--cn)" : "var(--t4)" }}>{d.aset ? rp(d.aset) : "—"}</td>
                  <td className="r" style={{ color: d.lain ? "var(--pk)" : "var(--t4)" }}>{d.lain ? rp(d.lain) : "—"}</td>
                  <td className="r" style={{ fontWeight: 700 }}>{rp(tot)}</td>
                  <td className="r"><span className={`badge ${pctVal > 100 ? "b-rd" : pctVal > 70 ? "b-yl" : "b-gn"}`}>{pctVal}%</span></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function WarmindoDashboard() {
  const [page, setPage] = useState("overview");
  const [synced, setSynced] = useState(false);

  // Seed hardcoded data to Supabase on first mount
  useEffect(() => {
    if (!window.WDB) return;
    const MO = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
    const parseD = d => { const p = d.split(' '); const day = p[0].padStart(2, '0'); const mon = MO[p[1]]; const yr = mon >= '03' ? '2026' : '2026'; return yr + '-' + mon + '-' + day; };
    const rows = DAILY.map(d => ({
      date: parseD(d.date), day_name: d.day, branch_id: 'hq', omset: d.omset,
      gojek_komisi: d.gojekK, gojek_bersih: d.gojekB, grab_komisi: d.grabK, grab_bersih: d.grabB,
      qris_komisi: d.qrisK, qris_bersih: d.qrisB, bahan_pokok: d.bahanPokok,
      operasional: d.ops, aset: d.aset, lain_lain: d.lain, sisa: d.sisa,
    }));
    window.WDB.seedDaily(rows, ok => { if (ok) setSynced(true); });
    const stockRows = STOCK_BAR.map((s, i) => ({
      item_name: s.item, unit: s.sat, qty: s.qty, price: s.harga, branch_id: 'hq',
    }));
    window.WDB.seedStock(stockRows);
  }, []);

  const nav = [
    { id: "overview", emoji: "📊", label: "Overview" },
    { id: "daily", emoji: "📅", label: "Daily Report" },
    { id: "channel", emoji: "💳", label: "Channel Sales" },
    { id: "expense", emoji: "📤", label: "Pengeluaran" },
    { id: "payroll", emoji: "👥", label: "Payroll" },
    { id: "stock", emoji: "📦", label: "Stok Gudang" },
  ];

  const titles = {
    overview: "Dashboard Overview",
    daily: "Daily Report",
    channel: "GoJek / Grab / QRIS",
    expense: "Pengeluaran",
    payroll: "Payroll & Kasbon",
    stock: "Stok Bahan Gudang",
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <nav className="sb">
          <div className="sb-logo">
            <div className="sb-logo-icon">🔥</div>
            <div>
              <div className="sb-logo-text">Warmindo</div>
              <div className="sb-logo-sub">FINANCIAL DASHBOARD</div>
            </div>
          </div>

          <div className="sb-section">
            <div className="sb-label">Analytics</div>
            {nav.map(n => (
              <div key={n.id} className={`sb-item ${page === n.id ? "on" : ""}`} onClick={() => setPage(n.id)}>
                <span className="emoji">{n.emoji}</span>
                <span>{n.label}</span>
              </div>
            ))}
          </div>

          <div className="sb-sp" />

          <div className="sb-footer">
            <div className="sb-footer-text">
              📄 Data: Daily Report<br />
              📅 11 Mar – 5 Apr 2026<br />
              💰 Total Omset: Rp76.61 juta<br />
              🏦 Saldo: Rp1.246.726
            </div>
          </div>
        </nav>

        <div className="main">
          <header className="hdr">
            <div className="hdr-title">{titles[page]}</div>
            <div className="hdr-badge">{synced ? "☁️ SYNCED" : "DATA RIIL"}</div>
            <div className="hdr-sp" />
            <div className="hdr-period">📅 11 Mar – 5 Apr 2026</div>
          </header>
          <div className="content">
            {page === "overview" && <OverviewPage />}
            {page === "daily" && <DailyPage />}
            {page === "channel" && <ChannelPage />}
            {page === "expense" && <ExpensePage />}
            {page === "payroll" && <PayrollPage />}
            {page === "stock" && <StockPage />}
          </div>
        </div>
      </div>
    </>
  );
}
