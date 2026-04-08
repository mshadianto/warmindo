// ═══════════════════════════════════════════════════════════════════════════
// WARMINDO DB — Supabase Integration Layer
// Offline-first: localStorage cache + Supabase cloud sync
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const SUPABASE_URL = 'https://tyvuqugmkajdltqaudaw.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dnVxdWdta2FqZGx0cWF1ZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjgwMTksImV4cCI6MjA5MTIwNDAxOX0.ysAYYusv-_aLoXmpLdzoEjfeZsecbib8OdseL3mdUlo'; // ← Paste from Dashboard > Settings > API

  if (!window.supabase) { console.warn('[WDB] supabase-js not loaded'); return }
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // ─── Column Mappings: localStorage key → {table, to(js→db), from(db→js)} ──
  const MAPS = {
    w3_prods: {
      table: 'products', pk: 'id',
      to: p => ({ id: p.id, name: p.name, price: p.price, category_id: p.cat, stock: p.stock, image: p.img, active: true }),
      from: r => ({ id: r.id, name: r.name, price: r.price, cat: r.category_id, stock: r.stock, img: r.image })
    },
    w3_brs: {
      table: 'branches', pk: 'id',
      to: b => ({ id: b.id, name: b.name, address: b.address, city: b.city, phone: b.phone, is_hq: !!b.isHQ, active: b.active !== false }),
      from: r => ({ id: r.id, name: r.name, address: r.address, city: r.city, phone: r.phone, isHQ: r.is_hq, active: r.active })
    },
    w3_emps: {
      table: 'employees', pk: 'id',
      to: e => ({ id: e.id, name: e.name, role: e.role, phone: e.phone, branch_id: e.branch, salary: e.salary, photo: e.photo, status: e.status, join_date: e.joinDate }),
      from: r => ({ id: r.id, name: r.name, role: r.role, phone: r.phone, branch: r.branch_id, salary: r.salary, photo: r.photo, status: r.status, joinDate: r.join_date })
    },
    w3_att: {
      table: 'attendance', pk: 'id', conflict: 'employee_id,date',
      to: a => ({ employee_id: a.empId, date: a.date, clock_in: a.clockIn || null, clock_out: a.clockOut || null, status: a.status, note: a.note || '' }),
      from: r => ({ empId: r.employee_id, date: r.date, clockIn: r.clock_in, clockOut: r.clock_out, status: r.status, note: r.note || '' })
    },
    w3_perf: {
      table: 'employee_performance', pk: 'id', conflict: 'employee_id,month',
      to: p => ({ employee_id: p.empId, month: p.month, orders_handled: p.ordersHandled, rating: p.rating, complaints: p.complaints, punctuality: p.punctuality, speed: p.speed }),
      from: r => ({ empId: r.employee_id, month: r.month, ordersHandled: r.orders_handled, rating: Number(r.rating), complaints: r.complaints, punctuality: r.punctuality, speed: r.speed })
    },
    w3_inv: {
      table: 'inventory', pk: 'id',
      to: i => ({ id: i.id, name: i.name, category_id: i.cat, qty: i.qty, min_qty: i.minQty, unit: i.unit, price: i.price, condition: i.condition, last_check: i.lastCheck }),
      from: r => ({ id: r.id, name: r.name, cat: r.category_id, qty: r.qty, minQty: r.min_qty, unit: r.unit, price: r.price, condition: r.condition, lastCheck: r.last_check })
    },
    w3_cctv: {
      table: 'cctv', pk: 'id',
      to: c => ({ id: c.id, name: c.name, location: c.location, branch_id: c.branch, status: c.status, ip: c.ip }),
      from: r => ({ id: r.id, name: r.name, location: r.location, branch: r.branch_id, status: r.status, ip: r.ip, lastMotion: r.last_motion || '—' })
    },
    w5_tables: {
      table: 'tables', pk: 'id',
      to: t => ({ id: t.id, num: t.num, name: t.name, capacity: t.capacity, status: t.status, qr_code: t.qrCode, current_bill: t.currentBill || 0, customer_id: t.customerId || null, start_time: t.startTime || null }),
      from: r => ({ id: r.id, num: r.num, name: r.name, capacity: r.capacity, status: r.status || 'empty', qrCode: r.qr_code, orders: [], currentBill: r.current_bill || 0, customerId: r.customer_id, startTime: r.start_time })
    },
    w5_custs: {
      table: 'customers', pk: 'id',
      to: c => ({ id: c.id, name: c.name, phone: c.phone, email: c.email || null, visits: c.visits, total_spent: c.totalSpent, last_visit: c.lastVisit, tags: c.tags || [], notes: c.notes || '', rating: c.rating }),
      from: r => ({ id: r.id, name: r.name, phone: r.phone, email: r.email || '', visits: r.visits, totalSpent: r.total_spent, lastVisit: r.last_visit, tags: r.tags || [], notes: r.notes || '', rating: Number(r.rating) })
    },
    w5_fb: {
      table: 'feedback', pk: 'id',
      to: f => ({ id: f.id, customer_name: f.custName, rating: f.rating, comment: f.comment, created_at: f.date, table_num: f.tableNum }),
      from: r => ({ id: r.id, custName: r.customer_name, rating: r.rating, comment: r.comment, date: r.created_at, tableNum: r.table_num })
    },
  };

  // ─── useDB: drop-in replacement for useLS with Supabase sync ─────────────
  function useDB(k, init) {
    var R = React;
    var val, setVal, skip, mt;
    val = R.useState(function () { try { var x = localStorage.getItem(k); return x ? JSON.parse(x) : init } catch (e) { return init } });
    var v = val[0], s = val[1];
    skip = R.useRef(false);
    mt = R.useRef(true);

    // Persist to localStorage
    R.useEffect(function () { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } }, [k, v]);

    // Fetch from Supabase on mount
    R.useEffect(function () {
      mt.current = true;
      var m = MAPS[k]; if (!m) return;
      sb.from(m.table).select('*').then(function (res) {
        if (!mt.current) return;
        if (res.error) { console.warn('[WDB] fetch ' + m.table + ':', res.error.message); return }
        if (res.data && res.data.length > 0) { skip.current = true; s(res.data.map(m.from)) }
      });
      return function () { mt.current = false };
    }, []);

    // Debounced upsert to Supabase on change
    R.useEffect(function () {
      if (skip.current) { skip.current = false; return }
      var m = MAPS[k]; if (!m || !Array.isArray(v) || v.length === 0) return;
      var t = setTimeout(function () {
        var rows = v.map(m.to);
        sb.from(m.table).upsert(rows, { onConflict: m.conflict || m.pk || 'id', ignoreDuplicates: false })
          .then(function (res) { if (res.error) console.warn('[WDB] upsert ' + m.table + ':', res.error.message) });
      }, 1500);
      return function () { clearTimeout(t) };
    }, [v]);

    return [v, s];
  }

  // ─── useOrders: special hook for transactions (append-only) ──────────────
  function useOrders(k, init) {
    var R = React;
    var val = R.useState(function () { try { var x = localStorage.getItem(k); return x ? JSON.parse(x) : init } catch (e) { return init } });
    var v = val[0], s = val[1];

    R.useEffect(function () { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } }, [k, v]);

    // Fetch existing orders from Supabase on mount
    R.useEffect(function () {
      sb.from('orders').select('*,order_items(*)').order('created_at', { ascending: false }).limit(200)
        .then(function (res) {
          if (res.error || !res.data || res.data.length === 0) return;
          var remote = res.data.map(function (o) {
            return {
              id: o.id, total: o.total, payment: o.payment_method,
              payLabel: o.payment_method, cashPaid: o.total, change: 0,
              orderType: o.order_type, timestamp: o.created_at, branch: o.branch_id || '',
              items: (o.order_items || []).map(function (i) { return { id: i.product_id, name: i.product_name, qty: i.qty, price: i.price } })
            };
          });
          s(function (prev) {
            var ids = {}; prev.forEach(function (t) { ids[t.id] = true });
            var merged = prev.slice();
            remote.forEach(function (r) { if (!ids[r.id]) merged.push(r) });
            return merged;
          });
        });
    }, []);

    return [v, s];
  }

  // ─── saveOrder: insert single order + items to Supabase ──────────────────
  function saveOrder(txn) {
    if (!txn || !txn.id) return;
    sb.from('orders').insert({
      id: txn.id,
      order_type: txn.orderType || null,
      payment_method: txn.payment || null,
      total: txn.total || 0,
      status: 'completed',
      is_paid: true,
      paid_at: txn.timestamp || new Date().toISOString(),
      created_at: txn.timestamp || new Date().toISOString(),
    }).then(function (res) {
      if (res.error) console.warn('[WDB] order insert:', res.error.message);
    });
    if (txn.items && txn.items.length > 0) {
      var items = txn.items.map(function (i) {
        return { order_id: txn.id, product_id: i.id, product_name: i.name, qty: i.qty, price: i.price };
      });
      sb.from('order_items').insert(items).then(function (res) {
        if (res.error) console.warn('[WDB] items insert:', res.error.message);
      });
    }
  }

  // ─── fetchDaily: get daily_summary for dashboard ─────────────────────────
  function fetchDaily(callback) {
    sb.from('daily_summary').select('*').order('date', { ascending: true })
      .then(function (res) {
        if (res.error) { console.warn('[WDB] daily:', res.error.message); callback(null); return }
        callback(res.data && res.data.length > 0 ? res.data : null);
      });
  }

  // ─── seedDaily: bulk insert daily summary data ───────────────────────────
  function seedDaily(rows, callback) {
    sb.from('daily_summary').upsert(rows, { onConflict: 'date,branch_id' })
      .then(function (res) {
        if (res.error) console.warn('[WDB] seed daily:', res.error.message);
        if (callback) callback(!res.error);
      });
  }

  // ─── seedStock: bulk insert stock purchases ──────────────────────────────
  function seedStock(rows, callback) {
    sb.from('stock_purchases').upsert(rows, { onConflict: 'id' })
      .then(function (res) {
        if (res.error) console.warn('[WDB] seed stock:', res.error.message);
        if (callback) callback(!res.error);
      });
  }

  // ─── Expose globally ────────────────────────────────────────────────────
  window.WDB = { sb: sb, useDB: useDB, useOrders: useOrders, saveOrder: saveOrder, fetchDaily: fetchDaily, seedDaily: seedDaily, seedStock: seedStock, MAPS: MAPS };
  console.log('[WDB] Warmindo DB ready — Supabase connected');
})();
