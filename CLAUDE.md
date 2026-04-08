# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Warmindo — a suite of React apps for managing an Indonesian food stall ("Warung Makan Indonesia"). Four single-file JSX components, no build system, no package.json, no backend. Each file is self-contained and requires only React in the host environment.

## Files

| File | Lines | Export | Purpose |
|------|-------|--------|---------|
| `warmindo-pos.jsx` | ~2089 | `WarmindoPOS` | POS kasir v1 — basic single-store |
| `warmindo-pos-v3.jsx` | ~925 | `WarmindoPOS` | POS enterprise v3 — multi-branch, employees, CCTV, inventory |
| `warmindo-table-crm.jsx` | ~742 | `WarmindoPOS` | Table management + customer CRM (v5) — QR per table, self-order, feedback, loyalty |
| `warmindo-dashboard.jsx` | ~741 | `WarmindoDashboard` | Financial dashboard with hardcoded real data (11 Mar – 5 Apr 2026) |

Note: `warmindo-pos-v2.jsx` also exists as an intermediate version.

## Architecture per File

### `warmindo-pos.jsx` (v1)
| Section | Contents |
|---------|----------|
| Data Layer (9–62) | `CATEGORIES`, `INITIAL_PRODUCTS`, `ORDER_TYPES`, `PAYMENT_METHODS` |
| Utilities (64–69) | `formatRupiah`, `formatTime`, `formatDate`, `generateId`, `todayStr` |
| Icon (72–93) | `Icon` — inline SVG icon library |
| Hooks (96–107) | `useLocalState` — localStorage-backed useState |
| Styles (110–1078) | `STYLES` template literal, dark theme, CSS custom properties |
| Components (1080–2018) | `Sidebar`, `TopBar`, `ProductCard`, `CartItem`, `PaymentModal`, `POSPage`, `HistoryPage`, `ProductsPage`, `ReportsPage`, `SettingsPage` |
| Root (2020–2089) | `WarmindoPOS` — top-level state & page routing |

### `warmindo-pos-v3.jsx` (Enterprise)
| Section | Contents |
|---------|----------|
| Data (8–150) | `CATEGORIES`, `PRODUCTS`, `BRANCHES` (3 locations), `ORDER_TYPES` (+ShopeeFood), `PAYMENT_METHODS` (12 methods in 5 groups), `INIT_EMPLOYEES`, `INIT_ATTENDANCE`, `INIT_PERF`, `INIT_CCTV`, `INV_CATEGORIES`, `INIT_INVENTORY` |
| Utils (151–157) | Minified: `rp`, `fT`, `fD`, `gid`, `tKey`, `useLS` |
| QR Generator (159–173) | `QRCode` — canvas-based QRIS code generator |
| Styles (175–373) | `CSS` template literal with shorthand variable names |
| Icons (374–398) | `Ic` + `IX` object — SVG path-based icon system |
| UI Helpers (399–411) | `KPIRing`, `ProgressBar` |
| Pages | `Sidebar`, `BranchSw`, `TopBar`, `PayModal`, `POSPage`, `EmployeePage`, `CCTVPage`, `InventoryPage`, `HistoryPage`, `ProductsPage`, `BranchesPage`, `ReportsPage`, `SettingsPage` |
| Root (886–925) | `WarmindoPOS` — state, branch switching, page routing |

### `warmindo-table-crm.jsx` (Table + CRM, v5)
| Section | Contents |
|---------|----------|
| Utils (8–14) | `rp`, `gid`, `fTime`, `fDate`, `fFull`, `useLS` |
| QR Generator (17–36) | `QR` — SVG-based QR code component with logo support |
| Data (38–81) | `CATS`, `MENU` (28 items), `INIT_TABLES` (12 tables with status/capacity/QR), `INIT_CUSTOMERS` (loyalty tiers), `INIT_FEEDBACK` |
| Styles (83–192) | `CSS` template literal |
| Components | `TableModal` (full table lifecycle: seat→order→serve→pay→clean), `SelfOrderPreview` (customer-facing QR order UI), `TablesPage`, `CustomersPage` (CRM with tier/points), `QRManagerPage` |
| Root (704–742) | `WarmindoPOS` — state for tables, customers, feedback; tab navigation |

### `warmindo-dashboard.jsx`
| Section | Contents |
|---------|----------|
| Data (18–116) | `DAILY` (24 days of real financial data), `EMPLOYEES` (9 staff), `KASBON`, `STOCK_BAR` (46 items) |
| Styles (118–244) | `CSS` template literal |
| Components (245–661) | `StatCard`, `HBar`, `OverviewPage`, `DailyPage`, `PayrollPage`, `StockPage`, `ChannelPage`, `ExpensePage` |
| Root (666–741) | `WarmindoDashboard` — tab-based navigation (6 tabs) |

## Key Patterns

- **State-driven routing**: All apps use `useState` for page/tab switching — no React Router.
- **localStorage persistence** (POS v1, v3 & table-crm): `useLocalState`/`useLS` hook wraps `useState` + `localStorage`. Dashboard uses hardcoded data only.
- **Inline CSS**: All styles in template literal strings (`STYLES` or `CSS`), injected via `<style>`. Do not create separate CSS files.
- **Indonesian locale**: Currency formatting with `id-ID` locale. UI labels in Bahasa Indonesia.
- **Emoji product images**: No image assets — products use emoji strings.
- **Minified naming in v3 & table-crm**: v3 and table-crm use short variable names (`rp`, `fT`, `gid`, `Ic`, `IX`, `pg`, `sr`, `cb`). When modifying these files, follow this convention.
- **Table lifecycle** (table-crm): Tables flow through statuses: `empty` → `occupied` → `ordering` → `served` → `paying` → `cleaning` → `empty`. Each status triggers different UI in `TableModal`.
- **Customer tiers** (table-crm): Loyalty tiers are Bronze/Silver/Gold/Platinum based on points accumulated from transactions.

## Differences Between POS v1 and v3

| Feature | v1 | v3 |
|---------|----|----|
| Branches | Single store | Multi-branch (3 locations) |
| Payment methods | 5 (cash, QRIS, transfer, GoFood, GrabFood) | 12 across 5 groups |
| Order types | 4 | 5 (+ShopeeFood) |
| Employees | None | Full HR (data, attendance, performance) |
| CCTV | None | Camera monitoring per branch |
| Inventory | None | Asset management with categories |
| QR/QRIS | None | Built-in QR code generator |
| Table management | None | None (see table-crm) |
| Customer CRM | None | None (see table-crm) |
| Code style | Readable names | Minified/short names |

## How to Modify

- **Add products**: Append to `INITIAL_PRODUCTS` (v1) or `PRODUCTS` (v3). Existing localStorage users won't see changes unless they reset.
- **Add categories**: Append to `CATEGORIES` array, use the new id in products.
- **Add payment methods**: v1: append to `PAYMENT_METHODS`. v3: append to `PAYMENT_METHODS` with a `group` field, update `PAY_GROUPS` if adding a new group.
- **Add a branch** (v3): Append to `BRANCHES` array.
- **Change theme colors**: Edit CSS custom properties in `:root` block inside the styles template literal.
- **Add a new page**: Add component, sidebar entry, and conditional render in the root component.
- **Add tables** (table-crm): Modify the `INIT_TABLES` array generator (line 57). Each table needs id, num, capacity, qrCode.
- **Modify loyalty tiers** (table-crm): Update tier logic in `CustomersPage` component.
- **Update dashboard data**: Edit `DAILY`, `EMPLOYEES`, `KASBON`, or `STOCK_BAR` arrays in `warmindo-dashboard.jsx`.
