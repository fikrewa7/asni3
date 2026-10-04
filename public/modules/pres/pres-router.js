/* ============================================================
   Asni Presentation — Router module
   Cross-cutting event listener that reacts to theme/lang
   changes and keeps chrome in sync.
   Exposes: Presentation.Router
   ============================================================ */
window.Presentation = window.Presentation || {};

(function(P) {
  'use strict';
  
  function setupReactiveListeners() {
    // When the theme changes, nothing chrome-specific needs updating here,
    // but we keep the event hook for future extensions (e.g. chart redraw).
    document.addEventListener('pres:theme-changed', () => {
      // no-op for now
    });
    
    // When the language changes, the counter text is still in the same
    // language-neutral format (numbers), so nothing extra to update either.
    document.addEventListener('pres:lang-changed', () => {
      // no-op for now
    });
  }
  
  // Pause animations when the tab is hidden (battery / performance).
  function setupVisibilityPause() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) document.body.classList.add('pres-paused');
      else document.body.classList.remove('pres-paused');
    });
  }
  
  P.Router = { setupReactiveListeners, setupVisibilityPause };
})(window.Presentation);