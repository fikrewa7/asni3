/* ============================================================
   Asni Presentation — Theme module
   Exposes: Presentation.Theme
   ============================================================ */
window.Presentation = window.Presentation || {};

(function (P) {
  'use strict';

  const KEYS = P.Keys;
  let currentTheme = localStorage.getItem(KEYS.theme) || 'dark';

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEYS.theme, theme);

    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

    document.dispatchEvent(new CustomEvent('pres:theme-changed', { detail: { theme } }));
  }

  function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  P.Theme = {
    applyTheme, toggleTheme,
    get current() { return currentTheme; }
  };
})(window.Presentation);