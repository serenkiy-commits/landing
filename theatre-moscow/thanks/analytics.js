(() => {
  'use strict';
  if (location.hostname !== 'snezhko.ru') return;
  const counter = 114452284;
  window.ym = window.ym || function () {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = Date.now();
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + counter;
  document.head.appendChild(script);
  window.ym(counter, 'init', {webvisor: false, clickmap: false, trackLinks: false});
})();
