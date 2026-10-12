#!/usr/bin/env python3
"""
Build the Carriacou Logistics Squarespace kit from the Netlify source.

The Netlify site (../index.html, ../main.js, ../fonts) stays the single source
of truth. This script cuts it into one paste per page section for a
Squarespace 7.1 page:

  00-page-header-injection.html  Page Settings > Advanced > Page Header Code Injection
                                 (fonts, shared styles, Squarespace overrides, structured data)
  01-header.html ... 11-footer.html
                                 one Code Block per Squarespace section, in order;
                                 each carries the styles only it uses
  404-optional.html              one Code Block on the page you choose as the 404

How the page survives Squarespace:
  - Every rule is scoped with :is(.cl-page,#cl-_). The class matches each
    section's wrapper; the never-present id inside :is() lifts the rule to id
    specificity, so the theme cannot restyle the page and the page cannot
    restyle the rest of the site.
  - Keyframes and font families carry a cl- prefix.
  - Fonts are inlined as data URIs: no uploads, no extra requests.
  - Squarespace's header, footer, section padding, layout grid, and block
    animations are neutralized on this page only (every override keys off .cl-page).
  - The header is fixed instead of sticky, because a sticky element cannot leave
    its own Squarespace section. A 56px slot keeps the layout identical.
  - The form posts to a Formspree-compatible endpoint set in one attribute.

Run:  python3 build.py                (writes the kit next to this file)
      python3 build.py --mock OUT     (also writes a mock Squarespace page for testing)
      python3 build.py --guide OUT    (also writes the step-by-step install guide page)
"""
import base64, html as htmlmod, json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parent
SCOPE = ':is(.cl-page,#cl-_)'

SECTIONS = [  # key, file, title, what the reader will see
    ('header',     '01-header.html',     'Header',                   'The fixed bar: wordmark, live zone readout, phone, and the rate button.'),
    ('hero',       '02-hero.html',       'Hero and facility plan',   'Headline, both buttons, and the drafted plan with zone select.'),
    ('zones',      '03-zones.html',      'Three temperature zones',  'Freezer, cooler, and dry, with the frost edge and the temperature shift on scroll.'),
    ('facility',   '04-facility.html',   'The building',             'Dark section behind the dock shutter: stats, capacity grid, and the spec table.'),
    ('compliance', '05-compliance.html', 'Retail compliance',        'The DC-window rows that chill on hover and disclose the paperwork.'),
    ('delivery',   '06-delivery.html',   'Storage and delivery',     'Receive, store, deliver, and the route that draws as you scroll.'),
    ('serves',     '07-serves.html',     'Who this is built for',    'Product and retail lists with the reading line on phones.'),
    ('terms',      '08-terms.html',      'Terms',                    'Contract, minimums, turnaround, insurance, and price.'),
    ('ownership',  '09-ownership.html',  'Who runs this',            'The one paragraph on the name, with the Spice Green rule.'),
    ('quote',      '10-quote.html',      'Get a rate and book a tour', 'Both tabs, the form, and the load ticket that draws as it is filled.'),
    ('footer',     '11-footer.html',     'Footer and page script',   'Address, contact, hours, service area, the phone bar, and the script that runs the page.'),
]
KEYS = [s[0] for s in SECTIONS]


# ---------------------------------------------------------------- helpers
def must_replace(text, old, new, count=1, label=''):
    found = text.count(old)
    if found != count:
        raise SystemExit(f'build: expected {count} of {label or old[:60]!r}, found {found}. The source changed; update build.py.')
    return text.replace(old, new)


def split_top(s, sep=','):
    out, depth, cur = [], 0, ''
    for ch in s:
        if ch in '([':
            depth += 1
        elif ch in ')]':
            depth -= 1
        if ch == sep and depth == 0:
            out.append(cur)
            cur = ''
        else:
            cur += ch
    out.append(cur)
    return [x.strip() for x in out if x.strip()]


def blocks(css):
    """Yield (prelude, body) for each top-level rule."""
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    i, n = 0, len(css)
    while i < n:
        while i < n and css[i].isspace():
            i += 1
        if i >= n:
            break
        j = css.index('{', i)
        depth, k = 0, j
        while True:
            if css[k] == '{':
                depth += 1
            elif css[k] == '}':
                depth -= 1
                if depth == 0:
                    break
            k += 1
        yield css[i:j].strip(), css[j + 1:k]
        i = k + 1


