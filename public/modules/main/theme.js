/* ============================================================
   Asni Guest House — Theme module
   Owns dark/light theme persistence and toggling.
   Exposes: AsniApp.Theme
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function(App) {
  'use strict';
  
  const KEYS = App.Keys;
  let currentTheme = localStorage.getItem(KEYS.theme) || 'dark';
  
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEYS.theme, theme);
    
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    
    document.dispatchEvent(new CustomEvent('asni:theme-changed', { detail: { theme } }));
  }
  
  function toggleTheme() {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    App.Toast.show(`${App.I18n.t('toast_theme_switched')} ${next}`);
  }
  
  App.Theme = {
    applyTheme,
    toggleTheme,
    get current() { return currentTheme; }
  };
})(window.AsniApp);