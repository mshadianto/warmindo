import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// WARMINDO — USER ROLE & MENU MANAGEMENT
// Owner: dietz1312@gmail.com | Super Admin: sopian.hadianto@gmail.com
// Owner & Manager can Add/Remove Menu Items
// ═══════════════════════════════════════════════════════════════

const ROLE_LEVELS = { owner: 4, super_admin: 3, manager: 2, kasir: 1 };
const ROLE_LABELS = { owner: "Owner", super_admin: "Super Admin", manager: "Manager", kasir: "Kasir" };
const ROLE_COLORS = { owner: "#e11d48", super_admin: "#7c3aed", manager: "#2563eb", kasir: "#64748b" };
const ROLE_BG = { owner: "rgba(225,29,72,.1)", super_admin: "rgba(124,58,237,.1)", manager: "rgba(37,99,235,.1)", kasir: "rgba(100,116,139,.1)" };

const INITIAL_USERS = [
  { id: "u1", name: "Dietz (Owner)", email: "dietz1312@gmail.com", role: "owner", pin: "1312", active: true, createdAt: "2024-01-01" },
  { id: "u2", name: "Sopian Hadianto", email: "sopian.hadianto@gmail.com", role: "super_admin", pin: "2024", active: true, createdAt: "2024-01-15" },
  { id: "u3", name: "Rifki", email: "rifki@warmindo.id", role: "manager", pin: "1111", active: true, createdAt: "2024-03-01" },
  { id: "u4", name: "Elma Fauziah", email: "elma@warmindo.id", role: "kasir", pin: "2222", active: true, createdAt: "2024-04-01" },
  { id: "u5", name: "Risha Septiani", email: "risha@warmindo.id", role: "kasir", pin: "3333", active: true, createdAt: "2024-05-01" },
];

const MENU_CATEGORIES = [
  { id: "indomie", name: "Indomie", emoji: "🍜" },
  { id: "nasi", name: "Nasi", emoji: "🍚" },
  { id: "makanan", name: "Makanan", emoji: "🍛" },
  { id: "gorengan", name: "Gorengan", emoji: "🍤" },
  { id: "minuman", name: "Minuman", emoji: "🥤" },
  { id: "snack", name: "Snack", emoji: "🍢" },
  { id: "extra", name: "Topping", emoji: "➕" },
];

