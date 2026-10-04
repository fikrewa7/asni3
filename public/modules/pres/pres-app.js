/* ============================================================
   Asni Presentation — Boot orchestrator
   Shared constants + init sequence. Loaded LAST.
   Exposes: window.Presentation
   ============================================================ */
window.Presentation = window.Presentation || {};

(function(P) {
  'use strict';
  
  // Shared storage keys — the SAME keys used by the main app so
  // theme and language preferences carry across index.html,
  // help.html, and presentation.html.
  P.Keys = P.Keys || {
  theme: 'asni_theme_v1',
  lang: 'asni_lang_v1'
};
  
  P.init = function init() {
    // 1. Collect all slides from the DOM
    P.Nav.collectSlides();
    
    // 2. Apply theme and language BEFORE first paint
    P.Theme.applyTheme(P.Theme.current);
    P.I18n.applyLang(P.I18n.currentLang);
    
    // 3. Restore slide from hash (or show slide 1)
    P.Nav.restoreFromHash();
    
    // 4. Wire the chrome buttons
    P.Chrome.setupChrome();
    
    // 5. Wire keyboard and stage-click navigation
    P.Shortcuts.setupAll();
    
    // 6. Set up reactive listeners (theme/lang changes, tab visibility)
    P.Router.setupReactiveListeners();
    P.Router.setupVisibilityPause();
  };
  
  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', P.init);
  } else {
    P.init();
  }
})(window.Presentation);