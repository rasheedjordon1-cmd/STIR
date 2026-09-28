#!/usr/bin/env python3
"""
Build the Carriacou Logistics Squarespace kit from the Netlify source.

The Netlify site (../index.html, ../main.js, ../fonts) stays the single source
of truth. This script turns it into two paste-in files for a Squarespace 7.1
page, plus an optional 404:

  1-page-header-injection.html   Page Settings > Advanced > Page Header Code Injection
  2-code-block.html              one Code Block, in one blank section, on that page
  3-optional-404-code-block.html one Code Block on the page you set as the 404

What it changes, and why:
  - Every CSS rule is scoped under #cl-root, so the Squarespace theme cannot
    restyle the page and the page cannot restyle the rest of the site.
  - Keyframes and font families get a cl- prefix so they cannot collide with
    anything Squarespace or another block loads.
  - Fonts are inlined as data URIs: no uploads, no extra requests.
  - Squarespace's header, footer, section padding, grid, and block animations
    are neutralized on this page only (every override keys off #cl-root).
  - The form posts to a Formspree-compatible endpoint set in one attribute,
    because Netlify Forms only works on Netlify.
  - <main>, the skip link, and generic SVG ids are renamed or dropped so they
    do not duplicate Squarespace's own.

Run:  python3 build.py            (writes the kit next to this file)
      python3 build.py --mock OUT (also writes a mock Squarespace page for testing)
"""
import base64, json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parent
ROOT_ID = 'cl-root'


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
def scope_selector(sel, root):
    R = '#' + root
    out = []
    for s in split_top(sel):
        if s == ':root' or s == 'body':
            out.append(R)
        elif s == 'html':
            out.append(f'html:has({R})')
        elif s.startswith('.js '):
            out.append(f'.cl-js {R} ' + s[4:])
        elif s.startswith('.no-js '):
            out.append(f'html:not(.cl-js) {R} ' + s[7:])
        elif s.startswith('*') or s.startswith('::') or s.startswith(':'):
            out.append(f'{R} {s}')
        else:
            if re.search(r'(^|[\s>+~,(])(html|body)\b', s) or '.js ' in s or ':root' in s:
                raise SystemExit(f'build: selector needs a scoping rule: {s}')
            out.append(f'{R} {s}')
    return ','.join(out)


def rename_animations(body, names):
    def fix(m):
        val = m.group(2)
        for n in names:
            val = re.sub(r'(?<![\w-])' + re.escape(n) + r'(?![\w-])', 'cl-' + n, val)
        return m.group(1) + val
    return re.sub(r'(animation(?:-name)?\s*:\s*)([^;}]*)', fix, body)


def scope_css(css, root, names):
    out = []
    for pre, body in blocks(css):
        if pre.startswith('@media') or pre.startswith('@supports'):
            out.append(pre + '{' + scope_css(body, root, names) + '}')
        elif pre.startswith('@keyframes'):
            out.append('@keyframes cl-' + pre.split()[1] + '{' + body + '}')
        elif pre.startswith('@font-face'):
            out.append(pre + '{' + body + '}')
        elif pre == 'html':
            out.append(f'html:has(#{root}){{scroll-padding-top:72px}}')
        else:
            out.append(scope_selector(pre, root) + '{' + rename_animations(body, names) + '}')
    return '\n'.join(out)


def keyframe_names(css):
    return sorted(set(re.findall(r'@keyframes\s+([\w-]+)', css)), key=len, reverse=True)


def font_data_uris(css):
    for name in ('archivo-display', 'archivo-text'):
        b64 = base64.b64encode((SRC / 'fonts' / f'{name}.woff2').read_bytes()).decode()
        css = css.replace(f'url(fonts/{name}.woff2)', f'url(data:font/woff2;base64,{b64})')
    return css.replace('"Archivo', '"CL Archivo')


def split_fonts(css):
    faces = ''.join(f'@font-face{{{b}}}\n' for p, b in blocks(css) if p.startswith('@font-face'))
    rest = '\n'.join(p + '{' + b + '}' for p, b in blocks(css) if not p.startswith('@font-face'))
    return faces, rest