# ---------------------------------------------------------------- CSS scoping
def scope_selector(s):
    if s in (':root', 'body'):
        return SCOPE
    if s.startswith('.js '):
        return f'.cl-js {SCOPE} ' + s[4:]
    if s.startswith('.no-js '):
        return f'html:not(.cl-js) {SCOPE} ' + s[7:]
    if re.search(r'(^|[\s>+~,(])(html|body)\b', s) or '.js ' in s or ':root' in s:
        raise SystemExit(f'build: selector needs a scoping rule: {s}')
    return f'{SCOPE} {s}'


def rename_animations(body, names):
    def fix(m):
        val = m.group(2)
        for n in names:
            val = re.sub(r'(?<![\w-])' + re.escape(n) + r'(?![\w-])', 'cl-' + n, val)
        return m.group(1) + val
    return re.sub(r'(animation(?:-name)?\s*:\s*)([^;}]*)', fix, body)


def selector_tokens(sel):
    s = re.sub(r'\[[^\]]*\]', '', sel)
    s = re.sub(r'^\.(?:no-)?js\s+', '', s)
    return set(re.findall(r'[.#]([A-Za-z_][\w-]*)', s))


def classify(sel, chunk_tokens):
    """Return the section key that owns this selector, or 'base' when it is shared."""
    known = {t for t in selector_tokens(sel) if any(t in toks for toks in chunk_tokens.values())}
    if not known:
        return 'base'
    owners = [k for k, toks in chunk_tokens.items() if known <= toks]
    return owners[0] if len(owners) == 1 else 'base'


def split_css(css, names, chunk_tokens):
    items = {k: [] for k in KEYS + ['base']}

    def walk(src, ctx):
        for pre, body in blocks(src):
            if pre.startswith('@media') or pre.startswith('@supports'):
                walk(body, ctx + (pre,))
            elif pre.startswith('@keyframes'):
                items['base'].append((ctx, '@keyframes cl-' + pre.split()[1], body))
            elif pre.startswith('@font-face'):
                continue
            elif pre == 'html':
                items['base'].append((ctx, 'html:has(.cl-page)', 'scroll-padding-top:72px'))
            else:
                groups = []
                for part in split_top(pre):
                    dest = classify(part, chunk_tokens)
                    if groups and groups[-1][0] == dest:
                        groups[-1][1].append(part)
                    else:
                        groups.append((dest, [part]))
                for dest, parts in groups:
                    items[dest].append((ctx, ','.join(scope_selector(p) for p in parts), rename_animations(body, names)))
    walk(css, ())
    return items


def render(items):
    out, open_ctx = [], ()
    for ctx, sel, body in items:
        if ctx != open_ctx:
            out.append('}' * len(open_ctx))
            out.append(''.join(c + '{' for c in ctx))
            open_ctx = ctx
        out.append(f'{sel}{{{body}}}\n')
    out.append('}' * len(open_ctx))
    return ''.join(out).strip()


def keyframe_names(css):
    return sorted(set(re.findall(r'@keyframes\s+([\w-]+)', css)), key=len, reverse=True)


def font_faces(css):
    faces = ''.join(f'@font-face{{{b}}}\n' for p, b in blocks(css) if p.startswith('@font-face'))
    for name in ('archivo-display', 'archivo-text'):
        b64 = base64.b64encode((SRC / 'fonts' / f'{name}.woff2').read_bytes()).decode()
        faces = faces.replace(f'url(fonts/{name}.woff2)', f'url(data:font/woff2;base64,{b64})')
    return faces


def brand_fonts(css):
    return css.replace('"Archivo', '"CL Archivo')


def reset_css(R):
    """Neutralize theme styles that would otherwise leak into the page."""
    return f'''{R}{{display:block;position:relative;width:100%;text-align:left;font-size:16px}}
{R} :is(h1,h2,h3,h4,h5,h6,p,li,dt,dd,address,legend,label,figcaption,a,small,strong,b,button,input,textarea,select){{font-family:inherit;font-size:inherit;line-height:inherit;color:inherit;font-weight:inherit;letter-spacing:inherit;text-transform:none;font-style:normal;text-shadow:none}}
{R} :is(h1,h2,h3,h4,h5,h6,p,li,dt,dd,address,legend,label,figcaption){{white-space:normal}}
{R} :is(input,button,textarea,select){{appearance:none;-webkit-appearance:none;border-radius:0;box-shadow:none;margin:0;height:auto;min-width:0;background-image:none}}
{R} :is(li,dt,dd,dl,address,label,legend,figcaption,small,blockquote){{margin:0}}
{R} label{{display:inline}}
{R} a{{text-decoration:none}}
{R} :is(ul,ol){{margin:0;padding:0;list-style:none}}
{R} :is(svg,img){{max-width:100%}}'''