const INITIAL_MENU = [
  { id: 1, name: "Indomie Goreng", price: 8000, cat: "indomie", emoji: "🍜", active: true },
  { id: 2, name: "Indomie Rebus", price: 8000, cat: "indomie", emoji: "🍜", active: true },
  { id: 3, name: "Indomie Goreng Telur", price: 12000, cat: "indomie", emoji: "🍳", active: true },
  { id: 4, name: "Indomie Rebus Telur", price: 12000, cat: "indomie", emoji: "🍳", active: true },
  { id: 5, name: "Indomie Double", price: 14000, cat: "indomie", emoji: "🍜", active: true },
  { id: 6, name: "Indomie Nyemek", price: 10000, cat: "indomie", emoji: "🍜", active: true },
  { id: 7, name: "Indomie Seblak", price: 13000, cat: "indomie", emoji: "🌶️", active: true },
  { id: 8, name: "Mie Goreng Jawa", price: 15000, cat: "indomie", emoji: "🍝", active: true },
  { id: 9, name: "Mie Bangladesh", price: 15000, cat: "indomie", emoji: "🍜", active: true },
  { id: 10, name: "Nasi Goreng", price: 15000, cat: "nasi", emoji: "🍛", active: true },
  { id: 11, name: "Nasi Goreng Daun Jeruk", price: 15000, cat: "nasi", emoji: "🍛", active: true },
  { id: 12, name: "Nasi Goreng Djaya", price: 15000, cat: "nasi", emoji: "🍛", active: true },
  { id: 13, name: "Nasi Telur", price: 10000, cat: "nasi", emoji: "🍚", active: true },
  { id: 14, name: "Nasi Putih", price: 5000, cat: "nasi", emoji: "🍚", active: true },
  { id: 15, name: "Nasi Uduk", price: 8000, cat: "nasi", emoji: "🍚", active: true },
  { id: 16, name: "Nasi Kuning", price: 10000, cat: "nasi", emoji: "🍛", active: true },
  { id: 17, name: "Ayam Penyet Sambal Ijo", price: 25000, cat: "makanan", emoji: "🍗", active: true },
  { id: 18, name: "Ayam Sambal Matah", price: 25000, cat: "makanan", emoji: "🍗", active: true },
  { id: 19, name: "Ayam Bakar", price: 25000, cat: "makanan", emoji: "🍗", active: true },
  { id: 20, name: "Ayam Hot Plate", price: 25000, cat: "makanan", emoji: "🍗", active: true },
  { id: 21, name: "Rice Bowl Asam Manis", price: 17000, cat: "makanan", emoji: "🍱", active: true },
  { id: 22, name: "Rice Bowl Chilli Padi", price: 17000, cat: "makanan", emoji: "🍱", active: true },
  { id: 23, name: "Dimsum Goreng", price: 15000, cat: "makanan", emoji: "🥟", active: true },
  { id: 24, name: "Risol 1 Porsi", price: 18000, cat: "makanan", emoji: "🥘", active: true },
  { id: 25, name: "Tempe Goreng", price: 3000, cat: "gorengan", emoji: "🟫", active: true },
  { id: 26, name: "Tahu Goreng", price: 3000, cat: "gorengan", emoji: "🟨", active: true },
  { id: 27, name: "Bakwan", price: 3000, cat: "gorengan", emoji: "🍤", active: true },
  { id: 28, name: "Tempe Mendoan", price: 4000, cat: "gorengan", emoji: "🟫", active: true },
  { id: 29, name: "Kentang Goreng", price: 12000, cat: "gorengan", emoji: "🍟", active: true },
  { id: 30, name: "Es Teh Manis", price: 5000, cat: "minuman", emoji: "🧊", active: true },
  { id: 31, name: "Teh Anget", price: 4000, cat: "minuman", emoji: "☕", active: true },
  { id: 32, name: "Es Jeruk", price: 6000, cat: "minuman", emoji: "🍊", active: true },
  { id: 33, name: "Kopi Hitam", price: 5000, cat: "minuman", emoji: "☕", active: true },
  { id: 34, name: "Es Kopi Susu", price: 10000, cat: "minuman", emoji: "🧋", active: true },
  { id: 35, name: "Air Mineral", price: 4000, cat: "minuman", emoji: "💧", active: true },
  { id: 36, name: "Milo", price: 8000, cat: "minuman", emoji: "🥛", active: true },
  { id: 37, name: "Ekstra Jos + Susu", price: 10000, cat: "minuman", emoji: "⚡", active: true },
  { id: 38, name: "Teh Tarik", price: 8000, cat: "minuman", emoji: "🍵", active: true },
  { id: 39, name: "Butterscotch Latte", price: 22000, cat: "minuman", emoji: "🧋", active: true },
  { id: 40, name: "Americano", price: 15000, cat: "minuman", emoji: "☕", active: true },
  { id: 41, name: "Matcha Latte", price: 20000, cat: "minuman", emoji: "🍵", active: true },
  { id: 42, name: "Kopsu Aren Creamy", price: 23000, cat: "minuman", emoji: "🧋", active: true },
  { id: 43, name: "Kerupuk", price: 2000, cat: "snack", emoji: "🍘", active: true },
  { id: 44, name: "Sate Telur Puyuh", price: 5000, cat: "snack", emoji: "🍢", active: true },
  { id: 45, name: "Cireng Rujak", price: 12000, cat: "snack", emoji: "🧆", active: true },
  { id: 46, name: "Cilok Goang", price: 10000, cat: "snack", emoji: "🍡", active: true },
  { id: 47, name: "Sosis Goreng", price: 10000, cat: "snack", emoji: "🌭", active: true },
  { id: 48, name: "Telur Ceplok", price: 5000, cat: "extra", emoji: "🍳", active: true },
  { id: 49, name: "Kornet", price: 5000, cat: "extra", emoji: "🥫", active: true },
  { id: 50, name: "Sosis", price: 5000, cat: "extra", emoji: "🌭", active: true },
  { id: 51, name: "Keju", price: 4000, cat: "extra", emoji: "🧀", active: true },
  { id: 52, name: "Piscok Lumer", price: 10000, cat: "snack", emoji: "🍫", active: true },
  { id: 53, name: "Jasuke Original", price: 10000, cat: "snack", emoji: "🌽", active: true },
];

// ─── PERSISTENCE ───
function useLS(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(val)); }, [key, val]);
  return [val, setVal];
}

// ─── PERMISSIONS ───
const canManageMenu = (role) => ["owner", "manager"].includes(role);
const canManageUsers = (role) => ["owner", "super_admin"].includes(role);
const canManageRoles = (role) => role === "owner";
const canDeleteUser = (currentRole, targetRole) => ROLE_LEVELS[currentRole] > ROLE_LEVELS[targetRole];

// ─── FORMAT ───
const rp = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

