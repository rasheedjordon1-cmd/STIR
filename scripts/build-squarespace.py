#!/usr/bin/env python3
"""
Generate the Squarespace paste-in package from the canonical site.

The standalone build (index/about/contact.html + assets/stir.css) is the
single source of truth. Everything under squarespace/ is derived, so it
can never drift from what is actually shipping. Run from the repo root:

    python3 scripts/build-squarespace.py

Produces:
    squarespace/stir-custom.css     scoped design system + host layer
    squarespace/header-injection.html
    squarespace/footer-injection.html
    squarespace/pages/{home,about,contact}.html
    squarespace/_preview.html       the whole thing in a mock host DOM

Hand-written sources live in squarespace/src/.
"""
import os, re, sys, html, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'squarespace', 'src')
OUT  = os.path.join(ROOT, 'squarespace')
SCOPE = '.stir'


def read(*parts):
    with open(os.path.join(*parts), encoding='utf-8') as f:
        return f.read()


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print('  %-44s %6d lines' % (os.path.relpath(path, ROOT), text.count('\n') + 1))


# ══════════════════════════════════════════════════════════════════
# CSS — scope every selector under .stir
# ══════════════════════════════════════════════════════════════════
COMMENT = re.compile(r'/\*.*?\*/', re.S)


def split_blocks(css):
    """Yield (prelude, body) top-level blocks; body is None for trailing text."""
    out, depth, buf, prelude = [], 0, '', ''
    i = 0
    while i < len(css):
        ch = css[i]
        if ch == '{':
            depth += 1
            if depth == 1:
                prelude, buf = buf, ''
                i += 1
                continue
        elif ch == '}':
            depth -= 1
            if depth == 0:
                out.append((prelude, buf))
                buf = ''
                i += 1
                continue
        buf += ch
        i += 1
    if buf.strip():
        out.append((buf, None))
    return out


def scope_selector(sel):
    """Scope one selector list, leaving any leading comments untouched.

    Prefixing a comment was silently producing `.stir /* … */ @font-face
    { … }`, which CSS parses as one bogus qualified rule — it ate the
    first @font-face outright. Comments are now carried, never scoped.
    """
    lead = ''
    while True:
        m = re.match(r'\s*/\*.*?\*/\s*', sel, re.S)
        if not m:
            break
        lead += m.group(0)
        sel = sel[m.end():]

    sel = sel.strip()
    if not sel:
        return lead.rstrip()
    if sel.startswith('@'):
        return lead + sel

    parts = []
    for s in (x.strip() for x in sel.split(',')):
        if not s:
            continue
        if s.startswith(SCOPE):
            parts.append(s)
        elif s in (':root', 'html', 'body'):
            parts.append(SCOPE)
        elif s == '*':
            parts.append(SCOPE + ' *')
        else:
            # A selector that qualifies <html> — `html.js .x`, used for
            # state the page sets before first paint — has to keep that
            # condition on the real root and scope only the rest, or it
            # becomes `.stir html.js .x` and never matches anything.
            m = re.match(r'^(html(?:[.#:\[][^\s>+~]*)*)\s+(.+)$', s)
            if m:
                parts.append('%s %s %s' % (m.group(1), SCOPE, m.group(2)))
            else:
                parts.append(SCOPE + ' ' + s)
    return lead + ',\n'.join(parts)


def scope(css, depth=0):
    out = []
    for prelude, body in split_blocks(css):
        if body is None:
            out.append(prelude)
            continue
        p = prelude.strip()
        bare = COMMENT.sub('', p).strip()
        if bare.startswith('@font-face') or bare.startswith('@keyframes'):
            # carry the comment, leave the at-rule alone
            out.append('%s {%s}' % (p, body))
        elif bare.startswith('@media') or bare.startswith('@supports'):
            out.append('%s {\n%s\n}' % (p, scope(body, depth + 1)))
        else:
            out.append('%s {%s}' % (scope_selector(prelude), body))
    return '\n'.join(out)


