/* ============================================================
   Asni Guest House — State module
   Owns the in-memory `db` object, the CRUD helpers that write
   through to D1 (or to localStorage when offline), and the
   reload() function that refreshes everything from the server.
   Exposes: AsniApp.State
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function (App) {
  'use strict';

  const KEYS = App.Keys;
  const TABLES = App.Tables;

  const db = App.State.db;

  function persistLocalCache() {
    try { localStorage.setItem(KEYS.cache, JSON.stringify(db)); } catch {}
  }
  function loadLocalCache() {
    try {
      const raw = localStorage.getItem(KEYS.cache);
      if (raw) {
        const p = JSON.parse(raw);
        for (const tbl of TABLES) db[tbl] = Array.isArray(p[tbl]) ? p[tbl] : [];
      }
    } catch {}
  }

  async function dbInsert(table, obj) {
    if (!App.Api.online) {
      const id = obj.id ?? Date.now();
      db[table].push({ ...obj, id });
      persistLocalCache();
      return id;
    }
    const cols = Object.keys(obj).filter(k => obj[k] !== undefined);
    const colList = cols.map(c => `"${c}"`).join(', ');
    const ph = cols.map(() => '?').join(', ');
    const vals = cols.map(c => obj[c]);
    const res = await App.Api.apiQuery(`INSERT INTO "${table}" (${colList}) VALUES (${ph})`, vals);
    return res.meta?.last_row_id;
  }

  async function dbUpdate(table, id, obj) {
    if (!App.Api.online) {
      const r = db[table].find(x => x.id === id);
      if (r) Object.assign(r, obj);
      persistLocalCache();
      return;
    }
    const cols = Object.keys(obj).filter(k => obj[k] !== undefined);
    const assign = cols.map(c => `"${c}" = ?`).join(', ');
    const vals = [...cols.map(c => obj[c]), id];
    await App.Api.apiQuery(`UPDATE "${table}" SET ${assign} WHERE id = ?`, vals);
  }

  async function dbDelete(table, id) {
    if (!App.Api.online) {
      db[table] = db[table].filter(x => x.id !== id);
      persistLocalCache();
      return;
    }
    await App.Api.apiQuery(`DELETE FROM "${table}" WHERE id = ?`, [id]);
  }

  async function reload() {
    if (App.Api.online) {
      try { Object.assign(db, await App.Api.loadAllFromD1()); }
      catch (e) { console.error(e); App.Toast.show('Refresh failed — ' + e.message, 'error'); }
    }
    App.Render.renderAll();
  }

  App.State = {
    db,
    dbInsert,
    dbUpdate,
    dbDelete,
    reload,
    persistLocalCache,
    loadLocalCache
  };
})(window.AsniApp);