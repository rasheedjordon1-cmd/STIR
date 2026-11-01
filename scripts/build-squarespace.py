#!/usr/bin/env python3
"""
Build the Squarespace paste kit from the standalone site.

The standalone site is the only source of truth. Everything under
squarespace/ready/ is generated and is overwritten by this script;
hand-edit squarespace/src/ instead. Hand-patching the output is how the
package previously lost its defensive reset without anyone noticing.

    python3 scripts/build-squarespace.py
"""
import json, pathlib, re, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'squarespace' / 'ready'
SRC = ROOT / 'squarespace' / 'src'
CFG = json.loads((ROOT / 'squarespace' / 'deploy.config.json').read_text())
BASE = CFG['asset_base'].rstrip('/') + '/'
FORMSPREE = (CFG.get('formspree_id') or '').strip()

# route -> (source file, Squarespace page path, paste-file number)
PAGES = [
    ('index.html',       '/',             '03-page-home'),
    ('labay.html',       '/labay',        '04-page-labay'),
    ('businesses.html',  '/businesses',   '05-page-businesses'),
    ('creators.html',    '/creators',     '06-page-creators'),
    ('collaborate.html', '/collaborate',  '07-page-collaborate'),
    ('about.html',       '/about',        '08-page-about'),
    ('contact.html',     '/contact',      '09-page-contact'),
]

# ── CSS ──────────────────────────────────────────────────────────────
def scope_css(css: str) -> str:
    """Scope every rule to .stir so neither stylesheet can reach the
    other. Squarespace's own sheet is loaded on the same page and its
    element selectors beat our inherited values."""
    css = css.replace('url("fonts/', f'url("{BASE}fonts/')

    out, i = [], 0
    while i < len(css):
        # pass comments through untouched
        if css.startswith('/*', i):
            j = css.index('*/', i) + 2
            out.append(css[i:j]); i = j; continue
        # at-rules: keep @font-face and @keyframes whole, recurse into
        # @media and @supports
        m = re.match(r'\s*@(\w[\w-]*)[^{;]*', css[i:])
        if m:
            name = m.group(1)
            start = i + m.start()
            head_end = i + m.end()
            if css[head_end:head_end + 1] == ';':
                out.append(css[start:head_end + 1]); i = head_end + 1; continue
            depth, j = 0, head_end
            while j < len(css):
                if css[j] == '{': depth += 1
                elif css[j] == '}':
                    depth -= 1
                    if depth == 0: break
                j += 1
            body = css[head_end + 1:j]
            if name in ('font-face', 'keyframes', '-webkit-keyframes'):
                out.append(css[start:j + 1])
            else:
                out.append(css[start:head_end + 1] + scope_css(body) + '}')
            i = j + 1; continue
        # an ordinary rule
        brace = css.find('{', i)
        if brace == -1:
            out.append(css[i:]); break
        close, depth, j = None, 0, brace
        while j < len(css):
            if css[j] == '{': depth += 1
            elif css[j] == '}':
                depth -= 1
                if depth == 0: close = j; break
            j += 1
        if close is None:
            out.append(css[i:]); break
        sels = css[i:brace].strip()
        body = css[brace + 1:close]
        out.append(prefix(sels) + ' {' + body + '}')
        i = close + 1
    return ''.join(out)


def prefix(sels: str) -> str:
    done = []
    for sel in sels.split(','):
        s = sel.strip()
        if not s:
            continue
        # :root carries the tokens; they move onto the scope itself.
        if s == ':root':
            done.append('.stir'); continue
        # body carries the base typography — font stack, colour,
        # ground — so it becomes the scope itself. Dropping it is how
        # the preview once showed the host's Georgia on every heading.
        if s == 'body':
            done.append('.stir'); continue
        if s.startswith('body '):
            done.append('.stir ' + s[5:]); continue
        # html describes the document, which belongs to the host.
        if s == 'html' or s.startswith('html '):
            continue
        if s.startswith('.stir'):
            done.append(s); continue
        # a bare universal selector would otherwise match the whole host
        if s.startswith('*'):
            done.append('.stir ' + s if s != '*' else '.stir *'); continue
        done.append('.stir ' + s)
    return ', '.join(done) if done else '.stir-never-matches'


# ── HTML ─────────────────────────────────────────────────────────────
def page_body(path: pathlib.Path) -> str:
    """Everything between <body> and </body>, minus the script tag and
    the skip link (Squarespace has its own)."""
    html = path.read_text()
    body = html[html.index('<body>') + 6:html.index('</body>')]
    body = re.sub(r'<a class="skip".*?</a>\s*', '', body, flags=re.S)
    body = re.sub(r'<script src="assets/stir\.js".*?</script>\s*', '', body, flags=re.S)
    body = body.replace('src="assets/', f'src="{BASE}')
    body = body.replace('srcset="assets/', f'srcset="{BASE}')
    body = body.replace('data-src="assets/', f'data-src="{BASE}')
    body = body.replace('href="assets/', f'href="{BASE}')
    return body.strip()