FONTS = {
    'fonts/founders-grotesk-light.woff2':        'FONT_LIGHT_URL',
    'fonts/founders-grotesk-light-italic.woff2': 'FONT_LIGHT_ITALIC_URL',
    'fonts/founders-grotesk-medium.woff2':       'FONT_MEDIUM_URL',
    'fonts/founders-grotesk-bold.woff2':         'FONT_BOLD_URL',
    'fonts/founders-grotesk-bold-italic.woff2':  'FONT_BOLD_ITALIC_URL',
}


def build_css():
    scoped = scope(read(ROOT, 'assets', 'stir.css'))
    for path, token in FONTS.items():
        scoped = scoped.replace('url("%s")' % path, 'url("%s")' % token)
    css = scoped + '\n\n' + read(SRC, 'host-layer.css')
    write(os.path.join(OUT, 'stir-custom.css'), css)
    return css


# ══════════════════════════════════════════════════════════════════
# Pages — the standalone body, adapted to the host
# ══════════════════════════════════════════════════════════════════
SCRIPT = re.compile(r'[ \t]*<script\b.*?</script>\s*', re.S | re.I)
STYLE  = re.compile(r'[ \t]*<style\b.*?</style>\s*', re.S | re.I)
ENTER  = re.compile(r'[ \t]*<!-- ══+ ENTRANCE.*?</div>\s*', re.S)

LINKS = [
    ('href="index.html#', 'href="/#'),
    ('href="index.html"', 'href="/"'),
    ('href="about.html"', 'href="/about"'),
    ('href="contact.html"', 'href="/contact"'),
    ('action="contact.html"', 'action="/contact"'),
]

# Which ground each section sits on, and what the running index calls it.
GROUND = {
    'hero':     ('cobalt', '01 — Attention'),
    'belief':   ('ivory',  '02 — Thesis'),
    'proof':    ('ivory',  '03 — Proof'),
    'method':   ('ivory',  '04 — What we do'),
    'outcomes': ('ivory',  '05 — What you leave with'),
    'who':      ('ivory',  '06 — Who this is for'),
    'convert':  ('cobalt', 'Your turn'),
    'page':     ('ivory',  None),          # about / contact
}


def body_of(filename):
    src = read(ROOT, filename)
    body = src[src.index('<body>') + len('<body>'):src.index('</body>')]
    body = ENTER.sub('', body)       # the cover ships in the header injection
    body = SCRIPT.sub('', body)
    body = STYLE.sub('', body)
    return body.strip('\n')


def annotate_sections(body, page_label=None):
    """Add data-ground / data-index so the adaptive nav and running
       index know what is passing beneath them."""
    def sub(m):
        attrs, cls = m.group(0), m.group(1)
        first = cls.split()[0]
        if 'data-ground' in attrs or first not in GROUND:
            return attrs
        ground, index = GROUND[first]
        index = page_label if first == 'page' else index
        extra = ' data-ground="%s"' % ground
        if index:
            extra += ' data-index="%s"' % html.escape(index, quote=True)
        return attrs.replace('class="%s"' % cls, 'class="%s"%s' % (cls, extra), 1)
    return re.sub(r'<section class="([^"]+)"[^>]*>', sub, body)


def adapt(body, page_label=None):
    for a, b in LINKS:
        body = body.replace(a, b)
    body = body.replace('src="assets/labay/labay-social-01.mp4"', 'src="VIDEO_URL"')
    body = body.replace('assets/', 'ASSET_BASE/')
    # The nav ships both marks in the source markup now; which one
    # shows is decided by the header's scrolled state, not the build.
    return annotate_sections(body, page_label)


def contact_to_formspree(body):
    """Squarespace has no form backend; Formspree takes the POST."""
    body, n = re.subn(
        r'<form class="contact-form reveal".*?id="contact-form">',
        '<form class="contact-form reveal" name="start-a-project" method="POST"\n'
        '            action="https://formspree.io/f/FORMSPREE_ID" id="contact-form">',
        body, count=1, flags=re.S)
    assert n == 1, 'contact form tag not found'
    body, n = re.subn(r'<input type="hidden" name="form-name"[^>]*>',
                      '<input type="hidden" name="_subject" value="New STIR inquiry">',
                      body, count=1)
    assert n == 1, 'Netlify form-name field not found'
    body = body.replace('name="bot-field"', 'name="_gotcha"')
    body = re.sub(r'<!-- Netlify Forms\..*?-->',
                  '<!-- Formspree takes the POST. Replace FORMSPREE_ID with your form id. -->',
                  body, count=1, flags=re.S)
    assert 'formspree.io' in body and 'netlify' not in body.lower(), \
        'contact form was not fully rewired to Formspree'
    return body


