import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
// WARMINDO POS v2.0 — Multi-Cabang • QRIS • Payment Gateway Komplit
// Aplikasi Kasir Premium untuk Warung Makan Indonesia
// ═══════════════════════════════════════════════════════════════════

// ─── CONSTANTS & DATA ──────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", name: "Semua", icon: "🍽️" },
  { id: "indomie", name: "Indomie", icon: "🍜" },
  { id: "nasi", name: "Nasi", icon: "🍚" },
  { id: "gorengan", name: "Gorengan", icon: "🍤" },
  { id: "minuman", name: "Minuman", icon: "🥤" },
  { id: "snack", name: "Snack", icon: "🍢" },
  { id: "extra", name: "Topping", icon: "➕" },
];

const PRODUCTS = [
  { id: 1, name: "Indomie Goreng", price: 8000, cat: "indomie", stock: 50, img: "🍜" },
  { id: 2, name: "Indomie Rebus", price: 8000, cat: "indomie", stock: 50, img: "🍜" },
  { id: 3, name: "Indomie Goreng Telur", price: 12000, cat: "indomie", stock: 40, img: "🍳" },
  { id: 4, name: "Indomie Rebus Telur", price: 12000, cat: "indomie", stock: 40, img: "🍳" },
  { id: 5, name: "Indomie Double", price: 14000, cat: "indomie", stock: 30, img: "🍜" },
  { id: 6, name: "Indomie Nyemek", price: 10000, cat: "indomie", stock: 35, img: "🍜" },
  { id: 7, name: "Indomie Seblak", price: 13000, cat: "indomie", stock: 25, img: "🌶️" },
  { id: 8, name: "Mie Goreng Jawa", price: 15000, cat: "indomie", stock: 20, img: "🍝" },
  { id: 9, name: "Nasi Goreng", price: 15000, cat: "nasi", stock: 30, img: "🍛" },
  { id: 10, name: "Nasi Telur", price: 10000, cat: "nasi", stock: 40, img: "🍚" },
  { id: 11, name: "Nasi Putih", price: 5000, cat: "nasi", stock: 60, img: "🍚" },
  { id: 12, name: "Nasi Uduk", price: 8000, cat: "nasi", stock: 25, img: "🍚" },
  { id: 13, name: "Nasi Kuning", price: 10000, cat: "nasi", stock: 20, img: "🍛" },
  { id: 14, name: "Tempe Goreng", price: 3000, cat: "gorengan", stock: 40, img: "🟫" },
  { id: 15, name: "Tahu Goreng", price: 3000, cat: "gorengan", stock: 40, img: "🟨" },
  { id: 16, name: "Bakwan", price: 3000, cat: "gorengan", stock: 30, img: "🍤" },
  { id: 17, name: "Pisang Goreng", price: 4000, cat: "gorengan", stock: 25, img: "🍌" },
  { id: 18, name: "Mendoan", price: 4000, cat: "gorengan", stock: 30, img: "🟫" },
  { id: 19, name: "Es Teh Manis", price: 5000, cat: "minuman", stock: 80, img: "🧊" },
  { id: 20, name: "Teh Anget", price: 4000, cat: "minuman", stock: 80, img: "☕" },
  { id: 21, name: "Es Jeruk", price: 6000, cat: "minuman", stock: 50, img: "🍊" },
  { id: 22, name: "Kopi Hitam", price: 5000, cat: "minuman", stock: 60, img: "☕" },
  { id: 23, name: "Es Kopi Susu", price: 10000, cat: "minuman", stock: 40, img: "🧋" },
  { id: 24, name: "Air Mineral", price: 4000, cat: "minuman", stock: 100, img: "💧" },
  { id: 25, name: "Susu Coklat", price: 8000, cat: "minuman", stock: 30, img: "🥛" },
  { id: 26, name: "Kerupuk", price: 2000, cat: "snack", stock: 60, img: "🍘" },
  { id: 27, name: "Sate Telur Puyuh", price: 5000, cat: "snack", stock: 30, img: "🍢" },
  { id: 28, name: "Otak-otak", price: 4000, cat: "snack", stock: 25, img: "🍢" },
  { id: 29, name: "Telur Ceplok", price: 5000, cat: "extra", stock: 50, img: "🍳" },
  { id: 30, name: "Kornet", price: 5000, cat: "extra", stock: 30, img: "🥫" },
  { id: 31, name: "Sosis", price: 5000, cat: "extra", stock: 30, img: "🌭" },
  { id: 32, name: "Keju", price: 4000, cat: "extra", stock: 20, img: "🧀" },
];

const INITIAL_BRANCHES = [
  { id: "hq", name: "Warmindo Pusat", address: "Jl. Raya Ciputat No. 88", city: "Tangerang Selatan", phone: "0812-3456-7890", isHQ: true, active: true },
  { id: "br1", name: "Warmindo Cabang Pamulang", address: "Jl. Pamulang Raya No. 12", city: "Tangerang Selatan", phone: "0813-1111-2222", isHQ: false, active: true },
  { id: "br2", name: "Warmindo Cabang Depok", address: "Jl. Margonda No. 45", city: "Depok", phone: "0814-3333-4444", isHQ: false, active: true },
];

const ORDER_TYPES = [
  { id: "dine_in", label: "Dine In", icon: "🪑", color: "#3B82F6" },
  { id: "take_away", label: "Bungkus", icon: "📦", color: "#F59E0B" },
  { id: "gofood", label: "GoFood", icon: "🟢", color: "#22C55E" },
  { id: "grab", label: "GrabFood", icon: "🟠", color: "#F97316" },
  { id: "shopee", label: "ShopeeFood", icon: "🔴", color: "#EF4444" },
];

const PAYMENT_METHODS = [
  { id: "cash", label: "Tunai", icon: "💵", group: "cash", color: "#22C55E" },
  { id: "qris", label: "QRIS", icon: "📱", group: "digital", color: "#8B5CF6" },
  { id: "gopay", label: "GoPay", icon: "🟢", group: "ewallet", color: "#00AED6" },
  { id: "ovo", label: "OVO", icon: "🟣", group: "ewallet", color: "#7C3AED" },
  { id: "dana", label: "DANA", icon: "🔵", group: "ewallet", color: "#3B82F6" },
  { id: "shopeepay", label: "ShopeePay", icon: "🔴", group: "ewallet", color: "#EF4444" },
  { id: "bca", label: "BCA", icon: "🏦", group: "bank", color: "#1E40AF" },
  { id: "bri", label: "BRI", icon: "🏦", group: "bank", color: "#1D4ED8" },
  { id: "mandiri", label: "Mandiri", icon: "🏦", group: "bank", color: "#0369A1" },
  { id: "bsi", label: "BSI", icon: "🏦", group: "bank", color: "#059669" },
  { id: "gofood_pay", label: "Via GoFood", icon: "🟢", group: "platform", color: "#22C55E" },
  { id: "grab_pay", label: "Via GrabFood", icon: "🟠", group: "platform", color: "#F97316" },
];

const PAY_GROUPS = [
  { id: "cash", label: "Tunai" },
  { id: "digital", label: "QRIS" },
  { id: "ewallet", label: "E-Wallet" },
  { id: "bank", label: "Transfer Bank" },
  { id: "platform", label: "Platform" },
];

// ─── UTILITIES ─────────────────────────────────────────────────────
const rp = (n) => "Rp" + (n || 0).toLocaleString("id-ID");
const fmtTime = (d) => new Date(d).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const fmtFull = (d) => fmtDate(d) + " " + fmtTime(d);
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const todayKey = () => new Date().toISOString().split("T")[0];
const useLS = (k, init) => {
  const [v, s] = useState(() => { try { const x = localStorage.getItem(k); return x ? JSON.parse(x) : init; } catch { return init; } });
  useEffect(() => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }, [k, v]);
  return [v, s];
};

// ─── QR CODE GENERATOR (pure SVG) ─────────────────────────────────
function generateQRModules(data) {
  // Simple QR-like pattern generator for visual simulation
  const size = 25;
  const modules = [];
  let seed = 0;
  for (let i = 0; i < data.length; i++) seed = ((seed << 5) - seed + data.charCodeAt(i)) | 0;
  const rng = () => { seed = (seed * 16807) % 2147483647; return (seed & 0x7fffffff) / 0x7fffffff; };
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Finder patterns (3 corners)
      const inFinderTL = x < 7 && y < 7;
      const inFinderTR = x >= size - 7 && y < 7;
      const inFinderBL = x < 7 && y >= size - 7;
      if (inFinderTL || inFinderTR || inFinderBL) {
        const fx = inFinderTL ? 0 : inFinderTR ? size - 7 : 0;
        const fy = inFinderTL ? 0 : inFinderTR ? 0 : size - 7;
        const lx = x - fx, ly = y - fy;
        const isOuter = lx === 0 || lx === 6 || ly === 0 || ly === 6;
        const isInner = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
        if (isOuter || isInner) modules.push({ x, y, on: true });
        else modules.push({ x, y, on: false });
      } else {
        modules.push({ x, y, on: rng() > 0.5 });
      }
    }
  }
  return { modules, size };
}

