#!/usr/bin/env python3
"""
BUILD FONTS — subset + convert the supplied font bundle to WOFF2.

The brief requires self-hosted fonts, not a third-party CDN. Rather than
shipping the raw TTFs (Bricolage variable is 408KB, Plex Mono ~134KB each)
we subset to the character set this site can actually produce and re-encode
as WOFF2. The variable axes (opsz, wdth, wght) are PRESERVED — the type
system drives them from CSS, so instancing them away would break it.

Run:  python3 scripts/build-fonts.py /path/to/font-bundle
Out:  app/fonts/*.woff2
"""
import subprocess, sys, pathlib

SRC = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'fonts')
OUT = pathlib.Path(__file__).resolve().parent.parent / 'app' / 'fonts'
OUT.mkdir(parents=True, exist_ok=True)

# Latin + Latin-1 + Latin Ext-A (Spanish accents for Colombian place and
# person names) + the punctuation and marks the content model uses.
UNICODES = ','.join([
    'U+0020-007E',
    'U+00A0-00FF',
    'U+0100-017F',
    'U+2010-2015', 'U+2018-201A', 'U+201C-201E',
    'U+2020-2022', 'U+2026', 'U+2030', 'U+2039-203A', 'U+2044',
    'U+2190-2193', 'U+20AC', 'U+2122', 'U+2212', 'U+00D7',
])

JOBS = [
    # (source path, output name, keep variable axes)
    (SRC / 'Bricolage_Grotesque' / 'BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf',
     'BricolageGrotesque-Variable.woff2', True),
    (SRC / 'IBM_Plex_Mono' / 'IBMPlexMono-Regular.ttf', 'IBMPlexMono-Regular.woff2', False),
    (SRC / 'IBM_Plex_Mono' / 'IBMPlexMono-Medium.ttf',  'IBMPlexMono-Medium.woff2',  False),
]

for src, name, variable in JOBS:
    if not src.exists():
        sys.exit(f'MISSING SOURCE: {src}')
    dest = OUT / name
    cmd = [
        sys.executable, '-m', 'fontTools.subset', str(src),
        f'--unicodes={UNICODES}',
        '--layout-features=kern,liga,calt,tnum,frac,ccmp,locl,mark,mkmk',
        '--flavor=woff2',
        '--no-hinting',
        '--desubroutinize',
        f'--output-file={dest}',
    ]
    if variable:
        # keep every axis intact
        cmd.append('--recalc-bounds')
    subprocess.run(cmd, check=True)
    print(f'{name:44s} {src.stat().st_size/1024:7.1f}KB -> {dest.stat().st_size/1024:6.1f}KB')