// ─── CSS ───
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
:root {
  --bg: #0c0e14; --bg2: #12151e; --bg3: #191d2b; --bg4: #1f2437;
  --t1: #f1f5f9; --t2: #cbd5e1; --t3: #94a3b8; --t4: #64748b;
  --accent: #f97316; --ac2: #fb923c; --green: #22c55e; --red: #ef4444;
  --blue: #3b82f6; --purple: #8b5cf6; --yellow: #eab308;
  --radius: 12px; --radius-sm: 8px; --radius-xs: 6px;
  --shadow: 0 4px 24px rgba(0,0,0,.4);
  --ff: 'Plus Jakarta Sans', system-ui, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
.W-root { font-family: var(--ff); background: var(--bg); color: var(--t1); min-height: 100vh; }

/* ─── LOGIN ─── */
.login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0c0e14 0%, #1a1025 50%, #0c0e14 100%); position: relative; overflow: hidden; }
.login-wrap::before { content: ''; position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(249,115,22,.08) 0%, transparent 70%); top: -200px; right: -100px; }
.login-wrap::after { content: ''; position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(139,92,246,.06) 0%, transparent 70%); bottom: -100px; left: -50px; }
.login-card { background: var(--bg2); border: 1px solid rgba(255,255,255,.06); border-radius: 20px; padding: 48px 40px; width: 420px; max-width: 90vw; position: relative; z-index: 1; box-shadow: var(--shadow); }
.login-logo { text-align: center; margin-bottom: 32px; }
.login-logo .fire { font-size: 48px; margin-bottom: 8px; }
.login-logo h1 { font-size: 24px; font-weight: 800; background: linear-gradient(135deg, var(--accent), var(--ac2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.login-logo p { color: var(--t4); font-size: 13px; margin-top: 4px; }
.login-field { margin-bottom: 16px; }
.login-field label { display: block; font-size: 12px; font-weight: 600; color: var(--t3); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .5px; }
.login-field input { width: 100%; padding: 12px 16px; background: var(--bg3); border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius-sm); color: var(--t1); font-family: var(--ff); font-size: 14px; outline: none; transition: all .2s; }
.login-field input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(249,115,22,.15); }
.login-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, var(--accent), #ea580c); border: none; border-radius: var(--radius-sm); color: #fff; font-family: var(--ff); font-size: 15px; font-weight: 700; cursor: pointer; transition: all .2s; margin-top: 8px; }
.login-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(249,115,22,.3); }
.login-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.login-err { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.2); border-radius: var(--radius-xs); padding: 10px 14px; color: var(--red); font-size: 13px; margin-bottom: 16px; }
.login-hint { text-align: center; margin-top: 20px; color: var(--t4); font-size: 12px; }

/* ─── LAYOUT ─── */
.app-layout { display: flex; min-height: 100vh; }
.sidebar { width: 260px; background: var(--bg2); border-right: 1px solid rgba(255,255,255,.06); display: flex; flex-direction: column; padding: 20px 0; flex-shrink: 0; }
.sb-logo { padding: 0 20px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,.06); margin-bottom: 16px; }
.sb-fire { font-size: 32px; }
.sb-brand { font-size: 18px; font-weight: 800; background: linear-gradient(135deg, var(--accent), var(--ac2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.sb-sub { font-size: 10px; color: var(--t4); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
.sb-nav { flex: 1; padding: 0 12px; }
.sb-label { font-size: 10px; font-weight: 700; color: var(--t4); text-transform: uppercase; letter-spacing: 1px; padding: 16px 12px 8px; }
.sb-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: var(--radius-sm); cursor: pointer; transition: all .15s; color: var(--t3); font-size: 13px; font-weight: 500; margin-bottom: 2px; }
.sb-item:hover { background: rgba(255,255,255,.04); color: var(--t2); }
.sb-item.on { background: rgba(249,115,22,.1); color: var(--accent); font-weight: 600; }
.sb-item .em { font-size: 18px; width: 24px; text-align: center; }
.sb-user { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,.06); margin-top: auto; }
.sb-user-info { display: flex; align-items: center; gap: 10px; }
.sb-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; }
.sb-uname { font-size: 13px; font-weight: 600; }
.sb-urole { font-size: 11px; margin-top: 2px; }
.sb-logout { margin-top: 10px; padding: 8px 12px; background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.15); border-radius: var(--radius-xs); color: var(--red); font-family: var(--ff); font-size: 12px; font-weight: 600; cursor: pointer; width: 100%; transition: all .15s; }
.sb-logout:hover { background: rgba(239,68,68,.2); }