const QRCode = ({ data, size = 200, fgColor = "#000", bgColor = "#FFF" }) => {
  const { modules, size: qrSize } = useMemo(() => generateQRModules(data || "WARMINDO"), [data]);
  const cellSize = size / (qrSize + 2);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 12 }}>
      <rect width={size} height={size} fill={bgColor} rx={12} />
      {modules.filter(m => m.on).map((m, i) => (
        <rect key={i} x={(m.x + 1) * cellSize} y={(m.y + 1) * cellSize} width={cellSize - 0.5} height={cellSize - 0.5} fill={fgColor} rx={1} />
      ))}
      {/* Center logo */}
      <rect x={size/2 - 18} y={size/2 - 18} width={36} height={36} fill={bgColor} rx={8} />
      <text x={size/2} y={size/2 + 7} textAnchor="middle" fontSize="20" fontFamily="sans-serif">🔥</text>
    </svg>
  );
};

// ─── SVG ICONS ─────────────────────────────────────────────────────
const I = ({ d, s = 20, sw = 2, ...p }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...p}><path d={d}/></svg>
);
const Icons = {
  home: (s) => <I s={s} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" />,
  search: (s) => <I s={s} d="M21 21l-4.35-4.35 M11 19a8 8 0 100-16 8 8 0 000 16z" />,
  cart: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  chart: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  box: (s) => <I s={s} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12" />,
  clock: (s) => <I s={s} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2" />,
  settings: (s) => <I s={s} d="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />,
  plus: (s) => <I s={s} d="M12 5v14 M5 12h14" />,
  minus: (s) => <I s={s} d="M5 12h14" />,
  trash: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  check: (s) => <I s={s} d="M20 6L9 17l-5-5" />,
  x: (s) => <I s={s} d="M18 6L6 18 M6 6l12 12" />,
  building: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>,
  chevDown: (s) => <I s={s} d="M6 9l6 6 6-6" />,
  wallet: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  printer: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  refresh: (s) => <I s={s} d="M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15" />,
  copy: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
};

