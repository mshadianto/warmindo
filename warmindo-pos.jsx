import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// WARMINDO POS — Aplikasi Kasir Warung Makan Indonesia
// Inspired by Qasir.id • Enhanced • Modular • Scalable
// ═══════════════════════════════════════════════════════════════

// ─── DATA LAYER ────────────────────────────────────────────────
const CATEGORIES = [
  { id: "indomie", name: "Indomie", icon: "🍜", color: "#E63946" },
  { id: "nasi", name: "Nasi", icon: "🍚", color: "#F4A261" },
  { id: "gorengan", name: "Gorengan", icon: "🍤", color: "#E9C46A" },
  { id: "minuman", name: "Minuman", icon: "🥤", color: "#2A9D8F" },
  { id: "snack", name: "Snack", icon: "🍢", color: "#264653" },
  { id: "extra", name: "Extra", icon: "➕", color: "#6A4C93" },
];

const INITIAL_PRODUCTS = [
  { id: 1, name: "Indomie Goreng", price: 8000, category: "indomie", stock: 50, image: "🍜" },
  { id: 2, name: "Indomie Rebus", price: 8000, category: "indomie", stock: 50, image: "🍜" },
  { id: 3, name: "Indomie Goreng Telur", price: 12000, category: "indomie", stock: 40, image: "🍳" },
  { id: 4, name: "Indomie Rebus Telur", price: 12000, category: "indomie", stock: 40, image: "🍳" },
  { id: 5, name: "Indomie Goreng Double", price: 14000, category: "indomie", stock: 30, image: "🍜" },
  { id: 6, name: "Indomie Nyemek", price: 10000, category: "indomie", stock: 35, image: "🍜" },
  { id: 7, name: "Indomie Seblak", price: 13000, category: "indomie", stock: 25, image: "🌶️" },
  { id: 8, name: "Nasi Goreng", price: 15000, category: "nasi", stock: 30, image: "🍛" },
  { id: 9, name: "Nasi Telur", price: 10000, category: "nasi", stock: 40, image: "🍚" },
  { id: 10, name: "Nasi Putih", price: 5000, category: "nasi", stock: 60, image: "🍚" },
  { id: 11, name: "Nasi Uduk", price: 8000, category: "nasi", stock: 25, image: "🍚" },
  { id: 12, name: "Tempe Goreng", price: 3000, category: "gorengan", stock: 40, image: "🟫" },
  { id: 13, name: "Tahu Goreng", price: 3000, category: "gorengan", stock: 40, image: "🟨" },
  { id: 14, name: "Bakwan", price: 3000, category: "gorengan", stock: 30, image: "🍤" },
  { id: 15, name: "Pisang Goreng", price: 4000, category: "gorengan", stock: 25, image: "🍌" },
  { id: 16, name: "Mendoan", price: 4000, category: "gorengan", stock: 30, image: "🟫" },
  { id: 17, name: "Es Teh Manis", price: 5000, category: "minuman", stock: 80, image: "🧊" },
  { id: 18, name: "Teh Anget", price: 4000, category: "minuman", stock: 80, image: "☕" },
  { id: 19, name: "Es Jeruk", price: 6000, category: "minuman", stock: 50, image: "🍊" },
  { id: 20, name: "Kopi Hitam", price: 5000, category: "minuman", stock: 60, image: "☕" },
  { id: 21, name: "Es Kopi Susu", price: 10000, category: "minuman", stock: 40, image: "🧋" },
  { id: 22, name: "Air Mineral", price: 4000, category: "minuman", stock: 100, image: "💧" },
  { id: 23, name: "Kerupuk", price: 2000, category: "snack", stock: 60, image: "🍘" },
  { id: 24, name: "Sate Telur Puyuh", price: 5000, category: "snack", stock: 30, image: "🍢" },
  { id: 25, name: "Telur Ceplok", price: 5000, category: "extra", stock: 50, image: "🍳" },
  { id: 26, name: "Kornet", price: 5000, category: "extra", stock: 30, image: "🥫" },
  { id: 27, name: "Sosis", price: 5000, category: "extra", stock: 30, image: "🌭" },
  { id: 28, name: "Keju", price: 4000, category: "extra", stock: 20, image: "🧀" },
];

const ORDER_TYPES = [
  { id: "dine_in", label: "Makan di Tempat", icon: "🪑" },
  { id: "take_away", label: "Bungkus", icon: "📦" },
  { id: "gojek", label: "GoFood", icon: "🟢" },
  { id: "grab", label: "GrabFood", icon: "🟠" },
];

const PAYMENT_METHODS = [
  { id: "cash", label: "Tunai", icon: "💵" },
  { id: "qris", label: "QRIS", icon: "📱" },
  { id: "transfer", label: "Transfer", icon: "🏦" },
  { id: "gofood", label: "GoFood", icon: "🟢" },
  { id: "grabfood", label: "GrabFood", icon: "🟠" },
];

// ─── UTILITY FUNCTIONS ─────────────────────────────────────────
const formatRupiah = (n) => "Rp" + (n || 0).toLocaleString("id-ID");
const formatTime = (d) => new Date(d).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const todayStr = () => new Date().toISOString().split("T")[0];

// ─── ICONS (inline SVG components) ─────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    cart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    box: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    minus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    printer: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
    arrowLeft: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    receipt: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>,
  };
  return icons[name] || null;
};

// ─── CUSTOM HOOKS ──────────────────────────────────────────────
const useLocalState = (key, initial) => {
  const [val, setVal] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
};

