/* ============================================================
   Asni Guest House — Modals module
   Owns every open/handle/delete pair for every entity, plus
   the cart, receipt, CSV export, and SQL console.
   Exposes: AsniApp.Modals
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function (App) {
  'use strict';

  const esc = App.Utils.esc;
  const fmtETB = App.Utils.fmtETB;
  const fmtDate = App.Utils.fmtDate;
  const t = (k) => App.I18n.t(k);
  const db = App.State.db;

  /* ---------------- Modal plumbing ---------------- */
  function openModal(id) {
  document.querySelectorAll('.modal').forEach(m => {
    if (m.dataset.locked === 'true') return; // ← keep login visible
    m.classList.add('hidden');
  });
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}
  
  function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.dataset.locked === 'true') return; // ← guard
  el.classList.add('hidden');
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => {
    if (m.dataset.locked === 'true') return; // ← guard
    m.classList.add('hidden');
  });
}

  /* ============================================================
     ROOMS
     ============================================================ */
  function openRoomModal(id = null) {
    document.getElementById('formRoom').reset();
    document.getElementById('roomEditId').value = id || '';
    document.getElementById('modalRoomTitle').innerHTML = id
      ? `<i class="fa-solid fa-pen text-amber"></i> ${esc(t('modal_room_edit'))}`
      : `<i class="fa-solid fa-plus text-amber"></i> ${esc(t('modal_room_new'))}`;
    if (id) {
      const r = db.rooms.find(x => x.id === id);
      if (r) {
        document.getElementById('roomNumInput').value = r.room_number;
        document.getElementById('roomTypeInput').value = r.room_type;
        document.getElementById('roomCapacityInput').value = r.capacity;
        document.getElementById('roomPriceInput').value = r.price_per_night_etb;
        document.getElementById('roomStatusInput').value = r.status;
        document.getElementById('roomDescInput').value = r.description || '';
      }
    }
    openModal('modalRoom');
  }
  async function handleRoomSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('roomEditId').value;
    const payload = {
      room_number: document.getElementById('roomNumInput').value.trim(),
      room_type: document.getElementById('roomTypeInput').value,
      capacity: parseInt(document.getElementById('roomCapacityInput').value),
      price_per_night_etb: parseFloat(document.getElementById('roomPriceInput').value),
      status: document.getElementById('roomStatusInput').value,
      description: document.getElementById('roomDescInput').value.trim()
    };
    try {
      if (editId) { await App.State.dbUpdate('rooms', parseInt(editId), payload); App.Toast.show(`${t('toast_room_updated')} ${payload.room_number}`); }
      else        { await App.State.dbInsert('rooms', payload); App.Toast.show(`${t('toast_room_added')} ${payload.room_number}`); }
      closeModal('modalRoom');
      await App.State.reload();
    } catch (err) { App.Toast.show(err.message, 'error'); }
  }
  async function deleteRoom(id) {
    if (!confirm(t('toast_confirm_delete_room'))) return;
    try { await App.State.dbDelete('rooms', id); App.Toast.show(t('toast_room_deleted')); await App.State.reload(); }
    catch (err) { App.Toast.show(err.message, 'error'); }
  }

  /* ============================================================
     USERS
     ============================================================ */
  function openUserModal(id = null) {
    document.getElementById('formUser').reset();
    document.getElementById('userEditId').value = id || '';
    document.getElementById('modalUserTitle').innerHTML = id
      ? `<i class="fa-solid fa-pen text-sky"></i> ${esc(t('modal_user_edit'))}`
      : `<i class="fa-solid fa-user-plus text-sky"></i> ${esc(t('modal_user_new'))}`;
    if (id) {
      const u = db.users.find(x => x.id === id);
      if (u) {
        document.getElementById('userNameInput').value = u.full_name;
        document.getElementById('userEmailInput').value = u.email;
        document.getElementById('userPhoneInput').value = u.phone || '';
        document.getElementById('userRoleInput').value = u.role;
      }
    }
    openModal('modalUser');
  }
  async function handleUserSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('userEditId').value;
    const payload = {
      full_name: document.getElementById('userNameInput').value.trim(),
      email: document.getElementById('userEmailInput').value.trim(),
      phone: document.getElementById('userPhoneInput').value.trim(),
      role: document.getElementById('userRoleInput').value
    };
    try {
      if (editId) { await App.State.dbUpdate('users', parseInt(editId), payload); App.Toast.show(`${t('toast_user_updated')} ${payload.full_name}`); }
      else        { await App.State.dbInsert('users', payload); App.Toast.show(`${t('toast_user_added')} ${payload.full_name}`); }
      closeModal('modalUser');
      await App.State.reload();
    } catch (err) { App.Toast.show(err.message, 'error'); }
  }
  async function deleteUser(id) {
    if (!confirm(t('toast_confirm_delete_user'))) return;
    try { await App.State.dbDelete('users', id); App.Toast.show(t('toast_user_deleted')); await App.State.reload(); }
    catch (err) { App.Toast.show(err.message, 'error'); }
  }

  /* ============================================================
     BOOKINGS
     ============================================================ */
  function openBookingModal(id = null) {
    document.getElementById('formBooking').reset();
    document.getElementById('bookingEditId').value = id || '';
    document.getElementById('modalBookingTitle').innerHTML = id
      ? `<i class="fa-solid fa-pen text-indigo"></i> ${esc(t('modal_booking_edit'))}`
      : `<i class="fa-solid fa-calendar-plus text-indigo"></i> ${esc(t('modal_booking_new'))}`;
    const rs = document.getElementById('bookingRoomSelect');
    rs.innerHTML = '';
    db.rooms.forEach(r => {
      const o = document.createElement('option');
      o.value = r.id;
      o.textContent = `${t('th_room')} ${r.room_number} — ${t('rt_' + r.room_type.replace(/\s+/g, ''))} (${fmtETB(r.price_per_night_etb)} ETB)`;
      rs.appendChild(o);
    });
    if (id) {
      const b = db.bookings.find(x => x.id === id);
      if (b) {
        rs.value = b.room_id;
        document.getElementById('bookingGuestNameInput').value = b.guest_name;
        document.getElementById('bookingGuestPhoneInput').value = b.guest_phone;
        document.getElementById('bookingCheckinInput').value = fmtDate(b.check_in_date);
        document.getElementById('bookingCheckoutInput').value = fmtDate(b.check_out_date);
        document.getElementById('bookingTotalInput').value = b.total_amount_etb;
        document.getElementById('bookingStatusInput').value = b.status;
      }
    } else {
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('bookingCheckinInput').value = today;
      document.getElementById('bookingCheckoutInput').value = today;
      autoFillBookingTotal();
    }
    openModal('modalBooking');
  }
  function autoFillBookingTotal() {
    const roomId = parseInt(document.getElementById('bookingRoomSelect').value);
    const ci = document.getElementById('bookingCheckinInput').value;
    const co = document.getElementById('bookingCheckoutInput').value;
    const room = db.rooms.find(r => r.id === roomId);
    if (!room || !ci || !co) return;
    const nights = Math.max(1, Math.round((new Date(co) - new Date(ci)) / (1000 * 60 * 60 * 24)));
    document.getElementById('bookingTotalInput').value = (nights * Number(room.price_per_night_etb || 0)).toFixed(2);
  }
  async function handleBookingSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('bookingEditId').value;
    const roomId = parseInt(document.getElementById('bookingRoomSelect').value);
    const payload = {
      room_id: roomId,
      guest_name: document.getElementById('bookingGuestNameInput').value.trim(),
      guest_phone: document.getElementById('bookingGuestPhoneInput').value.trim(),
      check_in_date: document.getElementById('bookingCheckinInput').value,
      check_out_date: document.getElementById('bookingCheckoutInput').value,
      total_amount_etb: parseFloat(document.getElementById('bookingTotalInput').value),
      status: document.getElementById('bookingStatusInput').value
    };
    try {
      if (editId) { await App.State.dbUpdate('bookings', parseInt(editId), payload); App.Toast.show(t('toast_booking_updated')); }
      else        { await App.State.dbInsert('bookings', payload); App.Toast.show(t('toast_booking_added')); }
      if (payload.status === 'CheckedIn') await App.State.dbUpdate('rooms', roomId, { status: 'Occupied' });
      else if (payload.status === 'CheckedOut' || payload.status === 'Cancelled') await App.State.dbUpdate('rooms', roomId, { status: 'Cleaning' });
      closeModal('modalBooking');
      await App.State.reload();
    } catch (err) { App.Toast.show(err.message, 'error'); }
  }
  async function deleteBooking(id) {
    if (!confirm(t('toast_confirm_delete_booking'))) return;
    try { await App.State.dbDelete('bookings', id); App.Toast.show(t('toast_booking_deleted')); await App.State.reload(); }
    catch (err) { App.Toast.show(err.message, 'error'); }
  }

  /* ============================================================
     MENU ITEMS
     ============================================================ */
  function openMenuModal(id = null) {
    document.getElementById('formMenu').reset();
    document.getElementById('menuEditId').value = id || '';
    document.getElementById('modalMenuTitle').innerHTML = id
      ? `<i class="fa-solid fa-pen text-rose"></i> ${esc(t('modal_menu_edit'))}`
      : `<i class="fa-solid fa-plus text-rose"></i> ${esc(t('modal_menu_new'))}`;
    if (id) {
      const m = db.menu_items.find(x => x.id === id);
      if (m) {
        document.getElementById('menuNameInput').value = m.name;
        document.getElementById('menuCategoryInput').value = m.category;
        document.getElementById('menuPriceInput').value = m.price_etb;
        document.getElementById('menuAvailableInput').checked = Number(m.available) === 1;
        document.getElementById('menuDescInput').value = m.description || '';
      }
    } else {
      document.getElementById('menuAvailableInput').checked = true;
    }
    openModal('modalMenu');
  }
  async function handleMenuSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('menuEditId').value;
    const payload = {
      name: document.getElementById('menuNameInput').value.trim(),
      category: document.getElementById('menuCategoryInput').value,
      price_etb: parseFloat(document.getElementById('menuPriceInput').value),
      available: document.getElementById('menuAvailableInput').checked ? 1 : 0,
      description: document.getElementById('menuDescInput').value.trim()
    };
    try {
      if (editId) { await App.State.dbUpdate('menu_items', parseInt(editId), payload); App.Toast.show(`${t('toast_menu_updated')} ${payload.name}`); }
      else        { await App.State.dbInsert('menu_items', payload); App.Toast.show(`${t('toast_menu_added')} ${payload.name}`); }
      closeModal('modalMenu');
      await App.State.reload();
    } catch (err) { App.Toast.show(err.message, 'error'); }
  }
  async function deleteMenuItem(id) {
    if (!confirm(t('toast_confirm_delete_item'))) return;
    try { await App.State.dbDelete('menu_items', id); App.Toast.show(t('toast_menu_deleted')); await App.State.reload(); }
    catch (err) { App.Toast.show(err.message, 'error'); }
  }

  /* ============================================================
     RESTAURANT TABLES
     ============================================================ */
  function openTableModal(id = null) {
    document.getElementById('formTable').reset();
    document.getElementById('tableEditId').value = id || '';
    document.getElementById('modalTableTitle').innerHTML = id
      ? `<i class="fa-solid fa-pen text-teal"></i> ${esc(t('modal_table_edit'))}`
      : `<i class="fa-solid fa-plus text-teal"></i> ${esc(t('modal_table_new'))}`;
    if (id) {
      const rt = db.restaurant_tables.find(x => x.id === id);
      if (rt) {
        document.getElementById('tableNumInput').value = rt.table_number;
        document.getElementById('tableCapacityInput').value = rt.seating_capacity;
        document.getElementById('tableZoneInput').value = rt.zone;
        document.getElementById('tableStatusInput').value = rt.status;
      }
    }
    openModal('modalTable');
  }
  async function handleTableSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('tableEditId').value;
    const payload = {
      table_number: document.getElementById('tableNumInput').value.trim(),
      seating_capacity: parseInt(document.getElementById('tableCapacityInput').value),
      zone: document.getElementById('tableZoneInput').value,
      status: document.getElementById('tableStatusInput').value
    };
    try {
      if (editId) { await App.State.dbUpdate('restaurant_tables', parseInt(editId), payload); App.Toast.show(`${t('toast_table_updated')} ${payload.table_number}`); }
      else        { await App.State.dbInsert('restaurant_tables', payload); App.Toast.show(`${t('toast_table_added')} ${payload.table_number}`); }
      closeModal('modalTable');
      await App.State.reload();
    } catch (err) { App.Toast.show(err.message, 'error'); }
  }
  async function deleteTable(id) {
    if (!confirm(t('toast_confirm_delete_table'))) return;
    try { await App.State.dbDelete('restaurant_tables', id); App.Toast.show(t('toast_table_deleted')); await App.State.reload(); }
    catch (err) { App.Toast.show(err.message, 'error'); }
  }

  /* ============================================================
     ORDERS / CART
     ============================================================ */
  const activeCart = [];

  function addToCart(itemId) {
    const it = db.menu_items.find(m => m.id === itemId);
    if (!it) return;
    const existing = activeCart.find(c => c.id === it.id);
    if (existing) existing.qty++;
    else activeCart.push({ id: it.id, name: it.name, qty: 1, price_etb: Number(it.price_etb) });
    document.getElementById('cartCountBadge').textContent = activeCart.reduce((s, c) => s + c.qty, 0);
    App.Toast.show(`${t('toast_cart_added')} — ${it.name}`);
  }
  function removeFromCart(i) {
    activeCart.splice(i, 1);
    document.getElementById('cartCountBadge').textContent = activeCart.reduce((s, c) => s + c.qty, 0);
    openCartModal();
  }
  function openCartModal() {
    const typeSel = document.getElementById('cartTypeInput');
    const targetSel = document.getElementById('cartTargetInput');
    function refreshTargets() {
      targetSel.innerHTML = '';
      if (typeSel.value === 'Room Service') {
        db.rooms.forEach(r => {
          const o = document.createElement('option');
          o.value = `${t('th_room')} ${r.room_number}`;
          o.textContent = `${t('th_room')} ${r.room_number} (${t('rt_' + r.room_type.replace(/\s+/g, ''))})`;
          targetSel.appendChild(o);
        });
        if (db.rooms.length === 0) targetSel.innerHTML = '<option value="">—</option>';
      } else {
        db.restaurant_tables.forEach(rt => {
          const o = document.createElement('option');
          o.value = `${t('th_table_num')} ${rt.table_number}`;
          o.textContent = `${t('th_table_num')} ${rt.table_number} — ${t('zone_' + rt.zone.replace(/\s+/g, ''))}`;
          targetSel.appendChild(o);
        });
        if (db.restaurant_tables.length === 0) targetSel.innerHTML = '<option value="">—</option>';
      }
    }
    refreshTargets();
    typeSel.onchange = refreshTargets;

    const list = document.getElementById('cartList');
    list.innerHTML = '';
    if (activeCart.length === 0) {
      list.innerHTML = `<div style="text-align:center;color:var(--muted);font-size:0.75rem;padding:1rem 0">${esc(t('cart_empty'))}</div>`;
      document.getElementById('cartTotalSumText').textContent = '0.00 ETB';
    } else {
      let total = 0;
      activeCart.forEach((it, i) => {
        total += it.price_etb * it.qty;
        const d = document.createElement('div');
        d.className = 'cart-row';
        d.innerHTML = `
          <div style="display:flex;gap:0.5rem;align-items:center">
            <span style="color:var(--text-strong);font-weight:600">${esc(it.name)}</span>
            <span style="color:var(--muted)">×${it.qty}</span>
          </div>
          <div style="display:flex;gap:0.75rem;align-items:center">
            <span style="color:var(--amber);font-weight:700">${fmtETB(it.price_etb * it.qty)} ETB</span>
            <button onclick="AsniApp.removeFromCart(${i})" style="background:none;border:none;color:#fda4af;cursor:pointer"><i class="fa-solid fa-trash"></i></button>
          </div>`;
        list.appendChild(d);
      });
      document.getElementById('cartTotalSumText').textContent = `${fmtETB(total)} ETB`;
    }
    openModal('modalCart');
  }
  async function placeOrder() {
    if (activeCart.length === 0) { App.Toast.show(t('toast_cart_empty'), 'error'); return; }
    const orderType = document.getElementById('cartTypeInput').value;
    const target = document.getElementById('cartTargetInput').value;
    if (!target) { App.Toast.show(t('misc_select_target'), 'error'); return; }
    const total = activeCart.reduce((s, i) => s + i.price_etb * i.qty, 0);
    const items = activeCart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price_etb: i.price_etb }));
    try {
      await App.State.dbInsert('orders', {
        order_type: orderType, target_identifier: target,
        items_json: JSON.stringify(items),
        total_amount_etb: total, status: 'Pending'
      });
      activeCart.length = 0;
      document.getElementById('cartCountBadge').textContent = '0';
      closeModal('modalCart');
      App.Toast.show(`${t('toast_order_submitted')} ${target}`);
      await App.State.reload();
    } catch (err) { App.Toast.show(err.message, 'error'); }
  }
  function clearCart() {
    activeCart.length = 0;
    document.getElementById('cartCountBadge').textContent = '0';
    openCartModal();
  }
  function openOrderModal(id) {
    const o = db.orders.find(x => x.id === id);
    if (!o) return;
    document.getElementById('orderEditId').value = o.id;
    document.getElementById('orderTypeInput').value = o.order_type;
    document.getElementById('orderTargetInput').value = o.target_identifier;
    document.getElementById('orderTotalInput').value = o.total_amount_etb;
    document.getElementById('orderStatusInput').value = o.status;
    openModal('modalOrder');
  }
  async function handleOrderSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('orderEditId').value;
    const payload = {
      order_type: document.getElementById('orderTypeInput').value,
      target_identifier: document.getElementById('orderTargetInput').value.trim(),
      total_amount_etb: parseFloat(document.getElementById('orderTotalInput').value),
      status: document.getElementById('orderStatusInput').value
    };
    try {
      await App.State.dbUpdate('orders', parseInt(editId), payload);
      closeModal('modalOrder');
      App.Toast.show(t('toast_order_updated'));
      await App.State.reload();
    } catch (err) { App.Toast.show(err.message, 'error'); }
  }
  async function deleteOrder(id) {
    if (!confirm(t('toast_confirm_delete_order'))) return;
    try { await App.State.dbDelete('orders', id); App.Toast.show(t('toast_order_deleted')); await App.State.reload(); }
    catch (err) { App.Toast.show(err.message, 'error'); }
  }

  /* ============================================================
     BANNERS
     ============================================================ */
  function openBannerModal(id = null) {
    document.getElementById('formBanner').reset();
    document.getElementById('bannerEditId').value = id || '';
    document.getElementById('modalBannerTitle').innerHTML = id
      ? `<i class="fa-solid fa-pen text-purple"></i> ${esc(t('modal_banner_edit'))}`
      : `<i class="fa-solid fa-plus text-purple"></i> ${esc(t('modal_banner_new'))}`;
    if (id) {
      const b = db.ad_banners.find(x => x.id === id);
      if (b) {
        document.getElementById('bannerTitleInput').value = b.title;
        document.getElementById('bannerDescInput').value = b.description;
        document.getElementById('bannerTagInput').value = b.tag;
        document.getElementById('bannerColorInput').value = b.badge_color || 'bg-amber-600';
        document.getElementById('bannerActiveInput').checked = Number(b.active) === 1;
      }
    } else {
      document.getElementById('bannerActiveInput').checked = true;
    }
    openModal('modalBanner');
  }
  async function handleBannerSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('bannerEditId').value;
    const payload = {
      title: document.getElementById('bannerTitleInput').value.trim(),
      description: document.getElementById('bannerDescInput').value.trim(),
      tag: document.getElementById('bannerTagInput').value.trim(),
      badge_color: document.getElementById('bannerColorInput').value,
      active: document.getElementById('bannerActiveInput').checked ? 1 : 0
    };
    try {
      if (editId) { await App.State.dbUpdate('ad_banners', parseInt(editId), payload); App.Toast.show(t('toast_banner_updated')); }
      else        { await App.State.dbInsert('ad_banners', payload); App.Toast.show(t('toast_banner_added')); }
      closeModal('modalBanner');
      await App.State.reload();
    } catch (err) { App.Toast.show(err.message, 'error'); }
  }
  async function deleteBanner(id) {
    if (!confirm(t('toast_confirm_delete_banner'))) return;
    try { await App.State.dbDelete('ad_banners', id); App.Toast.show(t('toast_banner_deleted')); await App.State.reload(); }
    catch (err) { App.Toast.show(err.message, 'error'); }
  }

  /* ============================================================
     RECEIPT + CSV + SQL
     ============================================================ */
  function printReceipt(payer, desc, amount) {
    document.getElementById('rcptId').textContent = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('rcptDate').textContent = new Date().toLocaleDateString(App.I18n.currentLang === 'am' ? 'am' : 'en-US');
    document.getElementById('rcptPayer').textContent = payer;
    document.getElementById('rcptType').textContent = t('rcpt_completed');
    document.getElementById('rcptDesc').textContent = desc;
    document.getElementById('rcptAmount').textContent = `${fmtETB(amount)} ETB`;
    openModal('modalReceipt');
  }
  function exportCSV() {
    const rows = App.Render.computeLedger();
    let csv = 'Ref,Date,Type,Description,Payer_Or_Target,Amount_ETB\n';
    rows.forEach(r => {
      const clean = s => String(s).replace(/"/g, '""');
      csv += `${r.ref},${r.date},${r.type},"${clean(r.desc)}","${clean(r.payer)}",${r.amount}\n`;
    });
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    link.download = `Asni_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link); link.click(); link.remove();
    App.Toast.show(t('toast_exported'));
  }
  async function runDirectSQL() {
    const q = document.getElementById('sqlQueryInput').value.trim();
    const out = document.getElementById('sqlOutputBox');
    const t0 = performance.now();
    if (!q) { out.innerHTML = `<span style="color:#fda4af">${esc(t('misc_enter_sql'))}</span>`; return; }
    try {
      if (!App.Api.online) throw new Error(t('misc_offline_sql'));
      const res = await App.Api.apiQuery(q);
      out.textContent = JSON.stringify(res.results || res.meta || {}, null, 2);
      document.getElementById('sqlExecDuration').textContent = `Execution time: ${(performance.now() - t0).toFixed(2)}ms`;
      await App.State.reload();
    } catch (e) {
      out.innerHTML = `<span style="color:#fda4af">Error: ${esc(e.message)}</span>`;
    }
  }
  async function resetSchema() {
    if (!confirm(t('toast_confirm_reset'))) return;
    if (!App.Api.online) { App.Toast.show(t('toast_d1_required'), 'error'); return; }
    const DDL = [
      `PRAGMA foreign_keys = OFF`,
      `DROP TABLE IF EXISTS users`,
      `DROP TABLE IF EXISTS rooms`,
      `DROP TABLE IF EXISTS bookings`,
      `DROP TABLE IF EXISTS restaurant_tables`,
      `DROP TABLE IF EXISTS menu_items`,
      `DROP TABLE IF EXISTS orders`,
      `DROP TABLE IF EXISTS ad_banners`,
      `CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, phone TEXT, role TEXT CHECK(role IN ('admin','receptionist','guest')) NOT NULL DEFAULT 'guest', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
      `CREATE TABLE rooms (id INTEGER PRIMARY KEY AUTOINCREMENT, room_number TEXT UNIQUE NOT NULL, room_type TEXT CHECK(room_type IN ('Standard','Deluxe','Executive Suite','Family Suite')) NOT NULL, price_per_night_etb REAL NOT NULL, capacity INTEGER NOT NULL DEFAULT 2, status TEXT CHECK(status IN ('Available','Occupied','Cleaning','Maintenance')) NOT NULL DEFAULT 'Available', description TEXT)`,
      `CREATE TABLE bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, room_id INTEGER NOT NULL, guest_name TEXT NOT NULL, guest_phone TEXT NOT NULL, check_in_date DATE NOT NULL, check_out_date DATE NOT NULL, total_amount_etb REAL NOT NULL, status TEXT CHECK(status IN ('Pending','Confirmed','CheckedIn','CheckedOut','Cancelled')) NOT NULL DEFAULT 'Confirmed', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE)`,
      `CREATE TABLE restaurant_tables (id INTEGER PRIMARY KEY AUTOINCREMENT, table_number TEXT UNIQUE NOT NULL, seating_capacity INTEGER NOT NULL, zone TEXT CHECK(zone IN ('Indoor Main','Garden Patio','Rooftop Lounge')) NOT NULL, status TEXT CHECK(status IN ('Available','Reserved','Occupied')) DEFAULT 'Available')`,
      `CREATE TABLE menu_items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT CHECK(category IN ('Traditional Ethiopian','Breakfast','Main Course','Beverages','Dessert')) NOT NULL, price_etb REAL NOT NULL, available INTEGER NOT NULL DEFAULT 1, description TEXT)`,
      `CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, order_type TEXT CHECK(order_type IN ('Room Service','Restaurant Table')) NOT NULL, target_identifier TEXT NOT NULL, items_json TEXT NOT NULL, total_amount_etb REAL NOT NULL, status TEXT CHECK(status IN ('Pending','Preparing','Served','Cancelled')) DEFAULT 'Pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
      `CREATE TABLE ad_banners (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, tag TEXT NOT NULL, badge_color TEXT DEFAULT 'bg-amber-600', active INTEGER NOT NULL DEFAULT 1)`,
      `PRAGMA foreign_keys = ON`
    ];
    try {
      for (const sql of DDL) await App.Api.apiQuery(sql);
      App.Toast.show(t('toast_reset_done'));
      await App.State.reload();
    } catch (err) { App.Toast.show(err.message, 'error'); }
  }

  App.Modals = {
    openModal, closeModal, closeAllModals,

    // Rooms
    openRoomModal, handleRoomSubmit, deleteRoom,
    // Users
    openUserModal, handleUserSubmit, deleteUser,
    // Bookings
    openBookingModal, autoFillBookingTotal, handleBookingSubmit, deleteBooking,
    // Menu
    openMenuModal, handleMenuSubmit, deleteMenuItem,
    // Tables
    openTableModal, handleTableSubmit, deleteTable,
    // Orders / Cart
    addToCart, removeFromCart, openCartModal, placeOrder, clearCart,
    openOrderModal, handleOrderSubmit, deleteOrder,
    // Banners
    openBannerModal, handleBannerSubmit, deleteBanner,
    // Utilities
    printReceipt, exportCSV, runDirectSQL, resetSchema
  };
})(window.AsniApp);