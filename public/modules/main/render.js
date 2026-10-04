/* ============================================================
   Asni Guest House — Render module
   Pure rendering functions. No side effects other than DOM
   updates. Depends on State.db and I18n.t().
   Exposes: AsniApp.Render
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function (App) {
  'use strict';

  const esc = App.Utils.esc;
  const fmtETB = App.Utils.fmtETB;
  const fmtDate = App.Utils.fmtDate;
  const t = (k) => App.I18n.t(k);
  const db = App.State.db;

  /* ---------------- Shared helpers ---------------- */
  function statusPill(value) {
    const label = t('status_' + value);
    const cls = value === 'Occupied' || value === 'Cancelled' || value === 'Maintenance' ? 'pill-rose'
              : value === 'Cleaning' || value === 'Pending' || value === 'Preparing' || value === 'Reserved' ? 'pill-amber'
              : value === 'CheckedIn' || value === 'Served' || value === 'Available' || value === 'Active' ? 'pill-emerald'
              : 'pill-sky';
    return `<span class="pill ${cls}">${esc(label)}</span>`;
  }

  function rolePill(role) {
    const cls = role === 'admin' ? 'pill-rose' : role === 'receptionist' ? 'pill-sky' : 'pill-slate';
    return `<span class="pill ${cls}">${esc(t('role_' + role))}</span>`;
  }

  /* ---------------- Dashboard ---------------- */
  function renderDashboards() {
    const occupied = db.rooms.filter(r => r.status === 'Occupied').length;
    const total = db.rooms.length;
    const occRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    const roomRev = db.bookings.reduce((s, b) => s + Number(b.total_amount_etb || 0), 0);
    const restRev = db.orders.reduce((s, o) => s + Number(o.total_amount_etb || 0), 0);

    document.getElementById('kpiTotalRev').textContent = `${fmtETB(roomRev + restRev)} ETB`;
    document.getElementById('kpiOccupancy').textContent = `${occRate}%`;
    document.getElementById('kpiOccupancySub').textContent = `${occupied} / ${total} ${t('dash_rooms_count')}`;
    document.getElementById('kpiGuests').textContent =
      db.bookings.filter(b => b.status === 'Confirmed' || b.status === 'CheckedIn').length;
    document.getElementById('kpiMenuItems').textContent =
      db.menu_items.filter(m => Number(m.available) === 1).length;

    const bannerBox = document.getElementById('dashboardBannerContainer');
    const active = db.ad_banners.filter(b => Number(b.active) === 1);

    if (active.length > 0) {
      const b = active[0];
      const bg = b.badge_color || 'bg-amber-600';
      const translated = App.I18n.getBannerTranslation(App.I18n.currentLang, b.title);
      const title = translated?.title || b.title;
      const desc = translated?.description || b.description;
      const tag = translated?.tag || b.tag;

      bannerBox.innerHTML = `
        <div>
          <span class="be-tag ${esc(bg)}">${esc(tag)}</span>
          <h2 class="be-title">${esc(title)}</h2>
          <p class="be-desc">${esc(desc)}</p>
        </div>`;
    } else {
      bannerBox.innerHTML = `<div class="be-desc">${esc(t('dash_no_banners'))}</div>`;
    }

    App.Charts.renderCharts();
  }
  
  function renderDashboard() {
  const isGuest = App.Router?.currentRole === 'Guest';
  
  // ---- Staff-only KPIs ----
  if (!isGuest) {
    const occupied = db.rooms.filter(r => r.status === 'Occupied').length;
    const total = db.rooms.length;
    const occRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    const roomRev = db.bookings.reduce((s, b) => s + Number(b.total_amount_etb || 0), 0);
    const restRev = db.orders.reduce((s, o) => s + Number(o.total_amount_etb || 0), 0);
    
    const revEl = document.getElementById('kpiTotalRev');
    if (revEl) revEl.textContent = `${fmtETB(roomRev + restRev)} ETB`;
    
    const occEl = document.getElementById('kpiOccupancy');
    if (occEl) occEl.textContent = `${occRate}%`;
    
    const occSub = document.getElementById('kpiOccupancySub');
    if (occSub) occSub.textContent = `${occupied} / ${total} ${t('dash_rooms_count')}`;
    
    const guestsEl = document.getElementById('kpiGuests');
    if (guestsEl) guestsEl.textContent =
      db.bookings.filter(b => b.status === 'Confirmed' || b.status === 'CheckedIn').length;
  }
  
  // ---- Guest-safe KPI ----
  const menuEl = document.getElementById('kpiMenuItems');
  if (menuEl) menuEl.textContent =
    db.menu_items.filter(m => Number(m.available) === 1).length;
  
  // ---- Banner (safe for everyone) ----
  const bannerBox = document.getElementById('dashboardBannerContainer');
  if (bannerBox) {
    const active = db.ad_banners.filter(b => Number(b.active) === 1);
    
    if (active.length > 0) {
      const b = active[0];
      const bg = b.badge_color || 'bg-amber-600';
      const translated = App.I18n.getBannerTranslation(App.I18n.currentLang, b.title);
      const title = translated?.title || b.title;
      const desc = translated?.description || b.description;
      const tag = translated?.tag || b.tag;
      
      bannerBox.innerHTML = `
        <div>
          <span class="be-tag ${esc(bg)}">${esc(tag)}</span>
          <h2 class="be-title">${esc(title)}</h2>
          <p class="be-desc">${esc(desc)}</p>
        </div>`;
    } else {
      bannerBox.innerHTML = `<div class="be-desc">${esc(t('dash_no_banners'))}</div>`;
    }
  }
  
  App.Charts.renderCharts();
}

  /* ---------------- Rooms ---------------- */
  function renderRooms() {
    const tbody = document.getElementById('roomsTable'); tbody.innerHTML = '';
    db.rooms.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;color:var(--text-strong)">${esc(t('th_room_num'))} ${esc(r.room_number)}</td>
        <td>${esc(t('rt_' + r.room_type.replace(/\s+/g, '')))}</td>
        <td>${r.capacity}</td>
        <td style="font-weight:700;color:var(--amber)">${fmtETB(r.price_per_night_etb)} ETB</td>
        <td>${statusPill(r.status)}</td>
        <td class="hide-lg" style="color:var(--muted);font-size:0.75rem">${esc(r.description || '')}</td>
        <td class="text-right">
          <div style="display:inline-flex;gap:0.35rem">
            <button onclick="AsniApp.openRoomModal(${r.id})" class="can-edit icon-sq"><i class="fa-solid fa-pen"></i></button>
            <button onclick="AsniApp.deleteRoom(${r.id})" class="can-edit icon-sq danger"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  /* ---------------- Users ---------------- */
  function renderUsers() {
    const tbody = document.getElementById('usersTable'); tbody.innerHTML = '';
    db.users.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;color:var(--text-strong)">${esc(u.full_name)}</td>
        <td style="font-family:monospace;color:var(--muted)">${esc(u.email)}</td>
        <td class="hide-sm" style="font-family:monospace;color:var(--muted)">${esc(u.phone || '—')}</td>
        <td>${rolePill(u.role)}</td>
        <td class="hide-lg" style="color:var(--muted);font-size:0.7rem">${esc(fmtDate(u.created_at))}</td>
        <td class="text-right">
          <div style="display:inline-flex;gap:0.35rem">
            <button onclick="AsniApp.openUserModal(${u.id})" class="can-edit icon-sq"><i class="fa-solid fa-pen"></i></button>
            <button onclick="AsniApp.deleteUser(${u.id})" class="can-edit icon-sq danger"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  /* ---------------- Bookings ---------------- */
  function renderBookings() {
    const grid = document.getElementById('roomMatrixGrid'); grid.innerHTML = '';
    db.rooms.forEach(r => {
      const cls = r.status === 'Occupied' ? 'matrix-occupied'
                : r.status === 'Cleaning' ? 'matrix-cleaning'
                : r.status === 'Maintenance' ? 'matrix-maintenance'
                : 'matrix-available';
      const cell = document.createElement('div');
      cell.className = `matrix-cell ${cls}`;
      cell.innerHTML = `<span class="m-num">#${esc(r.room_number)}</span><span class="m-status">${esc(t('status_' + r.status))}</span>`;
      grid.appendChild(cell);
    });

    const tbody = document.getElementById('bookingsTable'); tbody.innerHTML = '';
    db.bookings.forEach(b => {
      const room = db.rooms.find(r => r.id === b.room_id);
      const roomLabel = room ? `${t('th_room')} ${room.room_number}` : `${t('th_room')} #${b.room_id}`;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family:monospace;color:var(--muted);font-size:0.72rem">#${b.id}</td>
        <td style="font-weight:700;color:var(--text-strong)">${esc(b.guest_name)}</td>
        <td class="hide-md" style="font-family:monospace;color:var(--muted);font-size:0.72rem">${esc(b.guest_phone)}</td>
        <td>${esc(roomLabel)}</td>
        <td style="color:var(--muted)">${esc(fmtDate(b.check_in_date))}</td>
        <td class="hide-sm" style="color:var(--muted)">${esc(fmtDate(b.check_out_date))}</td>
        <td style="font-weight:700;color:var(--amber);white-space:nowrap">${fmtETB(b.total_amount_etb)} ETB</td>
        <td>${statusPill(b.status)}</td>
        <td class="text-right">
          <div style="display:inline-flex;gap:0.35rem">
            <button onclick="AsniApp.openBookingModal(${b.id})" class="can-edit icon-sq"><i class="fa-solid fa-pen"></i></button>
            <button onclick="AsniApp.deleteBooking(${b.id})" class="can-edit icon-sq danger"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  /* ---------------- Restaurant ---------------- */
  function renderRestaurant() {
    const mg = document.getElementById('menuCatalogGrid'); mg.innerHTML = '';
    db.menu_items.forEach(it => {
      const avail = Number(it.available) === 1;
      const c = document.createElement('div');
      c.className = 'menu-card';
      c.innerHTML = `
        <div>
          <div class="m-tags">
            <span class="menu-tag">${esc(t('cat_' + it.category.replace(/\s+/g, '')))}</span>
            <span class="menu-tag ${avail ? 'avail' : 'hidden-dish'}">${avail ? t('status_Available') : t('status_Hidden')}</span>
          </div>
          <h4 class="m-name" style="margin-top:0.4rem">${esc(it.name)}</h4>
          <p class="m-desc">${esc(it.description || '')}</p>
        </div>
        <div class="m-foot">
          <span class="m-price">${fmtETB(it.price_etb)} ETB</span>
          <div class="m-acts">
            <button onclick="AsniApp.addToCart(${it.id})" class="icon-sq add" title="${esc(t('btn_cart'))}"><i class="fa-solid fa-plus"></i></button>
            <button onclick="AsniApp.openMenuModal(${it.id})" class="can-edit icon-sq"><i class="fa-solid fa-pen"></i></button>
            <button onclick="AsniApp.deleteMenuItem(${it.id})" class="can-edit icon-sq danger"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>`;
      mg.appendChild(c);
    });

    const ot = document.getElementById('ordersTable'); ot.innerHTML = '';
    db.orders.forEach(o => {
      let parsed = []; try { parsed = JSON.parse(o.items_json || '[]'); } catch {}
      const summary = parsed.map(p => `${p.name} ×${p.qty || 1}`).join(', ') || '—';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family:monospace;color:var(--muted);font-size:0.72rem">#${o.id}</td>
        <td class="hide-sm" style="color:var(--muted);font-size:0.72rem">${esc(t('ot_' + o.order_type.replace(/\s+/g, '')))}</td>
        <td style="font-weight:600;color:var(--text-strong)">${esc(o.target_identifier)}</td>
        <td class="hide-md" style="color:var(--muted);font-size:0.72rem">${esc(summary)}</td>
        <td style="font-weight:700;color:var(--amber);white-space:nowrap">${fmtETB(o.total_amount_etb)} ETB</td>
        <td>${statusPill(o.status)}</td>
        <td class="text-right">
          <div style="display:inline-flex;gap:0.35rem">
            <button onclick="AsniApp.openOrderModal(${o.id})" class="can-edit icon-sq"><i class="fa-solid fa-pen"></i></button>
            <button onclick="AsniApp.deleteOrder(${o.id})" class="can-edit icon-sq danger"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>`;
      ot.appendChild(tr);
    });
  }

  /* ---------------- Tables ---------------- */
  function renderTables() {
    const tbody = document.getElementById('tablesTable'); tbody.innerHTML = '';
    db.restaurant_tables.forEach(rt => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;color:var(--text-strong)">${esc(rt.table_number)}</td>
        <td>${rt.seating_capacity} ${esc(t('misc_seats'))}</td>
        <td style="color:var(--text-mid)">${esc(t('zone_' + rt.zone.replace(/\s+/g, '')))}</td>
        <td>${statusPill(rt.status)}</td>
        <td class="text-right">
          <div style="display:inline-flex;gap:0.35rem">
            <button onclick="AsniApp.openTableModal(${rt.id})" class="can-edit icon-sq"><i class="fa-solid fa-pen"></i></button>
            <button onclick="AsniApp.deleteTable(${rt.id})" class="can-edit icon-sq danger"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  /* ---------------- Reports ---------------- */
  function computeLedger() {
    const rows = [];
    db.bookings.forEach(b => {
      const room = db.rooms.find(r => r.id === b.room_id);
      rows.push({
        ref: 'B' + b.id,
        date: fmtDate(b.check_in_date),
        type: 'Room Charge',
        desc: `Booking — ${room ? 'Room ' + room.room_number : 'Room #' + b.room_id} (${t('status_' + b.status)})`,
        payer: b.guest_name,
        amount: Number(b.total_amount_etb) || 0
      });
    });
    db.orders.forEach(o => {
      let parsed = []; try { parsed = JSON.parse(o.items_json || '[]'); } catch {}
      const summary = parsed.map(p => `${p.name} ×${p.qty || 1}`).join(', ');
      rows.push({
        ref: 'O' + o.id,
        date: fmtDate(o.created_at) || new Date().toISOString().slice(0, 10),
        type: o.order_type === 'Room Service' ? 'Room Service' : 'Restaurant POS',
        desc: summary || (o.order_type + ' — ' + o.target_identifier),
        payer: o.target_identifier,
        amount: Number(o.total_amount_etb) || 0
      });
    });
    return rows.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }

  function renderReports() {
    const rows = computeLedger();
    const roomRev = db.bookings.reduce((s, b) => s + Number(b.total_amount_etb || 0), 0);
    const restRev = db.orders.reduce((s, o) => s + Number(o.total_amount_etb || 0), 0);
    document.getElementById('repRoomRev').textContent = `${fmtETB(roomRev)} ETB`;
    document.getElementById('repRestRev').textContent = `${fmtETB(restRev)} ETB`;
    document.getElementById('repTotal').textContent = `${fmtETB(roomRev + restRev)} ETB`;

    const tbody = document.getElementById('reportsTableBody'); tbody.innerHTML = '';
    rows.forEach(l => {
      const isRoom = l.type === 'Room Charge';
      const isRest = l.type === 'Restaurant POS';
      const pillCls = isRoom ? 'pill-emerald' : isRest ? 'pill-rose' : 'pill-sky';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family:monospace;color:var(--muted);font-size:0.72rem">${esc(l.ref)}</td>
        <td class="hide-sm" style="color:var(--muted);font-size:0.72rem">${esc(l.date)}</td>
        <td><span class="pill ${pillCls}">${esc(l.type)}</span></td>
        <td class="hide-md" style="color:var(--text-mid);font-size:0.72rem">${esc(l.desc)}</td>
        <td style="color:var(--text);font-size:0.72rem">${esc(l.payer)}</td>
        <td style="font-weight:700;color:var(--emerald);white-space:nowrap">${fmtETB(l.amount)} ETB</td>
        <td class="text-right">
          <button onclick="AsniApp.printReceipt('${esc(l.payer)}','${esc(l.desc)}',${Number(l.amount)})" class="icon-sq"><i class="fa-solid fa-print"></i></button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  /* ---------------- Banners ---------------- */
  function renderBanners() {
    const g = document.getElementById('bannersGrid'); g.innerHTML = '';
    db.ad_banners.forEach(b => {
      const bg = b.badge_color || 'bg-amber-600';
      const activeFlag = Number(b.active) === 1;
      const translated = App.I18n.getBannerTranslation(App.I18n.currentLang, b.title);
      const title = translated?.title || b.title;
      const desc = translated?.description || b.description;
      const tag = translated?.tag || b.tag;

      const c = document.createElement('div');
      c.className = 'glass-panel';
      c.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;flex-wrap:wrap">
          <span class="be-tag ${esc(bg)}">${esc(tag)}</span>
          <div style="display:flex;align-items:center;gap:0.4rem">
            <span style="font-size:10px;font-weight:800;${activeFlag ? 'color:#6ee7b7' : 'color:var(--muted)'}">${esc(activeFlag ? t('status_Active') : t('status_Hidden'))}</span>
            <button onclick="AsniApp.openBannerModal(${b.id})" class="can-edit icon-sq"><i class="fa-solid fa-pen"></i></button>
            <button onclick="AsniApp.deleteBanner(${b.id})" class="can-edit icon-sq danger"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <h4 style="font-weight:700;color:var(--text-strong);margin:0.5rem 0 0.4rem">${esc(title)}</h4>
        <p style="font-size:0.78rem;color:var(--text-mid)">${esc(desc)}</p>`;
      g.appendChild(c);
    });
  }

  /* ---------------- Schema tree ---------------- */
  function renderSchema() {
    const tree = document.getElementById('schemaTree'); if (!tree) return;
    const rows = App.Tables.map(tbl => `<div>${tbl} (${db[tbl].length})</div>`).join('');
    tree.innerHTML = `
      <div>
        <div style="font-weight:700;color:var(--teal)"><i class="fa-solid fa-database"></i> asni_d1_db</div>
        <div style="padding-left:0.75rem;color:var(--muted);margin-top:0.3rem">${rows}</div>
      </div>`;
  }

  /* ---------------- All ---------------- */
 
  function renderAll() {
  renderDashboard();
  renderRooms();
  renderUsers();
  renderBookings();
  renderRestaurant();
  renderTables();
  renderReports();
  renderBanners();
  renderSchema();
  
  // Re-apply role gating to anything just rendered
  if (App.Router?.currentRole) {
    App.Router.setRole(App.Router.currentRole, /* silent */ true);
  }
}
  /* ---------------- Language change subscription ---------------- */
document.addEventListener('asni:lang-changed', () => {
  renderDashboard(); // hero banner + KPIs (KPIs are lang-neutral, harmless)
  renderBanners(); // ad-banners tab grid — same issue, same fix
});

  App.Render = {
    renderAll,
    renderDashboard, renderRooms, renderUsers, renderBookings,
    renderRestaurant, renderTables, renderReports, renderBanners, renderSchema,
    computeLedger
  };
})(window.AsniApp);
