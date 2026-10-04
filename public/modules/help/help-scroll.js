/* ============================================================
   Help Center — Scroll spy module
   Highlights the active TOC link as the user scrolls, and
   enables smooth-scroll when clicking a TOC link.
   Exposes: Help.Scroll
   ============================================================ */
window.Help = window.Help || {};

(function(H) {
  'use strict';
  
  function setupScrollSpy() {
    const main = document.getElementById('mainContent');
    if (!main) return;
    const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
    
    main.addEventListener('scroll', () => {
      const scrollY = main.scrollTop + 100;
      let active = null;
      for (const link of tocLinks) {
        const id = link.getAttribute('data-target');
        const sec = document.getElementById(id);
        if (sec && sec.offsetTop <= scrollY) active = link;
      }
      tocLinks.forEach(l => l.classList.toggle('active', l === active));
    }, { passive: true });
    
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('data-target');
        const sec = document.getElementById(id);
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.innerWidth <= 900) {
            document.getElementById('sidebar').classList.remove('is-open');
          }
        }
      });
    });
  }
  
  H.Scroll = { setupScrollSpy };
})(window.Help);