// ─── STYLES ────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
:root {
  --bg-0: #06080F;
  --bg-1: #0C1017;
  --bg-2: #131924;
  --bg-3: #1B2333;
  --bg-4: #243044;
  --bg-hover: #1F2A3E;
  --bdr: #1E293B;
  --bdr2: #2A3550;
  --t1: #F8FAFC;
  --t2: #CBD5E1;
  --t3: #64748B;
  --t4: #475569;
  --accent: #F97316;
  --accent2: #FB923C;
  --accent-g: rgba(249,115,22,0.12);
  --green: #22C55E;
  --green-g: rgba(34,197,94,0.12);
  --red: #EF4444;
  --red-g: rgba(239,68,68,0.12);
  --blue: #3B82F6;
  --blue-g: rgba(59,130,246,0.12);
  --purple: #8B5CF6;
  --purple-g: rgba(139,92,246,0.12);
  --yellow: #F59E0B;
  --yellow-g: rgba(245,158,11,0.12);
  --r1: 8px; --r2: 12px; --r3: 16px; --r4: 20px;
  --f: 'DM Sans', sans-serif;
  --fm: 'Space Mono', monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
.W{font-family:var(--f);background:var(--bg-0);color:var(--t1);min-height:100vh;display:flex;overflow:hidden}

/* Sidebar */
.S{width:68px;background:var(--bg-1);border-right:1px solid var(--bdr);display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:2px;flex-shrink:0;z-index:100}
.S-logo{width:42px;height:42px;background:linear-gradient(135deg,#F97316,#DC2626);border-radius:var(--r2);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px;box-shadow:0 4px 20px rgba(249,115,22,0.35)}
.S-btn{width:44px;height:44px;border:none;background:transparent;color:var(--t4);border-radius:var(--r2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;position:relative}
.S-btn:hover{background:var(--bg-3);color:var(--t3)}
.S-btn.on{background:var(--accent-g);color:var(--accent)}
.S-btn.on::after{content:'';position:absolute;left:-10px;width:3px;height:20px;background:var(--accent);border-radius:0 3px 3px 0}
.S-badge{position:absolute;top:2px;right:2px;background:var(--red);color:#fff;font-size:9px;font-weight:800;min-width:16px;height:16px;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 3px}
.S-sp{flex:1}

/* Main */
.M{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

/* Topbar */
.T{height:60px;background:var(--bg-1);border-bottom:1px solid var(--bdr);display:flex;align-items:center;padding:0 20px;gap:12px;flex-shrink:0}
.T-title{font-size:17px;font-weight:800;letter-spacing:-0.02em}
.T-sub{font-size:11px;color:var(--t4);font-weight:500}
.T-sp{flex:1}
.T-clock{font-family:var(--fm);font-size:12px;color:var(--t3);background:var(--bg-2);padding:6px 12px;border-radius:var(--r1);border:1px solid var(--bdr)}
.T-branch{display:flex;align-items:center;gap:8px;padding:6px 14px;background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r1);cursor:pointer;color:var(--t2);font-size:13px;font-weight:600;transition:all .15s}
.T-branch:hover{border-color:var(--accent);color:var(--accent)}
.T-branch .dot{width:8px;height:8px;border-radius:50%;background:var(--green)}
.T-user{display:flex;align-items:center;gap:8px;padding:6px 12px;background:var(--bg-2);border-radius:var(--r1);border:1px solid var(--bdr)}
.T-av{width:26px;height:26px;background:linear-gradient(135deg,var(--accent),#DC2626);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800}

/* Search */
.SB{position:relative;flex:1;max-width:360px}
.SB input{width:100%;height:38px;background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r1);padding:0 14px 0 36px;font-family:var(--f);font-size:13px;color:var(--t1);outline:none;transition:border .2s}
.SB input::placeholder{color:var(--t4)}
.SB input:focus{border-color:var(--accent)}
.SB-i{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--t4);pointer-events:none}

/* Layout */
.PB{flex:1;display:flex;overflow:hidden}

/* POS */
.PP{flex:1;display:flex;flex-direction:column;overflow:hidden;padding:16px 20px;gap:12px}
.PC{width:370px;background:var(--bg-1);border-left:1px solid var(--bdr);display:flex;flex-direction:column;flex-shrink:0}

/* Category Pills */
.cats{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;flex-shrink:0}
.cats::-webkit-scrollbar{height:0}
.cat{display:flex;align-items:center;gap:5px;padding:7px 14px;border:1px solid var(--bdr);background:var(--bg-2);color:var(--t3);border-radius:999px;cursor:pointer;font-family:var(--f);font-size:12px;font-weight:600;white-space:nowrap;transition:all .2s}
.cat:hover{border-color:var(--t4)}
.cat.on{background:var(--accent);border-color:var(--accent);color:#fff}

/* Product Grid */
.PG{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:10px;overflow-y:auto;flex:1;padding-right:6px;padding-bottom:12px}
.PG::-webkit-scrollbar{width:3px}
.PG::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:3px}
.pd{background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r2);padding:12px;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;gap:6px;position:relative;overflow:hidden}
.pd:hover{border-color:var(--accent);background:var(--bg-hover);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3)}
.pd.off{opacity:.35;pointer-events:none}
.pd-e{font-size:32px;text-align:center;padding:6px 0;filter:drop-shadow(0 2px 4px rgba(0,0,0,.2))}
.pd-n{font-size:12px;font-weight:600;line-height:1.3}
.pd-p{font-family:var(--fm);font-size:13px;color:var(--accent);font-weight:700}
.pd-s{font-size:10px;color:var(--t4)}
.pd-q{position:absolute;top:6px;right:6px;background:var(--accent);color:#fff;font-size:11px;font-weight:800;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(249,115,22,.4)}

/* Cart */
.CH{padding:14px 18px;border-bottom:1px solid var(--bdr)}
.CH-r{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.CH-t{font-size:15px;font-weight:800}
.CH-c{font-size:11px;color:var(--accent);background:var(--accent-g);padding:2px 8px;border-radius:999px;font-weight:700}
.CH-clr{background:none;border:none;color:var(--red);font-size:11px;font-family:var(--f);font-weight:600;cursor:pointer;padding:4px 8px;border-radius:6px}
.CH-clr:hover{background:var(--red-g)}
.OT{display:flex;gap:4px}
.OT-b{flex:1;padding:5px 3px;background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r1);color:var(--t4);font-size:9px;font-family:var(--f);font-weight:600;cursor:pointer;text-align:center;transition:all .2s;line-height:1.3}
.OT-b:hover{border-color:var(--t4)}
.OT-b.on{background:var(--accent-g);border-color:var(--accent);color:var(--accent)}
.OT-i{font-size:14px;display:block;margin-bottom:1px}

/* Cart Items */
.CI{flex:1;overflow-y:auto;padding:10px 18px}
.CI::-webkit-scrollbar{width:3px}
.CI::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:3px}
.ce{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:10px;color:var(--t4)}
.ci{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--bdr);animation:fsi .25s ease}
@keyframes fsi{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
.ci-e{font-size:22px;padding-top:2px}
.ci-i{flex:1;min-width:0}
.ci-n{font-size:12px;font-weight:600;margin-bottom:2px}
.ci-p{font-size:11px;color:var(--t4);font-family:var(--fm)}
.ci-st{font-size:12px;font-weight:700;color:var(--accent);font-family:var(--fm);text-align:right;white-space:nowrap}
.ci-ctr{display:flex;align-items:center;gap:6px;margin-top:5px}
.qb{width:26px;height:26px;border-radius:50%;border:1px solid var(--bdr);background:var(--bg-4);color:var(--t1);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.qb:hover{border-color:var(--accent);color:var(--accent)}
.qb.dng:hover{border-color:var(--red);color:var(--red)}
.qv{font-size:13px;font-weight:700;font-family:var(--fm);min-width:18px;text-align:center}
.ci-nb{background:none;border:none;color:var(--t4);font-size:10px;cursor:pointer;font-family:var(--f);padding:2px 4px;border-radius:3px}
.ci-nb:hover{background:var(--bg-4);color:var(--t2)}
.ci-note{font-size:10px;color:var(--yellow);font-style:italic;margin-top:3px;padding:3px 6px;background:var(--yellow-g);border-radius:4px}

/* Cart Footer */
.CF{padding:14px 18px;border-top:1px solid var(--bdr);background:var(--bg-1)}
.CF-r{display:flex;justify-content:space-between;font-size:12px;color:var(--t3);margin-bottom:6px}
.CF-t{display:flex;justify-content:space-between;font-size:17px;font-weight:800;margin:10px 0 14px;padding-top:10px;border-top:2px dashed var(--bdr2)}
.CF-ta{font-family:var(--fm);color:var(--accent)}

/* Buttons */
.bp{width:100%;height:46px;background:linear-gradient(135deg,var(--accent),#EA580C);color:#fff;border:none;border-radius:var(--r2);font-family:var(--f);font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 4px 16px rgba(249,115,22,.3)}
.bp:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(249,115,22,.4)}
.bp:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
.bs{width:100%;height:40px;background:var(--bg-2);color:var(--t1);border:1px solid var(--bdr);border-radius:var(--r2);font-family:var(--f);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:6px}
.bs:hover{border-color:var(--t4)}

/* Modal */
.MO{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000;animation:fi .2s ease}
@keyframes fi{from{opacity:0}to{opacity:1}}
.ML{background:var(--bg-1);border:1px solid var(--bdr);border-radius:var(--r4);padding:24px;width:92%;max-width:520px;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:su .3s ease}
.ML::-webkit-scrollbar{width:3px}
.ML::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:3px}
@keyframes su{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.ML-t{font-size:18px;font-weight:800;margin-bottom:18px;display:flex;align-items:center;gap:8px;letter-spacing:-0.02em}
.ML-x{margin-left:auto;background:none;border:none;color:var(--t4);cursor:pointer;padding:4px;border-radius:8px}
.ML-x:hover{background:var(--bg-3);color:var(--t1)}

/* Payment */
.PG-tabs{display:flex;gap:4px;margin-bottom:14px;overflow-x:auto;padding-bottom:2px}
.PG-tabs::-webkit-scrollbar{height:0}
.PG-tab{padding:6px 12px;border:1px solid var(--bdr);background:var(--bg-2);color:var(--t4);border-radius:999px;font-size:11px;font-weight:600;font-family:var(--f);cursor:pointer;white-space:nowrap;transition:all .15s}
.PG-tab:hover{border-color:var(--t4)}
.PG-tab.on{background:var(--accent-g);border-color:var(--accent);color:var(--accent)}
.PM{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:16px}
.PM-b{padding:10px 6px;background:var(--bg-2);border:2px solid var(--bdr);border-radius:var(--r2);color:var(--t3);font-size:11px;font-weight:600;font-family:var(--f);cursor:pointer;text-align:center;transition:all .2s}
.PM-b:hover{border-color:var(--t4)}
.PM-b.on{border-color:var(--accent);background:var(--accent-g);color:var(--accent)}
.PM-i{font-size:22px;display:block;margin-bottom:3px}
.PI{width:100%;height:46px;background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r2);padding:0 14px;font-family:var(--fm);font-size:16px;font-weight:700;color:var(--t1);outline:none;margin-bottom:10px;text-align:right}
.PI:focus{border-color:var(--accent)}
.QC{display:flex;gap:5px;margin-bottom:14px;flex-wrap:wrap}
.QC button{flex:1;min-width:64px;padding:7px;background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r1);color:var(--t3);font-family:var(--fm);font-size:11px;font-weight:600;cursor:pointer;transition:all .15s}
.QC button:hover{border-color:var(--accent);color:var(--accent)}

/* QRIS Display */
.qris-box{text-align:center;padding:20px;background:var(--bg-2);border-radius:var(--r3);margin-bottom:16px;border:1px solid var(--bdr)}
.qris-label{font-size:12px;color:var(--t3);margin-bottom:4px}
.qris-merchant{font-size:14px;font-weight:700;margin-bottom:12px}
.qris-amount{font-size:28px;font-weight:900;color:var(--accent);font-family:var(--fm);margin-bottom:16px}
.qris-timer{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:var(--yellow-g);color:var(--yellow);font-size:12px;font-weight:700;border-radius:999px;margin-top:12px}
.qris-logos{display:flex;justify-content:center;gap:12px;margin-top:12px;font-size:11px;color:var(--t4)}
.qris-logos span{display:flex;align-items:center;gap:4px;padding:4px 10px;background:var(--bg-3);border-radius:6px}
.qris-nmid{font-family:var(--fm);font-size:10px;color:var(--t4);margin-top:8px}

/* EWallet Display */
.ew-box{text-align:center;padding:20px;background:var(--bg-2);border-radius:var(--r3);margin-bottom:16px;border:1px solid var(--bdr)}
.ew-icon{font-size:48px;margin-bottom:8px}
.ew-name{font-size:16px;font-weight:700;margin-bottom:4px}
.ew-phone{font-family:var(--fm);font-size:14px;color:var(--t3);margin-bottom:8px}
.ew-status{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:999px;font-size:13px;font-weight:700}

/* Bank Transfer */
.bt-box{padding:16px;background:var(--bg-2);border-radius:var(--r3);margin-bottom:16px;border:1px solid var(--bdr)}
.bt-bank{font-size:15px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.bt-row{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg-3);border-radius:var(--r1);margin-bottom:8px}
.bt-label{font-size:11px;color:var(--t4);margin-bottom:2px}
.bt-val{font-family:var(--fm);font-size:15px;font-weight:700}
.bt-copy{background:none;border:1px solid var(--bdr);color:var(--t2);padding:6px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-family:var(--f);font-weight:600;display:flex;align-items:center;gap:4px;transition:all .15s}
.bt-copy:hover{border-color:var(--accent);color:var(--accent)}

/* Change */
.chg{text-align:center;padding:14px;background:var(--green-g);border-radius:var(--r2);margin-bottom:14px}
.chg-l{font-size:12px;color:var(--green);margin-bottom:4px}
.chg-a{font-size:26px;font-weight:800;color:var(--green);font-family:var(--fm)}

/* Receipt */
.RB{background:#FFF;color:#111;border-radius:var(--r2);padding:20px;font-size:11px;margin-bottom:14px;font-family:var(--fm)}
.RB-h{text-align:center;margin-bottom:14px}
.RB-sn{font-size:16px;font-weight:800;font-family:var(--f)}
.RB-hr{border:none;border-top:1px dashed #CCC;margin:8px 0}
.RB-row{display:flex;justify-content:space-between;padding:2px 0}
.RB-ir{padding:3px 0}
.RB-iq{color:#666}
.RB-tr{font-weight:700;font-size:13px;padding:5px 0}
.RB-ft{text-align:center;margin-top:10px;color:#888;font-size:10px}

/* Stats */
.SG{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;padding:16px 20px}
.SC{background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r3);padding:16px;display:flex;flex-direction:column;gap:6px}
.SC-ir{display:flex;align-items:center;justify-content:space-between}
.SC-ib{width:36px;height:36px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;font-size:18px}
.SC-l{font-size:12px;color:var(--t4);font-weight:500}
.SC-v{font-size:22px;font-weight:800;font-family:var(--fm)}

/* Tables */
.TBL{width:100%;border-collapse:separate;border-spacing:0}
.TBL th{text-align:left;font-size:10px;font-weight:600;color:var(--t4);text-transform:uppercase;letter-spacing:.05em;padding:10px 14px;border-bottom:1px solid var(--bdr);background:var(--bg-0);position:sticky;top:0;z-index:1}
.TBL td{padding:10px 14px;font-size:12px;border-bottom:1px solid var(--bdr);vertical-align:middle}
.TBL tr:hover td{background:var(--bg-2)}
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600}
.b-grn{background:var(--green-g);color:var(--green)}
.b-blu{background:var(--blue-g);color:var(--blue)}
.b-ylw{background:var(--yellow-g);color:var(--yellow)}
.b-prp{background:var(--purple-g);color:var(--purple)}
.b-red{background:var(--red-g);color:var(--red)}

/* Page scroll */
.pg{flex:1;overflow-y:auto;padding:16px 20px}
.pg::-webkit-scrollbar{width:4px}
.pg::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:4px}
.pg-t{font-size:18px;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px;letter-spacing:-0.02em}

/* Branch cards */
.br-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:20px}
.br-card{background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r3);padding:18px;transition:all .2s;cursor:pointer;position:relative}
.br-card:hover{border-color:var(--accent);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3)}
.br-card.sel{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent-g)}
.br-hq{position:absolute;top:10px;right:10px;background:var(--accent-g);color:var(--accent);font-size:9px;font-weight:700;padding:3px 8px;border-radius:999px}
.br-name{font-size:15px;font-weight:700;margin-bottom:4px}
.br-addr{font-size:12px;color:var(--t4);margin-bottom:8px;line-height:1.4}
.br-stats{display:flex;gap:12px}
.br-stat{font-size:11px;color:var(--t3)}
.br-stat b{color:var(--t1);font-family:var(--fm)}
.br-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:4px}

