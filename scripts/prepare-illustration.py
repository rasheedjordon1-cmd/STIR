#!/usr/bin/env python3
"""
Prepare a service-plate illustration: lift it off its paper and
normalise it so it drops straight into a cobalt plate.

    python3 scripts/prepare-illustration.py <source.jpg> <name>
    # e.g. ... ~/Downloads/press.jpg svc-04   ->  assets/svc-04.webp

The artwork arrives on white. The plate is cobalt, so the white has to
go — but the illustrations contain near-white of their own (a billboard
face, the body of a press), and a plain brightness threshold punches
holes straight through them. So only white that is CONNECTED TO THE
BORDER is treated as paper.

Requires: pillow, numpy, scipy.
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import label

TARGET_RATIO = 4 / 3     # every plate figure is normalised to this
OUT_WIDTH = 1000         # 2x the widest the plate ever renders
LOOSE = 226              # fully opaque at or below this
CLEAR = 248              # fully transparent at or above this


def prepare(src, name, out_dir='assets'):
    im = Image.open(src).convert('RGB')
    rgb = np.asarray(im).astype(np.int16)
    mn = rgb.min(2)

    lab, _ = label(mn > LOOSE)
    edge = np.concatenate([lab[0, :], lab[-1, :], lab[:, 0], lab[:, -1]])
    ids = np.unique(edge)
    bg = np.isin(lab, ids[ids != 0])

    # Feather across the paper's own anti-aliasing rather than cutting
    # a hard edge, or the line work gets a white fringe on cobalt.
    alpha = np.full(mn.shape, 255.0, dtype=np.float32)
    ramp = np.clip((float(CLEAR) - mn) / float(CLEAR - LOOSE), 0, 1) * 255.0
    alpha[bg] = ramp[bg]
    alpha = np.clip(alpha, 0, 255).astype(np.uint8)

    img = Image.fromarray(np.dstack([np.asarray(im).astype(np.uint8), alpha]), 'RGBA')
    bbox = Image.fromarray(alpha).point(lambda v: 255 if v > 10 else 0).getbbox()
    if bbox is None:
        raise SystemExit('%s: nothing survived the key — is it really on white?' % src)

    art = img.crop(bbox)
    w, h = art.size
    cw, ch = (w, round(w / TARGET_RATIO)) if w / h > TARGET_RATIO else (round(h * TARGET_RATIO), h)
    cw, ch = max(cw, w), max(ch, h)
    canvas = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    canvas.paste(art, ((cw - w) // 2, (ch - h) // 2))
    canvas = canvas.resize((OUT_WIDTH, round(OUT_WIDTH * ch / cw)), Image.LANCZOS)

    dest = os.path.join(out_dir, '%s.webp' % name)
    canvas.save(dest, 'WEBP', quality=86, method=6)
    print('%s  trimmed %dx%d (%.2f:1)  ->  %s  %s  %.0fKB'
          % (name, w, h, w / h, canvas.size, dest, os.path.getsize(dest) / 1024))


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    prepare(sys.argv[1], sys.argv[2])
