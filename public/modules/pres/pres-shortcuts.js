/* ============================================================
   Asni Presentation — Shortcuts module
   Keyboard navigation and click-anywhere-to-advance.
   Exposes: Presentation.Shortcuts
   ============================================================ */
window.Presentation = window.Presentation || {};

(function (P) {
  'use strict';

  function setupKeyboard() {
    document.addEventListener('keydown', e => {
      if (e.target.matches('input, textarea, select')) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault(); P.Nav.next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault(); P.Nav.prev();
      } else if (e.key === 'Home') {
        e.preventDefault(); P.Nav.show(0);
      } else if (e.key === 'End') {
        e.preventDefault(); P.Nav.show(P.Nav.total - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        P.Chrome.toggleFullscreen();
      }
    });
  }

  function setupStageClick() {
    const stage = document.getElementById('stage');
    if (!stage) return;
    stage.addEventListener('click', e => {
      if (e.target.closest('button, a, input, select, textarea, [data-no-advance]')) return;
      P.Nav.next();
    });
  }

  function setupAll() {
    setupKeyboard();
    setupStageClick();
  }

  P.Shortcuts = { setupAll, setupKeyboard, setupStageClick };
})(window.Presentation);