/* Charts */
.chart-box{background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r3);padding:18px;margin-bottom:16px}
.chart-t{font-size:14px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.bars{display:flex;align-items:flex-end;gap:6px;height:140px;padding-top:16px}
.bar-c{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bar{width:100%;border-radius:5px 5px 0 0;transition:height .5s ease;min-height:3px}
.bar-l{font-size:9px;color:var(--t4);text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bar-v{font-size:9px;color:var(--t3);font-family:var(--fm);font-weight:700}

/* Settings */
.set-sec{background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r3);padding:18px;margin-bottom:14px}
.set-st{font-size:14px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.set-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--bdr);gap:12px}
.set-row:last-child{border-bottom:none}
.set-lbl{font-size:13px;color:var(--t3)}
.set-inp{width:220px;height:34px;background:var(--bg-3);border:1px solid var(--bdr);border-radius:var(--r1);padding:0 10px;font-family:var(--f);font-size:13px;color:var(--t1);outline:none}
.set-inp:focus{border-color:var(--accent)}

/* Form */
.add-btn{display:flex;align-items:center;gap:5px;padding:8px 16px;background:var(--accent);color:#fff;border:none;border-radius:var(--r2);font-family:var(--f);font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}
.add-btn:hover{background:var(--accent2)}
.stk-inp{width:70px;height:30px;background:var(--bg-2);border:1px solid var(--bdr);border-radius:6px;padding:0 8px;font-family:var(--fm);font-size:12px;color:var(--t1);text-align:center;outline:none}
.stk-inp:focus{border-color:var(--accent)}
.stk-low{color:var(--red);font-weight:700}

/* Animation */
.pe{animation:pe .3s ease}
@keyframes pe{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

/* Dropdown */
.dd{position:absolute;top:calc(100%+4px);left:0;right:0;background:var(--bg-2);border:1px solid var(--bdr);border-radius:var(--r2);box-shadow:0 12px 40px rgba(0,0,0,.5);z-index:500;overflow:hidden;animation:su .2s ease}
.dd-i{padding:10px 14px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:8px;transition:background .15s;border-bottom:1px solid var(--bdr)}
.dd-i:last-child{border-bottom:none}
.dd-i:hover{background:var(--bg-3)}
.dd-i.on{background:var(--accent-g);color:var(--accent)}

@media(max-width:900px){.PC{width:300px}.PG{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}}
@media(max-width:700px){.S{width:52px}.PC{position:fixed;right:0;top:0;bottom:0;width:100%;max-width:370px;z-index:200;box-shadow:0 0 60px rgba(0,0,0,.7)}.T{padding:0 10px}.PP{padding:10px}.SG{grid-template-columns:repeat(2,1fr);padding:10px}}
`;

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

const Sidebar = ({ page, go, cartN }) => {
  const nav = [
    { id: "pos", icon: "cart", tip: "Kasir" },
    { id: "history", icon: "clock", tip: "Riwayat" },
    { id: "products", icon: "box", tip: "Produk" },
    { id: "branches", icon: "building", tip: "Cabang" },
    { id: "reports", icon: "chart", tip: "Laporan" },
    { id: "settings", icon: "settings", tip: "Pengaturan" },
  ];
  return (
    <nav className="S">
      <div className="S-logo">🔥</div>
      {nav.map(n => (
        <button key={n.id} className={`S-btn ${page===n.id?"on":""}`} onClick={()=>go(n.id)} title={n.tip}>
          {Icons[n.icon]?.(20)}
          {n.id==="pos" && cartN>0 && <span className="S-badge">{cartN}</span>}
        </button>
      ))}
      <div className="S-sp"/>
    </nav>
  );
};

const BranchSwitcher = ({ branches, current, setCurrent }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const cur = branches.find(b => b.id === current) || branches[0];
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div className="T-branch" onClick={() => setOpen(!open)}>
        <span className="dot" style={{ background: cur.active ? "var(--green)" : "var(--red)" }} />
        {cur.name}
        {Icons.chevDown(14)}
      </div>
      {open && (
        <div className="dd" style={{ minWidth: 260 }}>
          {branches.map(b => (
            <div key={b.id} className={`dd-i ${b.id===current?"on":""}`} onClick={() => { setCurrent(b.id); setOpen(false); }}>
              <span className="dot br-dot" style={{ background: b.active ? "var(--green)" : "var(--red)" }} />
              <div>
                <div style={{ fontWeight: 600 }}>{b.name}</div>
                <div style={{ fontSize: 11, color: "var(--t4)" }}>{b.city}</div>
              </div>
              {b.isHQ && <span style={{ marginLeft: "auto", fontSize: 9, color: "var(--accent)", fontWeight: 700 }}>PUSAT</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TopBar = ({ page, search, setSearch, branches, curBranch, setCurBranch }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const titles = { pos: "Kasir", history: "Riwayat Transaksi", products: "Kelola Produk", branches: "Kelola Cabang", reports: "Laporan", settings: "Pengaturan" };
  return (
    <header className="T">
      <div>
        <div className="T-title">{titles[page]}</div>
        <div className="T-sub">Warmindo POS v2.0</div>
      </div>
      {page === "pos" && (
        <div className="SB">
          <span className="SB-i">{Icons.search(15)}</span>
          <input placeholder="Cari menu..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      )}
      <div className="T-sp"/>
      <BranchSwitcher branches={branches} current={curBranch} setCurrent={setCurBranch} />
      <div className="T-clock">{time.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
      <div className="T-user"><div className="T-av">K</div><div style={{fontSize:12,fontWeight:600}}>Kasir 1</div></div>
    </header>
  );
};

// ── PAYMENT MODAL (FULL) ────────────────────────────────────────
const PaymentModal = ({ cart, orderType, total, onClose, onComplete, branchName }) => {
  const [payGroup, setPayGroup] = useState("cash");
  const [method, setMethod] = useState("cash");
  const [cash, setCash] = useState("");
  const [step, setStep] = useState("pay"); // pay | processing | receipt
  const [txn, setTxn] = useState(null);
  const [timer, setTimer] = useState(300);
  const [ewStatus, setEwStatus] = useState("waiting"); // waiting | success
  const cashN = parseInt(cash.replace(/\D/g,"")) || 0;
  const change = cashN - total;

  const filteredMethods = PAYMENT_METHODS.filter(m => m.group === payGroup);
  const quickAmts = [...new Set([total, Math.ceil(total/5000)*5000, Math.ceil(total/10000)*10000, Math.ceil(total/20000)*20000, Math.ceil(total/50000)*50000, 100000].filter(a=>a>=total))].slice(0,5);

  // QRIS timer
  useEffect(() => {
    if (step === "processing" && (payGroup === "digital" || payGroup === "ewallet")) {
      const t = setInterval(() => setTimer(v => { if (v <= 1) { clearInterval(t); return 0; } return v - 1; }), 1000);
      // Auto-success after 3-5 seconds for demo
      const s = setTimeout(() => { setEwStatus("success"); }, 3000 + Math.random() * 2000);
      return () => { clearInterval(t); clearTimeout(s); };
    }
  }, [step, payGroup]);

  // When ewallet/qris succeeds
  useEffect(() => {
    if (ewStatus === "success" && step === "processing") {
      setTimeout(() => {
        const newTxn = {
          id: genId(), items: [...cart], total, payment: method,
          payLabel: PAYMENT_METHODS.find(m=>m.id===method)?.label || method,
          cashPaid: total, change: 0, orderType,
          timestamp: new Date().toISOString(), branch: branchName,
        };
        setTxn(newTxn);
        setStep("receipt");
      }, 800);
    }
  }, [ewStatus, step]);

  const handlePay = () => {
    if (payGroup === "cash") {
      if (cashN < total) return;
      const newTxn = {
        id: genId(), items: [...cart], total, payment: method,
        payLabel: "Tunai", cashPaid: cashN, change: cashN - total,
        orderType, timestamp: new Date().toISOString(), branch: branchName,
      };
      setTxn(newTxn);
      setStep("receipt");
    } else if (payGroup === "bank") {
      const newTxn = {
        id: genId(), items: [...cart], total, payment: method,
        payLabel: PAYMENT_METHODS.find(m=>m.id===method)?.label || method,
        cashPaid: total, change: 0, orderType,
        timestamp: new Date().toISOString(), branch: branchName,
      };
      setTxn(newTxn);
      setStep("receipt");
    } else {
      setStep("processing");
    }
  };

  const vaNumber = useMemo(() => {
    const m = method;
    const prefix = m === "bca" ? "897" : m === "bri" ? "102" : m === "mandiri" ? "700" : "451";
    return prefix + "0" + Math.floor(1000000000 + Math.random() * 9000000000);
  }, [method]);

  const timerStr = `${Math.floor(timer/60).toString().padStart(2,"0")}:${(timer%60).toString().padStart(2,"0")}`;

  // ── Processing Screen (QRIS / E-Wallet) ──
  if (step === "processing") {
    const isQRIS = payGroup === "digital";
    return (
      <div className="MO" onClick={onClose}>
        <div className="ML" onClick={e=>e.stopPropagation()} style={{ maxWidth: 420 }}>
          {ewStatus === "success" ? (
            <div style={{ textAlign: "center", padding: 30 }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: "var(--green)" }}>Pembayaran Berhasil!</div>
              <div style={{ fontSize: 14, color: "var(--t3)" }}>{PAYMENT_METHODS.find(m=>m.id===method)?.label} • {rp(total)}</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "var(--t4)" }}>Menyiapkan struk...</div>
            </div>
          ) : (
            <>
              <div className="ML-t">
                {isQRIS ? "📱 Scan QRIS" : `${PAYMENT_METHODS.find(m=>m.id===method)?.icon} ${PAYMENT_METHODS.find(m=>m.id===method)?.label}`}
                <button className="ML-x" onClick={onClose}>{Icons.x(18)}</button>
              </div>
              {isQRIS ? (
                <div className="qris-box">
                  <div className="qris-label">QRIS — Quick Response Code Indonesian Standard</div>
                  <div className="qris-merchant">{branchName}</div>
                  <div className="qris-amount">{rp(total)}</div>
                  <QRCode data={`QRIS-WARMINDO-${total}-${Date.now()}`} size={220} />
                  <div className="qris-nmid">NMID: ID10240388291 • Terminal: T001</div>
                  <div className="qris-timer">⏱️ Berlaku {timerStr}</div>
                  <div className="qris-logos">
                    <span>🟢 GoPay</span>
                    <span>🟣 OVO</span>
                    <span>🔵 DANA</span>
                    <span>🔴 ShopeePay</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--t4)", marginTop: 8 }}>Scan QR code menggunakan aplikasi e-wallet manapun</div>
                </div>
              ) : (
                <div className="ew-box">
                  <div className="ew-icon">{PAYMENT_METHODS.find(m=>m.id===method)?.icon}</div>
                  <div className="ew-name">{PAYMENT_METHODS.find(m=>m.id===method)?.label}</div>
                  <div className="qris-amount">{rp(total)}</div>
                  <QRCode data={`EWALLET-${method}-${total}-${Date.now()}`} size={180} />
                  <div className="qris-timer">⏱️ Menunggu pembayaran... {timerStr}</div>
                  <div style={{ fontSize: 11, color: "var(--t4)", marginTop: 8 }}>Scan atau buka notifikasi di aplikasi {PAYMENT_METHODS.find(m=>m.id===method)?.label}</div>
                </div>
              )}
              <button className="bs" onClick={() => { setEwStatus("success"); }}>
                ✅ Simulasi: Tandai Sudah Bayar
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Receipt Screen ──
  if (step === "receipt" && txn) {
    return (
      <div className="MO" onClick={onClose}>
        <div className="ML" onClick={e=>e.stopPropagation()} style={{ maxWidth: 400 }}>
          <div className="RB">
            <div className="RB-h">
              <div className="RB-sn">🔥 {branchName}</div>
              <div style={{fontSize:10,color:"#888"}}>{fmtFull(txn.timestamp)}</div>
              <div style={{fontSize:10,color:"#888"}}>#{txn.id.toUpperCase()}</div>
            </div>
            <hr className="RB-hr"/>
            <div style={{fontSize:10,color:"#666",marginBottom:3}}>
              {ORDER_TYPES.find(t=>t.id===txn.orderType)?.icon} {ORDER_TYPES.find(t=>t.id===txn.orderType)?.label}
            </div>
            {txn.items.map((it,i) => (
              <div key={i} className="RB-ir">
                <div className="RB-row"><span>{it.name}</span><span>{rp(it.price*it.qty)}</span></div>
                <div className="RB-iq">  {it.qty}x {rp(it.price)}</div>
                {it.note && <div style={{fontSize:9,color:"#999",paddingLeft:8}}>📝 {it.note}</div>}
              </div>
            ))}
            <hr className="RB-hr"/>
            <div className="RB-row RB-tr"><span>TOTAL</span><span>{rp(txn.total)}</span></div>
            <div className="RB-row"><span>Bayar ({txn.payLabel})</span><span>{rp(txn.cashPaid)}</span></div>
            {txn.change > 0 && <div className="RB-row" style={{fontWeight:700}}><span>Kembali</span><span>{rp(txn.change)}</span></div>}
            <hr className="RB-hr"/>
            <div className="RB-ft">Terima kasih! Semoga berkah & kenyang selalu 🤲</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="bs" style={{flex:1}} onClick={()=>window.print()}>{Icons.printer(15)} Cetak</button>
            <button className="bp" style={{flex:1}} onClick={()=>{onComplete(txn);onClose()}}>{Icons.check(16)} Selesai</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Payment Screen ──
  return (
    <div className="MO" onClick={onClose}>
      <div className="ML" onClick={e=>e.stopPropagation()}>
        <div className="ML-t">💳 Pembayaran <button className="ML-x" onClick={onClose}>{Icons.x(18)}</button></div>

        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:12,color:"var(--t4)",marginBottom:3}}>Total Tagihan</div>
          <div style={{fontSize:30,fontWeight:900,fontFamily:"var(--fm)",color:"var(--accent)"}}>{rp(total)}</div>
        </div>

        {/* Payment Group Tabs */}
        <div className="PG-tabs">
          {PAY_GROUPS.map(g => (
            <button key={g.id} className={`PG-tab ${payGroup===g.id?"on":""}`}
              onClick={() => { setPayGroup(g.id); const first = PAYMENT_METHODS.find(m=>m.group===g.id); if(first) setMethod(first.id); }}>
              {g.label}
            </button>
          ))}
        </div>

        {/* Payment Methods Grid */}
        <div className="PM">
          {filteredMethods.map(m => (
            <button key={m.id} className={`PM-b ${method===m.id?"on":""}`} onClick={()=>setMethod(m.id)}>
              <span className="PM-i">{m.icon}</span>{m.label}
            </button>
          ))}
        </div>

        {/* Cash Input */}
        {payGroup === "cash" && (
          <>
            <div style={{fontSize:12,fontWeight:600,marginBottom:6,color:"var(--t3)"}}>Uang Diterima</div>
            <input className="PI" type="text" placeholder="0" autoFocus
              value={cash ? rp(parseInt(cash.replace(/\D/g,""))||0).replace("Rp","Rp ") : ""}
              onChange={e=>setCash(e.target.value.replace(/\D/g,""))} />
            <div className="QC">
              {quickAmts.map(a => <button key={a} onClick={()=>setCash(String(a))}>{rp(a)}</button>)}
            </div>
            {cashN >= total && <div className="chg"><div className="chg-l">Kembalian</div><div className="chg-a">{rp(change)}</div></div>}
          </>
        )}

        {/* Bank Transfer Info */}
        {payGroup === "bank" && (
          <div className="bt-box">
            <div className="bt-bank">{Icons.wallet(18)} Transfer ke {PAYMENT_METHODS.find(m=>m.id===method)?.label}</div>
            <div className="bt-row">
              <div><div className="bt-label">Nomor Virtual Account</div><div className="bt-val">{vaNumber}</div></div>
              <button className="bt-copy" onClick={()=>navigator.clipboard?.writeText(vaNumber)}>{Icons.copy(13)} Salin</button>
            </div>
            <div className="bt-row">
              <div><div className="bt-label">Jumlah Transfer</div><div className="bt-val" style={{color:"var(--accent)"}}>{rp(total)}</div></div>
              <button className="bt-copy" onClick={()=>navigator.clipboard?.writeText(String(total))}>{Icons.copy(13)} Salin</button>
            </div>
            <div style={{fontSize:11,color:"var(--t4)",marginTop:8,lineHeight:1.5}}>
              Transfer tepat sesuai jumlah di atas. Pembayaran akan diverifikasi otomatis dalam 1-5 menit.
            </div>
          </div>
        )}

        {/* QRIS Preview */}
        {payGroup === "digital" && (
          <div style={{textAlign:"center",padding:12,background:"var(--bg-2)",borderRadius:"var(--r2)",marginBottom:14,border:"1px solid var(--bdr)"}}>
            <div style={{fontSize:12,color:"var(--t3)",marginBottom:8}}>Tekan bayar untuk menampilkan QRIS code</div>
            <div style={{fontSize:36}}>📱</div>
          </div>
        )}

        {/* E-Wallet Preview */}
        {payGroup === "ewallet" && (
          <div style={{textAlign:"center",padding:12,background:"var(--bg-2)",borderRadius:"var(--r2)",marginBottom:14,border:"1px solid var(--bdr)"}}>
            <div style={{fontSize:36,marginBottom:4}}>{PAYMENT_METHODS.find(m=>m.id===method)?.icon}</div>
            <div style={{fontSize:13,fontWeight:600}}>{PAYMENT_METHODS.find(m=>m.id===method)?.label}</div>
            <div style={{fontSize:11,color:"var(--t4)",marginTop:4}}>Tekan bayar untuk generate QR / push notif</div>
          </div>
        )}

        {/* Platform */}
        {payGroup === "platform" && (
          <div style={{textAlign:"center",padding:14,background:"var(--bg-2)",borderRadius:"var(--r2)",marginBottom:14,border:"1px solid var(--bdr)"}}>
            <div style={{fontSize:36,marginBottom:4}}>{PAYMENT_METHODS.find(m=>m.id===method)?.icon}</div>
            <div style={{fontSize:13,fontWeight:600}}>Pembayaran via {PAYMENT_METHODS.find(m=>m.id===method)?.label}</div>
            <div style={{fontSize:11,color:"var(--t4)",marginTop:4}}>Sudah dibayar melalui platform ojol</div>
          </div>
        )}

        <button className="bp"
          disabled={payGroup === "cash" && cashN < total}
          onClick={handlePay}>
          {payGroup === "cash" && cashN < total
            ? `Kurang ${rp(total - cashN)}`
            : `✅ Bayar ${rp(total)}`}
        </button>
      </div>
    </div>
  );
};

// ── POS PAGE ────────────────────────────────────────────────────
const POSPage = ({ products, cart, setCart, orderType, setOrderType, onCheckout, search }) => {
  const [cat, setCat] = useState("all");
  const filtered = useMemo(() => {
    let l = products;
    if (cat !== "all") l = l.filter(p => p.cat === cat);
    if (search) { const q = search.toLowerCase(); l = l.filter(p => p.name.toLowerCase().includes(q)); }
    return l;
  }, [products, cat, search]);
  const cMap = useMemo(() => { const m={}; cart.forEach(c=>m[c.id]=c.qty); return m; }, [cart]);
  const add = useCallback(p => setCart(prev => { const e = prev.find(c=>c.id===p.id); return e ? prev.map(c=>c.id===p.id?{...c,qty:c.qty+1}:c) : [...prev,{...p,qty:1,note:""}]; }), []);
  const inc = useCallback(id => setCart(prev => prev.map(c=>c.id===id?{...c,qty:c.qty+1}:c)), []);
  const dec = useCallback(id => setCart(prev => prev.map(c=>c.id===id&&c.qty>1?{...c,qty:c.qty-1}:c)), []);
  const rm = useCallback(id => setCart(prev => prev.filter(c=>c.id!==id)), []);
  const note = useCallback(id => { const n=prompt("Catatan:"); if(n!==null) setCart(prev=>prev.map(c=>c.id===id?{...c,note:n}:c)); }, []);
  const sub = cart.reduce((s,c) => s+c.price*c.qty, 0);
  const totalI = cart.reduce((s,c) => s+c.qty, 0);

  return (
    <div className="PB">
      <div className="PP">
        <div className="cats">
          {CATEGORIES.map(c => (
            <button key={c.id} className={`cat ${cat===c.id?"on":""}`} onClick={()=>setCat(c.id)}>
              <span style={{fontSize:14}}>{c.icon}</span> {c.name}
            </button>
          ))}
        </div>
        <div className="PG">
          {filtered.map(p => (
            <div key={p.id} className={`pd ${p.stock<=0?"off":""}`} onClick={()=>p.stock>0&&add(p)}>
              {cMap[p.id]>0 && <div className="pd-q">{cMap[p.id]}</div>}
              <div className="pd-e">{p.img}</div>
              <div className="pd-n">{p.name}</div>
              <div className="pd-p">{rp(p.price)}</div>
              <div className="pd-s">{p.stock<=0?"Habis":`Stok: ${p.stock}`}</div>
            </div>
          ))}
          {filtered.length===0 && <div style={{gridColumn:"1/-1",textAlign:"center",padding:40,color:"var(--t4)"}}>🔍 Menu tidak ditemukan</div>}
        </div>
      </div>
      <div className="PC">
        <div className="CH">
          <div className="CH-r">
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span className="CH-t">Pesanan</span>
              {totalI>0 && <span className="CH-c">{totalI} item</span>}
            </div>
            {cart.length>0 && <button className="CH-clr" onClick={()=>setCart([])}>{Icons.trash(13)} Hapus</button>}
          </div>
          <div className="OT">
            {ORDER_TYPES.map(t => (
              <button key={t.id} className={`OT-b ${orderType===t.id?"on":""}`} onClick={()=>setOrderType(t.id)}>
                <span className="OT-i">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="CI">
          {cart.length===0 ? (
            <div className="ce"><div style={{fontSize:42,opacity:.3}}>🛒</div><div style={{fontSize:13}}>Belum ada pesanan</div><div style={{fontSize:11}}>Klik menu untuk menambahkan</div></div>
          ) : cart.map(item => (
            <div key={item.id} className="ci">
              <div className="ci-e">{item.img}</div>
              <div className="ci-i">
                <div className="ci-n">{item.name}</div>
                <div className="ci-p">{rp(item.price)}</div>
                <div className="ci-ctr">
                  <button className="qb dng" onClick={()=>item.qty===1?rm(item.id):dec(item.id)}>{item.qty===1?Icons.trash(12):Icons.minus(12)}</button>
                  <span className="qv">{item.qty}</span>
                  <button className="qb" onClick={()=>inc(item.id)}>{Icons.plus(12)}</button>
                  <button className="ci-nb" onClick={()=>note(item.id)}>{item.note?"✏️":"+ catatan"}</button>
                </div>
                {item.note && <div className="ci-note">📝 {item.note}</div>}
              </div>
              <div className="ci-st">{rp(item.price*item.qty)}</div>
            </div>
          ))}
        </div>
        {cart.length>0 && (
          <div className="CF">
            <div className="CF-r"><span>Subtotal ({totalI} item)</span><span style={{fontFamily:"var(--fm)",fontWeight:600}}>{rp(sub)}</span></div>
            <div className="CF-t"><span>Total</span><span className="CF-ta">{rp(sub)}</span></div>
            <button className="bp" onClick={()=>onCheckout(sub)}>💳 Bayar — {rp(sub)}</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── HISTORY PAGE ─────────────────────────────────────────────────
const HistoryPage = ({ txns, curBranch, branches }) => {
  const brName = branches.find(b=>b.id===curBranch)?.name || "";
  const brTxns = txns.filter(t => !t.branch || t.branch === brName);
  const sorted = [...brTxns].sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp));
  const todayT = sorted.filter(t=>t.timestamp.startsWith(todayKey()));
  const todayRev = todayT.reduce((s,t)=>s+t.total,0);

  return (
    <div className="pe" style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
      <div className="SG">
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--accent-g)"}}>🧾</div></div><div className="SC-l">Transaksi Hari Ini</div><div className="SC-v">{todayT.length}</div></div>
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--green-g)"}}>💰</div></div><div className="SC-l">Pendapatan Hari Ini</div><div className="SC-v" style={{color:"var(--green)"}}>{rp(todayRev)}</div></div>
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--blue-g)"}}>📊</div></div><div className="SC-l">Rata-rata / Transaksi</div><div className="SC-v">{todayT.length?rp(Math.round(todayRev/todayT.length)):"Rp0"}</div></div>
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--yellow-g)"}}>🏪</div></div><div className="SC-l">Cabang</div><div className="SC-v" style={{fontSize:14}}>{brName}</div></div>
      </div>
      <div className="pg">
        {sorted.length===0 ? (
          <div style={{textAlign:"center",padding:50,color:"var(--t4)"}}>📋 Belum ada transaksi di cabang ini</div>
        ) : (
          <table className="TBL"><thead><tr><th>ID</th><th>Waktu</th><th>Item</th><th>Tipe</th><th>Bayar</th><th style={{textAlign:"right"}}>Total</th></tr></thead>
          <tbody>{sorted.map(t => (
            <tr key={t.id}>
              <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--t4)"}}>#{t.id.slice(0,8).toUpperCase()}</td>
              <td><div>{fmtDate(t.timestamp)}</div><div style={{fontSize:10,color:"var(--t4)"}}>{fmtTime(t.timestamp)}</div></td>
              <td style={{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.items.map(i=>`${i.name} x${i.qty}`).join(", ")}</td>
              <td><span className="badge b-blu">{ORDER_TYPES.find(o=>o.id===t.orderType)?.icon} {ORDER_TYPES.find(o=>o.id===t.orderType)?.label}</span></td>
              <td><span className="badge b-grn">{t.payLabel || "Tunai"}</span></td>
              <td style={{textAlign:"right",fontFamily:"var(--fm)",fontWeight:700}}>{rp(t.total)}</td>
            </tr>
          ))}</tbody></table>
        )}
      </div>
    </div>
  );
};

// ── PRODUCTS PAGE ────────────────────────────────────────────────
const ProductsPage = ({ products, setProducts }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({name:"",price:"",cat:"indomie",stock:"",img:"🍜"});
  const handleAdd = () => { if(!form.name||!form.price) return; setProducts(p=>[...p,{id:Date.now(),name:form.name,price:parseInt(form.price),cat:form.cat,stock:parseInt(form.stock)||0,img:form.img}]); setForm({name:"",price:"",cat:"indomie",stock:"",img:"🍜"}); setShowForm(false); };
  const updStock = (id,v) => setProducts(p=>p.map(x=>x.id===id?{...x,stock:Math.max(0,parseInt(v)||0)}:x));
  const del = (id) => { if(confirm("Hapus?")) setProducts(p=>p.filter(x=>x.id!==id)); };

  return (
    <div className="pg pe">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div className="pg-t" style={{margin:0}}>📦 Produk ({products.length})</div>
        <button className="add-btn" onClick={()=>setShowForm(!showForm)}>{Icons.plus(14)} Tambah Produk</button>
      </div>
      {showForm && (
        <div style={{background:"var(--bg-2)",border:"1px solid var(--bdr)",borderRadius:"var(--r3)",padding:16,marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div><label style={{fontSize:11,color:"var(--t4)",display:"block",marginBottom:3}}>Emoji</label><input className="stk-inp" style={{width:50,fontSize:18}} value={form.img} onChange={e=>setForm({...form,img:e.target.value})}/></div>
          <div style={{flex:1,minWidth:140}}><label style={{fontSize:11,color:"var(--t4)",display:"block",marginBottom:3}}>Nama</label><input className="set-inp" style={{width:"100%"}} placeholder="Indomie Special" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div style={{minWidth:100}}><label style={{fontSize:11,color:"var(--t4)",display:"block",marginBottom:3}}>Harga</label><input className="set-inp" style={{width:"100%"}} type="number" placeholder="10000" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
          <div style={{minWidth:100}}><label style={{fontSize:11,color:"var(--t4)",display:"block",marginBottom:3}}>Kategori</label><select className="set-inp" style={{width:"100%"}} value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>{CATEGORIES.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
          <div style={{minWidth:70}}><label style={{fontSize:11,color:"var(--t4)",display:"block",marginBottom:3}}>Stok</label><input className="stk-inp" style={{width:"100%"}} type="number" placeholder="50" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></div>
          <button className="add-btn" onClick={handleAdd}>{Icons.check(14)} Simpan</button>
        </div>
      )}
      <table className="TBL"><thead><tr><th></th><th>Nama</th><th>Kategori</th><th>Harga</th><th>Stok</th><th></th></tr></thead>
      <tbody>{products.map(p=>(
        <tr key={p.id}>
          <td style={{fontSize:22}}>{p.img}</td>
          <td style={{fontWeight:600}}>{p.name}</td>
          <td><span className="badge b-blu">{CATEGORIES.find(c=>c.id===p.cat)?.icon} {CATEGORIES.find(c=>c.id===p.cat)?.name}</span></td>
          <td style={{fontFamily:"var(--fm)"}}>{rp(p.price)}</td>
          <td><input className={`stk-inp ${p.stock<=5?"stk-low":""}`} type="number" value={p.stock} onChange={e=>updStock(p.id,e.target.value)}/></td>
          <td><button style={{background:"none",border:"none",color:"var(--red)",cursor:"pointer",padding:4}} onClick={()=>del(p.id)}>{Icons.trash(15)}</button></td>
        </tr>
      ))}</tbody></table>
    </div>
  );
};

// ── BRANCHES PAGE ────────────────────────────────────────────────
const BranchesPage = ({ branches, setBranches, curBranch, setCurBranch, txns }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", address:"", city:"", phone:"" });

  const addBranch = () => {
    if (!form.name) return;
    setBranches(prev => [...prev, { id: genId(), name: form.name, address: form.address, city: form.city, phone: form.phone, isHQ: false, active: true }]);
    setForm({ name:"", address:"", city:"", phone:"" });
    setShowForm(false);
  };

  const toggleActive = (id) => setBranches(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  const delBranch = (id) => { if (confirm("Hapus cabang ini?")) setBranches(prev => prev.filter(b => b.id !== id)); };

  const getBranchRevenue = (name) => txns.filter(t => t.branch === name && t.timestamp.startsWith(todayKey())).reduce((s,t) => s + t.total, 0);
  const getBranchTxnCount = (name) => txns.filter(t => t.branch === name && t.timestamp.startsWith(todayKey())).length;

  return (
    <div className="pg pe">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div className="pg-t" style={{margin:0}}>🏪 Kelola Cabang ({branches.length})</div>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>{Icons.plus(14)} Tambah Cabang</button>
      </div>

      {showForm && (
        <div style={{background:"var(--bg-2)",border:"1px solid var(--bdr)",borderRadius:"var(--r3)",padding:16,marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div style={{flex:1,minWidth:160}}><label style={{fontSize:11,color:"var(--t4)",display:"block",marginBottom:3}}>Nama Cabang</label><input className="set-inp" style={{width:"100%"}} placeholder="Warmindo Cabang Bekasi" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div style={{flex:1,minWidth:160}}><label style={{fontSize:11,color:"var(--t4)",display:"block",marginBottom:3}}>Alamat</label><input className="set-inp" style={{width:"100%"}} placeholder="Jl. Raya No. 1" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div>
          <div style={{minWidth:120}}><label style={{fontSize:11,color:"var(--t4)",display:"block",marginBottom:3}}>Kota</label><input className="set-inp" style={{width:"100%"}} placeholder="Bekasi" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></div>
          <div style={{minWidth:120}}><label style={{fontSize:11,color:"var(--t4)",display:"block",marginBottom:3}}>Telepon</label><input className="set-inp" style={{width:"100%"}} placeholder="08xx" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
          <button className="add-btn" onClick={addBranch}>{Icons.check(14)} Simpan</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="SG" style={{padding:0,marginBottom:16}}>
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--accent-g)"}}>🏪</div></div><div className="SC-l">Total Cabang</div><div className="SC-v">{branches.length}</div></div>
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--green-g)"}}>✅</div></div><div className="SC-l">Cabang Aktif</div><div className="SC-v" style={{color:"var(--green)"}}>{branches.filter(b=>b.active).length}</div></div>
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--blue-g)"}}>💰</div></div><div className="SC-l">Total Revenue Semua Cabang</div><div className="SC-v" style={{color:"var(--accent)"}}>{rp(branches.reduce((s,b)=>s+getBranchRevenue(b.name),0))}</div></div>
      </div>

      {/* Branch Cards */}
      <div className="br-grid">
        {branches.map(b => (
          <div key={b.id} className={`br-card ${curBranch===b.id?"sel":""}`} onClick={()=>setCurBranch(b.id)}>
            {b.isHQ && <div className="br-hq">⭐ PUSAT</div>}
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span className="br-dot" style={{background:b.active?"var(--green)":"var(--red)"}}/>
              <div className="br-name">{b.name}</div>
            </div>
            <div className="br-addr">{b.address}, {b.city}<br/>{b.phone}</div>
            <div className="br-stats">
              <div className="br-stat">Hari ini: <b>{getBranchTxnCount(b.name)} txn</b></div>
              <div className="br-stat">Revenue: <b>{rp(getBranchRevenue(b.name))}</b></div>
            </div>
            <div style={{display:"flex",gap:6,marginTop:10}}>
              <button className="bs" style={{height:30,fontSize:11,flex:1}} onClick={e=>{e.stopPropagation();toggleActive(b.id)}}>
                {b.active ? "🔴 Nonaktifkan" : "🟢 Aktifkan"}
              </button>
              {!b.isHQ && <button className="bs" style={{height:30,fontSize:11,width:40,flex:"none",color:"var(--red)"}} onClick={e=>{e.stopPropagation();delBranch(b.id)}}>{Icons.trash(13)}</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Branch Comparison */}
      <div className="chart-box">
        <div className="chart-t">📊 Perbandingan Revenue Cabang Hari Ini</div>
        {branches.length > 0 ? (
          <div className="bars" style={{height:160}}>
            {branches.map(b => {
              const rev = getBranchRevenue(b.name);
              const maxRev = Math.max(...branches.map(x => getBranchRevenue(x.name)), 1);
              return (
                <div key={b.id} className="bar-c">
                  <div className="bar-v">{rp(rev)}</div>
                  <div className="bar" style={{height:`${(rev/maxRev)*120}px`,background:`linear-gradient(180deg,var(--accent),#DC2626)`}}/>
                  <div className="bar-l">{b.name.replace("Warmindo ","")}</div>
                </div>
              );
            })}
          </div>
        ) : <div style={{textAlign:"center",padding:30,color:"var(--t4)"}}>Belum ada data</div>}
      </div>
    </div>
  );
};

