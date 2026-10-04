/* ============================================================
   Asni Guest House — API module
   Owns the D1 API endpoint, the health check, and the fetch
   that loads every table into memory.
   Exposes: AsniApp.Api
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function(App) {
  'use strict';
  
  const KEYS = App.Keys;
  const DEFAULT_API = 'https://asni-guest-house.fikrewa7.workers.dev';
  const TABLES = App.Tables;
  
  let apiBase = (localStorage.getItem(KEYS.worker) || DEFAULT_API).replace(/\/$/, '');
  let onlineMode = false;
  
  async function apiQuery(sql, params = []) {
    const res = await fetch(`${apiBase}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params })
    });
    let data;
    try { data = await res.json(); } catch { data = {}; }
    if (!res.ok || data.success === false) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }
  
  async function apiHealth() {
    const res = await fetch(`${apiBase}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  
  async function loadAllFromD1() {
    const results = await Promise.all(
      TABLES.map(tbl => apiQuery(`SELECT * FROM "${tbl}" ORDER BY id ASC`))
    );
    const out = {};
    TABLES.forEach((tbl, i) => { out[tbl] = results[i].results || []; });
    return out;
  }
  
  App.Api = {
    apiQuery,
    apiHealth,
    loadAllFromD1,
    get base() { return apiBase; },
    //set base(url) { apiBase = String(url).replace(/\/$/, ''); },
    set base(url) {
      apiBase = String(url).replace(/\/$/, '');
      localStorage.setItem(KEYS.worker, apiBase);
    },
    get online() { return onlineMode; },
    set online(v) { onlineMode = !!v; }
  };
})(window.AsniApp);