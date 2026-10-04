/* ============================================================
   Asni Guest House — Auth module
   Guest by default. Staff sign in via an optional modal.
   Session persisted in localStorage (remember) or sessionStorage.

   ⚠️  Client-side only. Do not use in production.

   Exposes: AsniApp.Auth
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function (App) {
  'use strict';

  const SESSION_KEY  = 'asni.session';
  const REMEMBER_TTL = 30 * 24 * 60 * 60 * 1000;

  /* ---------- session storage ---------- */
  function saveSession(session, remember) {
    const json = JSON.stringify(session);
    logout();
    if (remember) localStorage.setItem(SESSION_KEY, json);
    else          sessionStorage.setItem(SESSION_KEY, json);
  }

  function loadSession() {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const s = JSON.parse(raw);
      if (s.exp && Date.now() > s.exp) { logout(); return null; }
      return s;
    } catch { return null; }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }

  /* ---------- credential check ---------- */
  async function login(email, password, remember) {
    const users = App.State.db.users || [];
    const u = users.find(x =>
      String(x.email).toLowerCase() === String(email).toLowerCase() &&
      Number(x.active ?? 1) === 1
    );
    if (!u) {
      await new Promise(r => setTimeout(r, 150));
      throw new Error('invalid');
    }
    const isGuestUser = String(u.role).toLowerCase() === 'guest';
    if (!isGuestUser && u.password !== password) {
      await new Promise(r => setTimeout(r, 150));
      throw new Error('invalid');
    }

    const session = {
      userId: u.id,
      email:  u.email,
      name:   u.full_name,
      role:   u.role,
      exp:    remember ? Date.now() + REMEMBER_TTL : 0
    };
    saveSession(session, remember);
    return u;
  }

  /* ---------- modal UI ---------- */
  const $ = (id) => document.getElementById(id);
  const getModal = () => $('modalLogin');
  const getForm  = () => $('formLogin');

  function showLoginModal() {
    getModal()?.classList.remove('hidden');
    App.I18n.applyLang(App.I18n.currentLang, true);
  }
  function hideLoginModal() { getModal()?.classList.add('hidden'); }

  function setError(key) {
    const el = $('loginError');
    if (!el) return;
    el.textContent = App.I18n.t(key);
    el.hidden = false;
  }
  function clearError() {
    const el = $('loginError');
    if (el) { el.textContent = ''; el.hidden = true; }
  }

  function fillUserDropdown() {
    const sel = $('loginUserSelect');
    if (!sel) return;

    const all = (App.State.db.users || []).filter(u => Number(u.active ?? 1) === 1);

    const ROLES = ['admin', 'receptionist', 'guest'];
    const byRole = {};
    all.forEach(u => {
      const r = String(u.role || '').toLowerCase();
      if (ROLES.includes(r) && !byRole[r]) byRole[r] = u;
    });

    sel.innerHTML = '';
    let any = false;
    ROLES.forEach(role => {
      const u = byRole[role];
      if (!u) return;
      any = true;
      const opt = document.createElement('option');
      opt.value = u.email;
      opt.textContent = App.I18n.t('role_' + role);
      sel.appendChild(opt);
    });

    if (!any) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = App.I18n.t('login_no_users');
      sel.appendChild(opt);
    }
  }

  /* ---------- toggle password field based on selected role ---------- */
  function syncLoginForm() {
  const sel     = $('loginUserSelect');
  const users   = App.State.db.users || [];
  const u       = users.find(x => x.email === sel?.value);
  const guest   = u && String(u.role).toLowerCase() === 'guest';

  const pwdWrap = $('loginPasswordInput')?.closest('div');
  const remWrap = $('loginRememberInput')?.closest('.form-check');

  if (pwdWrap) pwdWrap.classList.toggle('hidden', guest);
  if (remWrap) remWrap.classList.toggle('hidden', guest);

  // Toggle HTML5 validation
  const pwdEl = $('loginPasswordInput');
  if (pwdEl) {
    if (guest) { pwdEl.removeAttribute('required'); pwdEl.value = ''; }
    else       { pwdEl.setAttribute('required', ''); }
  }
}

  function bindEvents() {
    const form = getForm();
    if (!form || form.dataset.bound === '1') return;
    form.dataset.bound = '1';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();
      const email    = $('loginUserSelect')?.value || '';
      const pwd      = $('loginPasswordInput')?.value || '';
      const remember = !!$('loginRememberInput')?.checked;

      if (!email) { setError('login_error_missing'); return; }

      const users = App.State.db.users || [];
      const sel   = users.find(x => x.email === email);
      const isGuestUser = sel && String(sel.role).toLowerCase() === 'guest';

      // Guest doesn't need a password — just close the modal.
      if (isGuestUser) {
        hideLoginModal();
        updateLoginButton();
        return;
      }

      if (!pwd) { setError('login_error_missing'); return; }

      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      try {
        const user = await login(email, pwd, remember);
        hideLoginModal();
        App.Toast?.show(`${App.I18n.t('login_welcome')} ${user.full_name}`);
        applyRoleToShell(user.role);
        updateLoginButton();
      } catch {
        setError('login_error_invalid');
        const pwdField = $('loginPasswordInput');
        if (pwdField) { pwdField.value = ''; pwdField.focus(); }
      } finally {
        if (btn) btn.disabled = false;
      }
    });

    $('loginPasswordInput')?.addEventListener('input', clearError);
    $('loginUserSelect')?.addEventListener('change', syncLoginForm);
  }

  function applyRoleToShell(role) {
    const cased = String(role).charAt(0).toUpperCase() + String(role).slice(1);
    App.Router?.setRole?.(cased, true);
  }

  /* ---------- guest session ---------- */
  function guestSession() {
    return { userId: 0, email: '', name: 'Guest', role: 'guest', exp: 0 };
  }

  function isGuest() {
    const s = loadSession();
    return !s || s.role === 'guest';
  }

  /* ---------- public: open login modal (opt-in) ---------- */
  async function openLoginModal() {
    if (!isGuest()) return;

    if (!App.State.db.users || !App.State.db.users.length) {
      try {
        const res = await App.Api.apiQuery(
          'SELECT id, full_name, email, role, active, password ' +
          'FROM users WHERE active = 1 ORDER BY id ASC'
        );
        App.State.db.users = res.results || [];
      } catch (err) {
        console.error('[auth] failed to load users', err);
      }
    }
    showLoginModal();
    bindEvents();
    fillUserDropdown();
    syncLoginForm();   // ← hide password if guest is the first option
    setTimeout(() => {
      const guestSelected = $('loginPasswordInput')?.closest('div')?.classList.contains('hidden');
      if (!guestSelected) $('loginPasswordInput')?.focus();
    }, 50);
  }

  /* ---------- bootstrap: never blocks ---------- */
  async function bootstrap() {
    const existing = loadSession();
    if (existing) {
      applyRoleToShell(existing.role);
      return existing;
    }

    const guest = guestSession();
    applyRoleToShell('guest');
    return guest;
  }

  /* ---------- single button: sign in OR sign out ---------- */
  function updateLoginButton() {
    const btn = $('btnLogout');
    if (!btn) return;

    const guest = isGuest();

    btn.innerHTML = guest
      ? '<i class="fa-solid fa-right-to-bracket"></i>'
      : '<i class="fa-solid fa-right-from-bracket"></i>';

    const titleKey = guest ? 'login_title' : 'logout_title';
    btn.setAttribute('title', App.I18n.t(titleKey));
    btn.setAttribute('data-i18n-title', titleKey);

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (guest) {
        openLoginModal();
      } else {
        logout();
        applyRoleToShell('guest');
        updateLoginButton();
        App.Toast?.show(App.I18n.t('logout_done'));
      }
    };
  }

  /* ---------- public API ---------- */
  App.Auth = {
    bootstrap,
    login,
    logout,
    loadSession,
    bindLogout: updateLoginButton,
    updateLoginButton,
    openLoginModal,
    showLoginModal,
    hideLoginModal,
    isGuest,
    get current() { return loadSession(); }
  };
})(window.AsniApp);