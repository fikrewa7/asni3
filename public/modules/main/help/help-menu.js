/* ============================================================
   Help Center — Mobile menu module
   Toggles the sidebar on small screens; closes on backdrop
   click or Escape.
   Exposes: Help.Menu
   ============================================================ */
window.Help = window.Help || {};

(function(H) {
  'use strict';
  
  function setupMobileMenu() {
    const btn = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (!btn || !sidebar) return;
    
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('is-open');
    });
    
    // Close on outside click
    document.addEventListener('click', e => {
      if (window.innerWidth > 900) return;
      if (!sidebar.classList.contains('is-open')) return;
      if (sidebar.contains(e.target) || btn.contains(e.target)) return;
      sidebar.classList.remove('is-open');
    });
    
    // Esc closes
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') sidebar.classList.remove('is-open');
    });
  }
  
  H.Menu = { setupMobileMenu };
})(window.Help);