// ─── STYLES ────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');

  :root {
    --bg-primary: #0A0F1C;
    --bg-secondary: #111827;
    --bg-card: #1A2236;
    --bg-card-hover: #1F2A42;
    --bg-elevated: #243049;
    --border: #2A3550;
    --border-light: #1E293B;
    --text-primary: #F1F5F9;
    --text-secondary: #94A3B8;
    --text-muted: #64748B;
    --accent: #F97316;
    --accent-hover: #FB923C;
    --accent-glow: rgba(249, 115, 22, 0.15);
    --accent-soft: rgba(249, 115, 22, 0.1);
    --success: #22C55E;
    --success-soft: rgba(34, 197, 94, 0.12);
    --danger: #EF4444;
    --danger-soft: rgba(239, 68, 68, 0.12);
    --warning: #F59E0B;
    --info: #3B82F6;
    --info-soft: rgba(59, 130, 246, 0.12);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  .warmindo-app {
    font-family: var(--font);
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    display: flex;
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 72px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    gap: 4px;
    flex-shrink: 0;
    z-index: 100;
  }
  .sidebar-logo {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, var(--accent), #DC2626);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(249,115,22,0.3);
  }
  .sidebar-btn {
    width: 48px;
    height: 48px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    position: relative;
  }
  .sidebar-btn:hover { background: var(--bg-card); color: var(--text-secondary); }
  .sidebar-btn.active {
    background: var(--accent-soft);
    color: var(--accent);
  }
  .sidebar-btn.active::before {
    content: '';
    position: absolute;
    left: -12px;
    width: 3px;
    height: 24px;
    background: var(--accent);
    border-radius: 0 3px 3px 0;
  }
  .sidebar-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background: var(--danger);
    color: white;
    font-size: 10px;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }
  .sidebar-spacer { flex: 1; }

  /* ── Main Content ── */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  /* ── Top Bar ── */
  .topbar {
    height: 64px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
    flex-shrink: 0;
  }
  .topbar-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
  }
  .topbar-subtitle {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
  }
  .topbar-spacer { flex: 1; }
  .topbar-clock {
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text-secondary);
    background: var(--bg-card);
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
  }
  .topbar-user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    background: var(--bg-card);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
  }
  .topbar-avatar {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, var(--accent), #DC2626);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
  }

  /* ── Search Box ── */
  .search-box {
    position: relative;
    flex: 1;
    max-width: 400px;
  }
  .search-box input {
    width: 100%;
    height: 40px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0 16px 0 40px;
    font-family: var(--font);
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.2s;
  }
  .search-box input::placeholder { color: var(--text-muted); }
  .search-box input:focus { border-color: var(--accent); }
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }

  /* ── Page Layout ── */
  .page-body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  /* ── POS Layout ── */
  .pos-products {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 20px 24px;
    gap: 16px;
  }
  .pos-cart {
    width: 380px;
    background: var(--bg-secondary);
    border-left: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  /* ── Category Tabs ── */
  .category-tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    flex-shrink: 0;
  }
  .category-tabs::-webkit-scrollbar { height: 0; }
  .cat-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-secondary);
    border-radius: 999px;
    cursor: pointer;
    font-family: var(--font);
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.2s;
  }
  .cat-tab:hover { border-color: var(--text-muted); }
  .cat-tab.active {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
  }
  .cat-tab .cat-icon { font-size: 16px; }

  /* ── Product Grid ── */
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 12px;
    overflow-y: auto;
    flex: 1;
    padding-right: 8px;
    padding-bottom: 16px;
  }
  .product-grid::-webkit-scrollbar { width: 4px; }
  .product-grid::-webkit-scrollbar-track { background: transparent; }
  .product-grid::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .product-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }
  .product-card:hover {
    border-color: var(--accent);
    background: var(--bg-card-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  .product-card.out-of-stock {
    opacity: 0.4;
    pointer-events: none;
  }
  .product-emoji {
    font-size: 36px;
    text-align: center;
    padding: 8px 0;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  }
  .product-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
  }
  .product-price {
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--accent);
    font-weight: 600;
  }
  .product-stock {
    font-size: 11px;
    color: var(--text-muted);
  }
  .product-qty-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: var(--accent);
    color: white;
    font-size: 12px;
    font-weight: 700;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(249,115,22,0.4);
  }

  /* ── Cart Panel ── */
  .cart-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-light);
  }
  .cart-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .cart-title {
    font-size: 16px;
    font-weight: 700;
  }
  .cart-count {
    font-size: 12px;
    color: var(--accent);
    background: var(--accent-soft);
    padding: 2px 10px;
    border-radius: 999px;
    font-weight: 600;
  }
  .cart-clear-btn {
    background: none;
    border: none;
    color: var(--danger);
    font-size: 12px;
    font-family: var(--font);
    font-weight: 600;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
  }
  .cart-clear-btn:hover { background: var(--danger-soft); }

  /* ── Order Type Selector ── */
  .order-type-row {
    display: flex;
    gap: 6px;
  }
  .order-type-btn {
    flex: 1;
    padding: 6px 4px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    font-size: 10px;
    font-family: var(--font);
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    line-height: 1.3;
  }
  .order-type-btn:hover { border-color: var(--text-muted); }
  .order-type-btn.active {
    background: var(--accent-soft);
    border-color: var(--accent);
    color: var(--accent);
  }
  .order-type-icon { font-size: 16px; display: block; margin-bottom: 2px; }

  /* ── Cart Items ── */
  .cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 12px 20px;
  }
  .cart-items::-webkit-scrollbar { width: 3px; }
  .cart-items::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .cart-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 12px;
    color: var(--text-muted);
  }
  .cart-empty-icon { font-size: 48px; opacity: 0.3; }
  .cart-empty-text { font-size: 14px; }

  .cart-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-light);
    animation: fadeSlideIn 0.25s ease;
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateX(12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .cart-item-emoji { font-size: 24px; padding-top: 2px; }
  .cart-item-info { flex: 1; min-width: 0; }
  .cart-item-name { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .cart-item-price { font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); }
  .cart-item-subtotal {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
    font-family: var(--font-mono);
    text-align: right;
    white-space: nowrap;
  }
  .cart-item-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
  }
  .qty-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--bg-elevated);
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .qty-btn:hover { border-color: var(--accent); color: var(--accent); }
  .qty-btn.danger:hover { border-color: var(--danger); color: var(--danger); }
  .qty-value {
    font-size: 14px;
    font-weight: 700;
    font-family: var(--font-mono);
    min-width: 20px;
    text-align: center;
  }
  .cart-item-note-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 11px;
    cursor: pointer;
    font-family: var(--font);
    padding: 2px 6px;
    border-radius: 4px;
  }
  .cart-item-note-btn:hover { background: var(--bg-elevated); color: var(--text-secondary); }
  .cart-item-note {
    font-size: 11px;
    color: var(--warning);
    font-style: italic;
    margin-top: 4px;
    padding: 4px 8px;
    background: rgba(245, 158, 11, 0.08);
    border-radius: 4px;
  }

  /* ── Cart Footer ── */
  .cart-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--border-light);
    background: var(--bg-secondary);
  }
  .cart-summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }
  .cart-total-row {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 800;
    color: var(--text-primary);
    margin: 12px 0 16px;
    padding-top: 12px;
    border-top: 2px dashed var(--border);
  }
  .cart-total-row .total-amount {
    font-family: var(--font-mono);
    color: var(--accent);
  }

  /* ── Buttons ── */
  .btn-primary {
    width: 100%;
    height: 48px;
    background: linear-gradient(135deg, var(--accent), #EA580C);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(249,115,22,0.3);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(249,115,22,0.4); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-secondary {
    width: 100%;
    height: 42px;
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-family: var(--font);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-secondary:hover { border-color: var(--text-muted); }

  /* ── Modal Overlay ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 28px;
    width: 90%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .modal-title {
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .modal-close {
    margin-left: auto;
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 8px;
  }
  .modal-close:hover { background: var(--bg-card); color: var(--text-primary); }

  /* ── Payment Section ── */
  .payment-methods {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }
  .pay-method-btn {
    padding: 12px 8px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 600;
    font-family: var(--font);
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
  }
  .pay-method-btn:hover { border-color: var(--text-muted); }
  .pay-method-btn.active { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
  .pay-method-icon { font-size: 24px; display: block; margin-bottom: 4px; }
  .pay-input {
    width: 100%;
    height: 48px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 0 16px;
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    outline: none;
    margin-bottom: 12px;
    text-align: right;
  }
  .pay-input:focus { border-color: var(--accent); }
  .quick-cash {
    display: flex;
    gap: 6px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .quick-cash button {
    flex: 1;
    min-width: 70px;
    padding: 8px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .quick-cash button:hover { border-color: var(--accent); color: var(--accent); }
  .change-display {
    text-align: center;
    padding: 16px;
    background: var(--success-soft);
    border-radius: var(--radius-md);
    margin-bottom: 16px;
  }
  .change-label { font-size: 13px; color: var(--success); margin-bottom: 4px; }
  .change-amount { font-size: 28px; font-weight: 800; color: var(--success); font-family: var(--font-mono); }

  /* ── Receipt ── */
  .receipt-box {
    background: #FFF;
    color: #111;
    border-radius: var(--radius-md);
    padding: 24px;
    font-size: 12px;
    margin-bottom: 16px;
    font-family: var(--font-mono);
  }
  .receipt-header { text-align: center; margin-bottom: 16px; }
  .receipt-shop-name { font-size: 18px; font-weight: 800; font-family: var(--font); }
  .receipt-divider { border: none; border-top: 1px dashed #CCC; margin: 10px 0; }
  .receipt-row { display: flex; justify-content: space-between; padding: 2px 0; }
  .receipt-item-row { padding: 4px 0; }
  .receipt-item-qty { color: #666; }
  .receipt-total-row { font-weight: 700; font-size: 14px; padding: 6px 0; }
  .receipt-footer { text-align: center; margin-top: 12px; color: #888; font-size: 11px; }

  /* ── Stats Cards ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    padding: 20px 24px;
  }
  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .stat-icon-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .stat-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  .stat-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }
  .stat-value { font-size: 24px; font-weight: 800; font-family: var(--font-mono); }

  /* ── History Table ── */
  .history-page {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
  }
  .history-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }
  .history-table th {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: var(--bg-primary);
    z-index: 1;
  }
  .history-table td {
    padding: 12px 16px;
    font-size: 13px;
    border-bottom: 1px solid var(--border-light);
    vertical-align: middle;
  }
  .history-table tr:hover td { background: var(--bg-card); }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
  }
  .badge-success { background: var(--success-soft); color: var(--success); }
  .badge-info { background: var(--info-soft); color: var(--info); }
  .badge-warning { background: rgba(245,158,11,0.12); color: var(--warning); }

  /* ── Stock / Product Mgmt ── */
  .mgmt-page {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
  }
  .mgmt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .mgmt-title { font-size: 20px; font-weight: 800; }
  .add-product-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  .add-product-btn:hover { background: var(--accent-hover); }
  .stock-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }
  .stock-table th {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-primary);
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .stock-table td {
    padding: 10px 16px;
    font-size: 13px;
    border-bottom: 1px solid var(--border-light);
  }
  .stock-table tr:hover td { background: var(--bg-card); }
  .stock-input {
    width: 80px;
    height: 32px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0 8px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-primary);
    text-align: center;
    outline: none;
  }
  .stock-input:focus { border-color: var(--accent); }
  .stock-low { color: var(--danger); font-weight: 700; }

  /* ── Report Page ── */
  .report-page {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
  }
  .chart-placeholder {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 24px;
    margin-bottom: 20px;
  }
  .chart-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 160px;
    padding-top: 20px;
  }
  .bar-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .bar {
    width: 100%;
    border-radius: 6px 6px 0 0;
    transition: height 0.5s ease;
    min-height: 4px;
  }
  .bar-label { font-size: 10px; color: var(--text-muted); }
  .bar-value { font-size: 10px; color: var(--text-secondary); font-family: var(--font-mono); font-weight: 600; }

  /* ── Settings ── */
  .settings-page {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
  }
  .settings-section {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    margin-bottom: 16px;
  }
  .settings-section-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-light);
  }
  .setting-row:last-child { border-bottom: none; }
  .setting-label { font-size: 14px; color: var(--text-secondary); }
  .setting-input {
    width: 240px;
    height: 36px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0 12px;
    font-family: var(--font);
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
  }
  .setting-input:focus { border-color: var(--accent); }

  /* ── Animations ── */
  .page-enter { animation: pageEnter 0.3s ease; }
  @keyframes pageEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Mobile responsive ── */
  @media (max-width: 900px) {
    .pos-cart { width: 320px; }
    .product-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
  }
  @media (max-width: 700px) {
    .sidebar { width: 56px; }
    .pos-cart { 
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      max-width: 380px;
      z-index: 200;
      box-shadow: var(--shadow-lg);
      transition: transform 0.3s ease;
    }
    .pos-cart.hidden { transform: translateX(100%); }
    .topbar { padding: 0 12px; }
    .pos-products { padding: 12px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); padding: 12px; }
  }
