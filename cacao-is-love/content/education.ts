/**
 * EDUCATION — category explanation. Plainspoken, no health claims.
 *
 * ⚠ WHAT WAS REMOVED, AND WHY. Three things used to live in this file:
 *
 *   `composition` — a grid naming THEOBROMINE, MAGNESIUM, ANANDAMIDE and
 *     IRON + ANTIOXIDANTS. Those are nutrient and composition claims about a
 *     food. None is backed by an approved factual source for this brand, and a
 *     careful footnote does not make an unverified claim safe. Removed whole
 *     rather than softened.
 *
 *   `whyPeopleDrinkIt` — led with "GENTLE ENERGY … it lifts, but it does not
 *     shove", which is a structure/function claim in plain clothes.
 *
 *   the coffee comparison's THE LIFT row — "theobromine … slower on, slower
 *     off" is a physiological effect claim. The comparison still works on
 *     taste, method and time of day, which are observable.
 *
 * PRODUCT TRUTH: the bag holds short broken pieces. Nothing here says "block"
 * or "whole", because the photographs would contradict it.
 */

export const whatIsCacao = {
  headline: 'WHAT ARE YOU ACTUALLY DRINKING?',
  lede:
    'Chocolate starts as a fruit. Cacao is that fruit, before anybody adds sugar to it. That is the whole idea.',
  steps: [
    { n: '01', term: 'CACAO POD',  def: 'A fruit the size of a football, growing straight off the trunk of the tree.' },
    { n: '02', term: 'CACAO BEAN', def: 'The seeds inside. Fermented and dried on the farm, which is where the flavour is made.' },
    { n: '03', term: 'THE PIECES', def: 'The beans, ground and set. Nothing removed, nothing added. They come as pieces you break apart.' },
    { n: '04', term: 'YOUR CUP',   def: 'Broken small, melted into hot water or milk, and made however you like it.' },
  ],
  footnote: 'Not cocoa powder. Not a chocolate bar. Just cacao.',
}

export const coffeeNeighbor = {
  headline: ['YOUR COFFEE HAS A NEIGHBOR.'],
  lede:
    'We are not asking you to break up with coffee. We drink coffee. This just sits in a different part of the day.',
  rows: [
    { attribute: 'THE TASTE',  coffee: 'Roasted, bitter, bright.',                  cacao: 'Deeply chocolate. Fruity underneath. Not sweet.' },
    { attribute: 'THE MAKING', coffee: 'Grind, brew, pour. Two minutes.',           cacao: 'Break, warm, stir. Five minutes.' },
    { attribute: 'THE PACE',   coffee: 'Something you drink on the way somewhere.', cacao: 'Something you sit down for.' },
  ],
  closing:
    'Most people we know keep both. One for the morning, one for the part of the day that needs slowing down.',
}

export const productTruth = {
  kicker: 'ONE INGREDIENT.',
  headline: '100% CACAO.',
  lines: ['Nothing added.', 'Nothing taken away.'],
  facts: [
    { label: 'CONTENTS', value: '100% cacao' },
    { label: 'ORIGIN',   value: 'Colombia' },
    { label: 'WEIGHT',   value: '250 g' },
  ],
}