PAGE_HEAD = ('<!-- ══ STIR · %s ══ One Code Block on a blank page.\n'
             '     Find/replace ASSET_BASE with your Squarespace file URL prefix. -->\n'
             '<div class="stir stir-%s">\n')


def build_pages():
    pages = {}
    for name, source, label in (('home', 'index.html', None),
                                ('about', 'about.html', 'About'),
                                ('contact', 'contact.html', 'Contact')):
        body = adapt(body_of(source), label)
        if name == 'contact':
            body = contact_to_formspree(body)
        doc = PAGE_HEAD % (name.upper(), name) + body + '\n</div>\n'
        write(os.path.join(OUT, 'pages', '%s.html' % name), doc)
        pages[name] = doc
    return pages


# ══════════════════════════════════════════════════════════════════
# Injections
# ══════════════════════════════════════════════════════════════════
def main_script():
    """The standalone homepage behaviour, verbatim."""
    src = read(ROOT, 'index.html')
    blocks = SCRIPT.findall(src)
    body = src[src.index('<body>'):]
    scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', body, re.S | re.I)
    # the first is the entrance (header injection); the last is behaviour
    return scripts[-1].strip('\n')


def contact_script():
    """Only the parts unique to the contact page: the handoff prefill and
       the fetch submit. Reveal and the mobile menu already ship above."""
    return read(SRC, 'contact-behaviour.js').strip('\n')


def build_injections():
    header = read(SRC, 'header-injection.html')
    write(os.path.join(OUT, 'header-injection.html'), header)

    footer = ('<!-- ══ STIR · behaviour ══ Settings → Advanced → Code Injection → FOOTER -->\n'
              '<script>\n'
              + main_script() + '\n\n'
              + contact_script() + '\n\n'
              + read(SRC, 'host-behaviour.js').strip('\n') + '\n'
              '</script>\n')
    write(os.path.join(OUT, 'footer-injection.html'), footer)
    return header, footer


# ══════════════════════════════════════════════════════════════════
# Preview — the package inside a deliberately hostile mock host
# ══════════════════════════════════════════════════════════════════
def build_preview(css, pages, header, footer):
    def inline(text):
        # the preview runs from disk, so point the placeholders at real files
        text = text.replace('ASSET_BASE/', '../assets/')
        text = text.replace('VIDEO_URL', '../assets/labay/labay-social-01.mp4')
        for path, token in FONTS.items():
            text = text.replace(token, '../assets/' + path)
        return text

    doc = read(SRC, 'preview-shell.html')
    doc = doc.replace('<!--CSS-->', inline(css))
    doc = doc.replace('<!--HEADER-->', inline(header))
    doc = doc.replace('<!--HOME-->', inline(pages['home']))
    doc = doc.replace('<!--ABOUT-->', inline(pages['about']))
    doc = doc.replace('<!--CONTACT-->', inline(pages['contact']))
    doc = doc.replace('<!--FOOTER-->', inline(footer))
    write(os.path.join(OUT, '_preview.html'), doc)


# ══════════════════════════════════════════════════════════════════
# The paste kit — the same package with every placeholder resolved,
# numbered in the order it goes into Squarespace. Nothing to find and
# replace by hand, which is where this was losing people.
# ══════════════════════════════════════════════════════════════════
KIT = [
    ('01-custom-css.txt',             'Design → Custom CSS'),
    ('02-code-injection-header.html', 'Settings → Advanced → Code Injection → HEADER'),
    ('03-code-injection-footer.html', 'Settings → Advanced → Code Injection → FOOTER'),
    ('04-page-home.html',             'The / page → one Code Block, full width'),
    ('05-page-about.html',            'The /about page → one Code Block, full width'),
    ('06-page-contact.html',          'The /contact page → one Code Block, full width'),
]