def reset_css(root):
    """Neutralize theme styles that would otherwise leak into the page."""
    R = '#' + root
    return f'''{R}{{display:block;position:relative;width:100%;text-align:left;font-size:16px}}
{R} :is(h1,h2,h3,h4,h5,h6,p,li,dt,dd,address,legend,label,figcaption,a,small,strong,b,button,input,textarea,select){{font-family:inherit;font-size:inherit;line-height:inherit;color:inherit;font-weight:inherit;letter-spacing:inherit;text-transform:none;font-style:normal;text-shadow:none}}
{R} :is(h1,h2,h3,h4,h5,h6,p,li,dt,dd,address,legend,label,figcaption){{white-space:normal}}
{R} :is(input,button,textarea,select){{appearance:none;-webkit-appearance:none;border-radius:0;box-shadow:none;margin:0;height:auto;min-width:0;background-image:none}}
{R} :is(li,dt,dd,dl,address,label,legend,figcaption,small,blockquote){{margin:0}}
{R} label{{display:inline}}
{R} a{{text-decoration:none}}
{R} :is(ul,ol){{margin:0;padding:0;list-style:none}}
{R} :is(svg,img){{max-width:100%}}'''


CHROME = '''/* Squarespace chrome, this page only. Every rule keys off #cl-root, so this
   file is harmless on any page that does not contain the code block.
   To keep your Squarespace header and footer, delete the first rule and add:
   #cl-root .hdr, #cl-root .ftr { display:none } */
body:has(#cl-root) :is(#header, header.header, #footer-sections, footer.sections, .header-announcement-bar-wrapper){display:none!important}
body:has(#cl-root){background:#F5F8F9!important}
body:has(#cl-root) :is(#page, #sections, main, article):has(#cl-root){padding-top:0!important;margin-top:0!important}
section:has(#cl-root){display:block!important;padding:0!important;margin:0!important;min-height:0!important;background:#F5F8F9!important}
section:has(#cl-root) > :is(.section-background, .section-border, .section-divider-display){display:none!important}
section:has(#cl-root) *:has(#cl-root){display:block!important;padding:0!important;margin:0!important;max-width:none!important;width:auto!important;min-height:0!important;height:auto!important;grid-area:auto!important}
body *:has(#cl-root), section:has(#cl-root){overflow:visible!important;transform:none!important;filter:none!important;opacity:1!important;animation:none!important;transition:none!important;will-change:auto!important;contain:none!important;perspective:none!important;backdrop-filter:none!important;clip-path:none!important}'''


# ---------------------------------------------------------------- markup
def svg_def_ids(html):
    body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
    return re.findall(r'<(?:pattern|linearGradient|mask) id="([^"]+)"', body)


def rename_css_urls(css, ids):
    for old in ids:
        css = css.replace(f'url(#{old})', f'url(#cl-{old})')
    return css


def build_markup(html):
    body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
    body = must_replace(body, '<a class="skip" href="#main">Skip to content</a>\n', '', label='skip link')
    body = must_replace(body, '<main id="main">', '<div id="cl-main">', label='<main>')
    body = must_replace(body, '</main>', '</div>', label='</main>')
    body = must_replace(body, '<span id="top"></span>', '<span id="cl-top"></span>', label='top anchor')
    body = must_replace(body, 'href="#top"', 'href="#cl-top"', count=2, label='#top links')
    body = must_replace(body, '<script src="main.js" defer></script>\n', '', label='main.js tag')
    # Form: Netlify Forms out, a Formspree-compatible endpoint in.
    body = must_replace(body,
        'name="quote" method="post" action="/quote-received/" data-netlify="true" data-netlify-honeypot="company-website" novalidate>',
        'name="quote" method="post" action="https://formspree.io/f/YOUR_FORM_ID" novalidate>', label='form tag')
    body = must_replace(body, '<input type="hidden" name="form-name" value="quote">\n          ', '', label='form-name')
    body = must_replace(body, '<input name="company-website" tabindex="-1" autocomplete="off"', '<input name="_gotcha" tabindex="-1" autocomplete="off"', label='honeypot')
    # SVG definition ids are the most generic ids on the page; prefix them.
    for old in re.findall(r'<(?:pattern|linearGradient|mask) id="([^"]+)"', body):
        body = must_replace(body, f'id="{old}"', f'id="cl-{old}"', label=f'svg id {old}')
        body = body.replace(f'url(#{old})', f'url(#cl-{old})')
    if 'url(#' in re.sub(r'url\(#cl-', '', body):
        raise SystemExit('build: an SVG url(#...) reference was not renamed')
    return body.strip()