/* ─── MAIN ─── */
.main-area { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 64px; background: var(--bg2); border-bottom: 1px solid rgba(255,255,255,.06); display: flex; align-items: center; padding: 0 28px; gap: 16px; }
.topbar-title { font-size: 18px; font-weight: 700; }
.topbar-badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; background: rgba(249,115,22,.1); color: var(--accent); letter-spacing: .5px; }
.topbar-sp { flex: 1; }
.topbar-clock { font-size: 13px; color: var(--t4); font-variant-numeric: tabular-nums; }
.content { flex: 1; padding: 28px; overflow-y: auto; }

/* ─── CARDS & TABLES ─── */
.card { background: var(--bg2); border: 1px solid rgba(255,255,255,.06); border-radius: var(--radius); padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card { background: var(--bg3); border: 1px solid rgba(255,255,255,.04); border-radius: var(--radius-sm); padding: 16px; }
.stat-label { font-size: 11px; color: var(--t4); font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
.stat-val { font-size: 28px; font-weight: 800; margin-top: 4px; }
.stat-sub { font-size: 11px; color: var(--t4); margin-top: 4px; }
table.tbl { width: 100%; border-collapse: collapse; }
table.tbl th { text-align: left; font-size: 11px; font-weight: 700; color: var(--t4); text-transform: uppercase; letter-spacing: .5px; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,.06); }
table.tbl td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,.04); font-size: 13px; }
table.tbl tr:hover { background: rgba(255,255,255,.02); }
.r { text-align: right; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }

/* ─── TABS ─── */
.tabs { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
.tab { padding: 8px 18px; border-radius: 20px; border: 1px solid rgba(255,255,255,.08); background: transparent; color: var(--t3); font-family: var(--ff); font-size: 13px; font-weight: 600; cursor: pointer; transition: all .15s; }
.tab:hover { background: rgba(255,255,255,.04); }
.tab.on { background: var(--accent); color: #fff; border-color: var(--accent); }

/* ─── FORM / MODAL ─── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: var(--bg2); border: 1px solid rgba(255,255,255,.08); border-radius: 16px; padding: 32px; width: 520px; max-width: 90vw; max-height: 85vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,.5); }
.modal h2 { font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 12px; font-weight: 600; color: var(--t3); margin-bottom: 6px; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 14px; background: var(--bg3); border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius-xs); color: var(--t1); font-family: var(--ff); font-size: 13px; outline: none; transition: border-color .2s; }
.form-group input:focus, .form-group select:focus { border-color: var(--accent); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.btn { padding: 10px 20px; border-radius: var(--radius-xs); border: none; font-family: var(--ff); font-size: 13px; font-weight: 600; cursor: pointer; transition: all .15s; }
.btn-primary { background: linear-gradient(135deg, var(--accent), #ea580c); color: #fff; }
.btn-primary:hover { box-shadow: 0 4px 16px rgba(249,115,22,.3); }
.btn-danger { background: rgba(239,68,68,.15); color: var(--red); border: 1px solid rgba(239,68,68,.2); }
.btn-danger:hover { background: rgba(239,68,68,.25); }
.btn-ghost { background: rgba(255,255,255,.06); color: var(--t2); border: 1px solid rgba(255,255,255,.08); }
.btn-ghost:hover { background: rgba(255,255,255,.1); }
.btn-sm { padding: 6px 14px; font-size: 12px; }
.btn-row { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.toggle { width: 40px; height: 22px; border-radius: 11px; background: var(--bg4); border: none; cursor: pointer; position: relative; transition: all .2s; }
.toggle.on { background: var(--green); }
.toggle::after { content: ''; position: absolute; width: 16px; height: 16px; background: #fff; border-radius: 50%; top: 3px; left: 3px; transition: all .2s; }
.toggle.on::after { left: 21px; }

/* ─── MENU GRID ─── */
.menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
.menu-item { background: var(--bg3); border: 1px solid rgba(255,255,255,.04); border-radius: var(--radius-sm); padding: 16px; transition: all .15s; position: relative; }
.menu-item:hover { border-color: rgba(255,255,255,.1); transform: translateY(-1px); }
.menu-item.inactive { opacity: .5; }
.mi-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.mi-emoji { font-size: 28px; }
.mi-name { font-size: 14px; font-weight: 600; flex: 1; }
.mi-cat { font-size: 10px; padding: 2px 8px; border-radius: 10px; background: rgba(249,115,22,.1); color: var(--accent); font-weight: 600; }
.mi-price { font-size: 18px; font-weight: 800; color: var(--accent); }
.mi-actions { display: flex; gap: 6px; margin-top: 10px; }
.mi-btn { padding: 5px 10px; border-radius: var(--radius-xs); border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.04); color: var(--t3); font-family: var(--ff); font-size: 11px; cursor: pointer; transition: all .15s; }
.mi-btn:hover { background: rgba(255,255,255,.08); color: var(--t1); }
.mi-btn.del { border-color: rgba(239,68,68,.2); color: var(--red); }
.mi-btn.del:hover { background: rgba(239,68,68,.15); }
.search-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.search-input { flex: 1; padding: 10px 16px; background: var(--bg3); border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius-sm); color: var(--t1); font-family: var(--ff); font-size: 13px; outline: none; }
.search-input:focus { border-color: var(--accent); }
.empty-state { text-align: center; padding: 48px 20px; color: var(--t4); }
.empty-state .big-em { font-size: 48px; margin-bottom: 12px; }
.toast { position: fixed; bottom: 24px; right: 24px; background: var(--bg3); border: 1px solid rgba(255,255,255,.1); border-radius: var(--radius-sm); padding: 14px 20px; color: var(--t1); font-size: 13px; font-weight: 500; z-index: 2000; box-shadow: 0 8px 32px rgba(0,0,0,.4); animation: slideUp .3s ease; display: flex; align-items: center; gap: 10px; }
.toast.success { border-left: 3px solid var(--green); }
.toast.error { border-left: 3px solid var(--red); }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.confirm-box { text-align: center; }
.confirm-box p { color: var(--t2); font-size: 14px; margin-bottom: 8px; }
.confirm-box .warn { color: var(--red); font-size: 12px; }
`;

// ═══ TOAST ═══
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast ${type}`}>{type === "success" ? "✅" : "❌"} {msg}</div>;
};

