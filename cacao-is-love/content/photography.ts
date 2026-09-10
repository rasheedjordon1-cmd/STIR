/**
 * PHOTOGRAPHY — one registry for every image slot on the site.
 *
 * The site is designed to be correct with no photography at all: an unset slot
 * renders as a numbered Plate with a picture-box mark, which reads as reserved
 * space rather than a broken image. That means photography can land one file at
 * a time instead of all at once.
 *
 * TO ADD AN IMAGE
 *   1. Drop the file in `public/photo/` using the filename below.
 *   2. Add its key to AVAILABLE.
 * That is the whole change. No component edits, no layout work — every slot
 * already has its aspect ratio, caption and plate number.
 *
 * ⚠ Interim art direction: warm cream / kraft / cacao-brown, documentary, film
 *   grain, natural light, unstyled. Packaging must stay UNBRANDED until the
 *   mastermark exists — a mocked-up label would be inventing an identity.
 * ⚠ Origin imagery is illustrative until real photographs from the actual
 *   supply chain replace it. Do not caption interim origin images as if they
 *   document a specific farm.
 */

const files = {
  productFront: 'product-front.png', //  4:5  hero, buy modules
  productFlat: 'product-flat.png', //    4:3  gallery lead
  texture: 'texture.png', //             1:1  broken block, macro
  chop: 'chop.png', //                   3:2  step 01
  melt: 'melt.png', //                   3:2  step 02
  cupInHands: 'cup-in-hands.png', //     1:1  step 03, gallery
  comparison: 'comparison.png', //       1:1  cacao beside coffee
  pouchBack: 'pouch-back.png', //        1:1  ingredient panel
  originTree: 'origin-tree.png', //      1:1  pods on the trunk
  podSplit: 'pod-split.png', //          1:1  pod opened
  beansDrying: 'beans-drying.png', //    1:1  drying trays
  kitchen: 'kitchen.png', //             4:5  founder note

  /* Nicolas at the trees. These are the real provenance and founder
     photographs — the first images on the site that actually document the
     supply chain rather than illustrate it. When they land, the provenance
     section's cream half takes `originNicolas` and the founder section takes
     `founderNicolas`, and the interim captions below can name what is really
     shown instead of hedging. */
  founderNicolas: 'nicolas-pod.webp', //  16:9  founder note, close, hands on a pod
  originNicolas: 'nicolas-trees.webp', // 9:16  provenance, full figure under the trees
  oneCup: 'one-cup.png', //              3:4  make two
  twoCups: 'two-cups.png', //            3:4  make two
} as const

export type PhotoKey = keyof typeof files

/**
 * Keys whose files are actually present in `public/photo/`.
 * Everything not listed here renders as an empty plate, by design.
 */
const AVAILABLE: readonly PhotoKey[] = [
  // 'founderNicolas',
  // 'originNicolas',
  // 'chop',
  // 'melt',
  // 'originTree',
  // 'pouchBack',
  // 'kitchen',
]

export function photo(key: PhotoKey): string | null {
  return AVAILABLE.includes(key) ? `/photo/${files[key]}` : null
}
