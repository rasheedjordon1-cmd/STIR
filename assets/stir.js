/* ════════════════════════════════════════════════════════════════════
   STIR — behaviour.

   Everything essential is already in the DOM and readable before this
   file runs. Nothing here reveals content; it only adds the motion
   score's three responses and attaches the scene loop.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── C01: the mobile menu ───────────────────────────────────────
     Opens in document flow. Closed items are not focusable because
     the panel is [hidden], Escape closes and returns focus. */
  (function () {
    var btn = document.querySelector('.nav-menu');
    var panel = document.getElementById('nav-panel');
    if (!btn || !panel) return;
    function setOpen(open) {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
    }
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); }
    });
    matchMedia('(min-width: 768px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  })();

  /* ── Section titles: one 8px rise, once, title only ─────────────── */
  (function () {
    var titles = document.querySelectorAll('h2[data-rise]');
    if (!titles.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      titles.forEach(function (t) { t.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    titles.forEach(function (t) { io.observe(t); });
  })();

  /* ── The diorama loop ───────────────────────────────────────────
     The still in the markup is the real hero image; this lays a 14s
     seamless loop over it. Every failure mode lands on that still:

       no JS                  -> the <picture> is already correct
       prefers-reduced-motion -> no video is created at all
       no <video> support     -> canPlayType is empty, we return
       autoplay refused       -> play() rejects, the video is removed
       file missing / error   -> 'error' removes it

     The loop's first frame IS the poster, so the crossfade is between
     identical geometry and cannot be seen.                           */
  (function () {
    var stage = document.querySelector('.stage[data-scene]');
    if (!stage || reduce) return;

    var probe = document.createElement('video');
    if (!probe.canPlayType) return;
    var mp4 = probe.canPlayType('video/mp4; codecs="avc1.64001f"');
    var webm = probe.canPlayType('video/webm; codecs="vp9"');
    if (!mp4 && !webm) return;

    /* Matches the <source media> on the still exactly, so the loop and
       the poster are always the same composition. */
    var narrow = matchMedia('(max-width: 767px)');
    var base = 'assets/scene/hero-' + (narrow.matches ? 'phone' : 'desk');

    var v = document.createElement('video');
    v.className = 'stage-loop';
    v.muted = true;            /* before src: a later mute can be too
                                  late for the autoplay check */
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('muted', '');
    v.setAttribute('aria-hidden', 'true');
    v.preload = 'auto';
    v.tabIndex = -1;
    v.src = base + (webm ? '.webm' : '.mp4');

    var userPaused = false, gone = false;
    function drop() {
      if (gone) return;
      gone = true;
      stage.classList.remove('has-loop');
      if (v.parentNode) v.parentNode.removeChild(v);
      if (btn.parentNode) btn.parentNode.removeChild(btn);
    }
    v.addEventListener('error', drop);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'stage-motion';
    function label() {
      var paused = v.paused;
      btn.textContent = paused ? 'Play motion' : 'Pause motion';
      btn.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' the illustration’s motion');
      btn.setAttribute('aria-pressed', String(paused));
    }
    btn.addEventListener('click', function () {
      if (v.paused) { userPaused = false; v.play().then(label, label); }
      else { userPaused = true; v.pause(); label(); }
    });
    v.addEventListener('play', label);
    v.addEventListener('pause', label);

    /* A pause the visitor asked for is sticky: returning to the tab or
       scrolling the hero back into view must not override it. */
    function resume() {
      if (gone || userPaused || !v.paused) return;
      var r = v.play();
      if (r && r.catch) r.catch(function () {});
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (!v.paused) v.pause(); } else resume();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) resume();
          else if (!v.paused) v.pause();
        });
      }, { threshold: 0.12 }).observe(stage);
    }

    v.addEventListener('canplay', function () {
      if (gone) return;
      var r = v.play();
      if (r && r.then) {
        r.then(function () {
          stage.appendChild(btn);
          stage.classList.add('has-loop');
          v.classList.add('is-on');
          label();
        }, drop);                 /* autoplay refused: keep the still */
      } else {
        stage.appendChild(btn);
        stage.classList.add('has-loop');
        v.classList.add('is-on');
        label();
      }
    }, { once: true });

    stage.appendChild(v);
  })();
})();

/* ════════════════════════════════════════════════════════════════════
   C06 — the typed intake.

   The form works with JavaScript off: it is a real Netlify form, every
   field is present in the markup, and the server sees whichever `type`
   radio is selected. This only adds the route switching, client-side
   validation messages, and a submit guard.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var form = document.getElementById('inquiry');
  if (!form) return;

  var rows = form.querySelectorAll('[data-for]');
  var radios = form.querySelectorAll('input[name="type"]');

  /* Switching route never clears what has been typed: the rows are
     hidden, not removed, and no value is reset. Hidden rows are also
     taken out of the tab order and out of the accessibility tree. */
  function applyType(type) {
    rows.forEach(function (row) {
      var on = row.getAttribute('data-for') === type;
      row.hidden = !on;
      row.querySelectorAll('input, textarea, select').forEach(function (f) {
        f.disabled = !on;         /* a disabled field is not submitted,
                                     so the record carries only the
                                     questions the route actually asked */
      });
    });
  }
  radios.forEach(function (r) {
    r.addEventListener('change', function () { if (r.checked) applyType(r.value); });
  });

  /* ?type= selects the route the visitor arrived through. */
  var want = new URLSearchParams(location.search).get('type');
  var match = want && form.querySelector('input[name="type"][value="' + CSS.escape(want) + '"]');
  if (match) match.checked = true;
  applyType(form.querySelector('input[name="type"]:checked').value);

  /* Arriving back at ?sent=1 is Netlify's own redirect after it has
     accepted the submission. Nothing here claims success on its own. */
  var status = document.getElementById('status');
  if (new URLSearchParams(location.search).has('sent')) {
    status.textContent = 'Thanks — that reached STIR. You will get a reply at the address you gave.';
    form.reset();
  }

  var CHECKS = [
    ['f-name', 'e-name', function (v) { return v.trim().length > 0; }],
    ['f-email', 'e-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }],
    ['f-message', 'e-message', function (v) { return v.trim().length > 0; }],
  ];
  var busy = false;

  form.addEventListener('submit', function (e) {
    if (busy) { e.preventDefault(); return; }
    var bad = null;
    CHECKS.forEach(function (c) {
      var f = document.getElementById(c[0]), err = document.getElementById(c[1]);
      var ok = c[2](f.value);
      f.setAttribute('aria-invalid', String(!ok));
      err.hidden = ok;
      if (!ok && !bad) bad = f;
    });
    if (bad) {
      e.preventDefault();
      status.textContent = 'Check the highlighted fields and send again.';
      bad.focus();
      return;
    }
    /* The real request is happening now. The label says Sending, the
       button is blocked against a second click, and nothing claims the
       submission succeeded — only Netlify's redirect does that. */
    busy = true;
    var btn = document.getElementById('submit');
    btn.setAttribute('aria-busy', 'true');
    btn.querySelector('.action-label').textContent = 'Sending…';
    status.textContent = '';
  });
})();
