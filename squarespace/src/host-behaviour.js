/* ════════════════════════════════════════════════════════════════
   SQUARESPACE ENHANCEMENTS
   01 · Adaptive nav — inverts against the ground passing beneath it
   02 · Running index — which part of the argument you're in
   Both are state, not movement. Both are inert under reduced motion
   in the sense that nothing animates continuously.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var root = document.querySelector('.stir');
  if (!root) return;
  var nav = root.querySelector('.nav');
  var sections = Array.prototype.slice.call(root.querySelectorAll('[data-ground]'));
  if (!sections.length) return;

  /* running index element (desktop only via CSS) */
  var idx = document.createElement('div');
  idx.className = 'stir-index';
  idx.setAttribute('aria-hidden', 'true');
  idx.innerHTML = '<span class="idx-rule"></span><span class="idx-label"></span>';
  document.body.appendChild(idx);
  var label = idx.querySelector('.idx-label');

  var navH = 64, current = null, ticking = false;

  function measure() {
    navH = nav ? nav.offsetHeight : 64;
  }

  function update() {
    /* Viewport-relative, not offsetTop: Squarespace nests our root in
       several positioned wrappers, and offsetTop is measured against
       whichever of them happens to be the offsetParent. */
    var line = navH * 0.6;
    var active = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) active = sections[i];
    }
    if (active !== current) {
      current = active;
      var ground = active.getAttribute('data-ground') || 'ivory';
      if (nav) nav.setAttribute('data-on', ground);
      idx.setAttribute('data-on', ground);
      label.textContent = active.getAttribute('data-index') || '';
    }
    /* progress through the whole argument */
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    idx.style.setProperty('--idx-progress', p.toFixed(3));
    /* Shown once the argument is underway, and retired once it lands:
       the closing section owns the bottom-left corner, and a marker
       counting a journey that has finished is just clutter. */
    var last = sections[sections.length - 1];
    var landed = last.getBoundingClientRect().top < window.innerHeight * 0.6;
    idx.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.35 && !landed);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }

  function refresh() { measure(); update(); }

  refresh();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', refresh, { passive: true });

  /* The first pass runs before the artwork has laid out, when every
     section still reports roughly the same offset — which is how the
     nav ended up reading the wrong ground at first paint. Recompute
     whenever the page actually changes height. */
  /* The first pass runs before the artwork has laid out, when every
     section still reports roughly the same position — which is how the
     nav ended up showing the wrong ground at first paint. Nothing here
     is a poll: each is a one-shot settle as the page finishes
     resolving. */
  window.addEventListener('load', refresh);
  [120, 500, 1200].forEach(function (ms) { setTimeout(refresh, ms); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  if ('ResizeObserver' in window) { new ResizeObserver(refresh).observe(root); }
  root.querySelectorAll('img').forEach(function (img) {
    if (!img.complete) img.addEventListener('load', refresh, { once: true });
  });
})();