// ── REPORTS PAGE ─────────────────────────────────────────────────
const ReportsPage = ({ txns, branches, curBranch }) => {
  const brName = branches.find(b=>b.id===curBranch)?.name||"";
  const today = todayKey();
  const brTxns = txns.filter(t=>t.branch===brName);
  const todayTxns = brTxns.filter(t=>t.timestamp.startsWith(today));
  const todayRev = todayTxns.reduce((s,t)=>s+t.total,0);
  const allRev = txns.filter(t=>t.timestamp.startsWith(today)).reduce((s,t)=>s+t.total,0);

  const catBD={}; todayTxns.forEach(t=>t.items.forEach(i=>{const cn=CATEGORIES.find(c=>c.id===i.cat)?.name||"?"; catBD[cn]=(catBD[cn]||0)+i.price*i.qty;}));
  const catE=Object.entries(catBD).sort((a,b)=>b[1]-a[1]); const maxC=Math.max(...catE.map(e=>e[1]),1);
  const itemS={}; todayTxns.forEach(t=>t.items.forEach(i=>{itemS[i.name]=(itemS[i.name]||0)+i.qty;}));
  const best=Object.entries(itemS).sort((a,b)=>b[1]-a[1]).slice(0,8); const maxB=Math.max(...best.map(e=>e[1]),1);
  const payBD={}; todayTxns.forEach(t=>{const l=t.payLabel||"Tunai"; payBD[l]=(payBD[l]||0)+t.total;});

  return (
    <div className="pg pe">
      <div className="SG" style={{padding:0,marginBottom:16}}>
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--accent-g)"}}>🧾</div></div><div className="SC-l">Transaksi {brName}</div><div className="SC-v">{todayTxns.length}</div></div>
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--green-g)"}}>💰</div></div><div className="SC-l">Revenue Cabang Ini</div><div className="SC-v" style={{color:"var(--green)"}}>{rp(todayRev)}</div></div>
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--blue-g)"}}>🌍</div></div><div className="SC-l">Revenue Semua Cabang</div><div className="SC-v" style={{color:"var(--blue)"}}>{rp(allRev)}</div></div>
        <div className="SC"><div className="SC-ir"><div className="SC-ib" style={{background:"var(--purple-g)"}}>📊</div></div><div className="SC-l">Avg Ticket</div><div className="SC-v">{todayTxns.length?rp(Math.round(todayRev/todayTxns.length)):"Rp0"}</div></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div className="chart-box"><div className="chart-t">🏆 Menu Terlaris</div>
          {best.length===0?<div style={{textAlign:"center",padding:24,color:"var(--t4)"}}>Belum ada data</div>:(
            <div className="bars">{best.map(([n,q])=>(<div key={n} className="bar-c"><div className="bar-v">{q}</div><div className="bar" style={{height:`${(q/maxB)*110}px`,background:"linear-gradient(180deg,var(--accent),#DC2626)"}}/><div className="bar-l">{n.length>12?n.slice(0,12)+"…":n}</div></div>))}</div>
          )}
        </div>
        <div className="chart-box"><div className="chart-t">📂 Revenue per Kategori</div>
          {catE.length===0?<div style={{textAlign:"center",padding:24,color:"var(--t4)"}}>Belum ada data</div>:(
            <div className="bars">{catE.map(([n,t])=>(<div key={n} className="bar-c"><div className="bar-v">{rp(t)}</div><div className="bar" style={{height:`${(t/maxC)*110}px`,background:"linear-gradient(180deg,#2A9D8F,#264653)"}}/><div className="bar-l">{n}</div></div>))}</div>
          )}
        </div>
        <div className="chart-box" style={{gridColumn:"1/-1"}}><div className="chart-t">💳 Breakdown Metode Pembayaran</div>
          {Object.keys(payBD).length===0?<div style={{textAlign:"center",padding:24,color:"var(--t4)"}}>Belum ada data</div>:(
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>{Object.entries(payBD).map(([m,a])=>(
              <div key={m} style={{flex:1,minWidth:130,background:"var(--bg-3)",borderRadius:"var(--r2)",padding:14,textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{m}</div>
                <div style={{fontSize:18,fontWeight:800,fontFamily:"var(--fm)",color:"var(--accent)"}}>{rp(a)}</div>
                <div style={{fontSize:10,color:"var(--t4)",marginTop:3}}>{todayRev>0?Math.round(a/todayRev*100):0}%</div>
              </div>
            ))}</div>
          )}
        </div>

        {/* Cross-branch comparison */}
        <div className="chart-box" style={{gridColumn:"1/-1"}}><div className="chart-t">🏪 Revenue Semua Cabang Hari Ini</div>
          <div className="bars" style={{height:160}}>
            {branches.map(b => {
              const rev = txns.filter(t=>t.branch===b.name&&t.timestamp.startsWith(today)).reduce((s,t)=>s+t.total,0);
              const mx = Math.max(...branches.map(x=>txns.filter(t=>t.branch===x.name&&t.timestamp.startsWith(today)).reduce((s,t)=>s+t.total,0)),1);
              return (<div key={b.id} className="bar-c"><div className="bar-v">{rp(rev)}</div><div className="bar" style={{height:`${(rev/mx)*130}px`,background:b.id===curBranch?"linear-gradient(180deg,var(--accent),#DC2626)":"linear-gradient(180deg,var(--blue),#1E40AF)"}}/><div className="bar-l">{b.name.replace("Warmindo ","")}</div></div>);
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SETTINGS PAGE ────────────────────────────────────────────────
const SettingsPage = ({ shopName, setShopName, branches, curBranch }) => {
  const [tmp, setTmp] = useState(shopName);
  const curB = branches.find(b=>b.id===curBranch);
  return (
    <div className="pg pe">
      <div className="set-sec">
        <div className="set-st">🏪 Informasi Usaha</div>
        <div className="set-row"><span className="set-lbl">Nama Brand</span><div style={{display:"flex",gap:6}}><input className="set-inp" value={tmp} onChange={e=>setTmp(e.target.value)}/><button className="add-btn" style={{padding:"0 14px",height:34}} onClick={()=>setShopName(tmp)}>Simpan</button></div></div>
        <div className="set-row"><span className="set-lbl">Cabang Aktif</span><span style={{fontSize:13,fontWeight:600}}>{curB?.name}</span></div>
        <div className="set-row"><span className="set-lbl">Alamat</span><input className="set-inp" defaultValue={curB?.address}/></div>
        <div className="set-row"><span className="set-lbl">No. Telp</span><input className="set-inp" defaultValue={curB?.phone}/></div>
      </div>
      <div className="set-sec">
        <div className="set-st">💳 Pembayaran</div>
        <div className="set-row"><span className="set-lbl">QRIS Merchant ID (NMID)</span><input className="set-inp" defaultValue="ID10240388291"/></div>
        <div className="set-row"><span className="set-lbl">No. Rek BCA</span><input className="set-inp" defaultValue="897-0123456789"/></div>
        <div className="set-row"><span className="set-lbl">No. Rek BRI</span><input className="set-inp" defaultValue="1020-31234567890"/></div>
        <div className="set-row"><span className="set-lbl">No. Rek Mandiri</span><input className="set-inp" defaultValue="700-0012345678"/></div>
        <div className="set-row"><span className="set-lbl">No. Rek BSI</span><input className="set-inp" defaultValue="451-0098765432"/></div>
      </div>
      <div className="set-sec">
        <div className="set-st">🖨️ Struk</div>
        <div className="set-row"><span className="set-lbl">Pesan di Struk</span><input className="set-inp" style={{width:280}} defaultValue="Terima kasih! Semoga berkah & kenyang selalu 🤲"/></div>
        <div className="set-row"><span className="set-lbl">Pajak (%)</span><input className="set-inp" type="number" defaultValue="0" style={{width:80}}/></div>
      </div>
      <div className="set-sec">
        <div className="set-st">👤 Kasir</div>
        <div className="set-row"><span className="set-lbl">Nama Kasir</span><input className="set-inp" defaultValue="Kasir 1"/></div>
        <div className="set-row"><span className="set-lbl">PIN Kasir</span><input className="set-inp" type="password" defaultValue="1234" style={{width:100}}/></div>
      </div>
      <div className="set-sec" style={{background:"var(--accent-g)",border:"1px solid var(--accent)"}}>
        <div className="set-st" style={{color:"var(--accent)"}}>🔥 Warmindo POS v2.0</div>
        <div style={{fontSize:12,color:"var(--t3)",lineHeight:1.7}}>
          Aplikasi kasir premium untuk warung makan Indonesia.<br/>
          Multi-Cabang • QRIS • E-Wallet • Transfer Bank • Laporan Real-time<br/>
          GoFood • GrabFood • ShopeeFood Integration Ready<br/><br/>
          Built with ❤️ untuk UMKM Indonesia
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function WarmindoPOS() {
  const [page, setPage] = useState("pos");
  const [products, setProducts] = useLS("wpos_prods", PRODUCTS);
  const [txns, setTxns] = useLS("wpos_txns", []);
  const [branches, setBranches] = useLS("wpos_branches", INITIAL_BRANCHES);
  const [curBranch, setCurBranch] = useLS("wpos_curbranch", "hq");
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("dine_in");
  const [search, setSearch] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [payTotal, setPayTotal] = useState(0);
  const [shopName, setShopName] = useLS("wpos_shop", "Warmindo Jaya");

  const curBName = branches.find(b=>b.id===curBranch)?.name || "Warmindo Pusat";
  const checkout = (t) => { setPayTotal(t); setPayOpen(true); };
  const complete = (txn) => {
    setTxns(prev => [...prev, txn]);
    setProducts(prev => prev.map(p => { const ci = cart.find(c=>c.id===p.id); return ci ? {...p,stock:Math.max(0,p.stock-ci.qty)} : p; }));
    setCart([]);
    setOrderType("dine_in");
  };
  const cartN = cart.reduce((s,c)=>s+c.qty,0);

  return (
    <>
      <style>{CSS}</style>
      <div className="W">
        <Sidebar page={page} go={setPage} cartN={cartN} />
        <div className="M">
          <TopBar page={page} search={search} setSearch={setSearch} branches={branches} curBranch={curBranch} setCurBranch={setCurBranch} />
          {page==="pos" && <POSPage products={products} cart={cart} setCart={setCart} orderType={orderType} setOrderType={setOrderType} onCheckout={checkout} search={search}/>}
          {page==="history" && <HistoryPage txns={txns} curBranch={curBranch} branches={branches}/>}
          {page==="products" && <ProductsPage products={products} setProducts={setProducts}/>}
          {page==="branches" && <BranchesPage branches={branches} setBranches={setBranches} curBranch={curBranch} setCurBranch={setCurBranch} txns={txns}/>}
          {page==="reports" && <ReportsPage txns={txns} branches={branches} curBranch={curBranch}/>}
          {page==="settings" && <SettingsPage shopName={shopName} setShopName={setShopName} branches={branches} curBranch={curBranch}/>}
        </div>
        {payOpen && <PaymentModal cart={cart} orderType={orderType} total={payTotal} onClose={()=>setPayOpen(false)} onComplete={complete} branchName={curBName}/>}
      </div>
    </>
  );
}
