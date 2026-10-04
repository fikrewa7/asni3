/* ============================================================
   Help Center — Boot orchestrator
   Shared storage keys, theme + lang wiring, and init sequence.
   Exposes: window.Help
   ============================================================ */
window.Help = window.Help || {};

(function(H) {
  'use strict';
  
  // Shared storage keys — same as the main app so theme and
  // language preferences carry across index.html, help.html,
  // and presentation.html.
  H.Keys = H.Keys || {
  theme: 'asni_theme_v1',
  lang: 'asni_lang_v1'
};
  
  H.init = function init() {
    // 1. Apply theme + language before first paint of dynamic content
    H.Theme.applyTheme(H.Theme.current);
    H.I18n.applyLang(H.I18n.currentLang);
    
    // 2. Wire header toggles
    document.getElementById('themeToggle')?.addEventListener('click', H.Theme.toggleTheme);
    document.getElementById('langToggle')?.addEventListener('click', () => {
      H.I18n.applyLang(H.I18n.currentLang === 'en' ? 'am' : 'en');
    });
    
    // 3. Setup interactions
    H.Search.setupSearch();
    H.Scroll.setupScrollSpy();
    H.Menu.setupMobileMenu();
  };
  
  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', H.init);
  } else {
    H.init();
  }
})(window.Help);