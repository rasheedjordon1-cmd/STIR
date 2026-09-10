# TYPE — what ships, and under what terms

Rebuild the subsets with:

    python3 scripts/build-fonts.py fonts-src

| File | Family | Voice | Licence |
|---|---|---|---|
| `Bevellier-Variable.woff2` | Bevellier (ITF) | 01 — identity, stand-in | **ITF / Fontshare — NOT open source** |
| `BricolageGrotesque-Variable.woff2` | Bricolage Grotesque | 02 — language | SIL OFL 1.1 |
| `IBMPlexMono-{Regular,Medium}.woff2` | IBM Plex Mono | 03 — information | SIL OFL 1.1 |

## Bevellier — outstanding obligation before launch

Bevellier is licensed by Indian Type Foundry through Fontshare, not under the
OFL. The notice embedded in the font file reads:

> This Font Software is protected under domestic and international trademark
> and copyright law. You agree to identify the ITF fonts by name and credit
> the ITF's ownership of the trademarks and copyrights in any design or
> production credits.

Two things follow, and neither is done yet:

1. **A credit is required** wherever this site carries design or production
   credits. Decide where that lives (colophon, footer, or an about page).
2. **Confirm the current terms** at <https://fontshare.com/terms> before this
   goes live commercially. Fontshare's offer is free commercial use including
   web embedding, but this is a revenue site and the terms should be read and
   kept on file rather than assumed.

Bevellier is a STAND-IN for the CIL alphabet, never a substitute for it, and
is never referred to as CIL. When the real face exists, declare it as
`--font-cil-display` in `app/layout.tsx`; `--font-display` already resolves
that token first, so every display line switches in one edit and this
obligation goes away with it.

## Bevellier — two traps

* **Its default instance is wght 100 (Thin).** A rule that uses this family
  without stating `font-weight` renders as a hairline.
* **One axis only (wght).** No optical size, no width. The condensed label
  register therefore stays on Bricolage, which has a real `wdth` axis.