def build_js(js):
    js = must_replace(js, "  const d = document;\n",
        "  const d = document;\n  const ROOT = d.getElementById('cl-root');\n  if (!ROOT) return;\n", label='root guard')
    js = must_replace(js, "  const $ = (s, r = d) => r.querySelector(s);\n  const $$ = (s, r = d) => Array.from(r.querySelectorAll(s));",
        "  const $ = (s, r = ROOT) => r.querySelector(s);\n  const $$ = (s, r = ROOT) => Array.from(r.querySelectorAll(s));", label='scoped queries')
    js = must_replace(js,
        "        /* Netlify Forms: post URL-encoded to the page itself; form-name is a hidden field in the markup. */\n"
        "        const res = await fetch(location.pathname, { method: 'POST', body: new URLSearchParams(fd).toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });",
        "        /* Formspree-compatible endpoint, set once in the form's action attribute. */\n"
        "        const endpoint = form.getAttribute('action') || '';\n"
        "        if (!/^https:\\/\\//.test(endpoint) || /YOUR_FORM_ID/.test(endpoint)) { console.warn('Carriacou: set the form action to your form endpoint. See the kit README.'); throw new Error('no endpoint'); }\n"
        "        fd.set('_subject', (mode === 'tour' ? 'Dock tour request: ' : 'Rate request: ') + [optLabel('temp'), optLabel('pallets') && optLabel('pallets') + ' positions', fd.get('company')].filter(Boolean).join(', '));\n"
        "        const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });",
        label='form submit')
    js = must_replace(js, "\n})();\n", "\n  d.documentElement.classList.add('cl-ready');\n})();\n", label='ready flag')
    return js


EARLY = ("<script>(function(h){h.classList.add('cl-js');"
         "setTimeout(function(){if(!h.classList.contains('cl-ready'))h.classList.remove('cl-js')},4000)"
         "})(document.documentElement)</script>")


def jsonld(html):
    raw = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S).group(1)
    data = json.loads(raw)
    data.pop('url', None)
    data.pop('image', None)
    return '<script type="application/ld+json">\n' + json.dumps(data, indent=2) + '\n</script>'


# ---------------------------------------------------------------- 404
def build_404():
    html = (SRC / '404.html').read_text()
    css = re.search(r'<style>(.*?)</style>', html, re.S).group(1)
    names = keyframe_names(css)
    faces, rest = split_fonts(font_data_uris(css))
    scoped = scope_css(rest, 'cl-404', names)
    body = re.search(r'<body>(.*)</body>', html, re.S).group(1).strip()
    body = body.replace('<main>', '<div class="cl-404-main">').replace('</main>', '</div>')
    scoped = scoped.replace('#cl-404 main{', '#cl-404 .cl-404-main{').replace('#cl-404 main ', '#cl-404 .cl-404-main ')
    scoped = scoped.replace('@media(min-width:900px){#cl-404 main{', '@media(min-width:900px){#cl-404 .cl-404-main{')
    for old in re.findall(r'<pattern id="([^"]+)"', body):
        body = body.replace(f'id="{old}"', f'id="cl-404-{old}"').replace(f'url(#{old})', f'url(#cl-404-{old})')
    body = body.replace('href="./"', 'href="/"')
    chrome = CHROME.replace('#cl-root', '#cl-404').split('\n', 4)[-1]
    return ('<!-- Carriacou Logistics, Squarespace kit. Optional 404 page: one Code Block on the page you choose as the 404.\n'
            '     For no flash of the Squarespace header, move this <style> into that page\'s Page Header Code Injection. -->\n'
            f'<style>\n{faces}{chrome}\n{reset_css("cl-404")}\n{scoped}\n</style>\n'
            f'<div id="cl-404">\n{body}\n</div>\n')