def contact_form(body: str) -> str:
    """Netlify Forms do not exist on Squarespace. The same markup is
    repointed at Formspree, which is the only endpoint available here
    that actually delivers. With no id configured the form is left
    visibly disabled rather than silently dropping submissions."""
    if FORMSPREE:
        body = body.replace('method="POST" data-netlify="true"\n            netlify-honeypot="bot-field" action="/contact?sent=1"',
                            f'method="POST" action="https://formspree.io/f/{FORMSPREE}"')
        body = re.sub(r'method="POST" data-netlify="true"[^>]*?action="/contact\?sent=1"',
                      f'method="POST" action="https://formspree.io/f/{FORMSPREE}"', body)
        body = body.replace('<input type="hidden" name="form-name" value="inquiry">', '')
        body = body.replace('name="bot-field"', 'name="_gotcha"')
    else:
        body = body.replace('<p class="form-status" id="status" role="status"></p>',
            '<p class="form-status" id="status" role="status">'
            'This form is not connected yet. Add a Formspree id to '
            'squarespace/deploy.config.json and rebuild, or email '
            '<a class="inline" href="mailto:rasheed@builtbystir.com">rasheed@builtbystir.com</a>.'
            '</p>')
        body = body.replace('<button class="action" type="submit" id="submit">',
                            '<button class="action" type="submit" id="submit" disabled>')
    return body


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for f in OUT.glob('*'):
        f.unlink()

    scoped = scope_css((ROOT / 'assets' / 'stir.css').read_text())
    host = (SRC / 'host-layer.css').read_text()
    css = ('/* GENERATED by scripts/build-squarespace.py — do not edit.\n'
           '   Source: assets/stir.css + squarespace/src/host-layer.css */\n'
           + scoped + '\n' + host)
    (ROOT / 'squarespace' / 'stir-squarespace.css').write_text(css)

    js = (ROOT / 'assets' / 'stir.js').read_text()

    # 01 — header injection: the stylesheet and the fonts.
    (OUT / '01-code-injection-header.html').write_text(f'''<!-- STIR — paste into Settings > Advanced > Code Injection > HEADER.
     NOT into Design > Custom CSS: Squarespace compiles that field with
     LESS, which tries to evaluate calc(var(--stage-ar) * 1) as
     arithmetic, throws, and silently drops the whole stylesheet. Code
     Injection is passed through untouched. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{BASE}stir-squarespace.css">
<style>
  /* Carried inline so the cobalt is painted before the stylesheet
     arrives; otherwise the first frame is a white Squarespace page. */
  body {{ background: #0451AB; }}
</style>
''')

    # 02 — footer injection: behaviour.
    (OUT / '02-code-injection-footer.html').write_text(
        '<!-- STIR — paste into Settings > Advanced > Code Injection > FOOTER.\n'
        '     Runs after the Code Blocks exist. -->\n<script>\n' + js + '\n</script>\n')

    arrow = ('<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'
             '<symbol id="arr" viewBox="0 0 20 20"><path d="M3 10H16M11 5L16 10L11 15"/></symbol>'
             '</defs></svg>')

    for src, route, num in PAGES:
        body = page_body(ROOT / src)
        if src == 'contact.html':
            body = contact_form(body)
        if arrow not in body:
            body = arrow + '\n' + body
        (OUT / f'{num}.html').write_text(
            f'<!-- STIR — {route}\n'
            f'     One Code Block, full width, on an otherwise empty page.\n'
            f'     GENERATED from {src} by scripts/build-squarespace.py. -->\n'
            f'<div class="stir">\n{body}\n</div>\n')

    # ── the hostile preview ──────────────────────────────────────
    # Renders the generated package inside a mock of Squarespace's
    # document. It is where host-versus-us problems show up, and the
    # reason the defensive reset exists at all.
    shell = (SRC / 'preview-shell.html').read_text()
    head = (OUT / '01-code-injection-header.html').read_text()
    foot = (OUT / '02-code-injection-footer.html').read_text()
    # the preview reads the stylesheet off disk so it works offline
    head = head.replace(f'{BASE}stir-squarespace.css', './stir-squarespace.css')
    # Point the preview at the repo's own files. It has to render with
    # no network at all, or a blocked CDN looks like a broken package.
    local_css = css.replace(BASE, '../assets/')
    (ROOT / 'squarespace' / 'stir-squarespace.css').write_text(css)
    (ROOT / 'squarespace' / '_preview.css').write_text(local_css)
    head = head.replace('./stir-squarespace.css', './_preview.css')
    for src, route, num in PAGES:
        body = (OUT / f'{num}.html').read_text()
        page = shell.replace('<!--STIR-HEAD-->', head)
        page = page.replace('<!--STIR-BODY-->', body)
        page = page.replace('<!--STIR-FOOT-->', foot)
        name = '_preview.html' if src == 'index.html' else f'_preview-{num[3:]}.html'
        (ROOT / 'squarespace' / name).write_text(page)

    print(f'built {len(PAGES)} pages + 2 injections into squarespace/ready/')
    print(f'  stylesheet: {len(css):,} bytes  ->  squarespace/stir-squarespace.css')
    print(f'  asset base: {BASE}')
    print(f'  formspree:  {FORMSPREE or "NOT CONFIGURED — contact form builds disabled"}')


if __name__ == '__main__':
    main()
