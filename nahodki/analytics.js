(() => {
  'use strict';
  const counter = Number(document.documentElement.dataset.metrikaCounter);
  if (!counter || !['snezhko.ru', 'www.snezhko.ru'].includes(location.hostname)) return;
  window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = Date.now();
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.head.append(script);
  window.ym(counter, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
})();
