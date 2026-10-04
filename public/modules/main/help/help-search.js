/* ============================================================
   Help Center — Search module
   Filters TOC links and content sections based on the query.
   Exposes: Help.Search
   ============================================================ */
window.Help = window.Help || {};

(function(H) {
  'use strict';
  
  function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
    const sections = Array.from(document.querySelectorAll('.section'));
    const noResults = document.getElementById('noResults');
    
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        tocLinks.forEach(l => l.classList.remove('is-hidden'));
        sections.forEach(s => s.classList.remove('is-hidden'));
        noResults.hidden = true;
        return;
      }
      
      let visibleSections = 0;
      
      tocLinks.forEach(link => {
        const targetId = link.getAttribute('data-target');
        const labelText = (link.textContent || '').toLowerCase();
        const keywords = (link.getAttribute('data-keywords') || '').toLowerCase();
        const section = document.getElementById(targetId);
        const sectionText = section ? (section.textContent || '').toLowerCase() : '';
        const matches = labelText.includes(q) || keywords.includes(q) || sectionText.includes(q);
        
        link.classList.toggle('is-hidden', !matches);
        if (section) {
          section.classList.toggle('is-hidden', !matches);
          if (matches) visibleSections++;
        }
      });
      
      noResults.hidden = visibleSections !== 0;
    });
    
    // "/" keyboard shortcut focuses search
    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== input) {
        e.preventDefault();
        input.focus();
      }
    });
  }
  
  H.Search = { setupSearch };
})(window.Help);