/* Carriacou Logistics. One deferred file. Every effect here discloses a fact; nothing decorates. */
(() => {
  'use strict';
  const d = document;
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasTL = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: view()');
  const $ = (s, r = d) => r.querySelector(s);
  const $$ = (s, r = d) => Array.from(r.querySelectorAll(s));
  const expo = t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const tk = v => v === '' || v == null;

  /* Animate a number in place. Final value is already in the DOM for AT; the animation is aria-hidden. */
  function countTo(el, from, to, dur, done) {
    if (rm || dur <= 0) { el.textContent = fmt(to); done && done(); return; }
    const t0 = performance.now();
    const step = now => {
      const p = expo(clamp((now - t0) / dur, 0, 1));
      el.textContent = fmt(from + (to - from) * p);
      if (p < 1) requestAnimationFrame(step); else { el.textContent = fmt(to); done && done(); }
    };
    requestAnimationFrame(step);
  }

  /* ---------- Zone facts, read from the markup so there is one source of truth ---------- */
  const zones = {};
  $$('.pv .pz').forEach(a => {
    const z = a.dataset.zone;
    const art = $('#zone-' + z);
    const dds = art ? $$('dd', art) : [];
    zones[z] = {
      name: a.dataset.label,
      setpoint: $('.pz-num', a).dataset.setpoint,
      tempHTML: dds[0] ? dds[0].innerHTML : 'TK °F',
      countHTML: dds[1] ? dds[1].innerHTML : 'TK'
    };
  });

  /* ---------- M-01 Cold Start: readouts count from 72 °F down to each set point ---------- */
  (function coldStart() {
    const delays = { dry: 420, cooler: 510, freezer: 600 };
    $$('.pv .pz-num').forEach(el => {
      const sp = el.dataset.setpoint;
      if (tk(sp)) return; // pending: leave the designed TK state
      const target = parseFloat(sp);
      el.classList.remove('tk');
      const z = el.closest('.pz').dataset.zone;
      const run = () => {
        if (rm) { el.textContent = target; return; }
        const t0 = performance.now(), dur = 280;
        const step = now => {
          const p = expo(clamp((now - t0) / dur, 0, 1));
          el.textContent = Math.round(72 + (target - 72) * p);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      rm ? run() : setTimeout(run, delays[z] || 420);
    });
    const hero = $('.hero');
    setTimeout(() => hero && hero.classList.add('hero-done'), rm ? 0 : 900);
  })();

  /* ---------- M-07 Zone Select + spec panel + form pre-fill ---------- */
  const pv = $('#pv'), panel = $('#pv-panel');
  const setTemp = z => { const r = $('input[name="temp"][value="' + z + '"]'); if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); } };
  function select(z) {
    const links = $$('.pz', pv);
    links.forEach(a => a.classList.toggle('sel', a.dataset.zone === z));
    pv.classList.toggle('has-sel', !!z);
    if (!z) { panel.classList.remove('open'); return; }
    const f = zones[z];
    $('#ps-zone').textContent = f.name;
    $('#ps-temp').innerHTML = f.tempHTML;
    $('#ps-count').innerHTML = f.countHTML;
    $('#ps-cta').textContent = 'Get a ' + f.name.toLowerCase() + ' rate';
    panel.classList.add('open');
    setTemp(z);
  }
  if (pv) {
    $$('.pz', pv).forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      select(a.classList.contains('sel') ? null : a.dataset.zone);
    }));
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && pv.classList.contains('has-sel')) select(null); });
  }
  $$('[data-prefill]').forEach(a => a.addEventListener('click', () => setTemp(a.dataset.prefill)));
  $$('[data-intent="tour"]').forEach(a => a.addEventListener('click', () => {
    $('#f-intent').value = 'tour';
    $('#quote-title').textContent = 'Book a dock tour.';
    $('#f-submit').textContent = 'Request a dock tour';
  }));

  /* ---------- M-12 Reticle cursor over the plan, desktop only ---------- */
  const wrap = $('#pv-wrap'), ret = $('#pv-reticle'), retLbl = $('#pv-reticle-lbl');
  if (wrap && fine) {
    wrap.addEventListener('pointerenter', () => wrap.classList.add('ret'));
    wrap.addEventListener('pointerleave', () => wrap.classList.remove('ret'));
    wrap.addEventListener('pointermove', e => {
      const r = wrap.getBoundingClientRect();
      ret.style.transform = 'translate(' + (e.clientX - r.left) + 'px,' + (e.clientY - r.top) + 'px)';
      const t = e.target.closest ? e.target.closest('[data-label]') : null;
      retLbl.textContent = t ? t.dataset.label : (e.target.closest && e.target.closest('.pv-panel') ? 'Specification' : 'Plan');
    });
  }

  /* ---------- M-09 Live zone readout in the header ---------- */
  const roZone = $('#ro-zone'), roTemp = $('#ro-temp');
  function roll(el, str) {
    const chars = str.split('');
    const slots = $$('.roll-d', el);
    const rebuild = slots.length !== chars.length || chars.some((c, i) => (/\d/.test(c)) !== slots[i].classList.contains('dg'));
    if (rebuild) {
      el.innerHTML = '';
      const r = d.createElement('span'); r.className = 'roll';
      chars.forEach(c => {
        const s = d.createElement('span'); s.className = 'roll-d' + (/\d/.test(c) ? ' dg' : '');
        const inner = d.createElement('span');
        if (/\d/.test(c)) { for (let i = 0; i < 10; i++) { const it = d.createElement('i'); it.textContent = i; inner.appendChild(it); } }
        else { const it = d.createElement('i'); it.textContent = c; inner.appendChild(it); }
        s.appendChild(inner); r.appendChild(s);
      });
      el.appendChild(r);
    }
    $$('.roll-d', el).forEach((s, i) => {
      const c = chars[i];
      if (/\d/.test(c)) s.firstChild.style.transform = 'translateY(' + (-1.2 * parseInt(c, 10)) + 'em)';
      else s.firstChild.firstChild.textContent = c;
    });
  }
  const views = $$('[data-view]');
  const visible = new Set();
  let current = null;
  function updateView(entries) {
    (entries || []).forEach(e => { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
    const el = views.find(v => visible.has(v));
    if (!el || el === current) return;
    current = el;
    roZone.textContent = el.dataset.view;
    const isZone = /^zone-/.test(el.id);
    if (isZone) { const t = el.dataset.viewTemp; roll(roTemp, tk(t) ? 'TK °F' : t + ' °F'); }
    else roTemp.innerHTML = '';
  }
  if (views.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(updateView, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    views.forEach(v => io.observe(v));
  }

  /* ---------- M-14 Section reveals, once, one direction ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: 0.08 });
    $$('.rv').forEach(s => io.observe(s));
  } else $$('.rv').forEach(s => s.classList.add('in'));

  /* ---------- M-10 Number roll + M-05 Capacity fill ---------- */
  $$('.count').forEach(el => {
    const v = el.dataset.count;
    if (tk(v)) return;
    el.classList.remove('tk');
    const n = parseFloat(v);
    const sr = d.createElement('span'); sr.className = 'sr'; sr.textContent = fmt(n);
    el.after(sr); el.setAttribute('aria-hidden', 'true'); el.textContent = fmt(n);
  });
  const capGrid = $('#cap-grid'), capCount = $('#cap-count');
  function buildCapacity(n) {
    capGrid.innerHTML = '';
    const per = n > 600 ? 10 : 1;
    const units = Math.ceil(n / per);
    const frag = d.createDocumentFragment();
    for (let i = 0; i < units; i++) frag.appendChild(d.createElement('i'));
    capGrid.appendChild(frag);
    capGrid.classList.remove('pending');
    if (per > 1) { const note = $('#cap-note') || d.createElement('p'); note.id = 'cap-note'; note.className = 'small muted'; note.textContent = 'One square is ten pallet positions.'; capGrid.after(note); }
    return units;
  }
  if (capGrid) {
    const v = capCount.dataset.count;
    if (tk(v)) { for (let i = 0; i < 120; i++) capGrid.appendChild(d.createElement('i')); }
    else capGrid.classList.add('armed');
  }
  const statIO = 'IntersectionObserver' in window ? new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return;
    o.unobserve(e.target);
    const el = e.target;
    if (el.classList.contains('count')) {
      const n = parseFloat(el.dataset.count);
      countTo(el, 0, n, 700);
      if (el.id === 'cap-count') {
        const units = buildCapacity(n);
        const gap = Math.min(12, 1800 / units);
        const cells = $$('i', capGrid);
        requestAnimationFrame(() => cells.forEach((c, i) => { c.style.transitionDelay = rm ? '0ms' : (i * gap) + 'ms'; c.classList.add('on'); }));
      }
    }
  }), { threshold: 0.4 }) : null;
  if (statIO) $$('.count').forEach(el => { if (!tk(el.dataset.count)) statIO.observe(el); });
  else $$('.count').forEach(el => { if (!tk(el.dataset.count)) el.textContent = fmt(parseFloat(el.dataset.count)); });

  /* ---------- M-04 Dock shutter, once ---------- */
  const shutter = $('#shutter');
  if (shutter && !rm && 'IntersectionObserver' in window) {
    const N = 12;
    for (let i = 0; i < N; i++) {
      const s = d.createElement('i');
      s.style.top = (i * 100 / N) + '%';
      s.style.height = (100 / N + 0.2) + '%';
      s.style.transitionDelay = ((N - 1 - i) * 40) + 'ms';
      shutter.appendChild(s);
    }
    const io = new IntersectionObserver((es, o) => es.forEach(e => {
      if (!e.isIntersecting) return;
      o.disconnect();
      shutter.classList.add('open');
      setTimeout(() => shutter.classList.add('done'), 700);
    }), { threshold: 0.18 });
    io.observe($('#facility'));
  } else if (shutter) shutter.classList.add('done');

  /* ---------- M-02 Thermal scrub + M-06 Route draw: fallback when CSS scroll timelines are missing ---------- */
  if (!hasTL && !rm && 'IntersectionObserver' in window) {
    const steps = []; for (let i = 0; i <= 50; i++) steps.push(i / 50);
    const io = new IntersectionObserver(es => es.forEach(e => {
      const r = e.boundingClientRect, vh = innerHeight;
      let p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      if (e.target.id === 'delivery') p = clamp((p - 0.15) / 0.55, 0, 1);
      e.target.style.setProperty('--p', p.toFixed(3));
    }), { threshold: steps });
    ['#zones', '#delivery'].forEach(s => { const el = $(s); if (el) io.observe(el); });
  } else if (rm) {
    ['#zones', '#delivery'].forEach(s => { const el = $(s); if (el) el.style.setProperty('--p', '1'); });
  }

  /* ---------- M-08 Magnetic CTA, desktop only ---------- */
  if (fine && !rm) $$('.mag').forEach(w => {
    const b = $('.btn', w);
    if (!b) return;
    w.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const inside = Math.abs(dx) < r.width / 2 + 40 && Math.abs(dy) < r.height / 2 + 40;
      if (!inside) { w.classList.remove('live'); b.style.transform = ''; return; }
      w.classList.add('live');
      b.style.transform = 'translate(' + clamp(dx * 0.12, -6, 6).toFixed(1) + 'px,' + clamp(dy * 0.12, -6, 6).toFixed(1) + 'px)';
    });
    w.addEventListener('pointerleave', () => { w.classList.remove('live'); b.style.transform = ''; });
  });

  /* ---------- M-11 Live footprint ---------- */
  const fpGrid = $('#fp-grid'), fpCount = $('#fp-count'), fpNote = $('#fp-note');
  const fpMap = { '1-5': 5, '6-20': 20, '21-50': 50, '50+': 50 };
  function footprint(val) {
    const n = fpMap[val] || 0, more = val === '50+';
    const total = n + (more ? 10 : 0);
    while (fpGrid.children.length < total) fpGrid.appendChild(d.createElement('i'));
    while (fpGrid.children.length > total) fpGrid.lastChild.remove();
    const cells = Array.from(fpGrid.children);
    cells.forEach((c, i) => {
      c.classList.toggle('more', i >= n);
      c.style.transitionDelay = rm ? '0ms' : (i * 10) + 'ms';
    });
    requestAnimationFrame(() => cells.forEach(c => c.classList.add('on')));
    fpCount.innerHTML = (more ? '50+' : n) + '<small>positions</small>';
    fpNote.textContent = !n ? 'Pick a pallet range and this draws to match. One square is one pallet position.'
      : more ? 'More than 50 positions. The dashed squares stand for the rest; we size it on the call.'
      : n + ' pallet positions, drawn one square each. Change the range and it redraws.';
  }
  $$('input[name="pallets"]').forEach(r => r.addEventListener('change', () => footprint(r.value)));
  /* Beside the field on small screens, in its own column on wide ones. */
  const fpHome = $('#fp') && $('#fp').parentNode, fpAnchor = $('#seg-pallets') && $('#seg-pallets').closest('fieldset');
  const placeFp = () => { const fp = $('#fp'); if (!fp || !fpAnchor) return; if (matchMedia('(max-width: 959px)').matches) fpAnchor.after(fp); else fpHome.appendChild(fp); };
  placeFp(); matchMedia('(max-width: 959px)').addEventListener('change', placeFp);

  /* ---------- M-13 Field choreography + submit ---------- */
  const form = $('#quote-form');
  if (form) {
    const rules = {
      temp: { group: true, msg: 'Pick the temperature your product needs.' },
      pallets: { group: true, msg: 'Pick a pallet range. A rough number is fine.' },
      product: { msg: 'Say what the product is, in a few words.' },
      company: { msg: 'The company the rate is for.' },
      name: { msg: 'Your name, so we know who to ask for.' },
      email: { msg: 'A work email, so the rate has somewhere to go.', bad: 'That email is missing an @ or a domain.' }
    };
    const msgFor = n => $('#msg-' + n);
    const setMsg = (n, text, bad) => {
      const m = msgFor(n); if (!m) return;
      m.textContent = text || '';
      m.classList.toggle('show', !!text);
      const field = rules[n].group ? m.closest('fieldset') : m.closest('.field');
      if (field) field.classList.toggle('err', !!bad);
      if (!rules[n].group) { const i = form.elements[n]; if (i) i.setAttribute('aria-invalid', bad ? 'true' : 'false'); }
    };
    function check(n) {
      const r = rules[n];
      if (r.group) {
        const ok = !!form.querySelector('input[name="' + n + '"]:checked');
        setMsg(n, ok ? '' : r.msg, !ok); return ok;
      }
      const i = form.elements[n]; const v = i.value.trim();
      if (!v) { setMsg(n, r.msg, true); return false; }
      if (n === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setMsg(n, r.bad, true); return false; }
      setMsg(n, '', false); return true;
    }
    Object.keys(rules).forEach(n => {
      if (rules[n].group) form.querySelectorAll('input[name="' + n + '"]').forEach(i => i.addEventListener('change', () => check(n)));
      else { const i = form.elements[n]; i.addEventListener('blur', () => { if (i.value.trim() || i.dataset.touched) check(n); i.dataset.touched = '1'; }); i.addEventListener('input', () => { if (i.dataset.touched) check(n); }); }
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const bad = Object.keys(rules).filter(n => !check(n));
      if (bad.length) {
        const first = bad[0];
        const target = rules[first].group ? form.querySelector('input[name="' + first + '"]') : form.elements[first];
        target && target.focus();
        return;
      }
      const btn = $('#f-submit'); btn.disabled = true; const label = btn.textContent; btn.textContent = 'Sending';
      const fd = new FormData(form);
      const pick = n => { const el = form.querySelector('input[name="' + n + '"]:checked'); return el ? el.nextElementSibling.textContent : ''; };
      try {
        /* Netlify Forms: post URL-encoded to the page itself; form-name is a hidden field in the markup. */
        const res = await fetch(location.pathname, { method: 'POST', body: new URLSearchParams(fd).toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        if (!res.ok) throw new Error(res.status);
        $('#form-ok-copy').textContent = (fd.get('intent') === 'tour' ? 'A dock tour request' : 'A rate request') + ' for ' + pick('pallets').toLowerCase() + ' positions of ' + pick('temp').toLowerCase() + ' storage for ' + fd.get('product').trim() + ' is with the warehouse. The reply goes to ' + fd.get('email').trim() + '.';
        form.classList.add('sent'); $('#form-ok').classList.add('show');
        $('#form-ok').focus && $('#form-ok').setAttribute('tabindex', '-1'); $('#form-ok').focus();
      } catch (err) {
        $('#form-fail').classList.add('show');
        $('#form-fail').setAttribute('tabindex', '-1'); $('#form-fail').focus();
      } finally { btn.disabled = false; btn.textContent = label; }
    });
    $('#form-retry').addEventListener('click', () => { $('#form-fail').classList.remove('show'); $('#f-submit').focus(); });
  }
})();