// ═══ CONFIRM MODAL ═══
const ConfirmModal = ({ title, message, warn, onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
      <h2>{title}</h2>
      <div className="confirm-box">
        <p>{message}</p>
        {warn && <p className="warn">{warn}</p>}
      </div>
      <div className="btn-row">
        <button className="btn btn-ghost" onClick={onCancel}>Batal</button>
        <button className="btn btn-danger" onClick={onConfirm}>Ya, Hapus</button>
      </div>
    </div>
  </div>
);

// ═══ LOGIN PAGE ═══
const LoginPage = ({ users, onLogin }) => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const handle = () => {
    const u = users.find(u => u.email === email.trim().toLowerCase() && u.pin === pin && u.active);
    if (u) onLogin(u);
    else setErr("Email atau PIN salah. Pastikan akun aktif.");
  };
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="fire">🔥</div>
          <h1>Warmindo Djaya Rasa</h1>
          <p>Sistem Manajemen Terpadu</p>
        </div>
        {err && <div className="login-err">{err}</div>}
        <div className="login-field">
          <label>Email</label>
          <input type="email" placeholder="nama@email.com" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && handle()} />
        </div>
        <div className="login-field">
          <label>PIN</label>
          <input type="password" placeholder="••••" maxLength={6} value={pin} onChange={e => { setPin(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && handle()} />
        </div>
        <button className="login-btn" onClick={handle}>Masuk</button>
        <div className="login-hint">Hubungi Owner untuk mendapatkan akses</div>
      </div>
    </div>
  );
};

// ═══ MENU FORM MODAL ═══
const MenuFormModal = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState(item || { name: "", price: "", cat: "makanan", emoji: "🍽️", active: true });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim() && form.price && form.cat;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{item ? "✏️ Edit Menu" : "➕ Tambah Menu Baru"}</h2>
        <div className="form-group">
          <label>Nama Menu</label>
          <input value={form.name} onChange={e => upd("name", e.target.value)} placeholder="Contoh: Indomie Goreng Spesial" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Harga (Rp)</label>
            <input type="number" value={form.price} onChange={e => upd("price", parseInt(e.target.value) || "")} placeholder="15000" />
          </div>
          <div className="form-group">
            <label>Kategori</label>
            <select value={form.cat} onChange={e => upd("cat", e.target.value)}>
              {MENU_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Emoji</label>
            <input value={form.emoji} onChange={e => upd("emoji", e.target.value)} placeholder="🍜" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <button className={`toggle ${form.active ? "on" : ""}`} onClick={() => upd("active", !form.active)} />
              <span style={{ fontSize: 13, color: form.active ? "var(--green)" : "var(--t4)" }}>{form.active ? "Aktif" : "Nonaktif"}</span>
            </div>
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={() => valid && onSave(form)} disabled={!valid}>{item ? "Simpan Perubahan" : "Tambah Menu"}</button>
        </div>
      </div>
    </div>
  );
};

