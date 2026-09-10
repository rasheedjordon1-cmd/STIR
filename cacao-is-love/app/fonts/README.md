# TYPE — what ships, and under what terms

Rebuild the subsets with:

    python3 scripts/build-fonts.py fonts-src

| File | Family | Voice | Licence |
|---|---|---|---|
| `Bevellier-Variable.woff2` | Bevellier (ITF) | 01 — identity + headings | **ITF / Fontshare — NOT open source** |
| `Chillax-Variable.woff2` | Chillax (ITF) | 02 — language | **ITF / Fontshare — NOT open source** |
| `IBMPlexMono-{Regular,Medium}.woff2` | IBM Plex Mono | 03 — information | SIL OFL 1.1 |

Total 100KB across four files.

## Why these two

The mastermark is SOFT OUTSIDE, CUT INSIDE. Bevellier answers the cut half —
condensed, tight-fitting, dense. Chillax answers the soft half — rounded
terminals, open counters. Between them they triangulate the mark. A single
neutral grotesk answered neither, which is why the site read as a hand-drawn
logo sitting above someone else's typography.

Bevellier is a STAND-IN for the CIL alphabet, never a substitute for it and
never referred to as CIL. `--font-display` resolves `--font-cil-display`
first, so declaring the real face in `app/layout.tsx` switches every display
line in one edit.

## Outstanding obligation before launch

Both ITF families carry this notice in the font file:

> This Font Software is protected under domestic and international trademark
> and copyright law. You agree to identify the ITF fonts by name and credit
> the ITF's ownership of the trademarks and copyrights in any design or
> production credits.

1. **A credit is required** wherever this site carries design or production
   credits. Decide where that lives — colophon, footer, or about page.
2. **Read and file the current terms** at <https://fontshare.com/terms>.
   Fontshare's offer is free commercial use including web embedding, but this
   is a revenue site: the terms should be on file, not assumed.

Only IBM Plex Mono is OFL. Two thirds of this system is now licensed rather
than free, which is a deliberate trade for a voice that fits the brand.

## Traps, both live

* **Bevellier's default instance is wght 100 (Thin).** An unweighted rule
  renders as a hairline.
* **Chillax's default instance is wght 700 (Bold), and 700 is its ceiling.**
  An unweighted rule renders bold; a rule asking for 800 clamps to 700 and
  the source then says something that is not true. Nothing may ask for 800.
* **Neither family has a width or optical-size axis.** No rule may use
  `font-stretch` or `'opsz'` — both would be silent no-ops. There are none
  left in the codebase; keep it that way.
* Hover states that move the weight axis must rest **below** 700 or the
  transition is invisible. Nav and mega labels rest at 500–600 for this
  reason.