def chrome_css(cls):
    return f'''/* Squarespace overrides, this page only. Every rule keys off {cls}, so they do
   nothing on a page without these code blocks.
   To keep your Squarespace header and footer, delete the first rule. */
body:has({cls}) :is(#header, header.header, #footer-sections, footer.sections, .header-announcement-bar-wrapper){{display:none!important}}
body:has({cls}){{background:#F5F8F9!important}}
body:has({cls}) :is(#page, #sections, main, article):has({cls}){{padding-top:0!important;margin-top:0!important}}
section:has({cls}){{display:block!important;padding:0!important;margin:0!important;min-height:0!important;background:#F5F8F9!important}}
section:has({cls}) > :is(.section-background, .section-border, .section-divider-display){{display:none!important}}
section:has({cls}) *:has({cls}){{display:block!important;padding:0!important;margin:0!important;max-width:none!important;width:auto!important;min-height:0!important;height:auto!important;grid-area:auto!important}}
body *:has({cls}), section:has({cls}){{overflow:visible!important;transform:none!important;filter:none!important;opacity:1!important;animation:none!important;transition:none!important;will-change:auto!important;contain:none!important;perspective:none!important;backdrop-filter:none!important;clip-path:none!important}}'''


# ---------------------------------------------------------------- markup
def prepare_body(page):
    body = re.search(r'<body>(.*)</body>', page, re.S).group(1)
    body = must_replace(body, '<a class="skip" href="#main">Skip to content</a>\n', '', label='skip link')
    body = must_replace(body, '<span id="top"></span>', '<span id="cl-top"></span>', label='top anchor')
    body = must_replace(body, 'href="#top"', 'href="#cl-top"', count=2, label='#top links')
    body = must_replace(body,
        'name="quote" method="post" action="/quote-received/" data-netlify="true" data-netlify-honeypot="company-website" novalidate>',
        'name="quote" method="post" action="https://formspree.io/f/YOUR_FORM_ID" novalidate>', label='form tag')
    body = must_replace(body, '<input type="hidden" name="form-name" value="quote">\n          ', '', label='form-name')
    body = must_replace(body, '<input name="company-website" tabindex="-1" autocomplete="off"', '<input name="_gotcha" tabindex="-1" autocomplete="off"', label='honeypot')
    ids = re.findall(r'<(?:pattern|linearGradient|mask) id="([^"]+)"', body)
    for old in ids:
        body = must_replace(body, f'id="{old}"', f'id="cl-{old}"', label=f'svg id {old}')
        body = body.replace(f'url(#{old})', f'url(#cl-{old})')
    if re.search(r'url\(#(?!cl-)', body):
        raise SystemExit('build: an SVG url(#...) reference was not renamed')
    return body, ids


def cut_chunks(body):
    """Cut the page into the eleven sections, in page order."""
    take = lambda pat: re.search(pat, body, re.S).group(0)
    sections = re.findall(r'<section\b.*?</section>', body, re.S)
    if len(sections) != 9:
        raise SystemExit(f'build: expected 9 <section> elements, found {len(sections)}')
    header, footer, mbar = take(r'<header class="hdr">.*?</header>'), take(r'<footer class="dark ftr".*?</footer>'), take(r'<div class="mbar".*?</div>')
    chunks = {'header': header}
    for key, sec in zip(KEYS[1:10], sections):
        chunks[key] = sec
    chunks['hero'] = '<span id="cl-top"></span>\n' + chunks['hero']
    chunks['footer'] = footer + '\n\n' + mbar
    # Everything outside the chunks must be wrapper, comment, or script.
    rest = body
    for piece in [header, footer, mbar, *sections]:
        rest = rest.replace(piece, '', 1)
    rest = re.sub(r'<!--.*?-->|<span id="cl-top"></span>|<main id="main">|</main>|<script src="main.js" defer></script>', '', rest, flags=re.S)
    if rest.strip():
        raise SystemExit('build: markup outside the known sections: ' + rest.strip()[:120])
    return chunks