// ═══ USER FORM MODAL ═══
const UserFormModal = ({ user, currentRole, onSave, onClose }) => {
  const [form, setForm] = useState(user || { name: "", email: "", role: "kasir", pin: "", active: true });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const roles = Object.keys(ROLE_LEVELS).filter(r => ROLE_LEVELS[r] < ROLE_LEVELS[currentRole] || (user && r === user.role));
  const valid = form.name.trim() && form.email.trim() && form.pin.length >= 4;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{user ? "✏️ Edit User" : "➕ Tambah User Baru"}</h2>
        <div className="form-group">
          <label>Nama Lengkap</label>
          <input value={form.name} onChange={e => upd("name", e.target.value)} placeholder="Nama lengkap" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => upd("email", e.target.value)} placeholder="email@domain.com" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={e => upd("role", e.target.value)}>
              {roles.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>PIN (min. 4 digit)</label>
            <input type="password" value={form.pin} onChange={e => upd("pin", e.target.value)} placeholder="••••" maxLength={6} />
          </div>
        </div>
        <div className="form-group">
          <label>Status</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <button className={`toggle ${form.active ? "on" : ""}`} onClick={() => upd("active", !form.active)} />
            <span style={{ fontSize: 13, color: form.active ? "var(--green)" : "var(--t4)" }}>{form.active ? "Aktif" : "Nonaktif"}</span>
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={() => valid && onSave(form)} disabled={!valid}>{user ? "Simpan" : "Tambah User"}</button>
        </div>
      </div>
    </div>
  );
};

