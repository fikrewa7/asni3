/* ============================================================
   Asni Presentation — Chrome module
   Wires the fixed chrome buttons (prev/next/fullscreen, theme
   toggle, language toggle).
   Exposes: Presentation.Chrome
   ============================================================ */
window.Presentation = window.Presentation || {};

(function(P) {
  'use strict';
  
  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  
  function setupChrome() {
    document.getElementById('btnPrev')?.addEventListener('click', () => P.Nav.prev());
    document.getElementById('btnNext')?.addEventListener('click', () => P.Nav.next());
    document.getElementById('btnFull')?.addEventListener('click', toggleFullscreen);
    
    document.getElementById('btnTheme')?.addEventListener('click', () => P.Theme.toggleTheme());
    document.getElementById('btnLang')?.addEventListener('click', () => {
      P.I18n.applyLang(P.I18n.currentLang === 'en' ? 'am' : 'en');
    });
  }
  
  P.Chrome = { setupChrome, toggleFullscreen };
})(window.Presentation);