/* ════════════════════════════════════════════════════════════════════
   STIR — behaviour.

   Everything essential is already in the DOM and readable before this
   file runs. Nothing here reveals content; it only adds the motion
   score's three responses and attaches the scene loop.
   ════════════════════════════════════════════════════════════════════ */
document.documentElement.classList.add('js');

(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── The workbench illustrations ────────────────────────────────
     Each runs once when its compartment enters view. They are
     decorative (aria-hidden) and the copy never waits on them: if
     this never runs, CSS leaves them in their completed state. */
  (function () {
    var cells = document.querySelectorAll('[data-bench]');
    if (!cells.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      cells.forEach(function (c) { c.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    cells.forEach(function (c) { io.observe(c); });
  })();

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
    if (help) help.textContent = HELP[type] || HELP.general;
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
  /* Help text follows the route. The copy brief gives one line per
     path; the field itself and its name never change, so the stored
     record is unaffected. */
  var HELP = {
    business: 'What\u2019s working, what needs attention, and what would you like to change?',
    creator: 'What do you make\u2014or want to make? Share a link or an idea.',
    collaborator: 'What would you bring, and what kind of project would you like to work on?',
    general: 'What would you like to talk about?'
  };
  var help = document.querySelector('[data-help]');

  var params = new URLSearchParams(location.search);
  var want = params.get('type');
  var match = want && form.querySelector('input[name="type"][value="' + CSS.escape(want) + '"]');
  if (match) match.checked = true;
  applyType(form.querySelector('input[name="type"]:checked').value);

  /* /businesses deep-links carry the engagement they asked about. */
  var eng = { partnership: 'Ongoing partnership', project: 'Defined project' }[params.get('engagement')];
  if (eng) {
    var e = form.querySelector('input[name="engagement"][value="' + CSS.escape(eng) + '"]');
    if (e) e.checked = true;
  }

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
      status.textContent = 'Your note couldn\u2019t be sent. Please try again, or email rasheed@builtbystir.com. Your answers are still here.';
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

/* ════════════════════════════════════════════════════════════════════
   C04 — clips play on intent, never before.

   Each tile ships a poster image and a <template> holding the source.
   Nothing downloads until someone presses Play, so a page carrying
   eight clips still weighs what eight stills weigh. No hover playback,
   no autoplay, and only one clip runs at a time.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var frames = document.querySelectorAll('.tile-frame[data-clip]');
  if (!frames.length) return;
  var playing = null;

  function stop(frame) {
    var v = frame.querySelector('video');
    if (v) { v.pause(); v.remove(); }
    frame.removeAttribute('data-playing');
    frame.querySelector('.tile-play').textContent = 'Play';
    frame.setAttribute('aria-label', frame.getAttribute('data-label'));
  }

  frames.forEach(function (frame) {
    frame.setAttribute('data-label', frame.getAttribute('aria-label'));
    frame.addEventListener('click', function () {
      if (frame.getAttribute('data-playing') === 'true') { stop(frame); playing = null; return; }
      if (playing && playing !== frame) stop(playing);

      var src = frame.querySelector('template').getAttribute('data-src');
      var v = document.createElement('video');
      v.muted = true;             /* no sound, ever, without a control */
      v.defaultMuted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('muted', '');
      v.setAttribute('aria-hidden', 'true');
      v.preload = 'auto';
      v.src = src;
      v.addEventListener('error', function () { stop(frame); playing = null; });
      frame.appendChild(v);
      var r = v.play();
      if (r && r.catch) r.catch(function () { stop(frame); playing = null; });

      frame.setAttribute('data-playing', 'true');
      frame.querySelector('.tile-play').textContent = 'Pause';
      frame.setAttribute('aria-label', 'Pause ' + frame.getAttribute('data-label').replace(/^Play /, ''));
      playing = frame;
    });
  });
})();