`;

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── Sidebar Navigation ──
const Sidebar = ({ page, setPage, cartCount }) => {
  const navItems = [
    { id: "pos", icon: "cart", label: "Kasir" },
    { id: "history", icon: "clock", label: "Riwayat" },
    { id: "products", icon: "box", label: "Produk" },
    { id: "reports", icon: "chart", label: "Laporan" },
    { id: "settings", icon: "settings", label: "Pengaturan" },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">🔥</div>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`sidebar-btn ${page === item.id ? "active" : ""}`}
          onClick={() => setPage(item.id)}
          title={item.label}
        >
          <Icon name={item.icon} size={22} />
          {item.id === "pos" && cartCount > 0 && (
            <span className="sidebar-badge">{cartCount}</span>
          )}
        </button>
      ))}
      <div className="sidebar-spacer" />
    </nav>
  );
};

// ── TopBar ──
const TopBar = ({ page, search, setSearch, shopName }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const titles = {
    pos: "Kasir",
    history: "Riwayat Transaksi",
    products: "Kelola Produk & Stok",
    reports: "Laporan Penjualan",
    settings: "Pengaturan",
  };

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{titles[page]}</div>
        <div className="topbar-subtitle">{shopName}</div>
      </div>
      {page === "pos" && (
        <div className="search-box">
          <span className="search-icon"><Icon name="search" size={16} /></span>
          <input
            type="text"
            placeholder="Cari menu... (contoh: indomie goreng)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}
      <div className="topbar-spacer" />
      <div className="topbar-clock">
        {time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
      <div className="topbar-user">
        <div className="topbar-avatar">K</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Kasir 1</div>
        </div>
      </div>
    </header>
  );
};

// ── Product Card ──
const ProductCard = ({ product, qtyInCart, onAdd }) => (
  <div
    className={`product-card ${product.stock <= 0 ? "out-of-stock" : ""}`}
    onClick={() => product.stock > 0 && onAdd(product)}
  >
    {qtyInCart > 0 && <div className="product-qty-badge">{qtyInCart}</div>}
    <div className="product-emoji">{product.image}</div>
    <div className="product-name">{product.name}</div>
    <div className="product-price">{formatRupiah(product.price)}</div>
    <div className="product-stock">
      {product.stock <= 0 ? "Habis" : `Stok: ${product.stock}`}
    </div>
  </div>
);

// ── Cart Item ──
const CartItem = ({ item, onInc, onDec, onRemove, onNote }) => (
  <div className="cart-item">
    <div className="cart-item-emoji">{item.image}</div>
    <div className="cart-item-info">
      <div className="cart-item-name">{item.name}</div>
      <div className="cart-item-price">{formatRupiah(item.price)} /pcs</div>
      <div className="cart-item-controls">
        <button className="qty-btn danger" onClick={() => item.qty === 1 ? onRemove(item.id) : onDec(item.id)}>
          {item.qty === 1 ? <Icon name="trash" size={14} /> : <Icon name="minus" size={14} />}
        </button>
        <span className="qty-value">{item.qty}</span>
        <button className="qty-btn" onClick={() => onInc(item.id)}>
          <Icon name="plus" size={14} />
        </button>
        <button className="cart-item-note-btn" onClick={() => onNote(item.id)}>
          {item.note ? "✏️" : "+ catatan"}
        </button>
      </div>
      {item.note && <div className="cart-item-note">📝 {item.note}</div>}
    </div>
    <div className="cart-item-subtotal">{formatRupiah(item.price * item.qty)}</div>
  </div>
);

// ── Payment Modal ──
const PaymentModal = ({ cart, orderType, total, onClose, onComplete }) => {
  const [method, setMethod] = useState("cash");
  const [cashInput, setCashInput] = useState("");
  const [step, setStep] = useState("pay"); // pay | receipt
  const [txn, setTxn] = useState(null);
  const cashNum = parseInt(cashInput.replace(/\D/g, "")) || 0;
  const change = cashNum - total;

  const quickAmounts = [
    total,
    Math.ceil(total / 5000) * 5000,
    Math.ceil(total / 10000) * 10000,
    Math.ceil(total / 20000) * 20000,
    Math.ceil(total / 50000) * 50000,
    100000,
  ];
  const uniqueQuick = [...new Set(quickAmounts)].filter(a => a >= total).slice(0, 4);

  const handlePay = () => {
    if (method === "cash" && cashNum < total) return;
    const newTxn = {
      id: generateId(),
      items: [...cart],
      total,
      payment: method,
      cashPaid: method === "cash" ? cashNum : total,
      change: method === "cash" ? change : 0,
      orderType,
      timestamp: new Date().toISOString(),
    };
    setTxn(newTxn);
    setStep("receipt");
  };

  if (step === "receipt" && txn) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
          <div className="receipt-box">
            <div className="receipt-header">
              <div className="receipt-shop-name">🔥 WARMINDO JAYA</div>
              <div style={{ fontSize: 11, color: "#888" }}>Jl. Raya No. 123, Ciputat</div>
              <div style={{ fontSize: 11, color: "#888" }}>{formatDate(txn.timestamp)} {formatTime(txn.timestamp)}</div>
              <div style={{ fontSize: 11, color: "#888" }}>#{txn.id.toUpperCase()}</div>
            </div>
            <hr className="receipt-divider" />
            <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
              {ORDER_TYPES.find(t => t.id === txn.orderType)?.icon} {ORDER_TYPES.find(t => t.id === txn.orderType)?.label}
            </div>
            {txn.items.map((it, i) => (
              <div key={i} className="receipt-item-row">
                <div className="receipt-row">
                  <span>{it.name}</span>
                  <span>{formatRupiah(it.price * it.qty)}</span>
                </div>
                <div className="receipt-item-qty">  {it.qty}x {formatRupiah(it.price)}</div>
                {it.note && <div style={{ fontSize: 10, color: "#999", paddingLeft: 8 }}>📝 {it.note}</div>}
              </div>
            ))}
            <hr className="receipt-divider" />
            <div className="receipt-row receipt-total-row">
              <span>TOTAL</span>
              <span>{formatRupiah(txn.total)}</span>
            </div>
            <div className="receipt-row">
              <span>Bayar ({PAYMENT_METHODS.find(m => m.id === txn.payment)?.label})</span>
              <span>{formatRupiah(txn.cashPaid)}</span>
            </div>
            {txn.change > 0 && (
              <div className="receipt-row" style={{ fontWeight: 700 }}>
                <span>Kembali</span>
                <span>{formatRupiah(txn.change)}</span>
              </div>
            )}
            <hr className="receipt-divider" />
            <div className="receipt-footer">
              Terima kasih sudah makan di Warmindo Jaya!<br />
              Semoga berkah & kenyang selalu 🤲
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => window.print()}>
              <Icon name="printer" size={16} /> Cetak Struk
            </button>
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={() => { onComplete(txn); onClose(); }}
            >
              <Icon name="check" size={18} /> Selesai
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          💳 Pembayaran
          <button className="modal-close" onClick={onClose}><Icon name="x" size={20} /></button>
        </div>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Total Tagihan</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
            {formatRupiah(total)}
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>Metode Pembayaran</div>
        <div className="payment-methods">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              className={`pay-method-btn ${method === m.id ? "active" : ""}`}
              onClick={() => setMethod(m.id)}
            >
              <span className="pay-method-icon">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {method === "cash" && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>Uang Diterima</div>
            <input
              className="pay-input"
              type="text"
              placeholder="0"
              value={cashInput ? formatRupiah(parseInt(cashInput.replace(/\D/g, "")) || 0).replace("Rp", "Rp ") : ""}
              onChange={(e) => setCashInput(e.target.value.replace(/\D/g, ""))}
              autoFocus
            />
            <div className="quick-cash">
              {uniqueQuick.map((amt) => (
                <button key={amt} onClick={() => setCashInput(String(amt))}>
                  {formatRupiah(amt)}
                </button>
              ))}
            </div>
            {cashNum >= total && (
              <div className="change-display">
                <div className="change-label">Kembalian</div>
                <div className="change-amount">{formatRupiah(change)}</div>
              </div>
            )}
          </>
        )}

        <button
          className="btn-primary"
          disabled={method === "cash" && cashNum < total}
          onClick={handlePay}
        >
          {method === "cash" && cashNum < total
            ? `Kurang ${formatRupiah(total - cashNum)}`
            : `✅ Bayar ${formatRupiah(total)}`}
        </button>
      </div>
    </div>
  );
};

// ── POS Page ──
const POSPage = ({ products, cart, setCart, orderType, setOrderType, onCheckout, search, setSearch }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") list = list.filter((p) => p.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, activeCategory, search]);

  const cartMap = useMemo(() => {
    const m = {};
    cart.forEach((c) => (m[c.id] = c.qty));
    return m;
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) {
        return prev.map((c) => (c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...product, qty: 1, note: "" }];
    });
  }, [setCart]);

  const incQty = useCallback((id) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c)));
  }, [setCart]);

  const decQty = useCallback((id) => {
    setCart((prev) => prev.map((c) => (c.id === id && c.qty > 1 ? { ...c, qty: c.qty - 1 } : c)));
  }, [setCart]);

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, [setCart]);

  const addNote = useCallback((id) => {
    const note = prompt("Catatan untuk item ini:");
    if (note !== null) {
      setCart((prev) => prev.map((c) => (c.id === id ? { ...c, note } : c)));
    }
  }, [setCart]);

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="page-body">
      <div className="pos-products">
        <div className="category-tabs">
          <button
            className={`cat-tab ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            <span className="cat-icon">🍽️</span> Semua
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`cat-tab ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              qtyInCart={cartMap[p.id] || 0}
              onAdd={addToCart}
            />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              Menu tidak ditemukan
            </div>
          )}
        </div>
      </div>

      <div className={`pos-cart ${mobileCartOpen ? "" : "hidden"}`}>
        <div className="cart-header">
          <div className="cart-header-row">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="cart-title">Pesanan</span>
              {totalItems > 0 && <span className="cart-count">{totalItems} item</span>}
            </div>
            {cart.length > 0 && (
              <button className="cart-clear-btn" onClick={() => setCart([])}>
                <Icon name="trash" size={14} /> Hapus
              </button>
            )}
          </div>
          <div className="order-type-row">
            {ORDER_TYPES.map((t) => (
              <button
                key={t.id}
                className={`order-type-btn ${orderType === t.id ? "active" : ""}`}
                onClick={() => setOrderType(t.id)}
              >
                <span className="order-type-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <div className="cart-empty-text">Belum ada pesanan</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Klik menu untuk menambahkan</div>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onInc={incQty}
                onDec={decQty}
                onRemove={removeItem}
                onNote={addNote}
              />
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal ({totalItems} item)</span>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{formatRupiah(subtotal)}</span>
            </div>
            <div className="cart-total-row">
              <span>Total</span>
              <span className="total-amount">{formatRupiah(subtotal)}</span>
            </div>
            <button className="btn-primary" onClick={() => onCheckout(subtotal)}>
              💳 Bayar — {formatRupiah(subtotal)}
            </button>
          </div>
        )}
      </div>

      {/* Mobile FAB to toggle cart */}
      <button
        style={{
          display: "none",
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--accent)",
          color: "white",
          border: "none",
          boxShadow: "var(--shadow-lg)",
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 150,
          fontSize: 24,
        }}
        className="mobile-cart-fab"
        onClick={() => setMobileCartOpen(!mobileCartOpen)}
      >
        🛒
        {totalItems > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "var(--danger)", color: "white",
            fontSize: 11, fontWeight: 700,
            width: 22, height: 22, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
};

// ── History Page ──
const HistoryPage = ({ transactions }) => {
  const sorted = [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const todayTotal = sorted
    .filter((t) => t.timestamp.startsWith(todayStr()))
    .reduce((s, t) => s + t.total, 0);

  return (
    <div className="page-enter">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-row">
            <div className="stat-icon-box" style={{ background: "var(--accent-soft)" }}>📊</div>
          </div>
          <div className="stat-label">Transaksi Hari Ini</div>
          <div className="stat-value">{sorted.filter((t) => t.timestamp.startsWith(todayStr())).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div className="stat-icon-box" style={{ background: "var(--success-soft)" }}>💰</div>
          </div>
          <div className="stat-label">Pendapatan Hari Ini</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>{formatRupiah(todayTotal)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div className="stat-icon-box" style={{ background: "var(--info-soft)" }}>📈</div>
          </div>
          <div className="stat-label">Rata-rata per Transaksi</div>
          <div className="stat-value">
            {sorted.filter(t => t.timestamp.startsWith(todayStr())).length > 0
              ? formatRupiah(Math.round(todayTotal / sorted.filter(t => t.timestamp.startsWith(todayStr())).length))
              : "Rp0"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div className="stat-icon-box" style={{ background: "rgba(245,158,11,0.12)" }}>🛍️</div>
          </div>
          <div className="stat-label">Total Semua Transaksi</div>
          <div className="stat-value">{transactions.length}</div>
        </div>
      </div>

      <div className="history-page">
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            Belum ada transaksi
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Waktu</th>
                <th>Item</th>
                <th>Tipe</th>
                <th>Pembayaran</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((txn) => (
                <tr key={txn.id}>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                    #{txn.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td>
                    <div>{formatDate(txn.timestamp)}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatTime(txn.timestamp)}</div>
                  </td>
                  <td>
                    <div>{txn.items.map((i) => `${i.name} x${i.qty}`).join(", ")}</div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {ORDER_TYPES.find((t) => t.id === txn.orderType)?.icon}{" "}
                      {ORDER_TYPES.find((t) => t.id === txn.orderType)?.label}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      {PAYMENT_METHODS.find((m) => m.id === txn.payment)?.icon}{" "}
                      {PAYMENT_METHODS.find((m) => m.id === txn.payment)?.label}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                    {formatRupiah(txn.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ── Product Management ──
const ProductsPage = ({ products, setProducts }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", category: "indomie", stock: "", image: "🍜" });

  const handleAdd = () => {
    if (!form.name || !form.price) return;
    const newProd = {
      id: Date.now(),
      name: form.name,
      price: parseInt(form.price),
      category: form.category,
      stock: parseInt(form.stock) || 0,
      image: form.image,
    };
    setProducts((prev) => [...prev, newProd]);
    setForm({ name: "", price: "", category: "indomie", stock: "", image: "🍜" });
    setShowForm(false);
  };

  const updateStock = (id, newStock) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, parseInt(newStock) || 0) } : p))
    );
  };

  const deleteProduct = (id) => {
    if (confirm("Hapus produk ini?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="mgmt-page page-enter">
      <div className="mgmt-header">
        <div className="mgmt-title">Kelola Produk ({products.length})</div>
        <button className="add-product-btn" onClick={() => setShowForm(!showForm)}>
          <Icon name="plus" size={16} /> Tambah Produk
        </button>
      </div>

      {showForm && (
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: 20,
          marginBottom: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Emoji</label>
            <input className="stock-input" style={{ width: 60, fontSize: 20 }} value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Nama Menu</label>
            <input className="setting-input" style={{ width: "100%" }} placeholder="Indomie Special"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ minWidth: 120 }}>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Harga</label>
            <input className="setting-input" style={{ width: "100%" }} type="number" placeholder="10000"
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div style={{ minWidth: 120 }}>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Kategori</label>
            <select className="setting-input" style={{ width: "100%" }} value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div style={{ minWidth: 80 }}>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Stok</label>
            <input className="stock-input" style={{ width: "100%" }} type="number" placeholder="50"
              value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <button className="add-product-btn" onClick={handleAdd}>
            <Icon name="check" size={16} /> Simpan
          </button>
        </div>
      )}

      <table className="stock-table">
        <thead>
          <tr>
            <th></th>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={{ fontSize: 24 }}>{p.image}</td>
              <td style={{ fontWeight: 600 }}>{p.name}</td>
              <td>
                <span className="badge badge-info">
                  {CATEGORIES.find((c) => c.id === p.category)?.icon}{" "}
                  {CATEGORIES.find((c) => c.id === p.category)?.name}
                </span>
              </td>
              <td style={{ fontFamily: "var(--font-mono)" }}>{formatRupiah(p.price)}</td>
              <td>
                <input
                  className={`stock-input ${p.stock <= 5 ? "stock-low" : ""}`}
                  type="number"
                  value={p.stock}
                  onChange={(e) => updateStock(p.id, e.target.value)}
                />
              </td>
              <td>
                <button
                  style={{
                    background: "none", border: "none", color: "var(--danger)",
                    cursor: "pointer", padding: 4, borderRadius: 6,
                  }}
                  onClick={() => deleteProduct(p.id)}
                >
                  <Icon name="trash" size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Reports Page ──
const ReportsPage = ({ transactions }) => {
  const today = todayStr();
  const todayTxns = transactions.filter((t) => t.timestamp.startsWith(today));
  const todayRevenue = todayTxns.reduce((s, t) => s + t.total, 0);

  // Category breakdown
  const catBreakdown = {};
  todayTxns.forEach((t) =>
    t.items.forEach((item) => {
      const cat = CATEGORIES.find((c) => c.id === item.category)?.name || "Lainnya";
      catBreakdown[cat] = (catBreakdown[cat] || 0) + item.price * item.qty;
    })
  );
  const catEntries = Object.entries(catBreakdown).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...catEntries.map((e) => e[1]), 1);

  // Best sellers
  const itemSales = {};
  todayTxns.forEach((t) =>
    t.items.forEach((item) => {
      itemSales[item.name] = (itemSales[item.name] || 0) + item.qty;
    })
  );
  const bestSellers = Object.entries(itemSales).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxSales = Math.max(...bestSellers.map((e) => e[1]), 1);

  // Payment breakdown
  const payBreakdown = {};
  todayTxns.forEach((t) => {
    const label = PAYMENT_METHODS.find((m) => m.id === t.payment)?.label || t.payment;
    payBreakdown[label] = (payBreakdown[label] || 0) + t.total;
  });

  return (
    <div className="report-page page-enter">
      <div className="stats-grid" style={{ padding: 0, marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div className="stat-icon-box" style={{ background: "var(--accent-soft)" }}>🧾</div>
          </div>
          <div className="stat-label">Total Transaksi Hari Ini</div>
          <div className="stat-value">{todayTxns.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div className="stat-icon-box" style={{ background: "var(--success-soft)" }}>💰</div>
          </div>
          <div className="stat-label">Revenue Hari Ini</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>{formatRupiah(todayRevenue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div className="stat-icon-box" style={{ background: "var(--info-soft)" }}>📊</div>
          </div>
          <div className="stat-label">Avg Ticket Size</div>
          <div className="stat-value">
            {todayTxns.length > 0 ? formatRupiah(Math.round(todayRevenue / todayTxns.length)) : "Rp0"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div className="stat-icon-box" style={{ background: "rgba(245,158,11,0.12)" }}>🛍️</div>
          </div>
          <div className="stat-label">Total Item Terjual</div>
          <div className="stat-value">
            {todayTxns.reduce((s, t) => s + t.items.reduce((si, i) => si + i.qty, 0), 0)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="chart-placeholder">
          <div className="chart-title">🏆 Menu Terlaris Hari Ini</div>
          {bestSellers.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>Belum ada data</div>
          ) : (
            <div className="bar-chart">
              {bestSellers.map(([name, qty]) => (
                <div className="bar-col" key={name}>
                  <div className="bar-value">{qty}</div>
                  <div
                    className="bar"
                    style={{
                      height: `${(qty / maxSales) * 120}px`,
                      background: `linear-gradient(180deg, var(--accent), #DC2626)`,
                    }}
                  />
                  <div className="bar-label">{name.length > 10 ? name.slice(0, 10) + "…" : name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chart-placeholder">
          <div className="chart-title">📂 Revenue per Kategori</div>
          {catEntries.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>Belum ada data</div>
          ) : (
            <div className="bar-chart">
              {catEntries.map(([name, total]) => (
                <div className="bar-col" key={name}>
                  <div className="bar-value">{formatRupiah(total)}</div>
                  <div
                    className="bar"
                    style={{
                      height: `${(total / maxCat) * 120}px`,
                      background: `linear-gradient(180deg, #2A9D8F, #264653)`,
                    }}
                  />
                  <div className="bar-label">{name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chart-placeholder" style={{ gridColumn: "1 / -1" }}>
          <div className="chart-title">💳 Breakdown Metode Pembayaran</div>
          {Object.keys(payBreakdown).length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>Belum ada data</div>
          ) : (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {Object.entries(payBreakdown).map(([method, amount]) => (
                <div key={method} style={{
                  flex: 1, minWidth: 140,
                  background: "var(--bg-elevated)", borderRadius: "var(--radius-md)",
                  padding: 16, textAlign: "center",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{method}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                    {formatRupiah(amount)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                    {todayRevenue > 0 ? Math.round((amount / todayRevenue) * 100) : 0}% dari total
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Settings Page ──
const SettingsPage = ({ shopName, setShopName }) => {
  const [tempName, setTempName] = useState(shopName);

  return (
    <div className="settings-page page-enter">
      <div className="settings-section">
        <div className="settings-section-title">🏪 Informasi Toko</div>
        <div className="setting-row">
          <span className="setting-label">Nama Warung</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="setting-input"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
            <button
              className="add-product-btn"
              style={{ padding: "0 16px", height: 36 }}
              onClick={() => setShopName(tempName)}
            >
              Simpan
            </button>
          </div>
        </div>
        <div className="setting-row">
          <span className="setting-label">Alamat</span>
          <input className="setting-input" defaultValue="Jl. Raya No. 123, Ciputat" />
        </div>
        <div className="setting-row">
          <span className="setting-label">No. Telp</span>
          <input className="setting-input" defaultValue="0812-xxxx-xxxx" />
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">🖨️ Struk & Pembayaran</div>
        <div className="setting-row">
          <span className="setting-label">Pesan di Struk</span>
          <input className="setting-input" defaultValue="Terima kasih sudah makan di Warmindo Jaya!" />
        </div>
        <div className="setting-row">
          <span className="setting-label">Pajak (%)</span>
          <input className="setting-input" type="number" defaultValue="0" style={{ width: 100 }} />
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">👤 Kasir</div>
        <div className="setting-row">
          <span className="setting-label">Nama Kasir</span>
          <input className="setting-input" defaultValue="Kasir 1" />
        </div>
      </div>

      <div className="settings-section" style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}>
        <div className="settings-section-title" style={{ color: "var(--accent)" }}>🔥 Warmindo POS v1.0</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Aplikasi kasir khusus warung makan Indonesia.
          Dibangun dengan React — terinspirasi dari Qasir.id.
          <br /><br />
          Fitur: POS / Kasir, Manajemen Produk & Stok, Riwayat Transaksi,
          Laporan Penjualan, Multi Tipe Pesanan (Dine In / Bungkus / GoFood / GrabFood),
          Multi Metode Pembayaran, Cetak Struk, dan lainnya.
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
  const [products, setProducts] = useLocalState("warmindo_products", INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useLocalState("warmindo_txns", []);
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("dine_in");
  const [search, setSearch] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [shopName, setShopName] = useLocalState("warmindo_shop", "Warmindo Jaya");

  const handleCheckout = (total) => {
    setCheckoutTotal(total);
    setPaymentOpen(true);
  };

  const handlePaymentComplete = (txn) => {
    setTransactions((prev) => [...prev, txn]);
    // Reduce stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        if (cartItem) return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
        return p;
      })
    );
    setCart([]);
    setOrderType("dine_in");
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <>
      <style>{STYLES}</style>
      <div className="warmindo-app">
        <Sidebar page={page} setPage={setPage} cartCount={cartCount} />
        <div className="main-content">
          <TopBar page={page} search={search} setSearch={setSearch} shopName={shopName} />
          {page === "pos" && (
            <POSPage
              products={products}
              cart={cart}
              setCart={setCart}
              orderType={orderType}
              setOrderType={setOrderType}
              onCheckout={handleCheckout}
              search={search}
              setSearch={setSearch}
            />
          )}
          {page === "history" && <HistoryPage transactions={transactions} />}
          {page === "products" && <ProductsPage products={products} setProducts={setProducts} />}
          {page === "reports" && <ReportsPage transactions={transactions} />}
          {page === "settings" && <SettingsPage shopName={shopName} setShopName={setShopName} />}
        </div>

        {paymentOpen && (
          <PaymentModal
            cart={cart}
            orderType={orderType}
            total={checkoutTotal}
            onClose={() => setPaymentOpen(false)}
            onComplete={handlePaymentComplete}
          />
        )}
      </div>
    </>
  );
}