# ---------------------------------------------------------------- main
def main():
    html = (SRC / 'index.html').read_text()
    js = (SRC / 'main.js').read_text()
    css = re.search(r'<style>(.*?)</style>', html, re.S).group(1)
    names = keyframe_names(css)
    faces, rest = split_fonts(font_data_uris(css))
    scoped = rename_css_urls(scope_css(rest, ROOT_ID, names), svg_def_ids(html))
    if re.search(r'url\(#(?!cl-)', scoped):
        raise SystemExit('build: a CSS url(#...) reference was not renamed')

    head = ('<!-- Carriacou Logistics, Squarespace kit, part 1 of 2.\n'
            '     Paste into: this page > Page Settings > Advanced > Page Header Code Injection.\n'
            '     Generated by build.py from ../index.html. Edit the source, then rebuild. -->\n'
            f'<style>\n/* Fonts: Archivo (SIL OFL), inlined. */\n{faces}\n{CHROME}\n\n/* Page, scoped to #cl-root. */\n'
            f'{reset_css(ROOT_ID)}\n{scoped}\n</style>\n{jsonld(html)}\n')
    block = ('<!-- Carriacou Logistics, Squarespace kit, part 2 of 2.\n'
             '     Paste into: one Code Block, alone in one blank section, on the same page. Leave "Display source" off.\n'
             '     Set your form endpoint in the form action below (search for YOUR_FORM_ID). -->\n'
             f'{EARLY}\n<div id="{ROOT_ID}">\n{build_markup(html)}\n</div>\n<script>\n{build_js(js)}</script>\n')

    (HERE / '1-page-header-injection.html').write_text(head)
    (HERE / '2-code-block.html').write_text(block)
    (HERE / '3-optional-404-code-block.html').write_text(build_404())
    for f in ('1-page-header-injection.html', '2-code-block.html', '3-optional-404-code-block.html'):
        print(f'{f:36s} {len((HERE / f).read_bytes()) / 1024:6.1f} KB')

    if '--mock' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--mock') + 1])
        out.write_text(MOCK.replace('%%HEAD%%', head).replace('%%BLOCK%%', block))
        print('mock', out)


# A deliberately hostile stand-in for a Squarespace 7.1 page: theme type styles,
# padded sections with overflow hidden, a Fluid Engine grid, a block animation
# transform, and a sticky header. If the kit survives this, it survives the real thing.
MOCK = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mock Squarespace 7.1</title>
<style>
body{margin:0;font-family:Georgia,serif;background:#fff;color:#333;-webkit-font-smoothing:auto}
h1,h2,h3,h4{font-family:Georgia,serif;text-transform:uppercase;letter-spacing:.2em;line-height:1.8;color:#b00;margin:1em 0;font-weight:400}
p{margin:1em 0;line-height:1.9;font-size:18px;white-space:pre-wrap;color:#333}
a{color:#b00;text-decoration:underline wavy}
ul{padding-left:2em;list-style:disc}li{margin:.5em 0}
input[type=text],input[type=email],input[type=tel]{border:2px solid #999;padding:14px;border-radius:12px;background:#eee;box-shadow:inset 0 1px 3px #0003;height:52px;font-size:20px}
button{border-radius:30px;background:#b00;color:#fff;padding:20px;text-transform:uppercase;letter-spacing:.1em}
label{display:block;font-size:12px;text-transform:uppercase}
@font-face{font-family:"Archivo";src:local("Courier New")}
#header{position:sticky;top:0;height:90px;background:#222;color:#fff;display:flex;align-items:center;padding:0 4vw;z-index:9;font:24px Georgia}
#page{padding-top:40px}
.page-section{position:relative;display:flex;padding:6vmax 0;overflow:hidden;min-height:66vh}
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
<section class="page-section" data-section-theme="white"><div class="section-background"></div>
<div class="content-wrapper"><div class="content"><div class="fluid-engine"><div class="fe-block">
<div class="sqs-block code-block sqs-block-code"><div class="sqs-block-content">
%%BLOCK%%
</div></div></div></div></div></div></section></article></main>
<footer id="footer-sections" class="sections">Squarespace site footer</footer>
</body></html>'''

if __name__ == '__main__':
    main()
