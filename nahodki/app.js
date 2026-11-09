(() => {
  'use strict';
  const filters = [...document.querySelectorAll('[data-filter]')];
  const products = [...document.querySelectorAll('.product')];
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    let shown = 0;
    products.forEach(product => {
      const visible = category === 'all' || product.dataset.category === category;
      product.hidden = !visible;
      if (visible) shown++;
    });
    document.querySelector('#filter-status').textContent = `Показано находок: ${shown}`;
  }));

  const incoming = new URLSearchParams(location.search);
  const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'];
  const metrikaCounter = document.documentElement.dataset.metrikaCounter;
  document.querySelectorAll('a[data-max]').forEach(link => {
    link.target = '_blank';
    link.rel = 'noopener';
    const destination = new URL(link.href);
    allowed.forEach(key => {
      const value = incoming.get(key);
      if (value) destination.searchParams.set(key, value);
    });
    link.href = destination.href;
    link.addEventListener('click', () => {
      if (metrikaCounter && typeof window.ym === 'function') {
        window.ym(Number(metrikaCounter), 'reachGoal', 'nahodki_max_open', { placement: link.dataset.max });
      }
    });
  });
})();