def build_kit(css, pages, header, footer):
    cfg_path = os.path.join(OUT, 'deploy.config.json')
    cfg = json.load(open(cfg_path, encoding='utf-8'))
    base = cfg['asset_base'].rstrip('/') + '/'
    fid = (cfg.get('formspree_id') or '').strip()

    def resolve(text):
        for path, token in FONTS.items():
            text = text.replace(token, base + path)
        text = text.replace('VIDEO_URL', base + 'labay/labay-social-01.mp4')
        text = text.replace('ASSET_BASE/', base)
        if fid:
            text = text.replace('FORMSPREE_ID', fid)
        # The kit must not carry instructions for work the build just did.
        text = text.replace('\n     Find/replace ASSET_BASE with your Squarespace file URL prefix.', '')
        text = text.replace('\n     Swap ASSET_BASE for your uploaded file prefix.', '')
        text = text.replace('Paste into Settings → Advanced → Code Injection → HEADER.',
                            'Paste into Settings → Advanced → Code Injection → HEADER. Ready as-is.')
        return text

    out_dir = os.path.join(OUT, 'ready')
    bodies = [css, header, footer, pages['home'], pages['about'], pages['contact']]
    for (name, _), body in zip(KIT, bodies):
        write(os.path.join(out_dir, name), resolve(body))

    left = sorted(set(re.findall(r'ASSET_BASE|FONT_[A-Z_]+URL|VIDEO_URL|FORMSPREE_ID',
                                 ''.join(resolve(b) for b in bodies))))
    urls = sorted(set(re.findall(re.escape(base) + r'[A-Za-z0-9._/-]+',
                                 ''.join(resolve(b) for b in bodies))))
    write(os.path.join(out_dir, 'CHECKLIST.md'), checklist(base, fid, left, urls))
    return left, urls


def checklist(base, fid, left, urls):
    lines = ["# Paste kit", "",
             "Generated by `python3 scripts/build-squarespace.py`. Every placeholder is",
             "already resolved — paste each file as-is, no find and replace.", "",
             "Assets are served from `%s`." % base,
             "", "## Order", ""]
    for name, where in KIT:
        lines.append("%s. **`%s`** → %s" % (name[:2].lstrip('0'), name, where))
    lines += ["",
              "Each page needs ONE Code Block set to full width on an otherwise blank",
              "page. The Custom CSS already neutralises Squarespace's own wrappers.", "",
              "## Still to fill in", ""]
    lines.append("- Formspree: **%s**" % ("set (`%s`)" % fid if fid else
                 "NOT SET — add `formspree_id` to `squarespace/deploy.config.json` and re-run, "
                 "or the contact form will not send"))
    lines.append("- Leftover placeholders: %s" % (', '.join('`%s`' % p for p in left) if left else "none"))
    lines += ["", "## Check the assets resolve", "",
              "Paste this in a browser console on any page. It should report 0 missing;",
              "anything listed is a file the Netlify deploy is not serving yet.", "",
              "```js",
              "Promise.all(%s" % json.dumps(urls, indent=0).replace('\n', ' '),
              ".map(u => fetch(u, { method: 'HEAD' }).then(r => r.ok ? null : u).catch(() => u)))",
              "  .then(r => r.filter(Boolean))",
              "  .then(bad => console.log(bad.length + ' missing', bad));",
              "```", "",
              "## When the design changes", "",
              "Edit the standalone site (`index.html`, `about.html`, `contact.html`,",
              "`assets/stir.css`), re-run the build, and re-paste the files that changed.",
              "Never hand-edit anything under `squarespace/` — it is all generated.", ""]
    return '\n'.join(lines)


if __name__ == '__main__':
    os.chdir(ROOT)
    print('Building the Squarespace package from the canonical site…')
    css = build_css()
    pages = build_pages()
    header, footer = build_injections()
    build_preview(css, pages, header, footer)

    print('\nPaste kit (placeholders resolved):')
    left, urls = build_kit(css, pages, header, footer)

    leaks = re.findall(r'(?m)^(?!\.stir|@|\s|/\*|\*|\}|})([a-z][a-z0-9-]*)\s*[,{]',
                       css[:css.index('SQUARESPACE HOST LAYER')])
    print('\nunscoped leaks above the host layer:', sorted(set(leaks)) or 'none')
    print('unresolved placeholders in the kit :', left or 'none')
    print('distinct asset URLs referenced     :', len(urls))
