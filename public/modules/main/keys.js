/* ============================================================
   Asni Guest House — Shared bootstrap
   Keys, Tables, Utils, and the shared `db` object live here.
   MUST be loaded first so api/state/render/modals can read
   them at module-load time.
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function (App) {
  'use strict';

  App.Keys = App.Keys || {
    worker: 'asni_worker_url',
    cache:  'asni_cache_v5',
    role:   'asni_role_v2',
    theme:  'asni_theme_v1',
    lang:   'asni_lang_v1'
  };

  App.Tables = App.Tables || [
    'rooms', 'users', 'bookings',
    'restaurant_tables', 'menu_items', 'orders', 'ad_banners'
  ];

  App.Utils = App.Utils || {
    esc: s => String(s == null ? '' : s).replace(/[&<>"']/g,
      c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])),
    fmtETB: n => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    fmtDate: s => (s ? String(s).split('T')[0].split(' ')[0] : '')
  };

  // The single in-memory db object — every module shares this reference.
  App.State = App.State || {};
  App.State.db = App.State.db || {
    rooms: [], users: [], bookings: [],
    restaurant_tables: [], menu_items: [], orders: [], ad_banners: []
  };
})(window.AsniApp);