def tokens_of(markup):
    toks = set()
    for c in re.findall(r'class="([^"]*)"', markup):
        toks.update(c.split())
    toks.update(re.findall(r'\bid="([^"]+)"', markup))
    return toks


def build_js(js):
    js = must_replace(js, "  const d = document;\n",
        "  const d = document;\n  const IN = el => !!(el && el.closest && el.closest('.cl-page'));\n  if (!d.querySelector('.cl-page')) return;\n", label='scope guard')
    js = must_replace(js, "  const $ = (s, r = d) => r.querySelector(s);\n  const $$ = (s, r = d) => Array.from(r.querySelectorAll(s));",
        "  const $$ = (s, r = d) => Array.from(r.querySelectorAll(s)).filter(IN);\n  const $ = (s, r = d) => $$(s, r)[0] || null;", label='scoped queries')
    js = must_replace(js,
        "        /* Netlify Forms: post URL-encoded to the page itself; form-name is a hidden field in the markup. */\n"
        "        const res = await fetch(location.pathname, { method: 'POST', body: new URLSearchParams(fd).toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });",
        "        /* Formspree-compatible endpoint, set once in the form's action attribute (section 10). */\n"
        "        const endpoint = form.getAttribute('action') || '';\n"
        "        if (!/^https:\\/\\//.test(endpoint) || /YOUR_FORM_ID/.test(endpoint)) { console.warn('Carriacou: set the form action in section 10 to your form endpoint.'); throw new Error('no endpoint'); }\n"
        "        fd.set('_subject', (mode === 'tour' ? 'Dock tour request: ' : 'Rate request: ') + [optLabel('temp'), optLabel('pallets') && optLabel('pallets') + ' positions', fd.get('company')].filter(Boolean).join(', '));\n"
        "        const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });",
        label='form submit')
    js = must_replace(js, "\n})();\n", "\n  d.documentElement.classList.add('cl-ready');\n})();\n", label='ready flag')
    return js


EARLY = ("<script>(function(h){h.classList.add('cl-js');"
         "setTimeout(function(){if(!h.classList.contains('cl-ready'))h.classList.remove('cl-js')},4000)"
         "})(document.documentElement)</script>")

# The header leaves the page flow so it can stay on screen across Squarespace sections.
HEADER_EXTRA = [((), f'{SCOPE}.cl-hdr-slot', 'height:56px'),
                ((), f'{SCOPE} .hdr', 'position:fixed;top:0;left:0;right:0')]


def jsonld(page):
    data = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', page, re.S).group(1))
    data.pop('url', None)
    data.pop('image', None)
    return '<script type="application/ld+json">\n' + json.dumps(data, indent=2) + '\n</script>'


# ---------------------------------------------------------------- 404 (self-contained, one paste)
def scope_404(css, names):
    R = '#cl-404'
    out = []
    for pre, body in blocks(css):
        if pre.startswith('@media') or pre.startswith('@supports'):
            out.append(pre + '{' + scope_404(body, names) + '}')
        elif pre.startswith('@font-face') or pre.startswith('@keyframes'):
            continue
        else:
            sels = []
            for s in split_top(pre):
                s = s.replace('main', '.cl-404-main') if re.fullmatch(r'main\b.*', s) else s
                sels.append(R if s in (':root', 'body') else f'{R} {s}')
            out.append(','.join(sels) + '{' + rename_animations(body, names) + '}')
    return '\n'.join(out)


def build_404():
    page = (SRC / '404.html').read_text()
    css = re.search(r'<style>(.*?)</style>', page, re.S).group(1)
    body = re.search(r'<body>(.*)</body>', page, re.S).group(1).strip()
    body = body.replace('<main>', '<div class="cl-404-main">').replace('</main>', '</div>').replace('href="./"', 'href="/"')
    for old in re.findall(r'<pattern id="([^"]+)"', body):
        body = body.replace(f'id="{old}"', f'id="cl-404-{old}"').replace(f'url(#{old})', f'url(#cl-404-{old})')
    styles = brand_fonts(font_faces(css) + chrome_css('#cl-404') + '\n' + reset_css('#cl-404') + '\n' + scope_404(css, keyframe_names(css)))
    return ('<!-- Carriacou Logistics, Squarespace kit. Optional 404: one Code Block on the page you set as the 404. -->\n'
            f'<style>\n{styles}\n</style>\n<div id="cl-404">\n{body}\n</div>\n')