// ═══ PAGE: MENU MANAGEMENT ═══
const MenuPage = ({ menu, setMenu, currentUser, toast }) => {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null = closed, {} = add, {item} = edit
  const [deleting, setDeleting] = useState(null);
  const allowed = canManageMenu(currentUser.role);

  const filtered = menu.filter(m => {
    if (cat !== "all" && m.cat !== cat) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSave = (form) => {
    if (form.id) {
      setMenu(prev => prev.map(m => m.id === form.id ? { ...m, ...form, price: parseInt(form.price) } : m));
      toast("Menu berhasil diupdate!", "success");
    } else {
      const newId = Math.max(0, ...menu.map(m => m.id)) + 1;
      setMenu(prev => [...prev, { ...form, id: newId, price: parseInt(form.price) }]);
      toast("Menu baru berhasil ditambahkan!", "success");
    }
    setEditing(null);
  };

  const handleDelete = () => {
    setMenu(prev => prev.filter(m => m.id !== deleting.id));
    toast(`"${deleting.name}" berhasil dihapus`, "success");
    setDeleting(null);
  };

  const toggleActive = (id) => {
    setMenu(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const catCounts = MENU_CATEGORIES.map(c => ({ ...c, count: menu.filter(m => m.cat === c.id).length }));

  return (
    <div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-label">Total Menu</div><div className="stat-val" style={{ color: "var(--accent)" }}>{menu.length}</div></div>
        <div className="stat-card"><div className="stat-label">Menu Aktif</div><div className="stat-val" style={{ color: "var(--green)" }}>{menu.filter(m => m.active).length}</div></div>
        <div className="stat-card"><div className="stat-label">Nonaktif</div><div className="stat-val" style={{ color: "var(--t4)" }}>{menu.filter(m => !m.active).length}</div></div>
        <div className="stat-card"><div className="stat-label">Kategori</div><div className="stat-val">{MENU_CATEGORIES.length}</div></div>
      </div>

      <div className="search-bar">
        <input className="search-input" placeholder="🔍 Cari menu..." value={search} onChange={e => setSearch(e.target.value)} />
        {allowed && <button className="btn btn-primary" onClick={() => setEditing({})}>➕ Tambah Menu</button>}
      </div>

      <div className="tabs">
        <button className={`tab ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>Semua ({menu.length})</button>
        {catCounts.map(c => (
          <button key={c.id} className={`tab ${cat === c.id ? "on" : ""}`} onClick={() => setCat(c.id)}>{c.emoji} {c.name} ({c.count})</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="big-em">🍽️</div><p>Tidak ada menu ditemukan</p></div>
      ) : (
        <div className="menu-grid">
          {filtered.map(m => (
            <div key={m.id} className={`menu-item ${m.active ? "" : "inactive"}`}>
              <div className="mi-top">
                <span className="mi-emoji">{m.emoji}</span>
                <span className="mi-name">{m.name}</span>
              </div>
              <div className="mi-cat">{MENU_CATEGORIES.find(c => c.id === m.cat)?.name || m.cat}</div>
              <div className="mi-price" style={{ marginTop: 8 }}>{rp(m.price)}</div>
              {allowed && (
                <div className="mi-actions">
                  <button className="mi-btn" onClick={() => setEditing(m)}>✏️ Edit</button>
                  <button className="mi-btn" onClick={() => toggleActive(m.id)}>{m.active ? "🔴 Nonaktifkan" : "🟢 Aktifkan"}</button>
                  <button className="mi-btn del" onClick={() => setDeleting(m)}>🗑️</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing !== null && <MenuFormModal item={editing.id ? editing : null} onSave={handleSave} onClose={() => setEditing(null)} />}
      {deleting && <ConfirmModal title="🗑️ Hapus Menu" message={`Yakin ingin menghapus "${deleting.name}"?`} warn="Aksi ini tidak dapat dibatalkan" onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  );
};

// ═══ PAGE: USER MANAGEMENT ═══
const UsersPage = ({ users, setUsers, currentUser, toast }) => {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const allowed = canManageUsers(currentUser.role);

  const handleSave = (form) => {
    if (form.id) {
      setUsers(prev => prev.map(u => u.id === form.id ? { ...u, ...form } : u));
      toast("User berhasil diupdate!", "success");
    } else {
      const newId = "u" + (Math.max(0, ...users.map(u => parseInt(u.id.slice(1)) || 0)) + 1);
      setUsers(prev => [...prev, { ...form, id: newId, createdAt: new Date().toISOString().slice(0, 10) }]);
      toast("User baru berhasil ditambahkan!", "success");
    }
    setEditing(null);
  };

  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== deleting.id));
    toast(`User "${deleting.name}" berhasil dihapus`, "success");
    setDeleting(null);
  };

  return (
    <div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-label">Total User</div><div className="stat-val">{users.length}</div></div>
        <div className="stat-card"><div className="stat-label">Aktif</div><div className="stat-val" style={{ color: "var(--green)" }}>{users.filter(u => u.active).length}</div></div>
        {Object.entries(ROLE_LABELS).map(([k, v]) => (
          <div className="stat-card" key={k}><div className="stat-label">{v}</div><div className="stat-val" style={{ color: ROLE_COLORS[k] }}>{users.filter(u => u.role === k).length}</div></div>
        ))}
      </div>

      {allowed && (
        <div style={{ marginBottom: 20 }}>
          <button className="btn btn-primary" onClick={() => setEditing({})}>➕ Tambah User</button>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Terdaftar</th>
              {allowed && <th className="r">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td style={{ color: "var(--t3)", fontSize: 12 }}>{u.email}</td>
                <td><span className="badge" style={{ background: ROLE_BG[u.role], color: ROLE_COLORS[u.role] }}>{ROLE_LABELS[u.role]}</span></td>
                <td><span className="badge" style={{ background: u.active ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.1)", color: u.active ? "var(--green)" : "var(--red)" }}>{u.active ? "Aktif" : "Nonaktif"}</span></td>
                <td style={{ color: "var(--t4)", fontSize: 12 }}>{u.createdAt}</td>
                {allowed && (
                  <td className="r">
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      {(canDeleteUser(currentUser.role, u.role) || u.id === currentUser.id) && (
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(u)}>✏️</button>
                      )}
                      {canDeleteUser(currentUser.role, u.role) && u.id !== currentUser.id && (
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleting(u)}>🗑️</button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== null && <UserFormModal user={editing.id ? editing : null} currentRole={currentUser.role} onSave={handleSave} onClose={() => setEditing(null)} />}
      {deleting && <ConfirmModal title="🗑️ Hapus User" message={`Yakin ingin menghapus "${deleting.name}"?`} warn="User tidak akan bisa login lagi" onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  );
};

// ═══ PAGE: ROLE PERMISSIONS ═══
const PermissionsPage = ({ currentUser }) => {
  const perms = [
    { feature: "Lihat Menu / POS", owner: true, super_admin: true, manager: true, kasir: true },
    { feature: "Tambah/Edit/Hapus Menu", owner: true, super_admin: false, manager: true, kasir: false },
    { feature: "Lihat Dashboard & Laporan", owner: true, super_admin: true, manager: true, kasir: false },
    { feature: "Kelola User & Role", owner: true, super_admin: true, manager: false, kasir: false },
    { feature: "Ubah Role User", owner: true, super_admin: false, manager: false, kasir: false },
    { feature: "Kelola Cabang", owner: true, super_admin: true, manager: false, kasir: false },
    { feature: "Cash Management", owner: true, super_admin: true, manager: true, kasir: false },
    { feature: "Lihat CCTV", owner: true, super_admin: true, manager: true, kasir: false },
    { feature: "Pengaturan Sistem", owner: true, super_admin: true, manager: false, kasir: false },
    { feature: "Hapus Transaksi", owner: true, super_admin: false, manager: false, kasir: false },
  ];
  return (
    <div>
      <div className="card">
        <div className="card-title">🔐 Matriks Hak Akses per Role</div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Fitur</th>
              {Object.entries(ROLE_LABELS).map(([k, v]) => <th key={k} style={{ textAlign: "center" }}><span className="badge" style={{ background: ROLE_BG[k], color: ROLE_COLORS[k] }}>{v}</span></th>)}
            </tr>
          </thead>
          <tbody>
            {perms.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{p.feature}</td>
                {["owner", "super_admin", "manager", "kasir"].map(r => (
                  <td key={r} style={{ textAlign: "center", fontSize: 18 }}>{p[r] ? "✅" : "❌"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <div className="card-title">📋 Hierarki Role</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { role: "owner", desc: "Akses penuh ke semua fitur. Bisa mengubah role siapa saja. Bisa add/remove menu." },
            { role: "super_admin", desc: "Akses hampir penuh. Bisa kelola user (kecuali ubah role). Tidak bisa edit menu." },
            { role: "manager", desc: "Akses operasional. Bisa add/remove menu makanan/minuman. Lihat laporan & dashboard." },
            { role: "kasir", desc: "Akses terbatas. Hanya bisa operasikan POS kasir dan lihat menu." },
          ].map(({ role, desc }) => (
            <div key={role} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 14, background: "var(--bg3)", borderRadius: "var(--radius-xs)", borderLeft: `3px solid ${ROLE_COLORS[role]}` }}>
              <span className="badge" style={{ background: ROLE_BG[role], color: ROLE_COLORS[role], flexShrink: 0 }}>{ROLE_LABELS[role]}</span>
              <span style={{ fontSize: 13, color: "var(--t2)" }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══ MAIN APP ═══
export default function WarmindoUserMenuMgmt() {
  const [users, setUsers] = useLS("warmindo_users", INITIAL_USERS);
  const [menu, setMenu] = useLS("warmindo_menu", INITIAL_MENU);
  const [currentUser, setCurrentUser] = useLS("warmindo_session", null);
  const [page, setPage] = useState("menu");
  const [toastData, setToastData] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const toast = (msg, type) => setToastData({ msg, type });

  const handleLogin = (user) => {
    setCurrentUser(user);
    toast(`Selamat datang, ${user.name}!`, "success");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("menu");
  };

  if (!currentUser) return <div className="W-root"><style>{CSS}</style><LoginPage users={users} onLogin={handleLogin} />{toastData && <Toast {...toastData} onClose={() => setToastData(null)} />}</div>;

  const navItems = [
    { id: "menu", emoji: "🍽️", label: "Kelola Menu", show: true },
    { id: "users", emoji: "👥", label: "Manajemen User", show: canManageUsers(currentUser.role) },
    { id: "permissions", emoji: "🔐", label: "Hak Akses", show: true },
  ];

  const titles = { menu: "Kelola Menu", users: "Manajemen User", permissions: "Hak Akses & Role" };

  return (
    <div className="W-root">
      <style>{CSS}</style>
      <div className="app-layout">
        <div className="sidebar">
          <div className="sb-logo">
            <span className="sb-fire">🔥</span>
            <div><div className="sb-brand">Warmindo</div><div className="sb-sub">User & Menu Mgmt</div></div>
          </div>
          <div className="sb-nav">
            <div className="sb-label">Manajemen</div>
            {navItems.filter(n => n.show).map(n => (
              <div key={n.id} className={`sb-item ${page === n.id ? "on" : ""}`} onClick={() => setPage(n.id)}>
                <span className="em">{n.emoji}</span><span>{n.label}</span>
              </div>
            ))}
          </div>
          <div className="sb-user">
            <div className="sb-user-info">
              <div className="sb-avatar" style={{ background: ROLE_BG[currentUser.role], color: ROLE_COLORS[currentUser.role] }}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="sb-uname">{currentUser.name}</div>
                <div className="sb-urole" style={{ color: ROLE_COLORS[currentUser.role] }}>{ROLE_LABELS[currentUser.role]}</div>
              </div>
            </div>
            <button className="sb-logout" onClick={handleLogout}>🚪 Logout</button>
          </div>
        </div>

        <div className="main-area">
          <div className="topbar">
            <div className="topbar-title">{titles[page]}</div>
            <div className="topbar-badge">{ROLE_LABELS[currentUser.role]}</div>
            <div className="topbar-sp" />
            <div className="topbar-clock">{time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
          </div>
          <div className="content">
            {page === "menu" && <MenuPage menu={menu} setMenu={setMenu} currentUser={currentUser} toast={toast} />}
            {page === "users" && <UsersPage users={users} setUsers={setUsers} currentUser={currentUser} toast={toast} />}
            {page === "permissions" && <PermissionsPage currentUser={currentUser} />}
          </div>
        </div>
      </div>
      {toastData && <Toast {...toastData} onClose={() => setToastData(null)} />}
    </div>
  );
}
