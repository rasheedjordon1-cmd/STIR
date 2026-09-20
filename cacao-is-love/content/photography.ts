/**
 * PHOTOGRAPHY — one registry for every photograph on the site.
 *
 * Each entry carries its intrinsic size and the widths that exist on disk, so
 * <Photo> can emit a real srcset and reserve the right box before the file
 * lands. Variants are produced by `node scripts/build-photos.mjs`; nothing here
 * should name a file that script did not write.
 *
 * ALT TEXT lives here, next to the photograph, because it describes the
 * picture and not the layout — the same image means the same thing wherever it
 * is placed. Decorative uses pass alt="" at the call site.
 *
 * CAPTION INTEGRITY: captions and alt text describe WHAT IS SHOWN, never where.
 * The origin region and producer are still unconfirmed (see origin.ts), so
 * "pod on the branch" is safe and naming a farm or region is not.
 */

export interface Photograph {
  file: string
  /** Intrinsic dimensions of the largest variant — reserves the box, kills CLS. */
  w: number
  h: number
  /** Widths actually generated on disk. */
  widths: number[]
  dir?: string
  alt: string
}

const defs = {
  /* --- PRODUCT ------------------------------------------------------------ */
  packStudio: {
    file: 'pack-studio', w: 1024, h: 1536, widths: [640, 1024],
    alt: 'The Cacao Is Love pouch upright, with the cacao pieces visible through the window in the front of the bag.',
  },
  packWood: {
    file: 'pack-wood', w: 1122, h: 1402, widths: [640, 1024],
    alt: 'The Cacao Is Love pouch standing on a wooden surface.',
  },

  /* --- THE COUNTER — product portrait, observed, still --------------------- */
  counter: {
    file: 'counter-green', w: 1024, h: 1536, widths: [640, 1024],
    alt: 'The Cacao Is Love pouch on a green background beside a full cup of cacao, with broken pieces of cacao in front of it.',
  },

  /* --- DOMESTIC LIFE ------------------------------------------------------ */
  heroPass: {
    file: 'hero-pass', w: 1536, h: 1024, widths: [640, 1024],
    alt: 'A hand holding out a cup of cacao across a kitchen counter in daylight.',
  },
  /* THE BREAK. The reaching hand carries motion blur; the room is resolved.
     That is the photograph, not a fault — do not crop the hand away and do not
     lay text over the board. */
  theBreak: {
    file: 'break-kitchen', w: 1536, h: 1024, widths: [640, 1024],
    alt: 'A hand reaching for a broken piece of cacao on a pale cutting board, with a small knife, the pouch and a cup alongside.',
  },
  /* THE WAIT. Two cups, nobody in frame. The second person is the point, and
     they are outside the picture — keep both cups and the pouch in every crop. */
  theWait: {
    file: 'wait-two-cups', w: 1536, h: 1024, widths: [640, 1024],
    alt: 'Two full cups of cacao and the Cacao Is Love pouch on a dining table in morning light, the chairs around it empty.',
  },

  /* --- DOCUMENTARY PROVENANCE --------------------------------------------- */
  founderNicolas: {
    file: 'nicolas-pod', w: 1100, h: 825, widths: [640, 1024],
    alt: 'Nicolas reaching up to a ripening cacao pod growing on a tree.',
  },
  originPodBranch: {
    file: 'origin-pod-branch', w: 840, h: 1120, widths: [640],
    alt: 'Two hands holding a ripening cacao pod hanging from a branch.',
  },
  originAtTheTrees: {
    file: 'origin-at-the-trees', w: 840, h: 1120, widths: [640],
    alt: 'A person standing beneath a cacao tree, looking up at the pods.',
  },
  originTwoPods: {
    file: 'origin-two-pods', w: 840, h: 1120, widths: [640],
    alt: 'A hand reaching for two cacao pods on a trunk, lit from behind.',
  },

  /* --- GRAPHIC ------------------------------------------------------------ */
  oneMoreCup: {
    file: 'one-more-cup', dir: '/poster', w: 1601, h: 2000, widths: [640, 1024, 1600],
    alt: 'Cacao Is Love poster reading “One more cup?” over a cacao pod on the branch. Warning: one cup has a habit of becoming two.',
  },
} satisfies Record<string, Photograph>

/* Declared in two steps on purpose: `satisfies` alone narrows each entry to
   its own literal shape, so the optional `dir` vanishes from the union and
   every read of it fails to compile. Keys are inferred from defs; the exported
   value is widened back to the full interface. */
export type PhotoKey = keyof typeof defs
export const photos: Record<PhotoKey, Photograph> = defs

export const photoSrc = (key: PhotoKey) => {
  const p = photos[key]
  return `${p.dir ?? '/photo'}/${p.file}-${p.widths[p.widths.length - 1]}.webp`
}
