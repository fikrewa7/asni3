/* ============================================================
   Asni Guest House — Router module
   Owns tab switching, role filtering, sidebar toggle, and every
   event binding in the app. Calls into Modals for actions.
   Exposes: AsniApp.Router
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function(App) {
  'use strict';
  
  const KEYS = App.Keys;
  const t = (k) => App.I18n.t(k);
  const M = App.Modals;
  
  /* ============================================================
     Roles
     ============================================================ */
  let currentRole = 'Admin';
  
  function updateRoleBadge() {
    const label = document.getElementById('roleLabel');
    const icon = document.getElementById('roleIcon');
    if (label) label.textContent = currentRole;
    if (icon) {
      icon.className = 'fa-solid ' + (
        currentRole === 'Admin' ? 'fa-user-shield' :
        currentRole === 'Receptionist' ? 'fa-headset' : 'fa-user'
      );
    }
  }
  
  function setRole(role) {
    currentRole = role;
    localStorage.setItem(KEYS.role, role);
    
    document.body.classList.remove('role-admin', 'role-receptionist', 'role-guest');
    const cls = role === 'Admin' ? 'role-admin' : role === 'Receptionist' ? 'role-receptionist' : 'role-guest';
    document.body.classList.add(cls);
    
    updateRoleBadge();
    
    const roleKey = role.toLowerCase();
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const allowed = (btn.getAttribute('data-roles') || '').split(',');
      btn.classList.toggle('is-hidden', !allowed.includes(roleKey));
    });
    
    document.querySelectorAll('.can-edit').forEach(b => {
      b.classList.toggle('hidden', roleKey === 'guest');
    });
    
    const activeBtn = document.querySelector('.nav-btn.is-active');
    if (activeBtn && activeBtn.classList.contains('is-hidden')) {
      document.querySelector('.nav-btn[data-tab="dashboard"]')?.click();
    }
    App.Toast.show(`${t('toast_role_switched')} ${role}`);
  }
  
  /* ============================================================
     Tabs
     ============================================================ */
  function activateTab(tabId) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('is-active'));
    const btn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (btn) btn.classList.add('is-active');
    
    document.querySelectorAll('.tab-page').forEach(p => p.classList.add('hidden'));
    const el = document.getElementById(`tab-${tabId}`);
    if (el) el.classList.remove('hidden');
    
    if (window.innerWidth < 768) {
      document.getElementById('sidebar')?.classList.remove('is-open');
    }
  }
  
  /* ============================================================
     Event bindings
     ============================================================ */
  function setupEventListeners() {
    // Nav tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn.getAttribute('data-tab')));
    });
    
    // Mobile menu
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('is-open');
    });
    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('sidebar');
      const btn = document.getElementById('mobileMenuBtn');
      if (!sidebar || !btn) return;
      if (window.innerWidth < 768 && sidebar.classList.contains('is-open') &&
        !sidebar.contains(e.target) && !btn.contains(e.target)) {
        sidebar.classList.remove('is-open');
      }
    });
    
    // Role
    document.getElementById('roleSelect')?.addEventListener('change', e => setRole(e.target.value));
    
    // Theme
    document.getElementById('btnThemeToggle')?.addEventListener('click', App.Theme.toggleTheme);
    
    // Language
    document.getElementById('btnLangToggle')?.addEventListener('click', () => {
      App.I18n.applyLang(App.I18n.currentLang === 'en' ? 'am' : 'en');
    });
    
    // Refresh
    document.getElementById('btnRefreshD1')?.addEventListener('click', async () => {
      App.Toast.show(t('toast_refresh_start'));
      await App.State.reload();
      App.Toast.show(t('toast_refresh_done'));
    });
    
    // Modals close
    document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', M.closeAllModals));
    document.querySelectorAll('.modal').forEach(m => {
      m.addEventListener('click', e => { if (e.target === m) M.closeAllModals(); });
    });
    document.getElementById('btnCloseReceipt')?.addEventListener('click', () => M.closeModal('modalReceipt'));
    document.getElementById('btnPrintReceipt')?.addEventListener('click', () => window.print());
    
    // CRUD buttons
    document.getElementById('btnCreateRoom')?.addEventListener('click', () => M.openRoomModal());
    document.getElementById('formRoom')?.addEventListener('submit', M.handleRoomSubmit);
    document.getElementById('btnCreateUser')?.addEventListener('click', () => M.openUserModal());
    document.getElementById('formUser')?.addEventListener('submit', M.handleUserSubmit);
    document.getElementById('btnCreateBooking')?.addEventListener('click', () => M.openBookingModal());
    document.getElementById('formBooking')?.addEventListener('submit', M.handleBookingSubmit);
    document.getElementById('btnCreateMenuItem')?.addEventListener('click', () => M.openMenuModal());
    document.getElementById('formMenu')?.addEventListener('submit', M.handleMenuSubmit);
    document.getElementById('btnCreateTable')?.addEventListener('click', () => M.openTableModal());
    document.getElementById('formTable')?.addEventListener('submit', M.handleTableSubmit);
    document.getElementById('formOrder')?.addEventListener('submit', M.handleOrderSubmit);
    document.getElementById('btnCreateBanner')?.addEventListener('click', () => M.openBannerModal());
    document.getElementById('formBanner')?.addEventListener('submit', M.handleBannerSubmit);
    
    // Booking auto-fill
    document.getElementById('bookingRoomSelect')?.addEventListener('change', M.autoFillBookingTotal);
    document.getElementById('bookingCheckinInput')?.addEventListener('change', M.autoFillBookingTotal);
    document.getElementById('bookingCheckoutInput')?.addEventListener('change', M.autoFillBookingTotal);
    
    // Cart
    document.getElementById('btnOpenCartModal')?.addEventListener('click', M.openCartModal);
    document.getElementById('btnClearCart')?.addEventListener('click', M.clearCart);
    document.getElementById('btnPlaceOrder')?.addEventListener('click', M.placeOrder);
    
    // Reports + SQL
    document.getElementById('btnExportCSV')?.addEventListener('click', M.exportCSV);
    document.getElementById('btnExecuteSQL')?.addEventListener('click', M.runDirectSQL);
    document.getElementById('btnResetSeed')?.addEventListener('click', M.resetSchema);
    
    // Worker URL
    document.getElementById('btnSaveWorkerUrl')?.addEventListener('click', async () => {
      const url = document.getElementById('workerUrlInput').value.trim().replace(/\/$/, '');
      if (!url) { App.Toast.show(t('misc_enter_url'), 'error'); return; }
      localStorage.setItem(KEYS.worker, url);
      App.Api.base = url;
      App.Toast.show('Reconnecting…');
      await App.boot();
    });
    document.getElementById('btnTestWorker')?.addEventListener('click', async () => {
      const url = document.getElementById('workerUrlInput').value.trim().replace(/\/$/, '');
      const status = document.getElementById('workerStatusText');
      try {
        const r = await fetch(url + '/api/health');
        const j = await r.json();
        status.textContent = `✓ ${r.status} — ${j.app || 'worker online'}`;
        App.Toast.show(t('toast_worker_online'));
      } catch (e) {
        status.textContent = `⚠ ${e.message}`;
        App.Toast.show(t('toast_worker_failed'), 'error');
      }
    });
    
    // ESC closes modals
    document.addEventListener('keydown', e => { if (e.key === 'Escape') M.closeAllModals(); });
  }
  
  App.Router = {
    setRole,
    activateTab,
    updateRoleBadge,
    setupEventListeners,
    get currentRole() { return currentRole; }
  };
})(window.AsniApp);