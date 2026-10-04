/* ============================================================
   Help Center — Theme module
   Exposes: Help.Theme
   ============================================================ */
window.Help = window.Help || {};

(function (H) {
  'use strict';

  const KEYS = H.Keys;
  let currentTheme = localStorage.getItem(KEYS.theme) || 'dark';

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEYS.theme, theme);

    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

    document.dispatchEvent(new CustomEvent('help:theme-changed', { detail: { theme } }));
  }

  function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  H.Theme = {
    applyTheme, toggleTheme,
    get current() { return currentTheme; }
  };
})(window.Help);