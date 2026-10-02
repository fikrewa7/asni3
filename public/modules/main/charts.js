/* ============================================================
   Asni Guest House — Charts module
   Owns the Chart.js lifecycle. Tracks instances so they can be
   destroyed cleanly before re-render, and reacts to theme and
   language changes.
   Exposes: AsniApp.Charts
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function (App) {
  'use strict';

  let revenueChartInst = null;
  let categoryChartInst = null;

  function renderCharts() {
    const isLight = App.Theme.current === 'light';
    const gridColor = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.05)';
    const tickColor = isLight ? '#64748b' : '#94A3B8';
    const lang = App.I18n.currentLang;
    const db = App.State.db;

    const ctx1 = document.getElementById('revenueChart');
    if (ctx1 && window.Chart) {
      if (revenueChartInst) revenueChartInst.destroy();
      const labels = [], data = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toISOString().slice(0, 7);
        labels.push(d.toLocaleString(lang === 'am' ? 'am' : 'en-US', { month: 'short' }));
        const rSum = db.bookings.filter(b => (b.check_in_date || '').startsWith(key))
          .reduce((s, b) => s + Number(b.total_amount_etb || 0), 0);
        const oSum = db.orders.filter(o => (o.created_at || '').startsWith(key))
          .reduce((s, o) => s + Number(o.total_amount_etb || 0), 0);
        data.push(rSum + oSum);
      }
      revenueChartInst = new Chart(ctx1, {
        type: 'line',
        data: { labels, datasets: [{
          label: 'Revenue (ETB)', data,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          fill: true, tension: 0.4
        }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 } } },
            y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 } } }
          }
        }
      });
    }

    const ctx2 = document.getElementById('categoryChart');
    if (ctx2 && window.Chart) {
      if (categoryChartInst) categoryChartInst.destroy();
      const types = ['Standard', 'Deluxe', 'Executive Suite', 'Family Suite'];
      categoryChartInst = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: types.map(v => App.I18n.t('rt_' + v.replace(/\s+/g, ''))),
          datasets: [{
            data: types.map(v => db.rooms.filter(r => r.room_type === v).length),
            backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: tickColor, boxWidth: 10, font: { size: 10 } }
            }
          }
        }
      });
    }
  }

  function destroy() {
    if (revenueChartInst) { revenueChartInst.destroy(); revenueChartInst = null; }
    if (categoryChartInst) { categoryChartInst.destroy(); categoryChartInst = null; }
  }

  // React to theme or language change
  document.addEventListener('asni:theme-changed', renderCharts);
  document.addEventListener('asni:lang-changed', renderCharts);

  App.Charts = { renderCharts, destroy };
})(window.AsniApp);