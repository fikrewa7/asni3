/* ============================================================
   Asni Guest House — Boot orchestrator
   Shared helpers, keys, tables, toast, utils, and init.
   Load this file LAST, after all other modules.
   Exposes: window.AsniApp
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function (App) {
  'use strict';

  /* ============================================================
     Shared constants
     ============================================================ */
  
 

  /* ============================================================
     Toast notifications
     ============================================================ */
  App.Toast = {
    show(msg, type = 'success') {
      const c = document.getElementById('toastContainer');
      if (!c) return;
      const el = document.createElement('div');
      el.className = `toast toast-${type}`;
      el.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i> <span>${App.Utils.esc(msg)}</span>`;
      c.appendChild(el);
      requestAnimationFrame(() => el.classList.add('in'));
      setTimeout(() => {
        el.classList.remove('in');
        el.classList.add('out');
        setTimeout(() => el.remove(), 300);
      }, 3200);
    }
  };

  /* ============================================================
     Connection status badge
     ============================================================ */
  App.setConnectionStatus = function (state) {
    const dot = document.getElementById('syncDot');
    const txt = document.getElementById('syncText');
    if (!dot || !txt) return;
    dot.classList.remove('online', 'offline');
    if (state === 'online')  { dot.classList.add('online');  txt.textContent = App.I18n.t('online'); }
    else if (state === 'offline') { dot.classList.add('offline'); txt.textContent = App.I18n.t('offline'); }
    else { txt.textContent = App.I18n.t('connecting'); }
  };

  /* ============================================================
     Boot sequence
     ============================================================ */
  App.boot = async function boot() {
    App.setConnectionStatus('connecting');
    const statusEl = document.getElementById('workerStatusText');
    if (statusEl) statusEl.textContent = `Connecting to ${App.Api.base}…`;

    try {
      const health = await App.Api.apiHealth();
      if (statusEl) statusEl.textContent = `✓ Online — ${health.app || 'Asni D1 API'} @ ${App.Api.base}`;
      const fresh = await App.Api.loadAllFromD1();
      Object.assign(App.State.db, fresh);
      App.Api.online = true;
      App.setConnectionStatus('online');
      App.Toast.show(App.I18n.t('toast_connected'));
    } catch (e) {
      console.warn('D1 offline:', e);
      App.Api.online = false;
      App.State.loadLocalCache();
      App.setConnectionStatus('offline');
      if (statusEl) statusEl.textContent = `⚠ Offline — ${e.message}`;
      App.Toast.show(App.I18n.t('toast_offline'), 'error');
    }

    App.Render.renderAll();
  };

  /* ============================================================
     Init
     ============================================================ */
  App.init = async function init() {
  App.Router.setupEventListeners();
  App.Theme.applyTheme(App.Theme.current);
  App.I18n.applyLang(App.I18n.currentLang, /* silent */ true);
  
  await App.Auth.bootstrap(); // always resolves (guest or existing session)
  App.Auth.updateLoginButton(); // wire the sign in / sign out button
  
  await App.boot(); // load data, render
  
  document.body.classList.remove('is-booting');
};
  /* ============================================================
     Public API for inline onclick="" attributes
     Forward every modal action to the module that owns it.
     ============================================================ */
  // Rooms
  App.openRoomModal    = (...a) => App.Modals.openRoomModal(...a);
  App.deleteRoom       = (...a) => App.Modals.deleteRoom(...a);
  // Users
  App.openUserModal    = (...a) => App.Modals.openUserModal(...a);
  App.deleteUser       = (...a) => App.Modals.deleteUser(...a);
  // Bookings
  App.openBookingModal = (...a) => App.Modals.openBookingModal(...a);
  App.deleteBooking    = (...a) => App.Modals.deleteBooking(...a);
  // Menu
  App.openMenuModal    = (...a) => App.Modals.openMenuModal(...a);
  App.deleteMenuItem   = (...a) => App.Modals.deleteMenuItem(...a);
  // Tables
  App.openTableModal   = (...a) => App.Modals.openTableModal(...a);
  App.deleteTable      = (...a) => App.Modals.deleteTable(...a);
  // Orders / Cart
  App.addToCart        = (...a) => App.Modals.addToCart(...a);
  App.removeFromCart   = (...a) => App.Modals.removeFromCart(...a);
  App.openOrderModal   = (...a) => App.Modals.openOrderModal(...a);
  App.deleteOrder      = (...a) => App.Modals.deleteOrder(...a);
  // Banners
  App.openBannerModal  = (...a) => App.Modals.openBannerModal(...a);
  App.deleteBanner     = (...a) => App.Modals.deleteBanner(...a);
  // Utilities
  App.printReceipt     = (...a) => App.Modals.printReceipt(...a);

  // Convenience shortcuts that were previously on AsniApp directly
  App.t = (k) => App.I18n.t(k);

  /* ============================================================
     Auto-init
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
  } else {
    App.init();
  }
})(window.AsniApp);