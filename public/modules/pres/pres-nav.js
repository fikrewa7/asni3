/* ============================================================
   Asni Presentation — Navigation module
   Collects slides from the DOM, tracks the current index, and
   drives show() / next() / prev().
   Exposes: Presentation.Nav
   ============================================================ */
window.Presentation = window.Presentation || {};

(function (P) {
  'use strict';

  const slides = [];
  let current = 0;

  function collectSlides() {
    const stage = document.getElementById('stage');
    if (!stage) return;
    slides.length = 0;
    stage.querySelectorAll(':scope > .slide').forEach(s => slides.push(s));
    const totEl = document.getElementById('totSlides');
    if (totEl) totEl.textContent = slides.length;
  }

  function show(idx) {
    if (idx < 0) idx = 0;
    if (idx >= slides.length) idx = slides.length - 1;
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    current = idx;
    updateChrome();
    history.replaceState(null, '', '#slide-' + (idx + 1));
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  function updateChrome() {
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = ((current + 1) / slides.length * 100) + '%';
    const curEl = document.getElementById('curSlide');
    if (curEl) curEl.textContent = current + 1;
  }

  function restoreFromHash() {
    const m = (location.hash || '').match(/slide-(\d+)/);
    const idx = m ? Math.max(0, Math.min(slides.length - 1, parseInt(m[1], 10) - 1)) : 0;
    show(idx);
  }

  P.Nav = {
    collectSlides, show, next, prev,
    restoreFromHash, updateChrome,
    get slides() { return slides; },
    get current() { return current; },
    get total() { return slides.length; }
  };
})(window.Presentation);