# ---------------------------------------------------------------- main
def build():
    page = (SRC / 'index.html').read_text()
    css = re.search(r'<style>(.*?)</style>', page, re.S).group(1)
    body, svg_ids = prepare_body(page)
    chunks = cut_chunks(body)
    chunk_tokens = {k: tokens_of(chunks[k]) for k in KEYS}
    items = split_css(css, keyframe_names(css), chunk_tokens)
    items['header'] += HEADER_EXTRA

    def finish(text):
        for old in svg_ids:
            text = text.replace(f'url(#{old})', f'url(#cl-{old})')
        if re.search(r'url\(#(?!cl-)', text):
            raise SystemExit('build: a CSS url(#...) reference was not renamed')
        return brand_fonts(text)

    files = {}
    files['00-page-header-injection.html'] = (
        '<!-- Carriacou Logistics, Squarespace kit. Step 0 of 11.\n'
        '     Paste into: this page > Page Settings > Advanced > Page Header Code Injection.\n'
        '     Shared by every section: fonts, colours, type, buttons, motion, and the Squarespace overrides. -->\n'
        f'<style>\n/* Fonts: Archivo (SIL OFL), inlined. */\n{font_faces(css)}\n{chrome_css(".cl-page")}\n\n'
        f'/* Shared page styles. */\n{reset_css(SCOPE)}\n{finish(render(items["base"]))}\n</style>\n{jsonld(page)}\n')
    files['00-page-header-injection.html'] = brand_fonts(files['00-page-header-injection.html'])

    js = build_js((SRC / 'main.js').read_text())
    for n, (key, fname, title, _) in enumerate(SECTIONS, 1):
        markup = chunks[key]
        wrap_cls = 'cl-page cl-hdr-slot' if key == 'header' else 'cl-page'
        pre = EARLY + '\n' if key == 'header' else ''
        post = f'\n<script>\n{js}</script>' if key == 'footer' else ''
        note = {'header': '     Must be the first section on the page: it switches on the page motion.\n',
                'footer': '     Must be the last section on the page: it carries the script that runs every section.\n',
                'quote': '     Formspree goes here later: replace https://formspree.io/f/YOUR_FORM_ID with your endpoint.\n'}.get(key, '')
        files[fname] = (f'<!-- Carriacou Logistics, Squarespace kit. Step {n} of 11: {title}.\n'
                        f'     Paste into: one Code Block, alone in its own blank section. Display source off.\n{note}-->\n'
                        f'{pre}<style>\n{finish(render(items[key]))}\n</style>\n'
                        f'<div class="{wrap_cls}" id="cl-s-{key}">\n{markup}\n</div>{post}\n')
    files['404-optional.html'] = build_404()
    return files


def main():
    files = build()
    for old in ('1-page-header-injection.html', '2-code-block.html', '3-optional-404-code-block.html'):
        (HERE / old).unlink(missing_ok=True)
    for name, text in files.items():
        (HERE / name).write_text(text)
        print(f'{name:32s} {len(text.encode()) / 1024:6.1f} KB')
    if '--mock' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--mock') + 1])
        sections = ''.join(MOCK_SECTION.replace('%%BLOCK%%', files[f]) for _, f, _, _ in SECTIONS)
        out.write_text(MOCK.replace('%%HEAD%%', files['00-page-header-injection.html']).replace('%%SECTIONS%%', sections))
        print('mock', out)
    if '--guide' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--guide') + 1])
        out.write_text(guide(files))
        print('guide', out)


