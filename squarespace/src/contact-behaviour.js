/* ════════════════════════════════════════════════════════════════
   CONTACT — the parts unique to /contact. Reveal, the mobile menu
   and everything else already ran above; these two no-op on any
   page that doesn't have the form.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Handoff from the homepage starter ──────────────────────────
     Carry the answer over, then move the visitor to the next
     unanswered question rather than the top of the form.           */
  (function () {
    var q = new URLSearchParams(window.location.search).get('business');
    if (!q) return;
    var field = document.getElementById('f-business');
    if (!field) return;
    field.value = q;
    var next = document.querySelector('input[name="situation"]');
    if (!next) return;
    var block = next.closest('.q-block');
    if (!block) return;
    setTimeout(function () {
      block.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      next.focus({ preventScroll: true });
    }, 260);
  })();

  /* ── Submit ─────────────────────────────────────────────────────
     Posts to Formspree over fetch so the success state is immediate.
     CONFIRM: the red signal travels the rail while the request is in
     flight, then the form is replaced by the acknowledgement. Without
     JS the form still submits normally and Formspree answers.       */
  (function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    if (form.action.indexOf('FORMSPREE_ID') !== -1) {
      console.warn('STIR: replace FORMSPREE_ID in the contact page Code Block.');
    }
    var ok  = document.getElementById('form-success');
    var bad = document.getElementById('form-error');
    var btn = form.querySelector('button[type="submit"]');

    function show(el) {
      form.style.display = 'none';
      el.classList.add('is-shown');
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn) { btn.disabled = true; btn.firstChild.nodeValue = 'Sending '; }
      form.classList.add('is-sending');
      var travelled = new Promise(function (go) { setTimeout(go, reduce ? 0 : 620); });
      var sent = fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      Promise.all([travelled, sent]).then(function (res) {
        if (!res[1].ok) throw new Error(res[1].status);
        show(ok);
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.firstChild.nodeValue = 'Send it to STIR '; }
        form.classList.remove('is-sending');
        show(bad);
      });
    });
  })();
})();