# ---------------------------------------------------------------- test mock
# A deliberately hostile stand-in for a Squarespace 7.1 page: theme type styles,
# padded sections that clip overflow, a Fluid Engine grid, a block entrance
# animation, and a sticky site header. Each kit section sits in its own section.
MOCK_SECTION = '''<section class="page-section" data-section-theme="white"><div class="section-background"></div>
<div class="content-wrapper"><div class="content"><div class="fluid-engine"><div class="fe-block">
<div class="sqs-block code-block sqs-block-code"><div class="sqs-block-content">
%%BLOCK%%
</div></div></div></div></div></div></section>
'''
MOCK = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mock Squarespace 7.1</title>
<style>
body{margin:0;font-family:Georgia,serif;background:#fff;color:#333}
h1,h2,h3,h4{font-family:Georgia,serif;text-transform:uppercase;letter-spacing:.2em;line-height:1.8;color:#b00;margin:1em 0;font-weight:400}
[data-section-theme] h2{color:#06c}
.sqs-block-code p{color:#06c;font-size:22px}
p{margin:1em 0;line-height:1.9;font-size:18px;white-space:pre-wrap;color:#333}
a{color:#b00;text-decoration:underline wavy}
ul{padding-left:2em;list-style:disc}li{margin:.5em 0}
input[type=text],input[type=email],input[type=tel]{border:2px solid #999;padding:14px;border-radius:12px;background:#eee;box-shadow:inset 0 1px 3px #0003;height:52px;font-size:20px}
button{border-radius:30px;background:#b00;color:#fff;padding:20px;text-transform:uppercase;letter-spacing:.1em}
label{display:block;font-size:12px;text-transform:uppercase}
@font-face{font-family:"Archivo";src:local("Courier New")}
#header{position:sticky;top:0;height:90px;background:#222;color:#fff;display:flex;align-items:center;padding:0 4vw;z-index:9;font:24px Georgia}
#page{padding-top:40px}
.page-section{position:relative;display:flex;padding:6vmax 0;overflow:hidden;min-height:66vh;margin-bottom:24px}
.section-background{position:absolute;inset:0;background:#fafafa}
.content-wrapper{position:relative;max-width:1200px;margin:0 auto;padding:0 4vw;width:100%;overflow:hidden}
.fluid-engine{display:grid;grid-template-columns:repeat(24,1fr);grid-template-rows:repeat(12,24px);gap:11px}
.fe-block{grid-area:2/3/10/23;position:relative;overflow:hidden}
.sqs-block{padding:17px;transform:translateY(0);will-change:transform;animation:sqsIn 1s both}
@keyframes sqsIn{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
#footer-sections{background:#222;color:#fff;padding:60px 4vw}
</style>
%%HEAD%%</head><body>
<header id="header" class="header">Squarespace site header</header>
<main id="page" role="main"><article class="sections" id="sections">
%%SECTIONS%%</article></main>
<footer id="footer-sections" class="sections">Squarespace site footer</footer>
</body></html>'''


# ---------------------------------------------------------------- install guide page
def guide(files):
    esc = htmlmod.escape
    def step(n, fname, title, where, what):
        code = files[fname]
        kb = len(code.encode()) / 1024
        return f'''
<li class="step" data-step="{n}">
  <div class="num" aria-hidden="true">{n}</div>
  <div class="body">
    <div class="head">
      <h3>{esc(title)}</h3>
      <label class="done"><input type="checkbox" data-done="{n}"> <span>Done</span></label>
    </div>
    <p class="where">{where}</p>
    <p class="what">{esc(what)}</p>
    <div class="actions">
      <button class="copy" type="button" data-copy="{n}">Copy code</button>
      <span class="meta">{esc(fname)}, {kb:.0f} KB</span>
    </div>
    <details><summary>Show code</summary><textarea readonly spellcheck="false" id="code-{n}" aria-label="Code for step {n}">{esc(code)}</textarea></details>
  </div>
</li>'''
    steps = step(0, '00-page-header-injection.html', 'Shared styles and fonts',
                 'Page settings, then <b>Advanced</b>, then <b>Page Header Code Injection</b>. Not a code block.',
                 'Everything the sections share: Archivo, the colours, type, buttons, motion, and the rules that hide Squarespace\'s own header and spacing on this page only.')
    for n, (key, fname, title, what) in enumerate(SECTIONS, 1):
        where = f'Section {n} of 11: add a blank section, add one <b>Code Block</b>, paste, turn <b>Display source</b> off.'
        if key == 'header':
            where += ' Must stay the first section.'
        if key == 'footer':
            where += ' Must stay the last section.'
        steps += step(n, fname, title, where, what)

    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Carriacou Squarespace Kit</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100,400;100,500;125,700&display=swap">
<style>
:root{{--ground:#F5F8F9;--ink:#0B1F2A;--soft:#4F6169;--rule:rgba(11,31,42,.16);--rule-strong:rgba(11,31,42,.32);--panel:#FFFFFF;--accent:#E8A00D;--btn:#0B1F2A;--btn-ink:#F5F8F9;--code:#0B1F2A;--code-ink:#DCE4E8;--done:#14513C;
  --sans:"Archivo",Arial,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--ground:#0B1F2A;--ink:#EEF3F5;--soft:#9AAAB2;--rule:rgba(238,243,245,.14);--rule-strong:rgba(238,243,245,.3);--panel:#10293A;--btn:#EEF3F5;--btn-ink:#0B1F2A;--code:#06141C;--code-ink:#C9D5DB;--done:#5FBF96}}}}
:root[data-theme="dark"]{{--ground:#0B1F2A;--ink:#EEF3F5;--soft:#9AAAB2;--rule:rgba(238,243,245,.14);--rule-strong:rgba(238,243,245,.3);--panel:#10293A;--btn:#EEF3F5;--btn-ink:#0B1F2A;--code:#06141C;--code-ink:#C9D5DB;--done:#5FBF96}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--ground);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased}}
::selection{{background:var(--accent);color:#0B1F2A}}
:focus-visible{{outline:2px solid var(--accent);outline-offset:3px}}
.wrap{{max-width:880px;margin:0 auto;padding:48px 16px 96px}}
@media(min-width:720px){{.wrap{{padding:72px 32px 128px}}}}
h1,h2,h3{{font-stretch:125%;font-weight:700;letter-spacing:-.02em;line-height:1.05;margin:0;text-wrap:balance}}
h1{{font-size:clamp(32px,6vw,52px);margin-left:-.03em}}
h2{{font-size:22px;margin:56px 0 16px}}
h3{{font-size:19px}}
p{{margin:0;text-wrap:pretty}}
.lede{{margin-top:16px;font-size:18px;max-width:60ch;color:var(--soft)}}
.facts{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0;margin-top:32px;border-top:1px solid var(--rule-strong)}}
.facts div{{padding:14px 16px 14px 0;border-bottom:1px solid var(--rule)}}
.facts b{{display:block;font-stretch:125%;font-size:22px;font-variant-numeric:tabular-nums}}
.facts span{{font-size:14px;color:var(--soft)}}
.prep{{margin:0;padding:0;list-style:none;border-top:1px solid var(--rule-strong)}}
.prep li{{padding:12px 0;border-bottom:1px solid var(--rule);max-width:68ch}}
.steps{{margin:0;padding:0;list-style:none;border-top:1px solid var(--rule-strong)}}
.step{{display:grid;grid-template-columns:44px minmax(0,1fr);gap:16px;padding:24px 0;border-bottom:1px solid var(--rule)}}
@media(min-width:720px){{.step{{grid-template-columns:64px minmax(0,1fr)}}}}
.num{{font-stretch:125%;font-weight:700;font-size:28px;line-height:1;font-variant-numeric:tabular-nums;color:var(--accent)}}
.head{{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap}}
.where{{margin-top:6px}}
.what{{margin-top:4px;color:var(--soft);font-size:15px;max-width:64ch}}
.actions{{display:flex;align-items:center;gap:12px 16px;flex-wrap:wrap;margin-top:14px}}
.copy{{font:inherit;font-weight:500;font-size:15px;min-height:44px;padding:10px 18px;border:1.5px solid var(--btn);background:var(--btn);color:var(--btn-ink);cursor:pointer;transition:background-color 140ms cubic-bezier(.33,1,.68,1),color 140ms cubic-bezier(.33,1,.68,1)}}
.copy:hover{{background:transparent;color:var(--ink)}}
.copy:active{{transform:translateY(1px)}}
.copy.ok{{background:var(--done);border-color:var(--done);color:#F5F8F9}}
.meta{{font-size:14px;color:var(--soft);font-variant-numeric:tabular-nums}}
details{{margin-top:12px}}
summary{{cursor:pointer;font-size:14px;color:var(--soft);width:max-content}}
summary:hover{{color:var(--ink)}}
textarea{{display:block;width:100%;height:240px;margin-top:10px;padding:12px;border:0;background:var(--code);color:var(--code-ink);font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;resize:vertical;white-space:pre;overflow:auto}}
.done{{display:inline-flex;align-items:center;gap:8px;font-size:14px;color:var(--soft);cursor:pointer;min-height:44px}}
.done input{{width:18px;height:18px;accent-color:var(--done);margin:0}}
.step.is-done h3{{color:var(--soft)}}
.step.is-done .num{{color:var(--done)}}
.note{{margin-top:12px;padding:16px;border:1px solid var(--rule-strong);background:var(--panel);max-width:68ch}}
.note b{{font-weight:500}}
code{{font:14px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:var(--panel);padding:1px 5px;border:1px solid var(--rule);overflow-wrap:anywhere}}
.progress{{font-size:14px;color:var(--soft);margin-top:8px;font-variant-numeric:tabular-nums}}
@media(prefers-reduced-motion:reduce){{*{{transition:none!important}}}}
</style>
</head>
<body>
<div class="wrap">
  <h1>Carriacou Squarespace kit</h1>
  <p class="lede">The Carriacou Logistics page, cut into one paste per section. Work top to bottom: copy a step, paste it where the step says, tick it off. The form connects to Formspree last.</p>
  <div class="facts">
    <div><b>1</b><span>paste into page settings</span></div>
    <div><b>11</b><span>sections, one Code Block each</span></div>
    <div><b>0%</b><span>pixels changed from the original, in testing</span></div>
  </div>

  <h2>Before you start</h2>
  <ul class="prep">
    <li>Your plan must allow <b>Code Injection</b> and scripts in Code Blocks. That is Core and above, formerly Business.</li>
    <li>Create one <b>blank page</b> for this. Delete any sections Squarespace adds to it.</li>
    <li>Keep the sections in the order below. Section 1 must be first and section 11 last, because 1 switches the motion on and 11 carries the script that runs the page.</li>
  </ul>

  <h2>Paste, in order</h2>
  <p class="progress" id="progress" aria-live="polite"></p>
  <ol class="steps">{steps}
  </ol>

  <h2>After pasting</h2>
  <ul class="prep">
    <li><b>Look at it logged out.</b> Squarespace does not run scripts while you edit, so the editor shows the page still. Open the live page in a private window to see the motion.</li>
    <li><b>Page SEO title:</b> <code>Cold storage in Waterbury, CT: freezer, cooler, and dry pallet storage</code></li>
    <li><b>Page SEO description:</b> <code>Public refrigerated warehouse at 85 South Leonard Street, Waterbury, Connecticut. Freezer, cooler, and dry pallet positions rented by the month, four loading docks, and refrigerated delivery into grocery DCs.</code></li>
    <li><b>Social image</b> for the page: <code>og.png</code> from the zip. <b>Browser icon</b> for the site: <code>favicon-512.png</code>.</li>
    <li><b>Optional 404:</b> a page with one Code Block holding <code>404-optional.html</code>, set as the site's 404 page.</li>
  </ul>

  <h2>Later: connect the form</h2>
  <div class="note"><p>Create a form at Formspree and copy its endpoint. Edit the Code Block from <b>step 10</b>, find <code>https://formspree.io/f/YOUR_FORM_ID</code>, and replace it with your endpoint. It appears once. Until then, sending the form shows the page's designed "This didn't send" panel with the phone number, so nothing breaks in front of a visitor.</p></div>
</div>
<script>
(function () {{
  var KEY = 'carriacou-kit-done';
  var done = {{}};
  try {{ done = JSON.parse(localStorage.getItem(KEY) || '{{}}') || {{}}; }} catch (e) {{}}
  var boxes = Array.prototype.slice.call(document.querySelectorAll('[data-done]'));
  function paint() {{
    var n = 0;
    boxes.forEach(function (b) {{ var on = !!done[b.dataset.done]; b.checked = on; b.closest('.step').classList.toggle('is-done', on); if (on) n++; }});
    document.getElementById('progress').textContent = n === boxes.length ? 'All 12 steps done.' : n + ' of 12 steps done.';
  }}
  boxes.forEach(function (b) {{ b.addEventListener('change', function () {{ done[b.dataset.done] = b.checked; try {{ localStorage.setItem(KEY, JSON.stringify(done)); }} catch (e) {{}} paint(); }}); }});
  paint();
  document.querySelectorAll('[data-copy]').forEach(function (btn) {{
    btn.addEventListener('click', function () {{
      var ta = document.getElementById('code-' + btn.dataset.copy);
      var ok = function () {{ btn.textContent = 'Copied'; btn.classList.add('ok'); setTimeout(function () {{ btn.textContent = 'Copy code'; btn.classList.remove('ok'); }}, 1800); }};
      var manual = function () {{ ta.closest('details').open = true; ta.focus(); ta.select(); btn.textContent = 'Selected: press Ctrl+C or Cmd+C'; }};
      var legacy = function () {{ ta.closest('details').open = true; ta.select(); try {{ if (document.execCommand('copy')) {{ ok(); return; }} }} catch (e) {{}} manual(); }};
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(ok, legacy); else legacy();
    }});
  }});
}})();
</script>
</body>
</html>
'''


if __name__ == '__main__':
    main()
